import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save } from "lucide-react";

import {
  createEvent,
  getEvent,
  updateEvent,
} from "../../services/admin/eventService";
import { resolveAssetUrl } from "../../services/api";

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Wedding",
    description: "",
    location: "",
    eventDate: "",
    price: "",
    status: "Available",
    isFeatured: false,
    image: null,
  });

  const categories = [
    "Wedding",
    "Birthday",
    "Corporate",
    "Engagement",
    "Anniversary",
    "Baby Shower",
    "Other",
  ];

  const statusList = [
    "Available",
    "Booked",
    "Completed",
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

  // ================= FETCH EVENT =================

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const { event } = await getEvent(id);

      setFormData({
        title: event.title,
        category: event.category,
        description: event.description,
        location: event.location,
        eventDate: event.eventDate
          ? event.eventDate.substring(0, 10)
          : "",
        price: event.price,
        status: event.status,
        isFeatured: event.isFeatured,
        image: null,
      });

      if (event.image) {
        setPreview(resolveAssetUrl(event.image));
      }

    } catch (error) {
      console.error(error);
      alert("Unable to load event.");
      navigate("/admin/events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
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
      !formData.description ||
      !formData.location ||
      !formData.eventDate ||
      !formData.price
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("eventDate", formData.eventDate);
      data.append("price", formData.price);
      data.append("status", formData.status);
      data.append("isFeatured", formData.isFeatured);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (isEdit) {
        await updateEvent(id, data);
      } else {
        await createEvent(data);
      }

      alert(
        isEdit
          ? "Event updated successfully."
          : "Event created successfully."
      );

      navigate("/admin/events");

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
          onClick={() => navigate("/admin/events")}
          className="mb-5 flex items-center gap-2 text-ink-muted transition hover:text-wine"
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>

        <h1 className="text-3xl font-bold text-ink">

          {isEdit ? "Edit Event" : "Add New Event"}

        </h1>

        <p className="mt-2 text-ink-muted">

          {isEdit
            ? "Update your event details."
            : "Fill in the details below to create a new event."}

        </p>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-8 shadow"
      >

        <div className="grid gap-6 md:grid-cols-2">

          {/* Event Title */}

          <div>

            <label className="mb-2 block font-medium text-ink">
              Event Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
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
              placeholder="Write event description..."
              required
              className="w-full resize-none rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            />

          </div>

          {/* Location */}

          <div>

            <label className="mb-2 block font-medium text-ink">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Lucknow, Uttar Pradesh"
              required
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            />

          </div>
                    {/* Event Date */}

          <div>

            <label className="mb-2 block font-medium text-ink">
              Event Date
            </label>

            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            />

          </div>

          {/* Price */}

          <div>

            <label className="mb-2 block font-medium text-ink">
              Price (₹)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              placeholder="5000"
              required
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            />

          </div>

          {/* Status */}

          <div>

            <label className="mb-2 block font-medium text-ink">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-wine"
            >

              {statusList.map((status) => (

                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>

              ))}

            </select>

          </div>

          {/* Featured */}

          <div className="flex items-center gap-3 pt-8">

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
              Featured Event
            </label>

          </div>

          {/* Image Upload */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium text-ink">
              Event Image
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
                onClick={() => navigate("/admin/events")}
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
                    : "Creating..."
                  : isEdit
                  ? "Update Event"
                  : "Create Event"}

              </button>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
};

export default EventForm;