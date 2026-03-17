"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Option {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    value: string | number;
    onChange: (value: any) => void;
    options: Option[];
    className?: string; // Wrapper className
    triggerClassName?: string; // Button className
}

export default function CustomSelect({
    value,
    onChange,
    options,
    className = "",
    triggerClassName = ""
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex justify-between items-center focus:outline-none transition-colors ${triggerClassName}`}
            >
                <span className="block truncate">{selectedOption?.label}</span>
                <ChevronDown className={`w-4 h-4 ml-3 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--color-brand-green)]' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full min-w-[140px] mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100/50 overflow-hidden"
                    >
                        <ul className="max-h-60 overflow-auto py-2 focus:outline-none scrollbar-hide">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`cursor-pointer select-none relative py-2.5 px-4 text-sm font-medium transition-colors hover:bg-slate-50 ${value === option.value
                                            ? "text-[var(--color-brand-green)] bg-[var(--color-brand-green)]/5 font-bold"
                                            : "text-slate-700"
                                        }`}
                                >
                                    <span className="block truncate">{option.label}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
