import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Mail, Phone, Users, X } from "lucide-react";
import { fetchCustomers, deleteCustomer } from "../../services/admin/userService";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchCustomers();
      if (result.success) {
        setCustomers(result.customers);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer account? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError("");
      const result = await deleteCustomer(id);
      if (result.success) {
        setCustomers((prev) => prev.filter((c) => c._id !== id));
        if (selected?._id === id) setSelected(null);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to delete customer.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Customers</h1>
        <p className="text-ink-muted mt-1">
          Everyone who has created an account on the public site.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-border rounded-xl pl-11 pr-4 py-3 outline-none focus:border-wine"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center text-ink-muted">
          Loading customers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gold-light p-10 flex flex-col items-center justify-center">
          <Users size={60} className="text-wine mb-4" />
          <h2 className="text-xl font-semibold">No Customers Yet</h2>
          <p className="text-ink-muted mt-2">
            Accounts created via the public Sign Up page will appear here.
          </p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ivory">
                  <tr>
                    <th className="text-left px-6 py-4">Customer</th>
                    <th className="text-left px-6 py-4">Phone</th>
                    <th className="text-left px-6 py-4">Joined</th>
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
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush font-heading font-semibold text-wine">
                            {item.name?.charAt(0)?.toUpperCase() || "C"}
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-ink-muted">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-ink-muted">
                        {item.phone || "—"}
                      </td>
                      <td className="px-6 py-5 text-ink-muted">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => setSelected(item)}
                            className="p-2 rounded-lg bg-blush hover:opacity-80"
                            title="View details"
                          >
                            <Users size={18} className="text-wine-dark" />
                          </button>
                          <a
                            href={`mailto:${item.email}`}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 inline-block"
                            title="Send email"
                          >
                            <Mail size={18} className="text-blue-700" />
                          </a>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 disabled:opacity-50"
                            title="Delete customer"
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

          {selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-ink">Customer Details</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg hover:bg-blush transition"
                  >
                    <X size={20} className="text-ink-muted" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-ink-muted">Name</label>
                    <p className="text-ink font-medium">{selected.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink-muted">Email</label>
                    <p className="text-ink font-medium">{selected.email}</p>
                  </div>
                  {selected.phone && (
                    <div>
                      <label className="text-sm font-semibold text-ink-muted">Phone</label>
                      <p className="text-ink font-medium">{selected.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-ink-muted">Joined</label>
                    <p className="text-ink font-medium">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-2">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <Mail size={18} />
                    Email
                  </a>
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      <Phone size={18} />
                      Call
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customers;
