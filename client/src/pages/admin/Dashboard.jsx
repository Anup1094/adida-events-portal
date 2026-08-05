import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MessageSquare,
  Briefcase,
  Image,
  Users,
  Plus,
} from "lucide-react";

import StatCard from "../../components/admin/StatCard";
import { getEvents } from "../../services/admin/eventService";
import { fetchGalleryImages } from "../../services/admin/galleryService";
import { fetchServices } from "../../services/admin/serviceService";
import { fetchEnquiries } from "../../services/admin/enquiryService";
import { fetchCustomers } from "../../services/admin/userService";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    services: 0,
    enquiries: 0,
    customers: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [eventsRes, galleryRes, servicesRes, enquiriesRes, customersRes] =
          await Promise.all([
            getEvents(),
            fetchGalleryImages(),
            fetchServices(),
            fetchEnquiries(),
            fetchCustomers(),
          ]);

        setStats({
          events: eventsRes.events?.length || 0,
          gallery: galleryRes.success ? galleryRes.images?.length || 0 : 0,
          services: servicesRes.success ? servicesRes.services?.length || 0 : 0,
          enquiries: enquiriesRes.success
            ? enquiriesRes.enquiries?.length || 0
            : 0,
          customers: customersRes.success
            ? customersRes.customers?.length || 0
            : 0,
        });

        if (enquiriesRes.success) {
          setRecentEnquiries(
            (enquiriesRes.enquiries || []).slice(0, 5)
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink-muted mt-1">
          Welcome back. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Events"
          value={loading ? "..." : String(stats.events)}
          subtitle="Managed events"
          icon={CalendarDays}
        />

        <StatCard
          title="Gallery Images"
          value={loading ? "..." : String(stats.gallery)}
          subtitle="Uploaded images"
          icon={Image}
          color="from-gold to-rose-500"
        />

        <StatCard
          title="Services"
          value={loading ? "..." : String(stats.services)}
          subtitle="Active services"
          icon={Briefcase}
          color="from-blue-500 to-cyan-500"
        />

        <StatCard
          title="Enquiries"
          value={loading ? "..." : String(stats.enquiries)}
          subtitle="Customer messages"
          icon={MessageSquare}
          color="from-green-500 to-emerald-500"
        />

        <StatCard
          title="Customers"
          value={loading ? "..." : String(stats.customers)}
          subtitle="Registered accounts"
          icon={Users}
          color="from-wine to-gold"
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl border border-border p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-5">Quick Actions</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/events/add")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-wine to-gold text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            <Plus size={18} />
            Add Event
          </button>

          <button
            onClick={() => navigate("/admin/gallery/add")}
            className="flex items-center justify-center gap-2 border border-border py-3 rounded-xl hover:bg-blush transition"
          >
            <Plus size={18} />
            Upload Gallery
          </button>

          <button
            onClick={() => navigate("/admin/services")}
            className="flex items-center justify-center gap-2 border border-border py-3 rounded-xl hover:bg-blush transition"
          >
            <Plus size={18} />
            Add Service
          </button>

          <button
            onClick={() => navigate("/admin/testimonials")}
            className="flex items-center justify-center gap-2 border border-border py-3 rounded-xl hover:bg-blush transition"
          >
            <Plus size={18} />
            Add Testimonial
          </button>
        </div>
      </motion.div>

      {/* Recent Enquiries */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Enquiries</h2>
          <button
            onClick={() => navigate("/admin/enquiries")}
            className="text-sm font-medium text-wine hover:text-wine-dark"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-10 text-center text-ink-muted">
              Loading enquiries...
            </div>
          ) : recentEnquiries.length === 0 ? (
            <div className="px-6 py-10 text-center text-ink-muted">
              No enquiries yet.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-ivory">
                <tr>
                  <th className="text-left px-6 py-4">Client</th>
                  <th className="text-left px-6 py-4">Email</th>
                  <th className="text-left px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentEnquiries.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-ivory transition cursor-pointer"
                    onClick={() => navigate("/admin/enquiries")}
                  >
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
