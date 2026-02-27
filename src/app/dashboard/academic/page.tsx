import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { AcademicYear, GradeLevel, Term } from "@/models";
import { getTranslations } from "next-intl/server";

export default async function AcademicPage() {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    await connectDB();
    const data = await Promise.all([
        AcademicYear.find({}).sort({ nameAr: -1 }).lean(),
        Term.find({}).populate("academicYear").sort({ sequence: 1 }).lean(),
        GradeLevel.find({}).sort({ sequence: 1 }).lean()
    ]);

    const years = data[0] as any[];
    const terms = data[1] as any[];
    const grades = data[2] as any[];

    const t = await getTranslations("nav");

    return (
        <div className="space-y-8" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("academic")}</h1>
                    <p className="text-sm text-gray-500">إدارة السنوات الدراسية، الفصول، والمراحل التعليمية</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Academic Years Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800">السنوات الدراسية</h3>
                        <button className="text-blue-600 text-sm font-bold hover:underline">+ إضافة</button>
                    </div>
                    <div className="space-y-3">
                        {years.map(year => (
                            <div key={year._id.toString()} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="font-bold text-gray-700">{year.nameAr}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${year.isCurrent ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {year.isCurrent ? 'الحالية' : 'سابقة'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Terms Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800">الفصول الدراسية</h3>
                        <button className="text-blue-600 text-sm font-bold hover:underline">+ إضافة</button>
                    </div>
                    <div className="space-y-3">
                        {terms.map((term: any) => (
                            <div key={term._id.toString()} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <span className="font-bold text-gray-700 block">{term.nameAr}</span>
                                    <span className="text-[10px] text-gray-400">{term.academicYear?.nameAr}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${term.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {term.isActive ? 'نشط' : 'مغلق'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grade Levels Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800">المراحل والصفوف</h3>
                        <button className="text-blue-600 text-sm font-bold hover:underline">+ إضافة</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {grades.map(grade => (
                            <div key={grade._id.toString()} className="p-2 bg-gray-50 rounded-lg text-center border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                                <span className="text-xs font-bold text-gray-700">{grade.nameAr}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-blue-800">
                <h4 className="font-bold mb-2">ملاحظة</h4>
                <p className="text-sm opacity-90">هذه الإعدادات تؤثر على جميع أقسام المنظومة. يرجى توخي الحذر عند تعديل السنوات الدراسية أو الفصول النشطة.</p>
            </div>
        </div>
    );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
