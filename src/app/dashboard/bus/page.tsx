import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";

export default async function Page() {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="space-y-6" dir="rtl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">إدارة الحافلات</h1>
            <Card>
                <CardContent className="flex flex-col items-center justify-center text-center p-12">
                    <span className="text-6xl mb-4">🚌</span>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">قيد التطوير</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">نظام تتبع الحافلات المدرسية قيد العمل.</p>
                </CardContent>
            </Card>
        </div>
    );
}
