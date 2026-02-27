import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types";

/**
 * Middleware helper: Check if current user has required role(s)
 */
export async function requireRole(...allowedRoles: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    return {
      authorized: false,
      error: "Unauthorized: Not logged in",
      status: 401,
      session: null,
    } as const;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return {
      authorized: false,
      error: `Forbidden: Requires one of [${allowedRoles.join(", ")}]`,
      status: 403,
      session: null,
    } as const;
  }

  return {
    authorized: true,
    error: null,
    status: 200,
    session,
  } as const;
}

/**
 * Create a JSON error response
 */
export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a JSON success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ data }, { status });
}

/**
 * Role hierarchy for permission checking
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  accountant: 80,
  teacher: 60,
  staff: 50,
  driver: 40,
  parent: 20,
  student: 10,
};

/**
 * Check if a role has at least the given permission level
 */
export function hasMinRole(userRole: UserRole, minRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

/**
 * Menu items per role
 */
export interface MenuItem {
  titleKey: string;
  href: string;
  icon: string;
  children?: MenuItem[];
}

export const ROLE_MENUS: Record<UserRole, MenuItem[]> = {
  admin: [
    { titleKey: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { titleKey: "nav.students", href: "/dashboard/students", icon: "GraduationCap" },
    { titleKey: "nav.teachers", href: "/dashboard/teachers", icon: "Users" },
    { titleKey: "nav.guardians", href: "/dashboard/guardians", icon: "UserCheck" },
    { titleKey: "nav.academic", href: "/dashboard/academic", icon: "BookOpen" },
    { titleKey: "nav.timetable", href: "/dashboard/timetable", icon: "Calendar" },
    { titleKey: "nav.attendance", href: "/dashboard/attendance", icon: "ClipboardCheck" },
    { titleKey: "nav.exams", href: "/dashboard/exams", icon: "FileText" },
    { titleKey: "nav.finance", href: "/dashboard/finance", icon: "DollarSign" },
    { titleKey: "nav.transport", href: "/dashboard/transport", icon: "Bus" },
    { titleKey: "nav.cafeteria", href: "/dashboard/cafeteria", icon: "UtensilsCrossed" },
    { titleKey: "nav.announcements", href: "/dashboard/announcements", icon: "Bell" },
    { titleKey: "nav.settings", href: "/dashboard/settings", icon: "Settings" },
  ],
  teacher: [
    { titleKey: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { titleKey: "nav.myClasses", href: "/dashboard/classes", icon: "Users" },
    { titleKey: "nav.attendance", href: "/dashboard/attendance", icon: "ClipboardCheck" },
    { titleKey: "nav.assignments", href: "/dashboard/assignments", icon: "FileEdit" },
    { titleKey: "nav.exams", href: "/dashboard/exams", icon: "FileText" },
    { titleKey: "nav.timetable", href: "/dashboard/timetable", icon: "Calendar" },
    { titleKey: "nav.announcements", href: "/dashboard/announcements", icon: "Bell" },
  ],
  student: [
    { titleKey: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { titleKey: "nav.myClasses", href: "/dashboard/classes", icon: "BookOpen" },
    { titleKey: "nav.assignments", href: "/dashboard/assignments", icon: "FileEdit" },
    { titleKey: "nav.exams", href: "/dashboard/exams", icon: "FileText" },
    { titleKey: "nav.results", href: "/dashboard/results", icon: "BarChart" },
    { titleKey: "nav.timetable", href: "/dashboard/timetable", icon: "Calendar" },
    { titleKey: "nav.cafeteria", href: "/dashboard/cafeteria", icon: "UtensilsCrossed" },
    { titleKey: "nav.announcements", href: "/dashboard/announcements", icon: "Bell" },
  ],
  parent: [
    { titleKey: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { titleKey: "nav.children", href: "/dashboard/children", icon: "Users" },
    { titleKey: "nav.results", href: "/dashboard/results", icon: "BarChart" },
    { titleKey: "nav.finance", href: "/dashboard/finance", icon: "DollarSign" },
    { titleKey: "nav.transport", href: "/dashboard/transport", icon: "Bus" },
    { titleKey: "nav.cafeteria", href: "/dashboard/cafeteria", icon: "UtensilsCrossed" },
    { titleKey: "nav.announcements", href: "/dashboard/announcements", icon: "Bell" },
  ],
  accountant: [
    { titleKey: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { titleKey: "nav.invoices", href: "/dashboard/invoices", icon: "FileText" },
    { titleKey: "nav.payments", href: "/dashboard/payments", icon: "CreditCard" },
    { titleKey: "nav.feeStructure", href: "/dashboard/fees", icon: "DollarSign" },
    { titleKey: "nav.reports", href: "/dashboard/reports", icon: "BarChart" },
  ],
  driver: [
    { titleKey: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { titleKey: "nav.myBus", href: "/dashboard/bus", icon: "Bus" },
    { titleKey: "nav.route", href: "/dashboard/route", icon: "MapPin" },
    { titleKey: "nav.busAttendance", href: "/dashboard/bus-attendance", icon: "ClipboardCheck" },
  ],
  staff: [
    { titleKey: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { titleKey: "nav.announcements", href: "/dashboard/announcements", icon: "Bell" },
  ],
};
