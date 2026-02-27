import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const t = await getTranslations("dashboard");
    const role = session.user.role;

    return (
        <div>
            {/* Welcome Header */}
            <div style={{ marginBottom: "2rem" }}>
                <h1
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "0.25rem",
                    }}
                >
                    {t("welcome", { name: session.user.email?.split("@")[0] || "" })}
                </h1>
                <p
                    style={{
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                    }}
                >
                    {role === "admin"
                        ? "إدارة جميع أقسام النظام"
                        : "عرض لوحة التحكم الخاصة بك"}
                </p>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "1.25rem",
                    marginBottom: "2rem",
                }}
            >
                <StatCard
                    label={t("totalStudents")}
                    value="—"
                    color="#3b82f6"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
                        </svg>
                    }
                />
                <StatCard
                    label={t("totalTeachers")}
                    value="—"
                    color="#10b981"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />
                <StatCard
                    label={t("activeClasses")}
                    value="—"
                    color="#f59e0b"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    }
                />
                <StatCard
                    label={t("pendingInvoices")}
                    value="—"
                    color="#ef4444"
                    icon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    }
                />
            </div>

            {/* Placeholder content */}
            <div
                className="card"
                style={{ padding: "2rem", textAlign: "center" }}
            >
                <p
                    style={{
                        fontSize: "1rem",
                        color: "var(--text-secondary)",
                    }}
                >
                    🎉 EduFlow Egypt is ready for development.
                    <br />
                    Connect to MongoDB and build out your modules.
                </p>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    color,
    icon,
}: {
    label: string;
    value: string;
    color: string;
    icon: React.ReactNode;
}) {
    return (
        <div
            className="card card-interactive"
            style={{ padding: "1.25rem 1.5rem" }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                }}
            >
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--radius-lg)",
                        background: `${color}15`,
                        color: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </div>
            </div>
            <p
                style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                    fontFeatureSettings: '"tnum"',
                }}
            >
                {value}
            </p>
            <p
                style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                }}
            >
                {label}
            </p>
        </div>
    );
}
