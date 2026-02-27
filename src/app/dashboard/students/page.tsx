import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Student } from "@/models";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("students")}</h1>
                    <p className="text-sm text-gray-500">إدارة جميع الطلاب المسجلين بالمنظومة</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    + إضافة طالب جديد
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-bold text-gray-700">كود الطالب</th>
                                <th className="px-6 py-4 font-bold text-gray-700">الاسم الكامل</th>
                                <th className="px-6 py-4 font-bold text-gray-700">الصف</th>
                                <th className="px-6 py-4 font-bold text-gray-700">الفصل</th>
                                <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id.toString()} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-blue-600">{student.studentCode}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{student.fullNameAr}</td>
                                    <td className="px-6 py-4 text-gray-600">{student.currentGradeLevel?.nameAr || "—"}</td>
                                    <td className="px-6 py-4 text-gray-600">{student.classGroup?.nameAr || "—"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}>
                                            {student.status === "active" ? "نشط" : "غير نشط"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                                        <Link href={`/dashboard/students/${student._id}`} className="text-blue-600 hover:text-blue-800 font-bold ml-2">تعديل</Link>
                                        <button className="text-red-600 hover:text-red-800 font-bold">حذف</button>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        لا يوجد طلاب مضافين حالياً.
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
