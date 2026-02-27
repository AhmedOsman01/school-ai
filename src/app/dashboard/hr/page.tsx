import { auth } from "@/lib/auth";
import { Person, StaffContract, LeaveRequest } from "@/models";
import connectDB from "@/lib/db";
import { format } from "date-fns";

export default async function HRDashboard() {
    const session = await auth();
    if (!session || !["admin", "staff"].includes(session.user.role)) return null;

    await connectDB();

    // 1. Fetch Staff List (Users with role teacher or staff)
    const staffMembers = await Person.find({ role: { $in: ["teacher", "staff", "driver"] } })
        .sort({ fullNameAr: 1 });

    // 2. Fetch Recent Leave Requests
    const recentLeaves = await LeaveRequest.find()
        .populate("staff", "fullNameAr role")
        .sort({ createdAt: -1 })
        .limit(5);

    // 3. Stats
    const activeContracts = await StaffContract.countDocuments({ isActive: true });
    const pendingLeaves = await LeaveRequest.countDocuments({ status: "pending" });

    return (
        <div className="container mx-auto p-6 space-y-8" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-gray-900">إدارة الموارد البشرية</h1>
                    <p className="text-gray-500 text-lg">إدارة الموظفين، العقود، والرواتب</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-200">
                    + إضافة موظف جديد
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-400 mb-1">إجمالي الموظفين</p>
                    <p className="text-3xl font-black text-blue-600">{staffMembers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-400 mb-1">عقود مفعلة</p>
                    <p className="text-3xl font-black text-emerald-600">{activeContracts}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-400 mb-1">طلبات إجازة معلقة</p>
                    <p className="text-3xl font-black text-amber-600">{pendingLeaves}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-3xl shadow-xl">
                    <p className="text-gray-400 text-sm mb-1">إجمالي الرواتب (هذا الشهر)</p>
                    <p className="text-3xl font-black text-white">450,000 <span className="text-sm">ج.م</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Staff List Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">قائمة الموظفين</h3>
                        <input type="text" placeholder="بحث باسم الموظف..." className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <table className="w-full text-right">
                        <thead className="bg-gray-50/50 text-xs text-gray-400 font-bold uppercase">
                            <tr>
                                <th className="p-4">الموظف</th>
                                <th className="p-4">الدور</th>
                                <th className="p-4">نوع العقد</th>
                                <th className="p-4">الراتب الأساسي</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {staffMembers.map((staff) => (
                                <tr key={staff._id.toString()} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{staff.fullNameAr}</div>
                                        <div className="text-xs text-gray-400">{staff.email || 'بدون إيميل'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">
                                            {staff.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-600">دوام كامل</td>
                                    <td className="p-4 font-bold text-blue-600">-- ج.م</td>
                                    <td className="p-4 text-left">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">⚙️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Side Module: Recently Requested Leaves */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold mb-6">طلبـات الإجازة</h3>
                        <div className="space-y-4">
                            {recentLeaves.map((leave) => (
                                <div key={leave._id.toString()} className="p-4 rounded-2xl bg-gray-50 space-y-2 border border-transparent hover:border-blue-100 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-sm text-gray-800">{(leave.staff as any)?.fullNameAr || "موظف مجهول"}</div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${leave.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {leave.status === 'pending' ? 'جاري الانتظار' : 'تمت الموافقة'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500">
                                        <span>{leave.leaveType.toUpperCase()} ({leave.daysCount} أيام)</span>
                                        <span>{format(new Date(leave.startDate), 'MM/dd')}</span>
                                    </div>
                                </div>
                            ))}
                            {recentLeaves.length === 0 && (
                                <p className="text-sm text-gray-400 italic text-center py-4">لا توجد طلبات إجازة حديثة.</p>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            عرض كل الطلبات
                        </button>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                        <p className="text-indigo-100 text-xs font-bold mb-4 uppercase">دورات الرواتب</p>
                        <h4 className="text-2xl font-black mb-4">كـشف رواتب فبراير 2026</h4>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-white/10 px-4 py-2 rounded-xl">
                                <p className="text-[10px] opacity-70">الحالة</p>
                                <p className="text-sm font-bold">قيد المراجعة</p>
                            </div>
                        </div>
                        <button className="w-full bg-white text-indigo-600 font-bold p-4 rounded-2xl shadow-lg hover:shadow-indigo-400/50 transition-all">
                            اعتماد الرواتب وتوليد الفواتير
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
