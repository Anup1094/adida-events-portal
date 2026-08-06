import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
const Header = ({
  setSidebarOpen,
  collapsed,
  setCollapsed,
}) => {
  const navigate = useNavigate();
const location = useLocation();

const [showProfileMenu, setShowProfileMenu] = useState(false);

const admin =
  JSON.parse(localStorage.getItem("user")) || {
    name: "Administrator",
    email: "admin@adidaevents.com",
  };

const handleLogout = () => {
  localStorage.clear();
  navigate("/admin/login", { replace: true });
};

return (
  <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">

    <div className="flex h-16 items-center justify-between px-5 lg:px-8">

      {/* Left */}

      <div className="flex items-center gap-3">

        {/* Mobile Menu */}

        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 hover:bg-blush lg:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Desktop Collapse */}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-lg p-2 hover:bg-blush lg:flex"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

        {/* Back */}

        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 hover:bg-blush"
        >
          <ArrowLeft size={20} />
        </button>

        <div>

          <h1 className="text-xl font-bold text-ink">
            {location.pathname === "/admin"
              ? "Dashboard"
              : location.pathname
                  .split("/")
                  .pop()
                  ?.replace("-", " ")
                  .replace(/^./, c => c.toUpperCase())}
          </h1>

          <p className="text-sm text-ink-muted">
            Welcome back, {admin.name}
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        {/* Profile */}

        <div className="relative">

          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2 transition hover:border-wine hover:bg-ivory"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-wine to-gold text-sm font-bold text-white">
              {admin.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden text-left md:block">

              <p className="text-sm font-semibold text-ink">
                {admin.name}
              </p>

              <p className="text-xs text-ink-muted">
                Administrator
              </p>

            </div>

            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />

          </button>

          <AnimatePresence>

            {showProfileMenu && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
              >

                <div className="border-b border-border px-5 py-4">

                  <p className="text-base font-semibold text-ink">
                    {admin.name}
                  </p>

                  <p className="mt-1 text-sm text-ink-muted">
                    {admin.email}
                  </p>

                </div>

                <div className="p-2">

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-ink transition hover:bg-blush"
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/admin/settings");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-ink transition hover:bg-blush"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>

                  <hr className="my-2 border-border" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </div>

  </header>
);

};

export default Header;