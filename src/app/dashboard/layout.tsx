"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ROLE_MENUS, type MenuItem } from "@/lib/menu";
import type { UserRole } from "@/types";

// ─── Icon Map (lightweight SVG icons) ───────

function NavIcon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    LayoutDashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    GraduationCap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    Users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    UserCheck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    BookOpen: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    Calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    ClipboardCheck: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" />
      </svg>
    ),
    FileText: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    FileEdit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" /><polyline points="14 2 14 8 20 8" /><path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
      </svg>
    ),
    DollarSign: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    CreditCard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    Bus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><path d="M9 18h5" /><circle cx="16" cy="18" r="2" />
      </svg>
    ),
    MapPin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    UtensilsCrossed: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" /><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c1.7 1.7 4.3 1.7 6 0" /><path d="m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z" />
      </svg>
    ),
    Bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
    Settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    BarChart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  };

  return <>{icons[name] || icons["LayoutDashboard"]}</>;
}

// ─── Sidebar Component ──────────────────────

function SidebarItem({
  item,
  isActive,
  collapsed,
}: {
  item: MenuItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const t = useTranslations();

  return (
    <Link
      href={item.href}
      className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
      title={collapsed ? t(item.titleKey) : undefined}
    >
      <span className="sidebar-item-icon">
        <NavIcon name={item.icon} />
      </span>
      {!collapsed && (
        <span className="sidebar-item-text">{t(item.titleKey)}</span>
      )}
    </Link>
  );
}

// ─── Dashboard Layout ───────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations();
  const tApp = useTranslations("app");
  const tAuth = useTranslations("auth");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (session?.user?.role || "student") as UserRole;
  const menuItems = ROLE_MENUS[role] || ROLE_MENUS.student;

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""
          }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              fill="none"
            >
              <rect
                width="48"
                height="48"
                rx="12"
                fill="url(#sidebar-gradient)"
              />
              <path
                d="M14 34V18L24 12L34 18V34"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 34V26H28V34"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="21" r="3" stroke="white" strokeWidth="2" />
              <defs>
                <linearGradient
                  id="sidebar-gradient"
                  x1="0"
                  y1="0"
                  x2="48"
                  y2="48"
                >
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
            {!collapsed && (
              <span className="sidebar-brand">{tApp("name")}</span>
            )}
          </div>
          <button
            className="sidebar-toggle no-print"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {collapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href))
              }
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="sidebar-logout"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>{tAuth("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`dashboard-main ${collapsed ? "dashboard-main-expanded" : ""
          }`}
      >
        {/* Top Bar */}
        <header className="topbar no-print">
          <div className="topbar-start">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <div className="topbar-end">
            {/* User Info */}
            <div className="topbar-user">
              <div className="topbar-avatar">
                {session?.user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="topbar-user-info">
                <span className="topbar-user-email">
                  {session?.user?.email}
                </span>
                <span className="topbar-user-role badge badge-info">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content animate-fade-in">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
        }

        /* ── Sidebar ───────────── */
        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          inset-inline-start: 0; /* Automatically right in RTL, left in LTR */
          width: var(--sidebar-width);
          background: var(--bg-sidebar);
          color: var(--text-sidebar);
          display: flex;
          flex-direction: column;
          z-index: 50;
          transition: width var(--transition-normal), transform var(--transition-normal);
          overflow-x: hidden;
        }

        .sidebar-collapsed {
          width: var(--sidebar-collapsed-width);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          min-height: 72px;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          overflow: hidden;
        }

        .sidebar-brand {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          white-space: nowrap;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--text-sidebar);
          cursor: pointer;
          padding: 0.375rem;
          border-radius: var(--radius-sm);
          opacity: 0.6;
          transition: opacity var(--transition-fast);
          flex-shrink: 0;
        }

        .sidebar-toggle:hover {
          opacity: 1;
        }

        [dir="rtl"] .sidebar-toggle svg {
          transform: rotate(180deg);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        :global(.sidebar-item) {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.875rem;
          border-radius: var(--radius-md);
          color: var(--text-sidebar);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background var(--transition-fast),
            color var(--transition-fast);
          white-space: nowrap;
          overflow: hidden;
        }

        :global(.sidebar-item:hover) {
          background: var(--bg-sidebar-hover);
          color: white;
        }

        :global(.sidebar-item-active) {
          background: var(--bg-sidebar-active) !important;
          color: var(--text-sidebar-active) !important;
        }

        :global(.sidebar-item-icon) {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .sidebar-footer {
          padding: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: none;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-sidebar);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background var(--transition-fast),
            color var(--transition-fast);
        }

        .sidebar-logout:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }

        /* ── Mobile Sidebar ──────── */
        .sidebar-overlay {
          display: none;
        }

        @media (max-width: 1024px) {
          .sidebar {
            /* Use logical transform if possible, but translate is fine if reset */
            transform: translateX(-100%);
          }

          [dir="rtl"] .sidebar {
            transform: translateX(100%);
          }

          .sidebar-mobile-open {
            transform: translateX(0) !important;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 40;
          }

          .sidebar-toggle {
            display: none;
          }
        }

        /* ── Main Content ────────── */
        .dashboard-main {
          flex: 1;
          margin-inline-start: var(--sidebar-width); /* Logical margin */
          transition: margin-inline-start var(--transition-normal);
          min-width: 0; /* Prevent flex blowout */
        }

        .dashboard-main-expanded {
          margin-inline-start: var(--sidebar-collapsed-width);
        }

        @media (max-width: 1024px) {
          .dashboard-main,
          .dashboard-main-expanded {
            margin-inline-start: 0 !important;
          }
        }

        /* ── Top Bar ─────────────── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-default);
          min-height: 64px;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .topbar-start {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.375rem;
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex;
          }
        }

        .topbar-end {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .topbar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .topbar-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .topbar-user-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .topbar-user-email {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .topbar-user-role {
          font-size: 0.6875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
        }

        @media (max-width: 640px) {
          .topbar-user-info {
            display: none;
          }
        }

        /* ── Content ─────────────── */
        .dashboard-content {
          padding: 1.5rem;
          min-height: calc(100vh - 64px);
        }

        @media (max-width: 640px) {
          .dashboard-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
