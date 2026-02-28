import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/Card";

export default async function TimetablePage() {
    const session = await auth();
    if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
        redirect("/dashboard");
    }

    const t = await getTranslations("nav");

    return (
        <div className="space-y-6" dir="rtl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("timetable")}</h1>
            <Card>
                <CardContent className="flex flex-col items-center justify-center text-center p-12">
                    <span className="text-6xl mb-4">📅</span>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">جدول الحصص</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">أداة إدارة الجداول الدراسية قيد التطوير حالياً. ستتمكن قريباً من تنظيم الحصص والقاعات الدراسية هنا.</p>
                </CardContent>
            </Card>
        </div>
    );
}
