import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function TimetablePage() {
    const session = await auth();
    if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
        redirect("/dashboard");
    }

    const t = await getTranslations("nav");

    return (
        <div className="space-y-6" dir="rtl">
            <h1 className="text-2xl font-bold text-gray-900">{t("timetable")}</h1>
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4">📅</span>
                <h2 className="text-xl font-bold text-gray-800 mb-2">جدول الحصص</h2>
                <p className="text-gray-500 max-w-md">أداة إدارة الجداول الدراسية قيد التطوير حالياً. ستتمكن قريباً من تنظيم الحصص والقاعات الدراسية هنا.</p>
            </div>
        </div>
    );
}
