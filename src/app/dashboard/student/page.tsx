import { auth } from "@/lib/auth";
import { Student, StudentTermOverallSummary, Invoice, Attendance } from "@/models";
import connectDB from "@/lib/db";
import Link from "next/link";

export default async function StudentDashboard() {
    const session = await auth();
    if (!session || session.user.role !== "student") return null;

    await connectDB();
    const studentId = session.user.personId;

    // 1. Fetch Student Data
    const student = await Student.findById(studentId).populate("currentGradeLevel classGroup");
    if (!student) {
        return (
            <div className="container mx-auto p-10 text-center">
                <h1 className="text-2xl font-bold text-gray-800">بيانات الطالب غير موجودة</h1>
                <p className="text-gray-500">يرجى مراجعة الإدارة لتفعيل حسابك.</p>
            </div>
        );
    }

    // 2. Academic Summary
    const summary = await StudentTermOverallSummary.findOne({ student: studentId }).sort({ createdAt: -1 });

    // 3. Financial Summary
    const pendingInvoices = await Invoice.find({ student: studentId, status: { $ne: "paid" } });
    const totalDue = pendingInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

    // 4. Attendance Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendanceToday = await Attendance.findOne({ student: studentId, date: { $gte: today } });

    return (
        <div className="container mx-auto p-4 lg:p-10 space-y-8" dir="rtl">
            {/* Welcome Banner */}
            <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="relative z-10 text-center lg:text-right">
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        مرحباً، {student?.fullNameAr?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-400 text-lg">أهلاً بك في البوابة التعليمية. إليك ملخص لأدائك اليوم.</p>
                </div>

                <div className="flex gap-4 relative z-10">
                    <div className="bg-blue-50 px-8 py-4 rounded-3xl border border-blue-100">
                        <p className="text-xs text-blue-400 font-bold mb-1 uppercase">الصف الدراسي</p>
                        <p className="text-xl font-black text-blue-900">{student?.currentGradeLevel?.nameAr}</p>
                    </div>
                    <div className="bg-indigo-50 px-8 py-4 rounded-3xl border border-indigo-100">
                        <p className="text-xs text-indigo-400 font-bold mb-1 uppercase">الفصل</p>
                        <p className="text-xl font-black text-indigo-900">{student?.classGroup?.nameAr}</p>
                    </div>
                </div>

                {/* Background Accent */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Stats & Links */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* GPA Card */}
                        <Link href="/dashboard/performance" className="group bg-blue-600 rounded-[35px] p-8 text-white shadow-xl shadow-blue-200 hover:scale-[1.02] transition-all relative overflow-hidden">
                            <p className="text-blue-100 text-sm font-bold mb-2">المعدل التراكمي (GPA)</p>
                            <h3 className="text-5xl font-black">{summary?.overallGPA?.toFixed(2) || "0.00"}</h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">ترتيبك: #{summary?.classRank || "--"}</span>
                            </div>
                            <span className="absolute top-6 left-6 text-4xl opacity-20 transition-opacity group-hover:opacity-40">📊</span>
                        </Link>

                        {/* Finance Card */}
                        <Link href="/dashboard/finance" className="group bg-amber-500 rounded-[35px] p-8 text-white shadow-xl shadow-amber-200 hover:scale-[1.02] transition-all relative overflow-hidden">
                            <p className="text-amber-100 text-sm font-bold mb-2">المصروفات المتبقية</p>
                            <h3 className="text-4xl font-black tracking-tight">{totalDue.toLocaleString()} <span className="text-lg">ج.م</span></h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">{pendingInvoices.length} فواتير معلقة</span>
                            </div>
                            <span className="absolute top-6 left-6 text-4xl opacity-20 transition-opacity group-hover:opacity-40">💰</span>
                        </Link>

                        {/* Attendance Card */}
                        <div className="bg-emerald-500 rounded-[35px] p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                            <p className="text-emerald-100 text-sm font-bold mb-2">حضور اليوم</p>
                            <h3 className="text-4xl font-black">{attendanceToday ? (attendanceToday.status === 'present' ? 'حاضر' : 'غائب') : 'لم يسجل'}</h3>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">نظام البصمة الذكي</span>
                            </div>
                            <span className="absolute top-6 left-6 text-4xl opacity-20 transition-opacity group-hover:opacity-40">📅</span>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { title: "الجدول الدراسي", icon: "🕒", color: "bg-white text-gray-900 border-gray-100 hover:border-blue-500", href: "/dashboard/schedule" },
                            { title: "الحافلة المدرسية", icon: "🚌", color: "bg-white text-gray-900 border-gray-100 hover:border-orange-500", href: "/dashboard/transport" },
                            { title: "قائمة الطعام", icon: "🍱", color: "bg-white text-gray-900 border-gray-100 hover:border-green-500", href: "/dashboard/canteen" },
                            { title: "النتائج والتقارير", icon: "📜", color: "bg-white text-gray-900 border-gray-100 hover:border-indigo-500", href: "/dashboard/performance" },
                        ].map((action, i) => (
                            <Link key={i} href={action.href} className={`flex flex-col items-center justify-center p-6 rounded-[30px] border shadow-sm transition-all hover:shadow-md ${action.color}`}>
                                <span className="text-3xl mb-3">{action.icon}</span>
                                <span className="font-bold text-center text-sm">{action.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Column: Upcoming Events & Notifications */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span>🔔</span> التنبيهات
                        </h4>
                        <div className="space-y-4">
                            <div className="bg-amber-50 p-4 rounded-2xl border-r-4 border-amber-400">
                                <p className="text-xs text-amber-900 font-bold mb-1">المالية</p>
                                <p className="text-sm text-amber-800 leading-tight">موعد سداد دفعة مصروفات الترم الثاني غداً.</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl border-r-4 border-blue-400">
                                <p className="text-xs text-blue-900 font-bold mb-1">الامتحانات</p>
                                <p className="text-sm text-blue-800 leading-tight">تم إضافة جدول امتحانات الشهر الأول.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                        <p className="text-gray-400 text-xs font-bold mb-4 uppercase">التواصل المباشر</p>
                        <h4 className="text-xl font-black mb-6">هل لديك أي استفسار؟</h4>
                        <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold">
                            💬 دردشة مع المعلم
                        </button>
                        {/* Decorative Circle */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
