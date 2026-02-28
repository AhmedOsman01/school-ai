"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, GraduationCap, FileText } from "lucide-react";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Trap focus & body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Mock results based on query (in real app, this would hit an API)
    const results =
        query.length > 2
            ? [
                {
                    id: "1",
                    title: "Ahmed Youssef",
                    type: "Student",
                    subtitle: "Grade 10 - Class A",
                    icon: GraduationCap,
                    action: () => router.push("/dashboard/students/1"),
                },
                {
                    id: "2",
                    title: "INV-2023-089",
                    type: "Invoice",
                    subtitle: "EGP 4,500 - Overdue",
                    icon: FileText,
                    action: () => router.push("/dashboard/invoices/INV-2023-089"),
                },
            ]
            : [];

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Palette Container */}
            <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-in">
                {/* Search Input */}
                <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-0 outline-none px-3 text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                        placeholder="Search students, staff, invoices... (Ctrl+K)"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="hidden sm:flex items-center gap-1 font-sans text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded h-6 shrink-0">
                        ESC
                    </kbd>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {query.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">
                            <p>Type to start searching...</p>
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">Students</span>
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">Staff</span>
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">Invoices</span>
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            <div className="px-3 ph-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-2">
                                Results
                            </div>
                            {results.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        item.action();
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shrink-0">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {item.title}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate mt-0.5">
                                            {item.subtitle}
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                                        Jump to
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">No results found</p>
                            <p className="text-xs text-slate-500 mt-1">We couldn&apos;t find anything matching &quot;{query}&quot;</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                    <span>Use <kbd className="bg-slate-200 dark:bg-slate-700 font-sans px-1 rounded">↑</kbd> <kbd className="bg-slate-200 dark:bg-slate-700 font-sans px-1 rounded">↓</kbd> to navigate</span>
                    <span>Press <kbd className="bg-slate-200 dark:bg-slate-700 font-sans px-1 rounded">Enter</kbd> to select</span>
                </div>
            </div>
        </div>
    );
}
