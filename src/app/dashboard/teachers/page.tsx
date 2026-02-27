import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Teacher } from "@/models";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { ISubject } from "@/types";

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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("teachers")}</h1>
                    <p className="text-sm text-gray-500">إدارة الكادر التعليمي وتخصيص المواد</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    + إضافة معلم جديد
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-bold text-gray-700">كود الموظف</th>
                                <th className="px-6 py-4 font-bold text-gray-700">الاسم</th>
                                <th className="px-6 py-4 font-bold text-gray-700">التخصص</th>
                                <th className="px-6 py-4 font-bold text-gray-700">المواد</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher._id.toString()} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-blue-600">{teacher.employeeId}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{teacher.fullNameAr}</td>
                                    <td className="px-6 py-4 text-gray-600">{teacher.specialization || "—"}</td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="flex flex-wrap gap-1">
                                            {(teacher.subjects as unknown as ISubject[])?.map((sub: ISubject) => (
                                                <span key={sub._id.toString()} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                                                    {sub.nameAr}
                                                </span>
                                            ))}
                                            {(!teacher.subjects || teacher.subjects.length === 0) && "—"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                                        <Link href={`/dashboard/teachers/${teacher._id}`} className="text-blue-600 hover:text-blue-800 font-bold ml-2">تعديل</Link>
                                        <button className="text-red-600 hover:text-red-800 font-bold">حذف</button>
                                    </td>
                                </tr>
                            ))}
                            {teachers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        لا يوجد معلمين مضافين حالياً.
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
