import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-blush">
      {/* ================= Mobile Sidebar ================= */}

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 z-50 h-screen"
            >
              <Sidebar
                closeSidebar={() => setSidebarOpen(false)}
                collapsed={false}
                setCollapsed={setCollapsed}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= Desktop Layout ================= */}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar — width is controlled entirely inside Sidebar.jsx now */}

        <aside className="hidden lg:block">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>

        {/* ================= Right Section ================= */}

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}

          <header className="sticky top-0 z-30 border-b border-border bg-white">
            <Header
              setSidebarOpen={setSidebarOpen}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
          </header>

          {/* Main */}

          <main className="flex-1 overflow-y-auto bg-blush p-5 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;