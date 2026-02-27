import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Guardian } from "@/models";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { IStudent } from "@/types";

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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("guardians")}</h1>
                    <p className="text-sm text-gray-500">إدارة حسابات أولياء الأمور والربط مع الطلاب</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    + إضافة ولي أمر جديد
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-bold text-gray-700">الاسم</th>
                                <th className="px-6 py-4 font-bold text-gray-700">رقم الهاتف</th>
                                <th className="px-6 py-4 font-bold text-gray-700">الطلاب المرتبطين</th>
                                <th className="px-6 py-4 font-bold text-gray-700">المهنة</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guardians.map((guardian) => (
                                <tr key={guardian._id.toString()} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{guardian.fullNameAr}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600 font-bold">{guardian.phoneWa}</td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="flex flex-wrap gap-1">
                                            {(guardian.students as unknown as IStudent[])?.map((student: IStudent) => (
                                                <span key={student._id.toString()} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    {student.fullNameAr}
                                                </span>
                                            ))}
                                            {(!guardian.students || guardian.students.length === 0) && "—"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{guardian.occupation || "—"}</td>
                                    <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                                        <Link href={`/dashboard/guardians/${guardian._id}`} className="text-blue-600 hover:text-blue-800 font-bold ml-2">تعديل</Link>
                                    </td>
                                </tr>
                            ))}
                            {guardians.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        لا يوجد أولياء أمور مضافين حالياً.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
}
