import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { resolveAssetUrl } from "../../services/api";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Loader2,
  Upload,
} from "lucide-react";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/admin/testimonialService";

const initialFormState = {
  name: "",
  event: "",
  rating: 5,
  review: "",
  status: "Published",
};

const Testimonials = () => {
  const [search, setSearch] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const fileInputRef = useRef(null);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchTestimonials();
      if (result.success) {
        setTestimonials(result.testimonials);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.event && item.event.toLowerCase().includes(search.toLowerCase()))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
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

  const openEditForm = (testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      name: testimonial.name,
      event: testimonial.event || "",
      rating: testimonial.rating,
      review: testimonial.review,
      status: testimonial.status,
    });
    setFile(null);
    setPreview(testimonial.image ? resolveAssetUrl(testimonial.image) : null);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.review.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("event", formData.event);
      formPayload.append("rating", formData.rating);
      formPayload.append("review", formData.review);
      formPayload.append("status", formData.status);
      if (file) {
        formPayload.append("image", file);
      }

      let result;
      if (editingId) {
        result = await updateTestimonial(editingId, formPayload);
      } else {
        result = await createTestimonial(formPayload);
      }

      if (result.success) {
        await loadTestimonials();
        resetForm();
        setShowForm(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to save testimonial.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (testimonialId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );
    if (!confirmDelete) return;

    try {
      setError("");
      const result = await deleteTestimonial(testimonialId);
      if (result.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== testimonialId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to delete testimonial.");
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
          <h1 className="text-3xl font-bold text-ink">Testimonials</h1>
          <p className="text-ink-muted mt-1">
            Manage customer reviews displayed on the website.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-gradient-to-r from-wine to-gold text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border pl-11 pr-4 py-3 outline-none focus:border-wine"
          />
        </div>
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
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
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
                  Photo (optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gold-light rounded-xl p-6 text-center cursor-pointer hover:bg-blush transition"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded-full object-cover w-32 h-32"
                    />
                  ) : (
                    <>
                      <Upload size={36} className="text-wine mx-auto mb-2" />
                      <p className="font-semibold text-ink text-sm">
                        Click to upload photo
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

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                  placeholder="Rahul Sharma"
                />
              </div>

              {/* Event */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Event Type
                </label>
                <input
                  type="text"
                  name="event"
                  value={formData.event}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                  placeholder="Wedding, Corporate, etc."
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition"
                    >
                      <Star
                        size={28}
                        fill={
                          star <= (hoverRating || formData.rating)
                            ? "#FACC15"
                            : "none"
                        }
                        className={
                          star <= (hoverRating || formData.rating)
                            ? "text-yellow-400"
                            : "text-border"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                  placeholder="Write the testimonial..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-3 rounded-xl border border-border text-ink hover:bg-ivory"
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
                    "Update Testimonial"
                  ) : (
                    "Save Testimonial"
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
          Loading testimonials...
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gold-light p-10 flex flex-col items-center justify-center">
          <Star size={60} className="text-wine mb-4" />
          <h2 className="text-xl font-semibold">No Testimonials Yet</h2>
          <p className="text-ink-muted mt-2">
            Click the Add Testimonial button to add your first review.
          </p>
        </div>
      ) : (
        /* Cards */
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-border shadow-sm p-6"
            >
              <div className="flex items-center gap-4">
                {item.image ? (
                  <img
                    src={resolveAssetUrl(item.image)}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : null}
                <div className={item.image ? "" : ""}>
                  {!item.image && (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-wine to-gold flex items-center justify-center text-white text-xl font-bold mb-2">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {item.event && (
                    <p className="text-ink-muted text-sm">{item.event}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-1 mt-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="#FACC15"
                    className="text-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-4 text-ink-muted leading-relaxed">
                {item.review}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200"
                    title="Edit testimonial"
                  >
                    <Pencil size={18} className="text-yellow-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                    title="Delete testimonial"
                  >
                    <Trash2 size={18} className="text-red-700" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;

