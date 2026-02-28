import { auth } from "@/lib/auth";
import { Invoice } from "@/models";
import connectDB from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";
import type { IStudent } from "@/types";

export default async function FinancePage() {
    const session = await auth();
    if (!session) return null;

    await connectDB();

    // Find invoices (if parent, show only for their children; if student, show their own)
    let query = {};
    if (session.user.role === "parent") {
        await Person.findById(session.user.personId);
        // Logic to find students linked to this parent...
    } else if (session.user.role === "student") {
        query = { student: session.user.personId };
    }

    const invoices = await Invoice.find(query)
        .populate("student", "fullNameAr studentCode")
        .sort({ createdAt: -1 });

    const stats = {
        totalPending: invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + i.balanceDue, 0),
        paidThisMonth: 154000, // Placeholder for aggregation
        overdueCount: invoices.filter(i => i.status === 'overdue').length
    };

    return (
        <div className="container mx-auto p-6 space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-black text-gray-800">المالية والمدفوعات</h1>
                <p className="text-gray-500">متابعة الرسوم الدراسية والفواتير</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-400 mb-1">إجمالي المستحقات</p>
                    <p className="text-2xl font-black text-red-600">{stats.totalPending.toLocaleString()} ج.م</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-400 mb-1">تم تحصيله هذا الشهر</p>
                    <p className="text-2xl font-black text-green-600">{stats.paidThisMonth.toLocaleString()} ج.م</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-400 mb-1">فواتير متأخرة</p>
                    <p className="text-2xl font-black text-amber-600">{stats.overdueCount} فاتورة</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center text-sm font-bold text-gray-400">
                    <span>الفواتير الأخيرة</span>
                    {session.user.role === "admin" && (
                        <button className="text-blue-600">+ فاتورة جديدة</button>
                    )}
                </div>

                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-gray-50/50 text-xs text-gray-400 font-bold uppercase tracking-widest border-b border-gray-50">
                            <th className="p-4">رقم الفاتورة</th>
                            <th className="p-4">الطالب</th>
                            <th className="p-4">المبلغ</th>
                            <th className="p-4">المتبقي</th>
                            <th className="p-4">تاريخ الاستحقاق</th>
                            <th className="p-4">الحالة</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {invoices.map((inv) => (
                            <tr key={inv._id.toString()} className="hover:bg-blue-50/20 transition-colors">
                                <td className="p-4 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{(inv.student as unknown as IStudent).fullNameAr}</div>
                                    <div className="text-xs text-gray-400">{(inv.student as unknown as IStudent).studentCode}</div>
                                </td>
                                <td className="p-4 font-bold">{inv.total.toLocaleString()} ج.م</td>
                                <td className="p-4 font-bold text-red-500">{inv.balanceDue.toLocaleString()} ج.م</td>
                                <td className="p-4 text-sm text-gray-500">{format(new Date(inv.dueDate), 'yyyy/MM/dd')}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                        inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {inv.status === 'paid' ? 'نسددت' : inv.status === 'overdue' ? 'متأخرة' : 'قيد الانتظار'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link href={`/dashboard/finance/invoice/${inv._id}`} className="p-2 hover:bg-gray-100 rounded-lg inline-block transition-colors">
                                        👁️
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Needed imports for Person
import { Person } from "@/models";
