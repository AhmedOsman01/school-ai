import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Users, GraduationCap, DollarSign, Calendar, MessageSquare, Plus, FileText, Bus } from "lucide-react";
import Link from "next/link";
import { RevenueChart } from "@/components/ui/RevenueChart";
import { AttendanceChart } from "@/components/ui/AttendanceChart";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const t = await getTranslations("dashboard");
    const role = session.user.role;

    // Quick Actions mapping based on role
    const getQuickActions = (userRole: string) => {
        switch (userRole) {
            case "admin":
                return [
                    { label: "Add Student", icon: Plus, href: "/dashboard/students/add", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" },
                    { label: "Broadcast Message", icon: MessageSquare, href: "/dashboard/announcements", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" },
                    { label: "Generate Report", icon: FileText, href: "/dashboard/reports", color: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" },
                    { label: "Manage Transport", icon: Bus, href: "/dashboard/transport", color: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400" },
                ];
            default:
                return [
                    { label: "View Timetable", icon: Calendar, href: "/dashboard/timetable", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" },
                ];
        }
    };

    const quickActions = getQuickActions(role as string);

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize mb-1">
                        {t("welcome", { name: session.user.email?.split("@")[0] || "" })}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {role === "admin"
                            ? "Here is what's happening in your school today."
                            : "Welcome back to your dashboard."}
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Academic Year:</span>
                    <span className="badge badge-info ring-1 ring-inset ring-indigo-600/20">2026/2027</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label={t("totalStudents")}
                    value="1,248"
                    trend="+12 this month"
                    trendUp={true}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50 dark:bg-indigo-500/10"
                    icon={<GraduationCap className="w-6 h-6" />}
                />
                <StatCard
                    label={t("totalTeachers")}
                    value="94"
                    trend="Stable"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50 dark:bg-emerald-500/10"
                    icon={<Users className="w-6 h-6" />}
                />
                <StatCard
                    label={t("activeClasses")}
                    value="42"
                    trend=""
                    color="text-amber-600"
                    bgColor="bg-amber-50 dark:bg-amber-500/10"
                    icon={<Calendar className="w-6 h-6" />}
                />
                <StatCard
                    label={t("pendingInvoices")}
                    value="EGP 45k"
                    trend="12 Overdue"
                    trendUp={false}
                    color="text-rose-600"
                    bgColor="bg-rose-50 dark:bg-rose-500/10"
                    icon={<DollarSign className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area (Charts) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Revenue Chart */}
                    <div className="card p-6 min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
                            <select className="text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 font-medium text-slate-600 dark:text-slate-300 outline-none">
                                <option>This Year</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <RevenueChart />
                    </div>

                    {/* Attendance Chart */}
                    <div className="card p-6 min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Student Attendance</h3>
                            <button className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium">View Details</button>
                        </div>
                        <AttendanceChart />
                    </div>
                </div>

                {/* Sidebar Area (Quick Actions & Notifications) */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="card p-5">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all bg-white dark:bg-slate-900 group"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${action.color} group-hover:scale-110 transition-transform`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Pending Approvals / Tasks */}
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                                View All
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">New student enrolled in Grade {i + 5}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{i + 2} hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    trend,
    trendUp,
    color,
    bgColor,
    icon,
}: {
    label: string;
    value: string;
    trend: string;
    trendUp?: boolean;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white num-ar">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-xs font-medium">
                    {trendUp !== undefined && (
                        <span className={`mr-1 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {trendUp ? '↑' : '↓'}
                        </span>
                    )}
                    <span className="text-slate-500 dark:text-slate-400">{trend}</span>
                </div>
            )}
        </div>
    );
}
