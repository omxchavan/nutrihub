"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/mongoose";
import FoodLog from "@/models/FoodLog";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeFood({
    text,
    imageBase64,
}: {
    text?: string;
    imageBase64?: string;
}) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        await connectToDatabase();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analyze the provided food (text description or image). 
    Extract the following nutritional information as a strict JSON object with NO markdown wrapping, just the raw JSON:
    {
      "foodName": "String, short and descriptive",
      "calories": Number,
      "protein": Number,
      "carbs": Number,
      "fat": Number,
      "fiber": Number,
      "quantity": "String, e.g., '1 bowl', '100g', '2 slices'"
    }
    If it's an image, guess the portion size reasonably.
    If it's text like 'I ate 2 eggs and a toast', combine the macros.
    `;

        let responseText = "";

        if (imageBase64) {
            const mimeTypeMatch = imageBase64.match(/^data:([^;]+);base64,/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
            const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
            
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
            ]);
            responseText = result.response.text();
        } else if (text) {
            const result = await model.generateContent([prompt, `Food description: ${text}`]);
            responseText = result.response.text();
        } else {
            throw new Error("No input provided");
        }

        // Attempt to parse JSON safely
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const nutritionalInfo = JSON.parse(cleanJson);

        return { success: true, data: nutritionalInfo };

    } catch (error: any) {
        console.error("Error analyzing food:", error);
        return { success: false, error: error.message };
    }
}

export async function logFoodEntry(data: any) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        await connectToDatabase();

        const newLog = await FoodLog.create({
            userId: user.id,
            ...data,
        });

        revalidatePath("/dashboard");
        revalidatePath("/analytics");
        revalidatePath("/history");

        return { success: true, data: JSON.parse(JSON.stringify(newLog)) };
    } catch (error: any) {
        console.error("Error logging food entry:", error);
        return { success: false, error: error.message };
    }
}

export async function getFoodLogsByDate(dateStr: string) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        await connectToDatabase();

        // Create range for the given local date string (YYYY-MM-DD)
        const [year, month, day] = dateStr.split('-').map(Number);

        // Use local time for the boundaries
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

        const logs = await FoodLog.find({
            userId: user.id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ date: -1 });

        return { success: true, data: JSON.parse(JSON.stringify(logs)) };
    } catch (error: any) {
        console.error("Error fetching logs:", error);
        return { success: false, error: error.message };
    }
}
