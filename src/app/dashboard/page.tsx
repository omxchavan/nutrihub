export const dynamic = "force-dynamic";

import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import FoodLog from "@/models/FoodLog";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, Plus, Flame, Beef, Wheat, Droplets, AlertTriangle, Sparkles } from "lucide-react";

export default async function DashboardPage() {
    await connectToDatabase();
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const user = await User.findOne({ userId: clerkUser.id });
    if (!user) redirect("/onboarding");

    // Get today's logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await FoodLog.find({
        userId: clerkUser.id,
        date: { $gte: today },
    });

    const consumedCalories = logs.reduce((acc, log) => acc + log.calories, 0);
    const consumedProtein = logs.reduce((acc, log) => acc + log.protein, 0);
    const consumedCarbs = logs.reduce((acc, log) => acc + log.carbs, 0);
    const consumedFat = logs.reduce((acc, log) => acc + log.fat, 0);

    const calProgress = Math.min((consumedCalories / user.targetCalories) * 100, 100);
    const proteinProgress = Math.min((consumedProtein / user.targetProtein) * 100, 100);
    const carbsProgress = Math.min((consumedCarbs / user.targetCarbs) * 100, 100);
    const fatProgress = Math.min((consumedFat / user.targetFat) * 100, 100);

    const isOverCalories = consumedCalories > user.targetCalories * 1.2;
    const isLowProtein = consumedProtein < user.targetProtein * 0.5 && new Date().getHours() > 18;
    const noMeals = logs.length === 0;

    return (
        <div className="min-h-dvh pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Hello, Chief</h1>
                    <p className="text-slate-500 mt-1 font-medium">Here is your daily nutrition intelligence.</p>
                </div>
                <Link
                    href="/add-food"
                    className="flex items-center gap-2 px-6 py-3 clay-btn-primary font-bold shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Log Meal
                </Link>
            </div>

            {/* Smart Notifications */}
            <div className="space-y-3">
                {isOverCalories && (
                    <div className="p-4 bg-[var(--color-warning)]/15 border border-[var(--color-warning)]/30 rounded-2xl flex items-center gap-3 text-amber-600">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Warning: You have exceeded your target calories by more than 20% today.</p>
                    </div>
                )}
                {isLowProtein && (
                    <div className="p-4 bg-[var(--color-warning)]/15 border border-[var(--color-warning)]/30 rounded-2xl flex items-center gap-3 text-amber-600">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Notice: It&apos;s getting late and you are significantly below your protein target.</p>
                    </div>
                )}
                {noMeals && (
                    <div className="p-4 bg-[var(--color-brand-blue)]/10 border border-[var(--color-brand-blue)]/20 rounded-2xl flex items-center gap-3 text-[var(--color-brand-blue)]">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Don&apos;t forget to log your meals today!</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Calories Card */}
                <div className="clay-card p-6 border-t-4 border-t-[var(--color-brand-green)]">
                    <div className="flex items-center gap-3 mb-4 text-slate-600 font-bold">
                        <Flame className="w-5 h-5 text-[var(--color-brand-green)]" />
                        <h3 className="font-bold">Calories</h3>
                    </div>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-extrabold text-slate-800">{consumedCalories}</span>
                        <span className="text-slate-400 mb-1 font-semibold">/ {user.targetCalories} kcal</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-[var(--color-brand-green)] rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${calProgress}%` }}
                        />
                    </div>
                </div>

                {/* Protein Card */}
                <div className="clay-card p-6 border-t-4 border-t-[var(--color-brand-orange)]">
                    <div className="flex items-center gap-3 mb-4 text-slate-600 font-bold">
                        <Beef className="w-5 h-5 text-[var(--color-brand-orange)]" />
                        <h3 className="font-bold">Protein</h3>
                    </div>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-extrabold text-slate-800">{consumedProtein}g</span>
                        <span className="text-slate-400 mb-1 font-semibold">/ {user.targetProtein}g</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-[var(--color-brand-orange)] rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${proteinProgress}%` }}
                        />
                    </div>
                </div>

                {/* Carbs Card */}
                <div className="clay-card p-6 border-t-4 border-t-emerald-400">
                    <div className="flex items-center gap-3 mb-4 text-slate-600 font-bold">
                        <Wheat className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-bold">Carbs</h3>
                    </div>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-extrabold text-slate-800">{consumedCarbs}g</span>
                        <span className="text-slate-400 mb-1 font-semibold">/ {user.targetCarbs}g</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${carbsProgress}%` }}
                        />
                    </div>
                </div>

                {/* Fat Card */}
                <div className="clay-card p-6 border-t-4 border-t-amber-400">
                    <div className="flex items-center gap-3 mb-4 text-slate-600 font-bold">
                        <Droplets className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold">Fat</h3>
                    </div>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-extrabold text-slate-800">{consumedFat}g</span>
                        <span className="text-slate-400 mb-1 font-semibold">/ {user.targetFat}g</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${fatProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* AI Insights & Recent Meals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 clay-panel p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                        <Activity className="text-[var(--color-brand-green)]" />
                        Today&apos;s Log
                    </h2>
                    {logs.length === 0 ? (
                        <div className="text-center py-10 bg-[var(--color-bg-light)] rounded-2xl border border-[var(--color-brand-green)]/30 border-dashed">
                            <p className="text-slate-500 mb-4 font-medium">No meals logged today yet.</p>
                            <Link href="/add-food" className="text-[var(--color-brand-green)] font-bold hover:underline">
                                Add your first meal
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log._id.toString()} className="flex items-center justify-between p-4 bg-white border border-slate-200 shadow-sm rounded-2xl transition-colors">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{log.foodName}</h4>
                                        <p className="text-sm text-slate-500 font-medium">{log.quantity} • {log.mealType}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-extrabold text-[var(--color-brand-green)]">{log.calories} kcal</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">
                                            P: {log.protein}g • C: {log.carbs}g • F: {log.fat}g
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="clay-panel p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                            <Sparkles className="text-[var(--color-brand-orange)]" />
                            AI Diet Coach
                        </h2>
                        <div className="p-4 bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/20 rounded-2xl shadow-sm">
                            <p className="text-slate-700 font-medium text-sm leading-relaxed">
                                You&apos;re on track for your {user.goalType.replace("_", " ")} goal.
                                Keep your protein high during dinner to hit your target.
                            </p>
                        </div>
                    </div>
                    <Link href="/reports" className="mt-8 text-center text-sm font-bold text-[var(--color-text-main)] hover:text-[var(--color-brand-green)] transition-colors block border border-[var(--color-brand-green)]/20 py-3 rounded-xl bg-white hover:bg-[var(--color-bg-light)] shadow-sm">
                        View Weekly Analysis &rarr;
                    </Link>
                </div>
            </div>

        </div>
    );
}
