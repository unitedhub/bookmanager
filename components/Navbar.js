"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// SVG Icons
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function UserIcon({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold shadow-md">
      {initials}
    </div>
  );
}

export default function Sidebar({ user, activeView, setActiveView }) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navItems = [
    {
      id: "sidebar-dashboard",
      view: "dashboard",
      icon: <GridIcon />,
      label: "Dashboard",
    },
    {
      id: "sidebar-books",
      view: "books",
      icon: <BookIcon />,
      label: "My Library",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-white shadow-sidebar flex flex-col items-center py-6 gap-6 z-20">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md mb-2">
        <span className="text-lg">📚</span>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-100" />

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-3 flex-1">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <div key={item.id} className="relative group">
              <button
                id={item.id}
                onClick={() => setActiveView(item.view)}
                title={item.label}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/30 sidebar-icon-active"
                    : "text-text-muted hover:bg-primary-light hover:text-primary"
                }`}
              >
                {item.icon}
              </button>
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-text-main text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Bottom: avatar + logout */}
      <div className="flex flex-col items-center gap-3">
        {/* Logout */}
        <div className="relative group">
          <button
            id="sidebar-logout"
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl text-text-muted flex items-center justify-center hover:bg-danger-light hover:text-danger transition"
            title="Log out"
          >
            <LogOutIcon />
          </button>
          <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-text-main text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Log out
          </span>
        </div>

        {/* Profile avatar */}
        <div ref={profileRef} className="relative">
          <button
            id="sidebar-profile"
            onClick={() => setShowProfile((v) => !v)}
            title="Profile"
            className="focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-full transition hover:scale-110 active:scale-95"
          >
            <UserIcon name={user?.name} />
          </button>

          {/* Profile dropdown */}
          {showProfile && (
            <div className="absolute bottom-12 left-full ml-3 w-56 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden animate-fade-in z-50">
              {/* Header */}
              <div className="px-4 py-4 bg-primary-light flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">
                  {user?.name
                    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-main truncate">{user?.name}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Actions */}
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger-light transition font-medium"
                >
                  <LogOutIcon />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
