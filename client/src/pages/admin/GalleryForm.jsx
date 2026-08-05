import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resolveAssetUrl } from "../../services/api";

import {
  ArrowLeft,
  Upload,
  Save,
} from "lucide-react";

import {
  createGalleryImage,
  getGalleryImage,
  updateGalleryImage,
} from "../../services/admin/galleryService";

const GalleryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Wedding",
    description: "",
    image: null,
    isFeatured: false,
  });

  const categories = [
    "Wedding",
    "Birthday",
    "Corporate",
    "Engagement",
    "Anniversary",
    "Baby Shower",
    "Decoration",
    "Photography",
    "Other",
  ];
    // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= HANDLE IMAGE =================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // ================= FETCH IMAGE =================

  const fetchGalleryImage = async () => {
    try {
      setLoading(true);

      const { image } = await getGalleryImage(id);

      setFormData({
        title: image.title,
        category: image.category,
        description: image.description,
        image: null,
        isFeatured: image.isFeatured || false,
      });

      if (image.image) {
        setPreview(resolveAssetUrl(image.image));
      }

    } catch (error) {
      console.error(error);

      alert("Unable to load gallery image.");

      navigate("/admin/gallery");

    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    if (isEdit) {
      fetchGalleryImage();
    }

    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);
    // ================= SUBMIT FORM =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.description
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!isEdit && !formData.image) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("isFeatured", formData.isFeatured);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (isEdit) {
        await updateGalleryImage(id, data);
      } else {
        await createGalleryImage(data);
      }

      alert(
        isEdit
          ? "Gallery image updated successfully."
          : "Gallery image added successfully."
      );

      navigate("/admin/gallery");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}

      <div className="mb-8">

        <button
          type="button"
          onClick={() => navigate("/admin/gallery")}
          className="mb-5 flex items-center gap-2 text-ink-muted transition hover:text-wine"
        >
          <ArrowLeft size={18} />
          Back to Gallery
        </button>

        <h1 className="text-3xl font-bold text-ink">
          {isEdit ? "Edit Gallery Image" : "Add Gallery Image"}
        </h1>

        <p className="mt-2 text-ink-muted">
          {isEdit
            ? "Update gallery image details."
            : "Upload a new image to your gallery."}
        </p>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-8 shadow"
      >

        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}

          <div>

            <label className="mb-2 block font-medium text-ink">
              Image Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter image title"
              required
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            />

          </div>

          {/* Category */}

          <div>

            <label className="mb-2 block font-medium text-ink">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            >

              {categories.map((category) => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              ))}

            </select>

          </div>

          {/* Description */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium text-ink">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description..."
              required
              className="w-full resize-none rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            />

          </div>

          {/* Featured */}

          <div className="flex items-center gap-3">

            <input
              id="featured"
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-5 w-5 accent-wine"
            />

            <label
              htmlFor="featured"
              className="font-medium text-ink"
            >
              Featured Image
            </label>

          </div>

          {/* Image Upload */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium text-ink">
              Gallery Image
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-ivory px-6 py-10 transition hover:border-wine hover:bg-blush">

              <Upload
                size={40}
                className="mb-3 text-wine"
              />

              <p className="font-medium text-ink">
                Click to Upload Image
              </p>

              <span className="mt-1 text-sm text-ink-muted">
                JPG, PNG, WEBP (Max 5 MB)
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </label>

          </div>

          {/* Image Preview */}

          {preview && (

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium text-ink">
                Preview
              </label>

              <img
                src={preview}
                alt="Preview"
                className="h-72 w-full rounded-xl border object-cover"
              />

            </div>

          )}
                    {/* Action Buttons */}

          <div className="md:col-span-2 mt-4">

            <div className="flex items-center justify-end gap-4 border-t border-border pt-6">

              <button
                type="button"
                onClick={() => navigate("/admin/gallery")}
                disabled={loading}
                className="rounded-lg border border-border px-6 py-3 font-medium text-ink transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-wine px-8 py-3 font-medium text-white transition hover:bg-wine-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Uploading..."
                  : isEdit
                  ? "Update Image"
                  : "Upload Image"}

              </button>

            </div>

          </div>
                  </div>

      </form>

    </div>
  );
};

export default GalleryForm;
        