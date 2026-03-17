"use server";

import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import FoodLog from "@/models/FoodLog";
import { currentUser } from "@clerk/nextjs/server";

export async function getAnalyticsByTimeframe(days: number = 7) {
    try {
        await connectToDatabase();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        const dbUser = await User.findOne({ userId: clerkUser.id });
        if (!dbUser) return { success: false, error: "User profile not found" };

        const targetCalories = dbUser.targetCalories;
        const targetProtein = dbUser.targetProtein;

        // Get date 'days' ago, start of day
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);

        const logs = await FoodLog.find({
            userId: clerkUser.id,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // Map logs to days
        const daysMap = new Map();

        // Initialize last 'days' days including today
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const fullDateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
            daysMap.set(fullDateStr, {
                name: days > 14 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : dateStr,
                calories: 0,
                protein: 0,
                target: targetCalories,
                proteinTarget: targetProtein,
                fullDate: fullDateStr
            });
        }

        logs.forEach(log => {
            const dateStr = new Date(log.date).toISOString().split('T')[0];
            if (daysMap.has(dateStr)) {
                const dayData = daysMap.get(dateStr);
                dayData.calories += log.calories;
                dayData.protein += log.protein;
            }
        });

        // Convert map to array and format properties
        const weeklyData = Array.from(daysMap.values()).map(day => ({
            name: day.name,
            calories: Math.round(day.calories),
            protein: Math.round(day.protein),
            target: day.target,
            proteinTarget: day.proteinTarget,
        }));

        return { success: true, data: weeklyData };

    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return { success: false, error: error.message };
    }
}
