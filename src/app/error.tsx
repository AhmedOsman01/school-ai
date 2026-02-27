"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Critical System Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
            <div className="max-w-lg w-full bg-white rounded-[40px] p-10 lg:p-16 shadow-2xl border border-red-50 text-center space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                    ⚠️
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-gray-900 leading-tight">حدث خطأ تقني غير متوقع</h2>
                    <p className="text-gray-500 text-lg">
                        نعتذر منك، حدث خلل بسيط في معالجة طلبك. فريقنا التقني يعمل على استقرار النظام حالياً.
                    </p>
                </div>

                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-right">
                    <p className="text-xs text-red-400 font-bold mb-2 uppercase">تفاصيل الخطأ التقني:</p>
                    <code className="text-sm text-red-800 font-mono break-all line-clamp-2">
                        {error.message || "Unknown system exception occurred."}
                    </code>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-10 py-4 bg-gray-900 text-white font-black rounded-[20px] shadow-xl hover:bg-black transition-all active:scale-95"
                    >
                        إعادة المحاولة
                    </button>
                    <Link
                        href="/dashboard"
                        className="px-10 py-4 bg-white text-blue-600 font-bold rounded-[20px] border-2 border-blue-50 hover:bg-blue-50 transition-all"
                    >
                        لوحة الإدارة
                    </Link>
                </div>

                <div className="pt-10 flex items-center justify-center gap-4 opacity-30 grayscale pointer-events-none">
                    <span className="text-xs font-bold">EduFlow Egypt Security</span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    <span className="text-xs">Error ID: {error.digest || 'E001'}</span>
                </div>
            </div>
        </div>
    );
}
