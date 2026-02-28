import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Student } from "@/models";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default async function StudentsPage() {
    const session = await auth();
    if (!session || (session.user.role !== "admin" && session.user.role !== "staff")) {
        redirect("/dashboard");
    }

    await connectDB();
    const students = await Student.find({})
        .populate("currentGradeLevel classGroup")
        .sort({ fullNameAr: 1 })
        .limit(50);

    const t = await getTranslations("nav");

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("students")}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">إدارة جميع الطلاب المسجلين بالمنظومة</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
                    إضافة طالب جديد
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">كود الطالب</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">الاسم الكامل</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">الصف</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">الفصل</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">الحالة</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id.toString()} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-medium">{student.studentCode}</td>
                                    <td className="px-6 py-3 font-semibold text-slate-900 dark:text-white">{student.fullNameAr}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">{student.currentGradeLevel?.nameAr || "—"}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">{student.classGroup?.nameAr || "—"}</td>
                                    <td className="px-6 py-3">
                                        <Badge variant={student.status === "active" ? "success" : "danger"}>
                                            {student.status === "active" ? "نشط" : "غير نشط"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" asChild>
                                                <Link href={`/dashboard/students/${student._id}`}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700 dark:text-rose-400">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        لا يوجد طلاب مضافين حالياً.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
