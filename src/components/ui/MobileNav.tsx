"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { LayoutDashboard, PlusCircle, History, LineChart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "History", href: "/history", icon: History },
        { name: "Log", href: "/add-food", icon: PlusCircle, primary: true },
        { name: "Stats", href: "/analytics", icon: LineChart },
        { name: "Coach", href: "/reports", icon: Sparkles },
    ];

    return (
        <SignedIn>
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-2">
                <motion.div
                    className="clay-panel px-4 py-3 flex items-center justify-between rounded-3xl"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        if (item.primary) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative -mt-10 group"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-16 h-16 rounded-full bg-[var(--color-brand-green)] flex items-center justify-center shadow-[0_8px_25px_rgba(32,135,89,0.3)] border-4 border-white relative z-10"
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <div className="absolute inset-0 bg-[var(--color-brand-green)] blur-xl opacity-40 rounded-full group-hover:opacity-60 transition-opacity" />
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-14 transition-all ${isActive
                                    ? "text-[var(--color-brand-green)]"
                                    : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? "drop-shadow-sm" : ""}`} />
                                <span className={`text-[10px] mt-1 font-bold ${isActive ? "text-[var(--color-brand-green)]" : ""}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </motion.div>
            </div>
        </SignedIn>
    );
}
