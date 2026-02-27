import { auth } from "@/lib/auth";
import { Exam, Student, StudentExamResult, ClassGroup, CurriculumItem, Subject } from "@/models";
import connectDB from "@/lib/db";
import { notFound } from "next/navigation";
import GradingTable from "./GradingTable";

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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <nav className="text-sm text-gray-400 mb-2">
                        <Link href="/dashboard/exams" className="hover:text-blue-600 transition-colors">الامتحانات</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-600 font-medium">رصد الدرجات</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-800">{exam.nameAr}</h1>
                    <p className="text-gray-500">
                        {exam.subject.subject.nameAr} • الدرجة العظمى: {exam.maxMarks}
                    </p>
                </div>

                <div className="flex bg-blue-50 p-4 rounded-xl items-center gap-3">
                    <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {students.length}
                    </div>
                    <div className="text-sm">
                        <p className="text-blue-900 font-bold">إجمالي الطلاب</p>
                        <p className="text-blue-600">المقرر رصدهم</p>
                    </div>
                </div>
            </div>

            <GradingTable
                examId={examId}
                maxMarks={exam.maxMarks}
                students={JSON.parse(JSON.stringify(students))}
                initialResults={JSON.parse(JSON.stringify(existingResults))}
            />
        </div>
    );
}

// Separate import for Link because it's used in the JSX
import Link from "next/link";
