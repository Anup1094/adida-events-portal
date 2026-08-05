import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Trash2,
  Phone,
  Mail,
  X,
} from "lucide-react";
import {
  fetchEnquiries,
  deleteEnquiry,
  updateEnquiryStatus,
} from "../../services/admin/enquiryService";

const STATUS_STYLES = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
};

const Enquiries = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchEnquiries();
      if (result.success) {
        setEnquiries(result.enquiries);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filtered = enquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || (item.status || "New") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (enquiryId, status) => {
    try {
      setUpdatingId(enquiryId);
      const result = await updateEnquiryStatus(enquiryId, status);
      if (result.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === enquiryId ? { ...e, status } : e))
        );
        setSelectedEnquiry((prev) =>
          prev?._id === enquiryId ? { ...prev, status } : prev
        );
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (enquiryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );
    if (!confirmDelete) return;

    try {
      setError("");
      const result = await deleteEnquiry(enquiryId);
      if (result.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== enquiryId));
        if (selectedEnquiry?._id === enquiryId) {
          setSelectedEnquiry(null);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to delete enquiry.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Enquiries
          </h1>
          <p className="text-ink-muted mt-1">
            Manage all customer enquiries.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:border-wine"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex items-center justify-center gap-2 border border-border rounded-xl px-5 py-3 bg-white outline-none focus:border-wine cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center text-ink-muted">
          Loading enquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gold-light p-10 flex flex-col items-center justify-center">
          <Mail size={60} className="text-wine mb-4" />
          <h2 className="text-xl font-semibold">No Enquiries Yet</h2>
          <p className="text-ink-muted mt-2">
            Customer enquiries will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ivory">
                  <tr>
                    <th className="text-left px-6 py-4">Client</th>
                    <th className="text-left px-6 py-4">Date</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-center px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t hover:bg-ivory transition"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-ink-muted">{item.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-ink-muted">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={item.status || "New"}
                          disabled={updatingId === item._id}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value)
                          }
                          className={`rounded-full px-3 py-1.5 text-xs font-heading font-semibold outline-none cursor-pointer disabled:opacity-50 ${
                            STATUS_STYLES[item.status || "New"]
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => setSelectedEnquiry(item)}
                            className="p-2 rounded-lg bg-blush hover:bg-blush"
                            title="View message"
                          >
                            <Eye size={18} className="text-wine-dark" />
                          </button>
                          {item.phone && (
                            <a
                              href={`tel:${item.phone}`}
                              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 inline-block"
                              title="Call"
                            >
                              <Phone size={18} className="text-green-700" />
                            </a>
                          )}
                          <a
                            href={`mailto:${item.email}`}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 inline-block"
                            title="Send email"
                          >
                            <Mail size={18} className="text-blue-700" />
                          </a>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                            title="Delete enquiry"
                          >
                            <Trash2 size={18} className="text-red-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* View Message Modal */}
          {selectedEnquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-ink">
                    Enquiry Details
                  </h2>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="p-2 rounded-lg hover:bg-blush transition"
                  >
                    <X size={20} className="text-ink-muted" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-ink-muted">
                      Name
                    </label>
                    <p className="text-ink font-medium">
                      {selectedEnquiry.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink-muted">
                      Email
                    </label>
                    <p className="text-ink font-medium">
                      {selectedEnquiry.email}
                    </p>
                  </div>

                  {selectedEnquiry.phone && (
                    <div>
                      <label className="text-sm font-semibold text-ink-muted">
                        Phone
                      </label>
                      <p className="text-ink font-medium">
                        {selectedEnquiry.phone}
                      </p>
                    </div>
                  )}

                  {selectedEnquiry.location && (
                    <div>
                      <label className="text-sm font-semibold text-ink-muted">
                        Location
                      </label>
                      <p className="text-ink font-medium">
                        {selectedEnquiry.location}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-ink-muted">
                      Status
                    </label>
                    <select
                      value={selectedEnquiry.status || "New"}
                      disabled={updatingId === selectedEnquiry._id}
                      onChange={(e) =>
                        handleStatusChange(selectedEnquiry._id, e.target.value)
                      }
                      className={`mt-1 block rounded-full px-3 py-1.5 text-xs font-heading font-semibold outline-none cursor-pointer disabled:opacity-50 ${
                        STATUS_STYLES[selectedEnquiry.status || "New"]
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink-muted">
                      Date
                    </label>
                    <p className="text-ink font-medium">
                      {formatDate(selectedEnquiry.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink-muted">
                      Message
                    </label>
                    <p className="text-ink mt-1 bg-ivory rounded-xl p-4 leading-relaxed">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-2">
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <Mail size={18} />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => {
                      handleDelete(selectedEnquiry._id);
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Enquiries;

