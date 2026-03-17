"use server";

import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function hasUserProfile() {
    try {
        await connectToDatabase();
        const user = await currentUser();
        if (!user) return false;

        const dbUser = await User.findOne({ userId: user.id });
        return !!dbUser;
    } catch (error: any) {
        if (error.message?.includes('Dynamic server usage') || error.digest?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Error checking user profile:", error);
        return false;
    }
}

export async function createUserProfile(formData: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: string;
    goalType: string;
}) {
    try {
        await connectToDatabase();
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        // Harris-Benedict Equation for BMR
        let bmr = 0;
        if (formData.gender === "male") {
            bmr = 88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * formData.age);
        } else {
            bmr = 447.593 + (9.247 * formData.weight) + (3.098 * formData.height) - (4.330 * formData.age);
        }

        // Activity Multiplier
        const activityMultipliers: Record<string, number> = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };
        const tdee = bmr * (activityMultipliers[formData.activityLevel] || 1.2);

        // Goal Adjustments
        let targetCalories = tdee;
        if (formData.goalType === "fat_loss") targetCalories -= 500;
        if (formData.goalType === "weight_gain" || formData.goalType === "muscle_gain") targetCalories += 500;

        targetCalories = Math.round(targetCalories);

        // Macro Split (Rough estimation)
        let targetProtein = Math.round(formData.weight * 2.2); // ~2.2g per kg
        let targetFat = Math.round((targetCalories * 0.25) / 9); // 25% from fat
        let targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFat * 9)) / 4);

        if (formData.goalType === "fat_loss") {
            targetProtein = Math.round(formData.weight * 2.5); // Higher protein for fat loss
            targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFat * 9)) / 4);
        }

        const newUser = await User.create({
            userId: user.id,
            ...formData,
            targetCalories,
            targetProtein,
            targetCarbs,
            targetFat,
        });

        revalidatePath("/dashboard");
        return { success: true, data: JSON.parse(JSON.stringify(newUser)) };
    } catch (error: any) {
        console.error("Error creating profile:", error);
        return { success: false, error: error.message };
    }
}
