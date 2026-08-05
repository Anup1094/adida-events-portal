import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { getPublicEvents, resolveImageUrl } from "../../services/public/eventService";

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const EventsPreview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    getPublicEvents()
      .then((data) => {
        if (mounted) setEvents(data.slice(0, 6));
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="events" className="bg-ivory py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-heading uppercase tracking-[0.3em] text-wine font-semibold text-sm">
            Upcoming Events
          </p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-ink">
            What&apos;s Happening Next
          </h2>
          <p className="mt-3 text-ink-muted max-w-2xl mx-auto font-sans">
            A glimpse of the celebrations currently on our calendar.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 border-4 border-wine border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-ink-muted font-sans">
            We couldn&apos;t load events right now. Please check back shortly.
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-center text-ink-muted font-sans">
            No events scheduled at the moment — check back soon.
          </p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(122,31,75,0.12)]"
              >
                <div className="relative h-44 overflow-hidden bg-blush">
                  {event.image ? (
                    <img
                      src={resolveImageUrl(event.image)}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="diamond scale-150" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-heading font-semibold text-wine backdrop-blur">
                    {event.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-ink mb-2">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-ink-muted mb-1.5 font-sans">
                    <CalendarDays size={15} className="text-gold shrink-0" />
                    {formatDate(event.eventDate)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-ink-muted mb-4 font-sans">
                    <MapPin size={15} className="text-gold shrink-0" />
                    {event.location}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-wine">
                      {formatPrice(event.price)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-heading font-medium ${
                        event.status === "Available"
                          ? "bg-blush text-wine"
                          : "bg-ink/5 text-ink-muted"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPreview;
