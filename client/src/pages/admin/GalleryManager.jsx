import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, ImagePlus, X, Loader2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resolveAssetUrl } from "../../services/api";
import {
  fetchGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
} from "../../services/admin/galleryService";

const GalleryManager = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const fileInputRef = useRef(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchGalleryImages();
      if (result.success) {
        setImages(result.images);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only images (jpeg, jpg, png, gif, webp, svg) are allowed.");
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setError("");
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !title.trim()) {
      setError("Please provide a title and select an image.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("category", category || "Uncategorized");

      const result = await uploadGalleryImage(formData);

      if (result.success) {
        setImages((prev) => [result.image, ...prev]);
        resetUploadForm();
        setShowUploadModal(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this image?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      const result = await deleteGalleryImage(imageId);

      if (result.success) {
        setImages((prev) => prev.filter((img) => img._id !== imageId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to delete image.");
    }
  };

  const resetUploadForm = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setCategory("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseModal = () => {
    resetUploadForm();
    setShowUploadModal(false);
    setError("");
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Gallery Manager
          </h1>
          <p className="text-ink-muted mt-1">
            Upload and manage gallery images.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-wine to-gold text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          <Upload size={18} />
          Upload Image
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-ink">
                Upload Image
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-blush transition"
              >
                <X size={20} className="text-ink-muted" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              {/* File Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gold-light rounded-xl p-8 text-center cursor-pointer hover:bg-blush transition"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={50}
                      className="text-wine mx-auto mb-3"
                    />
                    <p className="font-semibold text-ink">
                      Click to select an image
                    </p>
                    <p className="text-sm text-ink-muted mt-1">
                      JPEG, PNG, GIF, WebP, SVG (max 5MB)
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

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                  placeholder="Wedding Ceremony"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
                >
                  <option value="">Select category</option>
                  <option value="Weddings">Weddings</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Engagements">Engagements</option>
                  <option value="Anniversaries">Anniversaries</option>
                  <option value="Baby Showers">Baby Showers</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-3 rounded-xl border border-border text-ink hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !file || !title.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-wine text-white hover:bg-wine-dark disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload
                    </>
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
          Loading gallery images...
        </div>
      ) : images.length === 0 ? (
        /* Empty State */
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl border-2 border-dashed border-gold-light p-10 flex flex-col items-center justify-center"
        >
          <ImagePlus size={60} className="text-wine mb-4" />
          <h2 className="text-xl font-semibold">No Images Yet</h2>
          <p className="text-ink-muted mt-2">
            Click the Upload Image button to add your first image.
          </p>
        </motion.div>
      ) : (
        /* Images Grid */
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {images.map((img) => (
            <motion.div
              key={img._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden"
            >
              <img
                src={resolveAssetUrl(img.image)}
                alt={img.title}
                className="w-full h-56 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x350?text=Image+Not+Found";
                }}
              />

              <div className="p-5">
                <h3 className="font-semibold text-lg">{img.title}</h3>
                {img.category && (
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-blush text-wine-dark">
                    {img.category}
                  </span>
                )}

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/admin/gallery/edit/${img._id}`)}
                    className="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                    title="Edit image"
                  >
                    <Pencil size={18} className="text-blue-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="p-3 rounded-lg bg-red-100 hover:bg-red-200 transition"
                    title="Delete image"
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

export default GalleryManager;
