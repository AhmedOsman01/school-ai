"use client";

import { useState, useTransition } from "react";
import { saveExamResults } from "@/server/actions/grading";
import { useRouter } from "next/navigation";

interface Student {
    _id: string;
    fullNameAr: string;
    studentCode: string;
}

interface Result {
    student: string;
    marksObtained: number;
    isAbsent: boolean;
    remarks?: string;
}

interface Props {
    examId: string;
    maxMarks: number;
    students: Student[];
    initialResults: Result[];
}

export default function GradingTable({ examId, maxMarks, students, initialResults }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [results, setResults] = useState<Record<string, { marks: number; absent: boolean; remarks: string }>>(
        students.reduce((acc, s) => {
            const existing = initialResults.find((r) => r.student === s._id);
            acc[s._id] = {
                marks: existing?.marksObtained ?? 0,
                absent: existing?.isAbsent ?? false,
                remarks: existing?.remarks ?? "",
            };
            return acc;
        }, {} as Record<string, { marks: number; absent: boolean; remarks: string }>)
    );

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (studentId: string, field: "marks" | "absent" | "remarks", value: string | number | boolean) => {
        setResults((prev) => {
            const current = prev[studentId] || { marks: 0, absent: false, remarks: "" };
            return {
                ...prev,
                [studentId]: { ...current, [field]: value },
            };
        });
    };

    const handleSave = async () => {
        setMessage(null);
        const data = {
            examId,
            results: Object.entries(results).map(([studentId, data]) => ({
                studentId,
                marksObtained: data.marks,
                isAbsent: data.absent,
                remarks: data.remarks,
            })),
        };

        startTransition(async () => {
            const res = await saveExamResults(data);
            if (res.success) {
                setMessage({ type: "success", text: "تم حفظ الدرجات بنجاح!" });
                router.refresh();
            } else {
                setMessage({ type: "error", text: res.error || "فشل حفظ الدرجات" });
            }
        });
    };

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm font-bold border-b border-gray-100">
                            <th className="p-4 w-16">#</th>
                            <th className="p-4">كود الطالب</th>
                            <th className="p-4">اسم الطالب</th>
                            <th className="p-4 w-32">الدرجة ({maxMarks})</th>
                            <th className="p-4 w-24 text-center">غائب</th>
                            <th className="p-4">ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {students.map((student, idx) => {
                            const res = results[student._id] || { marks: 0, absent: false, remarks: "" };
                            return (
                                <tr key={student._id} className={`hover:bg-blue-50/30 transition-colors ${res.absent ? 'bg-gray-50/50' : ''}`}>
                                    <td className="p-4 text-gray-400 font-medium">{idx + 1}</td>
                                    <td className="p-4 font-mono text-sm text-gray-600">{student.studentCode}</td>
                                    <td className="p-4 font-bold text-gray-800">{student.fullNameAr}</td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            max={maxMarks}
                                            min={0}
                                            disabled={res.absent}
                                            value={res.marks}
                                            onChange={(e) => handleChange(student._id, "marks", parseFloat(e.target.value) || 0)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={res.absent}
                                            onChange={(e) => handleChange(student._id, "absent", e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="text"
                                            placeholder="مثال: تحسن ملحوظ..."
                                            value={res.remarks}
                                            onChange={(e) => handleChange(student._id, "remarks", e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    إلغاء
                </button>
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-10 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                >
                    {isPending ? "جاري الحفظ..." : "حفظ الدرجات"}
                </button>
            </div>
        </div>
    );
}
