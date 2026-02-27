import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/types";

// ─── App Store ──────────────────────────────

interface AppState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  locale: "ar" | "en";
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setLocale: (locale: "ar" | "en") => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      locale: "ar",
      theme: "light",
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapse: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "eduflow-app-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        locale: state.locale,
        theme: state.theme,
      }),
    }
  )
);

// ─── Dashboard Stats Store ──────────────────

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeClasses: number;
  pendingInvoices: number;
  todayAttendanceRate: number;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStats>((set) => ({
  totalStudents: 0,
  totalTeachers: 0,
  activeClasses: 0,
  pendingInvoices: 0,
  todayAttendanceRate: 0,
  isLoading: false,
  error: null,
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      set({
        totalStudents: data.data?.totalStudents ?? 0,
        totalTeachers: data.data?.totalTeachers ?? 0,
        activeClasses: data.data?.activeClasses ?? 0,
        pendingInvoices: data.data?.pendingInvoices ?? 0,
        todayAttendanceRate: data.data?.todayAttendanceRate ?? 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
}));

// ─── Notification Store ─────────────────────

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  timestamp: Date;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
