import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

import { getEvents, deleteEvent } from "../../services/admin/eventService";
import { resolveAssetUrl } from "../../services/api";

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const data = await getEvents();

      setEvents(data.events || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const keyword = search.toLowerCase();

      return (
        event.title?.toLowerCase().includes(keyword) ||
        event.category?.toLowerCase().includes(keyword) ||
        event.location?.toLowerCase().includes(keyword)
      );
    });
  }, [events, search]);

  const handleDelete = async () => {
    if (deleting) return;

    try {
      setDeleting(true);

      await deleteEvent(deleteId);

      setEvents((prev) =>
        prev.filter((item) => item._id !== deleteId)
      );

      setDeleteId(null);

      alert("Event deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to delete event.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-ink">
            Events Management
          </h1>

          <p className="mt-1 text-ink-muted">
            Manage all your events from one place.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/events/add")}
          className="flex items-center gap-2 rounded-lg bg-wine px-5 py-3 font-medium text-white transition hover:bg-wine-dark"
        >
          <Plus size={18} />
          Add Event
        </button>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
        />

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-white py-3 pl-11 pr-4 outline-none transition focus:border-wine"
        />

      </div>

      {/* Loading */}

      {loading ? (

        <div className="rounded-xl bg-white p-10 text-center shadow">

          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-wine border-t-transparent"></div>

          <p className="text-ink-muted">
            Loading events...
          </p>

        </div>

      ) : filteredEvents.length === 0 ? (

        <div className="rounded-xl bg-white py-20 text-center shadow">

          <CalendarDays
            size={60}
            className="mx-auto text-border"
          />

          <h2 className="mt-4 text-2xl font-semibold text-ink">
            {events.length === 0 ? "No Events Found" : "No Matching Events"}
          </h2>

          <p className="mt-2 text-ink-muted">
            {events.length === 0
              ? "Create your first event to get started."
              : "Try a different search term."}
          </p>

          {events.length === 0 && (
            <button
              onClick={() => navigate("/admin/events/add")}
              className="mt-6 rounded-lg bg-wine px-6 py-3 text-white transition hover:bg-wine-dark"
            >
              Add Event
            </button>
          )}

        </div>

      ) : (

        <div className="overflow-hidden rounded-xl bg-white shadow">

          <div className="overflow-x-auto">

            <table className="min-w-full">
              <thead className="bg-blush">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Image
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Title
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-ink">
                    Featured
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-ink">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredEvents.map((event) => (

                  <tr
                    key={event._id}
                    className="border-t hover:bg-ivory transition"
                  >

                    <td className="px-6 py-4">

                      <img
                        src={
                          event.image
                            ? resolveAssetUrl(event.image)
                            : "https://placehold.co/80x60?text=No+Image"
                        }
                        alt={event.title}
                        className="h-16 w-24 rounded-lg object-cover border"
                      />

                    </td>

                    <td className="px-6 py-4 font-medium text-ink">
                      {event.title}
                    </td>

                    <td className="px-6 py-4">
                      {event.category}
                    </td>

                    <td className="px-6 py-4">
                      {event.location}
                    </td>

                    <td className="px-6 py-4">
                      {formatDate(event.eventDate)}
                    </td>

                    <td className="px-6 py-4 font-semibold text-wine">
                      ₹{event.price}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold text-white
                          ${
                            event.status === "Available"
                              ? "bg-green-500"
                              : event.status === "Booked"
                              ? "bg-yellow-500"
                              : "bg-ink-muted"
                          }`}
                      >
                        {event.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-center">

                      {event.isFeatured ? (

                        <span className="rounded-full bg-blush px-3 py-1 text-xs font-semibold text-wine-dark">
                          Yes
                        </span>

                      ) : (

                        <span className="rounded-full bg-blush px-3 py-1 text-xs text-ink-muted">
                          No
                        </span>

                      )}

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() =>
                            navigate(`/admin/events/edit/${event._id}`)
                          }
                          className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteId(event._id)}
                          className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* Delete Confirmation Modal */}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

            <h2 className="text-2xl font-bold text-ink">
              Delete Event
            </h2>

            <p className="mt-3 text-ink-muted">
              Are you sure you want to delete this event?
            </p>

            <p className="mt-1 text-sm text-red-500">
              This action cannot be undone.
            </p>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="rounded-lg border border-border px-5 py-2 text-ink transition hover:bg-blush disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Events;