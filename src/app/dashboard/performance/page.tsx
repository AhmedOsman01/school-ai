import { auth } from "@/lib/auth";
import { Student, StudentExamResult, StudentTermOverallSummary, StudentTermSubjectSummary, Term } from "@/models";
import connectDB from "@/lib/db";
import { notFound } from "next/navigation";
import PerformanceCharts from "./PerformanceCharts"; // We'll build this next

export default async function StudentPerformancePage({ params }: { params: Promise<{ studentId?: string }> }) {
    const session = await auth();
    if (!session) return null;

    await connectDB();

    // If role is parent, use the studentId from params. If role is student, use their linked ID.
    const targetId = session.user.role === "student" ? session.user.personId : (await params).studentId;
    if (!targetId) return notFound();

    const student = await Student.findById(targetId).populate("currentGradeLevel classGroup");
    if (!student) return notFound();

    // Fetch the latest term summary
    const summary = await StudentTermOverallSummary.findOne({ student: targetId })
        .populate("term")
        .sort({ createdAt: -1 });

    // Fetch results for the current term
    const subjectSummaries = await StudentTermSubjectSummary.find({
        student: targetId,
        term: summary?.term?._id
    }).populate({
        path: "subject",
        populate: { path: "subject" }
    });

    return (
        <div className="container mx-auto p-4 lg:p-8 space-y-8" dir="rtl">
            {/* Header Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-right">
                        <h1 className="text-4xl font-extrabold mb-2">{student.fullNameAr}</h1>
                        <p className="text-blue-100 opacity-90 flex items-center gap-2 justify-center md:justify-start">
                            <span>{student.currentGradeLevel.nameAr}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                            <span>{student.classGroup.nameAr}</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[120px]">
                            <p className="text-xs text-blue-200 uppercase tracking-widest mb-1">المعدل التراكمي</p>
                            <p className="text-3xl font-black">{summary?.overallGPA?.toFixed(2) || "0.00"}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[120px]">
                            <p className="text-xs text-blue-200 uppercase tracking-widest mb-1">الترتيب</p>
                            <p className="text-3xl font-black">#{summary?.classRank || "--"}</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subject Breakdown List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 px-2">نتائج المواد - {summary?.term?.nameAr || "الفصل الحالي"}</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {subjectSummaries.map((sub) => (
                            <div key={sub._id.toString()} className="group bg-white hover:bg-blue-50/50 p-5 rounded-2xl border border-gray-100 shadow-sm transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                        {sub.subject.subject.code.slice(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-gray-800 text-lg">{sub.subject.subject.nameAr}</h4>
                                        <p className="text-sm text-gray-400">آخر تحديث: {new Date(sub.lastCalculatedAt).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <div className="text-2xl font-black text-blue-600">{sub.percentage}%</div>
                                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block font-bold mt-1 ${sub.percentage >= 90 ? 'bg-green-100 text-green-700' :
                                            sub.percentage >= 75 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        التقدير: {sub.gradeLetter || "ممتاز"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">توزيع الدرجات</h3>
                        {/* Chart Placeholder / Performance Overview */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">الاختبارات الشهرية</span>
                                <span className="font-bold">40%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-[40%]"></div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">المهام الأدائية</span>
                                <span className="font-bold">20%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[20%]"></div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">اختبار نهاية الفصل</span>
                                <span className="font-bold">40%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full w-[40%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                        <h3 className="text-amber-900 font-bold mb-2">ملاحظات المعلم</h3>
                        <p className="text-amber-800 text-sm leading-relaxed italic">
                            "{summary?.remarks || "لا توجد ملاحظات عامة لهذا الفصل الدراسي. أداء يوسف ممتاز ومستقر في معظم المواد."}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
