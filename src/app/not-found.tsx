import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Animated 404 Visual */}
                <div className="relative">
                    <h1 className="text-[180px] font-black text-blue-600/10 leading-none select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl">🔍</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-gray-900">عذراً، الصفحة غير موجودة</h2>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو أنها لم تعد موجودة في نظام إيدوفلو مصر.
                    </p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="px-10 py-4 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.05] transition-all"
                    >
                        العودة للوحة التحكم
                    </Link>
                    <Link
                        href="/"
                        className="px-10 py-4 bg-white text-gray-800 font-bold rounded-3xl border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        الصفحة الرئيسية
                    </Link>
                </div>

                <p className="text-xs text-gray-400 font-medium tracking-widest pt-12 uppercase">
                    EduFlow Egypt • نظام إدارة المدارس الذكي
                </p>
            </div>
        </div>
    );
}
