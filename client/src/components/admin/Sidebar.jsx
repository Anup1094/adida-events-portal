import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Briefcase,
  MessageSquare,
  Settings,
  Star,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  { name: "Events", path: "/admin/events", icon: CalendarDays },
  { name: "Gallery", path: "/admin/gallery", icon: Image },
  { name: "Services", path: "/admin/services", icon: Briefcase },
  { name: "Testimonials", path: "/admin/testimonials", icon: Star },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const Sidebar = ({ collapsed, setCollapsed, closeSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
    if (closeSidebar) closeSidebar();
  };

  return (
    <aside
      className={`h-screen flex flex-col border-r border-ink bg-ink text-white sticky top-0 transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-ink px-2">
        {collapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-wine to-gold text-lg font-bold">
            A
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-wine-light to-gold bg-clip-text text-transparent">
              Adida Events
            </h1>
            <p className="text-xs text-ink-muted mt-1">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden justify-end p-2 lg:flex">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-lg p-1.5 text-ink-muted hover:bg-ink hover:text-white transition"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => closeSidebar && closeSidebar()}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 6 }}
                  whileTap={{ scale: 0.98 }}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-wine to-gold text-white shadow-lg"
                      : "text-border hover:bg-ink hover:text-white"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && (
                    <span className="font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto h-2.5 w-2.5 rounded-full bg-white"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-ink p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500 py-3 font-semibold text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </motion.button>

        {!collapsed && (
          <div className="mt-5 text-center">
            <p className="text-xs text-ink-muted">Adida Events</p>
            <p className="mt-1 text-[11px] text-ink-muted">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;