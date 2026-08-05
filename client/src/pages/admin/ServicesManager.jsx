import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { resolveAssetUrl } from "../../services/api";
import { Plus, Pencil, Trash2, Briefcase, X, Loader2, Upload } from "lucide-react";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../services/admin/serviceService";

const initialFormState = {
  title: "",
  description: "",
  category: "",
};

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchServices();
      if (result.success) {
        setServices(result.services || []);
      } else {
        setError(result.message || "Failed to load services.");
      }
    } catch (err) {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Revoke object URLs on unmount / when preview changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only images (jpeg, jpg, png, gif, webp, svg) are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setError("");
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setFile(null);
    setPreview(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title || "",
      description: service.description || "",
      category: service.category || "",
    });
    setFile(null);
    setPreview(service.image ? resolveAssetUrl(service.image) : null);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formPayload = new FormData();
      formPayload.append("title", formData.title.trim());
      formPayload.append("description", formData.description.trim());
      formPayload.append("category", formData.category.trim() || "General");
      if (file) {
        formPayload.append("image", file);
      }

      let result;
      if (editingId) {
        result = await updateService(editingId, formPayload);
      } else {
        result = await createService(formPayload);
      }

      if (result.success) {
        await loadServices();
        resetForm();
        setShowForm(false);
      } else {
        setError(result.message || "Failed to save service.");
      }
    } catch (err) {
      setError("Failed to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (deletingId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(serviceId);
      setError("");
      const result = await deleteService(serviceId);
      if (result.success) {
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
      } else {
        setError(result.message || "Failed to delete service.");
      }
    } catch (err) {
      setError("Failed to delete service.");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setFile(null);
    setPreview(null);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
    setError("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
        <div>
          <h1 className="text-3xl font-bold text-ink">Services</h1>
          <p className="text-ink-muted mt-1">
            Manage all services offered by Adida Events.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-gradient-to-r from-wine to-gold text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-ink">
                {editingId ? "Edit Service" : "Add Service"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 rounded-lg hover:bg-blush transition"
              >
                <X size={20} className="text-ink-muted" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gold-light rounded-xl p-6 text-center cursor-pointer hover:bg-blush transition"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <Upload size={40} className="text-wine mx-auto mb-2" />
                      <p className="font-semibold text-ink text-sm">
                        Click to upload image
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                  placeholder="Event Planning"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                  placeholder="Event Category"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                  placeholder="Describe the service..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl border border-border text-ink hover:bg-ivory disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-wine text-white hover:bg-wine-dark disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update Service"
                  ) : (
                    "Save Service"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center text-ink-muted">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gold-light p-10 flex flex-col items-center justify-center">
          <Briefcase size={60} className="text-wine mb-4" />
          <h2 className="text-xl font-semibold">No Services Yet</h2>
          <p className="text-ink-muted mt-2">
            Click the Add Service button to create your first service.
          </p>
        </div>
      ) : (
        /* Cards */
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service._id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              {service.image && (
                <img
                  src={resolveAssetUrl(service.image)}
                  alt={service.title}
                  className="w-full h-44 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-wine to-gold flex items-center justify-center">
                    <Briefcase className="text-white" size={26} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(service)}
                      disabled={deletingId === service._id}
                      className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 disabled:opacity-50"
                      title="Edit service"
                    >
                      <Pencil size={18} className="text-yellow-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      disabled={deletingId === service._id}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200 disabled:opacity-50"
                      title="Delete service"
                    >
                      {deletingId === service._id ? (
                        <Loader2 size={18} className="text-red-700 animate-spin" />
                      ) : (
                        <Trash2 size={18} className="text-red-700" />
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-4">
                  {service.title}
                </h2>

                {service.category && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blush text-wine-dark">
                    {service.category}
                  </span>
                )}

                <p className="text-ink-muted mt-3 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesManager;