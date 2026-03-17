"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Flame, Beef, Loader2, AlertTriangle, Calendar } from "lucide-react";
import { getAnalyticsByTimeframe } from "@/actions/analytics";
import CustomSelect from "@/components/ui/CustomSelect";

export default function AnalyticsPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [daysFilter, setDaysFilter] = useState<number>(7);

    useEffect(() => {
        setIsMounted(true);
        fetchData(daysFilter);
    }, [daysFilter]);

    async function fetchData(days: number) {
        setLoading(true);
        try {
            const res = await getAnalyticsByTimeframe(days);
            if (res.success) {
                setWeeklyData(res.data || []);
            } else {
                setError(res.error || "Failed to load data");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (!isMounted) return null;

    return (
        <div className="min-h-dvh pt-24 pb-48 px-4 md:px-8 max-w-7xl mx-auto space-y-12">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Analytics & Trends</h1>
                        <p className="text-slate-500 mt-1 font-medium">Visualize your progress and consistency.</p>
                    </div>

                    <div className="clay-panel flex items-center gap-2 px-4 py-2 rounded-2xl relative z-40">
                        <Calendar className="w-5 h-5 flex-shrink-0 text-[var(--color-brand-green)]" />
                        <CustomSelect
                            value={daysFilter}
                            onChange={(val) => setDaysFilter(Number(val))}
                            options={[
                                { label: "Last 7 Days", value: 7 },
                                { label: "Last 14 Days", value: 14 },
                                { label: "Last 30 Days", value: 30 }
                            ]}
                            className="flex-1 w-32"
                            triggerClassName="bg-transparent border-none outline-none text-slate-700 font-bold cursor-pointer w-full text-left"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="clay-panel p-12 rounded-[2rem] flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="w-12 h-12 text-[var(--color-brand-green)] animate-spin mb-4" />
                        <p className="text-slate-500 font-bold">Loading your historical data...</p>
                    </div>
                ) : error ? (
                    <div className="clay-panel p-8 rounded-[2rem] border border-red-500/30 bg-red-50">
                        <div className="flex items-center gap-3 text-red-500 mb-2">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="font-bold">Error loading analytics</h3>
                        </div>
                        <p className="text-slate-600 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Calorie Trend Chart */}
                        <div className="clay-panel p-6 rounded-[2rem] flex flex-col">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <div className="p-2 bg-[var(--color-brand-green)]/20 rounded-lg">
                                    <Flame className="w-5 h-5 text-[var(--color-brand-green)]" />
                                </div>
                                Calorie Intake Trend
                            </h2>
                            <div className="h-72 w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-brand-green)" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="var(--color-brand-green)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="none" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 600 }} tickMargin={10} />
                                        <YAxis stroke="none" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 600 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontWeight: 600 }}
                                            itemStyle={{ color: '#334155' }}
                                        />
                                        <Area type="monotone" dataKey="calories" stroke="var(--color-brand-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
                                        <Area type="monotone" dataKey="target" stroke="rgba(0,0,0,0.2)" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Protein Intake Bar Chart */}
                        <div className="clay-panel p-6 rounded-[2rem] flex flex-col">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <div className="p-2 bg-[var(--color-brand-orange)]/20 rounded-lg">
                                    <Beef className="w-5 h-5 text-[var(--color-brand-orange)]" />
                                </div>
                                Daily Protein Content
                            </h2>
                            <div className="h-72 w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="none" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 600 }} tickMargin={10} />
                                        <YAxis stroke="none" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 12, fontWeight: 600 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontWeight: 600 }}
                                            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                        />
                                        <Bar dataKey="protein" fill="var(--color-brand-orange)" radius={[6, 6, 0, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                )}
        </div>
    );
}
