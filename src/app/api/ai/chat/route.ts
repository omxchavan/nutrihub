import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import FoodLog from "@/models/FoodLog";
import { currentUser } from "@clerk/nextjs/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid request. 'messages' array is required." }, { status: 400 });
        }

        await connectToDatabase();

        // Parallelize fetching User and 7-day FoodLogs
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const [dbUser, logs] = await Promise.all([
            User.findOne({ userId: clerkUser.id }),
            FoodLog.find({
                userId: clerkUser.id,
                date: { $gte: oneWeekAgo },
            }).sort({ date: 1 })
        ]);

        if (!dbUser) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        // Map logs to a compressed format to save tokens
        const compressedLogs = logs.map(log => ({
            d: log.date.toISOString().split('T')[0],
            t: log.mealType,
            f: log.foodName,
            c: log.calories,
            p: log.protein,
            cr: log.carbs,
            ft: log.fat
        }));

        const systemInstruction = `
You are NutriHub's AI Diet Coach, an expert nutritionist and supportive guide.
Your client's profile:
- Age: ${dbUser.age}, Gender: ${dbUser.gender}, Weight: ${dbUser.weight}kg, Height: ${dbUser.height}cm
- Activity Level: ${dbUser.activityLevel}
- Goal: ${dbUser.goalType}
- Daily Targets: Calories: ${dbUser.targetCalories} kcal, Protein: ${dbUser.targetProtein}g, Carbs: ${dbUser.targetCarbs}g, Fat: ${dbUser.targetFat}g

Here is their food log from the last 7 days (compressed format: d=date, t=mealType, f=foodName, c=calories, p=protein(g), cr=carbs(g), ft=fat(g)):
${JSON.stringify(compressedLogs)}

Instructions:
1. Respond to the user's messages in a helpful, conversational, and encouraging tone.
2. Use their profile and recent food logs to give highly personalized, specific answers.
3. If they ask about their data (e.g., "what did I eat?"), clearly reference the logs.
4. Keep your formatting clean using standard markdown. Use bullet points or short paragraphs for readability.
5. Answer exactly what the user is asking in a conversational manner.
`;

        // Format history for Groq (OpenAI-compatible)
        const groqMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
            { role: "system", content: systemInstruction },
            ...messages.map((m: any) => ({
                role: (m.role === 'user' ? 'user' : 'assistant') as "user" | "assistant",
                content: m.content
            }))
        ];

        const stream = await groq.chat.completions.create({
            messages: groqMessages,
            model: "llama-3.3-70b-versatile",
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
        });

        const responseStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(new TextEncoder().encode(content));
                        }
                    }
                } catch (err) {
                    console.error("Groq stream error:", err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(responseStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error: any) {
        console.error("Error generating AI response:", error);
        return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
    }
}

