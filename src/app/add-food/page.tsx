"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { analyzeFood, logFoodEntry } from "@/actions/food";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Type, Sparkles, Utensils, Check, X, Flame, Beef, Wheat, Droplets } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function AddFoodPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [inputMode, setInputMode] = useState<"text" | "image">("text");
    const [mealType, setMealType] = useState("lunch");
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const [text, setText] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text && !previewImage) return alert("Please provide text or an image");

        setLoading(true);
        const res = await analyzeFood({
            text: inputMode === "text" ? text : undefined,
            imageBase64: inputMode === "image" && previewImage ? previewImage : undefined,
        });

        if (res.success) {
            setAnalysisResult(res.data);
        } else {
            alert("Error analyzing food: " + res.error);
        }
        setLoading(false);
    };

    const handleConfirmLog = async () => {
        setLoading(true);
        const res = await logFoodEntry({
            ...analysisResult,
            mealType,
        });

        if (res.success) {
            router.push("/dashboard");
        } else {
            alert("Error logging food: " + res.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh pt-24 pb-12 px-6 flex flex-col items-center relative overflow-hidden">
            <AnimatePresence mode="wait">
                {!analysisResult ? (
                    <motion.div
                        key="input-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-2xl clay-panel p-8 md:p-12 rounded-[2rem]"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-orange)] flex items-center justify-center shadow-sm">
                                <Utensils className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-800">Log a Meal</h1>
                                <p className="text-slate-500 text-sm mt-1 font-medium">Our A.I. will automatically extract macros and calories.</p>
                            </div>
                        </div>

                        <form onSubmit={handleAnalyze} className="space-y-8">
                            <div className="flex gap-4 p-1.5 bg-slate-200 rounded-2xl border border-slate-300 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setInputMode("text")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${inputMode === "text" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    <Type className="w-4 h-4" /> Text
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInputMode("image")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${inputMode === "image" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    <Upload className="w-4 h-4" /> Image
                                </button>
                            </div>

                            <div className="space-y-2 relative z-40">
                                <label className="text-sm text-slate-700 font-bold">Meal Type</label>
                                <CustomSelect
                                    value={mealType}
                                    onChange={(val) => setMealType(val)}
                                    options={[
                                        { label: "Breakfast", value: "breakfast" },
                                        { label: "Lunch", value: "lunch" },
                                        { label: "Dinner", value: "dinner" },
                                        { label: "Snack", value: "snack" },
                                    ]}
                                    className="w-full"
                                    triggerClassName="w-full clay-input px-4 py-4 text-slate-800 font-bold"
                                />
                            </div>

                            {inputMode === "text" ? (
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-700 font-bold">Describe your meal</label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="e.g. 2 scrambled eggs, 1 slice of whole wheat toast, and half an avocado..."
                                        className="w-full h-32 clay-input px-4 py-4 resize-none placeholder:text-slate-400"
                                        required={inputMode === "text"}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <label className="text-sm text-slate-700 font-bold">Upload Food Image</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 hover:bg-slate-100 hover:border-[var(--color-brand-green)]"
                                    >
                                        {previewImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-green)]/20 flex items-center justify-center mb-4 shadow-sm">
                                                    <Upload className="w-6 h-6 text-[var(--color-brand-green)]" />
                                                </div>
                                                <p className="font-bold text-slate-700">Click to upload an image</p>
                                                <p className="text-sm text-slate-500 mt-1 font-medium">PNG, JPG up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {previewImage && (
                                        <button type="button" onClick={() => setPreviewImage(null)} className="text-sm font-bold text-red-500 hover:text-red-600">
                                            Remove Image
                                        </button>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (inputMode === "text" && !text) || (inputMode === "image" && !previewImage)}
                                className="w-full py-4 clay-btn-primary flex items-center justify-center gap-2 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Analyzing with Ai..." : <><Sparkles className="w-5 h-5" /> Analyze Meal</>}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="analysis-preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl clay-panel p-8 md:p-12 rounded-[2rem] space-y-8"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 bg-[var(--color-brand-green)]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-10 h-10 text-[var(--color-brand-green)]" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-800">A.I. Analysis Complete</h2>
                            <p className="text-slate-500 mt-2 font-medium">Here&apos;s what our A.I. detected in your meal.</p>
                        </div>

                        <div className="clay-card p-6 space-y-6">
                            <div className="flex flex-col items-center border-b border-[var(--color-brand-green)]/10 pb-6">
                                <h3 className="text-2xl font-extrabold text-slate-800">{analysisResult.foodName}</h3>
                                <p className="text-[var(--color-brand-green)] font-bold uppercase tracking-wider text-xs mt-1">{analysisResult.quantity}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center space-y-1">
                                    <div className="flex items-center justify-center gap-1 text-[var(--color-text-muted)] text-xs font-bold uppercase"><Flame className="w-3 h-3 text-[var(--color-brand-green)]" /> Calories</div>
                                    <div className="text-xl font-extrabold text-slate-800">{analysisResult.calories}</div>
                                </div>
                                <div className="text-center space-y-1">
                                    <div className="flex items-center justify-center gap-1 text-[var(--color-text-muted)] text-xs font-bold uppercase"><Beef className="w-3 h-3 text-[var(--color-brand-orange)]" /> Protein</div>
                                    <div className="text-xl font-extrabold text-slate-800">{analysisResult.protein}g</div>
                                </div>
                                <div className="text-center space-y-1">
                                    <div className="flex items-center justify-center gap-1 text-[var(--color-text-muted)] text-xs font-bold uppercase"><Wheat className="w-3 h-3 text-emerald-500" /> Carbs</div>
                                    <div className="text-xl font-extrabold text-slate-800">{analysisResult.carbs}g</div>
                                </div>
                                <div className="text-center space-y-1">
                                    <div className="flex items-center justify-center gap-1 text-[var(--color-text-muted)] text-xs font-bold uppercase"><Droplets className="w-3 h-3 text-amber-500" /> Fat</div>
                                    <div className="text-xl font-extrabold text-slate-800">{analysisResult.fat}g</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                <X className="w-5 h-5" /> Retake
                            </button>
                            <button
                                onClick={handleConfirmLog}
                                className="flex-2 py-4 px-10 clay-btn-primary font-bold text-lg flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : <><Check className="w-6 h-6" /> Log this Meal</>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

