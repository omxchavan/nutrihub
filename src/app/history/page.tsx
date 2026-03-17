"use client";

import { useState, useEffect, useRef } from "react";
import { getFoodLogsByDate } from "@/actions/food";
import { Calendar, ChevronLeft, ChevronRight, Flame, Beef, Droplets, Wheat, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function toLocalISODate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export default function HistoryPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async (date: Date) => {
        setLoading(true);
        const dateStr = toLocalISODate(date);
        const res = await getFoodLogsByDate(dateStr);
        if (res.success) {
            setLogs(res.data);
        } else {
            console.error(res.error);
            setLogs([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs(selectedDate);
    }, [selectedDate]);

    const prevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        setSelectedDate(d);
    };

    const nextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        setSelectedDate(d);
    };

    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        const [y, m, d] = e.target.value.split('-').map(Number);
        setSelectedDate(new Date(y, m - 1, d));
    };

    const triggerDatePicker = () => {
        if (dateInputRef.current) {
            try {
                // @ts-ignore - showPicker is a newer API
                if (dateInputRef.current.showPicker) {
                    // @ts-ignore
                    dateInputRef.current.showPicker();
                } else {
                    dateInputRef.current.click();
                }
            } catch (err) {
                dateInputRef.current.click();
            }
        }
    };

    const totalStats = logs.reduce(
        (acc, log) => {
            acc.calories += log.calories || 0;
            acc.protein += log.protein || 0;
            acc.carbs += log.carbs || 0;
            acc.fat += log.fat || 0;
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return (
        <div className="min-h-dvh pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-10">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Food History</h1>
                        <p className="text-slate-500 mt-1 font-medium">Review your past meals and nutritional data.</p>
                    </div>

                    <div className="flex items-center gap-3 clay-panel p-2 rounded-2xl w-fit">
                        <button onClick={prevDay} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>

                        <div
                            onClick={triggerDatePicker}
                            className="relative flex items-center justify-center min-w-[150px] px-3 py-1.5 hover:bg-black/5 rounded-xl cursor-pointer transition-all active:scale-95 group select-none"
                        >
                            {/* Visual Layer */}
                            <div className="flex items-center gap-2 text-slate-800 font-bold pointer-events-none">
                                <Calendar className="w-4 h-4 text-[var(--color-brand-green)] group-hover:scale-110 transition-transform" />
                                <span>{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            <input
                                ref={dateInputRef}
                                type="date"
                                value={toLocalISODate(selectedDate)}
                                onChange={handleDateChange}
                                className="absolute inset-0 opacity-0 pointer-events-none"
                                max={toLocalISODate(new Date())}
                                aria-label="Select date"
                            />
                        </div>

                        <button
                            onClick={nextDay}
                            disabled={toLocalISODate(selectedDate) === toLocalISODate(new Date())}
                            className="p-2 hover:bg-black/5 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="clay-panel p-12 rounded-[2rem] flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="w-10 h-10 text-[var(--color-brand-green)] animate-spin mb-4" />
                        <p className="text-slate-500 font-bold">Loading your history...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="clay-panel p-12 rounded-[2rem] flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No meals logged on this date</h3>
                        <p className="text-slate-500">You didn&apos;t track any food on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                        {/* Daily Summary */}
                        <div className="clay-card p-6 flex flex-wrap gap-6 items-center justify-between">
                            <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
                                <div className="p-3 bg-[var(--color-brand-green)]/20 rounded-xl">
                                    <Flame className="text-[var(--color-brand-green)] w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-500">Total Calories</div>
                                    <div className="text-2xl font-extrabold text-slate-800">{Math.round(totalStats.calories)}</div>
                                </div>
                            </div>
                            <div className="flex-1 flex justify-around gap-4 min-w-[250px]">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-500 mb-1">
                                        <Beef className="w-4 h-4 text-[var(--color-brand-orange)]" /> Protein
                                    </div>
                                    <div className="text-lg font-bold text-slate-800">{Math.round(totalStats.protein)}g</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-500 mb-1">
                                        <Wheat className="w-4 h-4 text-emerald-500" /> Carbs
                                    </div>
                                    <div className="text-lg font-bold text-slate-800">{Math.round(totalStats.carbs)}g</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-500 mb-1">
                                        <Droplets className="w-4 h-4 text-amber-500" /> Fat
                                    </div>
                                    <div className="text-lg font-bold text-slate-800">{Math.round(totalStats.fat)}g</div>
                                </div>
                            </div>
                        </div>

                        {/* List of meals */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-700 text-lg ml-2">Meals Logged</h3>
                            {logs.map((log) => (
                                <div key={log._id} className="clay-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-green)] px-2 py-0.5 bg-[var(--color-brand-green)]/10 rounded-md">
                                                {log.mealType || "meal"}
                                            </span>
                                            <span className="text-sm text-slate-400 font-medium">
                                                {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800">{log.foodName}</h4>
                                        <p className="text-sm text-slate-500 font-medium">Portion: {log.quantity}</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/50 px-4 py-2 rounded-xl shadow-inner border border-slate-100">
                                        <div className="text-center border-r border-slate-200 pr-4">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Cals</div>
                                            <div className="font-bold text-slate-700">{Math.round(log.calories || 0)}</div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <div className="font-medium text-slate-600">P <span className="font-bold text-slate-800">{Math.round(log.protein || 0)}g</span></div>
                                            <div className="font-medium text-slate-600">C <span className="font-bold text-slate-800">{Math.round(log.carbs || 0)}g</span></div>
                                            <div className="font-medium text-slate-600">F <span className="font-bold text-slate-800">{Math.round(log.fat || 0)}g</span></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </motion.div>
                )}
        </div>
    );
}