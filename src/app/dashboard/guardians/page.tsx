import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Guardian } from "@/models";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { IStudent } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default async function GuardiansPage() {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    await connectDB();
    const guardians = await Guardian.find({})
        .populate("students")
        .sort({ fullNameAr: 1 });

    const t = await getTranslations("nav");

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("guardians")}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">إدارة حسابات أولياء الأمور والربط مع الطلاب</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
                    إضافة ولي أمر جديد
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">الاسم</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">رقم الهاتف</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">الطلاب المرتبطين</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">المهنة</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guardians.map((guardian) => (
                                <tr key={guardian._id.toString()} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-semibold text-slate-900 dark:text-white">{guardian.fullNameAr}</td>
                                    <td className="px-6 py-3 font-mono text-sm text-slate-600 dark:text-slate-400 font-medium">{guardian.phoneWa}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(guardian.students as unknown as IStudent[])?.map((student: IStudent) => (
                                                <Badge key={student._id.toString()} variant="success">
                                                    {student.fullNameAr}
                                                </Badge>
                                            ))}
                                            {(!guardian.students || guardian.students.length === 0) && (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">{guardian.occupation || "—"}</td>
                                    <td className="px-6 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" asChild>
                                                <Link href={`/dashboard/guardians/${guardian._id}`}>
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
                            {guardians.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        لا يوجد أولياء أمور مضافين حالياً.
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
