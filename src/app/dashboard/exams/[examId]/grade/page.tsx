import { auth } from "@/lib/auth";
import { Exam, Student, StudentExamResult } from "@/models";
import connectDB from "@/lib/db";
import { notFound } from "next/navigation";
import GradingTable from "./GradingTable";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

interface Props {
    params: Promise<{ examId: string }>;
}

export default async function GradeExamPage({ params }: Props) {
    const { examId } = await params;
    const session = await auth();
    if (!session) return null;

    await connectDB();

    // 1. Fetch Exam Detail
    const exam = await Exam.findById(examId)
        .populate({
            path: "subject",
            populate: { path: "subject", populate: { path: "gradeLevel" } }
        });

    if (!exam) return notFound();

    // 2. Fetch Students for this grade level
    // Note: subject points to CurriculumItem -> Subject -> GradeLevel
    const gradeLevelId = exam.subject.subject.gradeLevel._id;
    const students = await Student.find({ currentGradeLevel: gradeLevelId })
        .sort({ fullNameAr: 1 })
        .select("fullNameAr fullNameEn studentCode");

    // 3. Fetch existing results
    const existingResults = await StudentExamResult.find({ exam: examId });

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <nav className="text-sm text-slate-400 dark:text-slate-500 mb-2">
                            <Link href="/dashboard/exams" className="hover:text-indigo-600 transition-colors">الامتحانات</Link>
                            <span className="mx-2">/</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">رصد الدرجات</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{exam.nameAr}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                            {exam.subject.subject.nameAr} • الدرجة العظمى: <span className="text-slate-700 dark:text-slate-200">{exam.maxMarks}</span>
                        </p>
                    </div>

                    <div className="flex bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl items-center gap-3 border border-indigo-100 dark:border-indigo-800/30">
                        <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm">
                            {students.length}
                        </div>
                        <div className="text-sm">
                            <p className="text-indigo-900 dark:text-indigo-100 font-bold">إجمالي الطلاب</p>
                            <p className="text-indigo-600 dark:text-indigo-400">المقرر رصدهم</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <GradingTable
                examId={examId}
                maxMarks={exam.maxMarks}
                students={JSON.parse(JSON.stringify(students))}
                initialResults={JSON.parse(JSON.stringify(existingResults))}
            />
        </div>
    );
}
