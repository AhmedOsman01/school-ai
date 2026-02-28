import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Teacher } from "@/models";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { ISubject } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default async function TeachersPage() {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    await connectDB();
    const teachers = await Teacher.find({})
        .populate("subjects")
        .sort({ fullNameAr: 1 });

    const t = await getTranslations("nav");

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("teachers")}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">إدارة الكادر التعليمي وتخصيص المواد</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
                    إضافة معلم جديد
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">كود الموظف</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">الاسم</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">التخصص</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">المواد</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher._id.toString()} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-medium">{teacher.employeeId}</td>
                                    <td className="px-6 py-3 font-semibold text-slate-900 dark:text-white">{teacher.fullNameAr}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">{teacher.specialization || "—"}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(teacher.subjects as unknown as ISubject[])?.map((sub: ISubject) => (
                                                <Badge key={sub._id.toString()} variant="info">
                                                    {sub.nameAr}
                                                </Badge>
                                            ))}
                                            {(!teacher.subjects || teacher.subjects.length === 0) && (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" asChild>
                                                <Link href={`/dashboard/teachers/${teacher._id}`}>
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
                            {teachers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        لا يوجد معلمين مضافين حالياً.
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
