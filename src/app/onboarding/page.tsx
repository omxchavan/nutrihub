"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserProfile } from "@/actions/user";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: 25 as number | string,
        gender: "male",
        height: 175 as number | string,
        weight: 70 as number | string,
        activityLevel: "moderate",
        goalType: "maintenance",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        const finalValue = e.target.type === "number" ? (value === "" ? "" : Number(value)) : value;
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: finalValue,
        }));
    };

    const handleCustomSelectChange = (name: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await createUserProfile(formData as any);
        if (res.success) {
            router.push("/dashboard");
        } else {
            alert("Error saving profile");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh w-full px-4 flex flex-col items-center justify-center relative overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full clay-panel p-8 md:p-12 rounded-[2rem]"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-orange)] flex items-center justify-center shadow-md">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold mb-3 text-slate-800">AI Body Profile</h1>
                    <p className="text-slate-500 font-medium">Help NutriHub's AI engine calculate your perfect macro breakdown.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-700 font-bold">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full clay-input px-4 py-3 text-slate-800 focus:border-[var(--color-brand-green)]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-700 font-bold">Gender</label>
                            <CustomSelect
                                value={formData.gender}
                                onChange={(val) => handleCustomSelectChange("gender", val)}
                                options={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" },
                                ]}
                                className="w-full relative z-50"
                                triggerClassName="w-full clay-input px-4 py-3 text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-700 font-bold">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full clay-input px-4 py-3 text-slate-800 focus:border-[var(--color-brand-green)]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-700 font-bold">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full clay-input px-4 py-3 text-slate-800 focus:border-[var(--color-brand-green)]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-700 font-bold">Activity Level</label>
                        <CustomSelect
                            value={formData.activityLevel}
                            onChange={(val) => handleCustomSelectChange("activityLevel", val)}
                            options={[
                                { label: "Sedentary (Office Job)", value: "sedentary" },
                                { label: "Lightly Active (1-3 days/week)", value: "light" },
                                { label: "Moderately Active (3-5 days/week)", value: "moderate" },
                                { label: "Active (6-7 days/week)", value: "active" },
                                { label: "Very Active (Athlete)", value: "very_active" },
                            ]}
                            className="w-full relative z-40"
                            triggerClassName="w-full clay-input px-4 py-3 text-slate-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-700 font-bold">Primary Goal</label>
                        <CustomSelect
                            value={formData.goalType}
                            onChange={(val) => handleCustomSelectChange("goalType", val)}
                            options={[
                                { label: "Fat Loss", value: "fat_loss" },
                                { label: "Muscle Gain", value: "muscle_gain" },
                                { label: "Weight Gain", value: "weight_gain" },
                                { label: "Lean Body Recomp", value: "lean_body" },
                                { label: "Maintenance", value: "maintenance" },
                            ]}
                            className="w-full relative z-30"
                            triggerClassName="w-full clay-input px-4 py-3 text-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl clay-btn-primary font-bold mt-8 shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Calculating..." : "Generate AI Profile"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
