import { auth } from "@/lib/auth";
import { Exam, Term, Subject } from "@/models";
import connectDB from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";

export default async function ExamsPage() {
    const session = await auth();
    if (!session) return null;

    await connectDB();

    // Fetch exams (if teacher, show only their exams; if admin/accountant, show all)
    const query = session.user.role === "teacher"
        ? { createdBy: session.user.id }
        : {};

    const exams = await Exam.find(query)
        .populate("term", "nameAr nameEn")
        .sort({ examDate: -1 });

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {session.user.role === "teacher" ? "امتحاناتي" : "إدارة الامتحانات"}
                    </h1>
                    <p className="text-gray-500">رصد الدرجات وإدارة التقييمات</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
                    + إضافة امتحان جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <div key={exam._id.toString()} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${exam.examType === 'final' ? 'bg-red-50 text-red-600' :
                                        exam.examType === 'quiz' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {exam.examType.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {format(new Date(exam.examDate), 'yyyy/MM/dd')}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-1 truncate">{exam.nameAr}</h3>
                            <p className="text-sm text-gray-500 mb-4">{exam.term.nameAr}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="text-sm">
                                    <span className="text-gray-400">الدرجة القصوى:</span>
                                    <span className="font-bold ml-1">{exam.maxMarks}</span>
                                </div>
                                <Link
                                    href={`/dashboard/exams/${exam._id}/grade`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
                                >
                                    رصد الدرجات →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {exams.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 italic">لا توجد امتحانات مسجلة حالياً.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
