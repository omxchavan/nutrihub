"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto clay-panel px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--color-brand-green)] flex items-center justify-center shadow-md">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">Nutri<span className="text-gradient">Hub</span></span>
                </Link>

                <div className="flex items-center gap-4 md:gap-6">
                    <SignedIn>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/add-food" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Log Food
                            </Link>
                            <Link href="/history" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                History
                            </Link>
                            <Link href="/analytics" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Analytics
                            </Link>
                            <Link href="/reports" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                AI Coach
                            </Link>
                        </div>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/sign-in" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/sign-up" className="px-4 py-2 md:px-5 md:py-2.5 clay-btn-primary text-sm font-bold flex items-center justify-center">
                            Get Started
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </motion.nav>
    );
}
