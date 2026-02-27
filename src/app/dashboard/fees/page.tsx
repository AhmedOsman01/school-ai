import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="space-y-6" dir="rtl">
            <h1 className="text-2xl font-bold text-gray-900">هيكل الرسوم</h1>
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4">💰</span>
                <h2 className="text-xl font-bold text-gray-800 mb-2">قيد التطوير</h2>
                <p className="text-gray-500 max-w-md">نظام إعداد الرسوم الدراسية والخصومات قيد التطوير.</p>
            </div>
        </div>
    );
}
