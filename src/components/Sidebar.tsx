"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const subLinks = [
    { href: "/dashboard/sop/1/sections/overview", label: "Project Overview" },
    { href: "/dashboard/sop/1/sections/ai-system", label: "AI System Overview" },
    { href: "/dashboard/sop/1/sections/tech-setup", label: "Technical Setup Guide" },
    { href: "/dashboard/sop/1/sections/features", label: "Feature Register" },
    { href: "/dashboard/sop/1/sections/roadmap", label: "Roadmap" },
    { href: "/dashboard/sop/1/sections/issues", label: "Issues" },
    { href: "/dashboard/sop/1/sections/decisions", label: "Decisions" },
    { href: "/dashboard/sop/1/sections/changelog", label: "Change Log" },
    { href: "/dashboard/sop/1/sections/updates", label: "Daily Updates" },
    { href: "/dashboard/sop/1/sections/tasks", label: "Tasks" },
    { href: "/dashboard/sop/1/sections/blockers", label: "Blockers" },
    { href: "/dashboard/sop/1/sections/onboarding", label: "Onboarding" },
    { href: "/dashboard/sop/1/sections/handover", label: "Handover" },
    { href: "/dashboard/sop/1/sections/health", label: "SOP Health" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/dashboard" className="sidebar-logo">
          <span className="sidebar-logo-icon">KP</span>
          <span className="sidebar-logo-text">KeyPillar Hub</span>
        </Link>
      </div>
      <nav className="sidebar-nav">
        <Link
          href="/dashboard"
          className={`sidebar-link ${isActive("/dashboard") && !pathname.includes("/sop") ? "active" : ""}`}
        >
          <span className="sidebar-icon">📊</span>
          <span>Dashboard</span>
        </Link>

        <Link
          href="/dashboard/projects"
          className={`sidebar-link ${isActive("/dashboard/projects") ? "active" : ""}`}
        >
          <span className="sidebar-icon">📁</span>
          <span>Projects</span>
        </Link>

        <Link
          href="/dashboard/updates"
          className={`sidebar-link ${isActive("/dashboard/updates") ? "active" : ""}`}
        >
          <span className="sidebar-icon">📝</span>
          <span>Daily Updates</span>
        </Link>

        <div className="sidebar-section">
          <button
            className="sidebar-section-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="sidebar-icon">📋</span>
            <span>SOP Workspaces</span>
            <span className={`sidebar-chevron ${expanded ? "open" : ""}`}>▼</span>
          </button>
          {expanded && (
            <div className="sidebar-submenu">
              {subLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`sidebar-sub-link ${isActive(link.href) ? "active" : ""}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/dashboard/reports"
          className={`sidebar-link ${isActive("/dashboard/reports") ? "active" : ""}`}
        >
          <span className="sidebar-icon">📈</span>
          <span>Reports</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className={`sidebar-link ${isActive("/dashboard/settings") ? "active" : ""}`}
        >
          <span className="sidebar-icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">M</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Mohi Uddin Ahmed</div>
            <div className="sidebar-user-role">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
