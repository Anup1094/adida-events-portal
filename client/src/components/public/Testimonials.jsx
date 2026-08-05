import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getPublicTestimonials, resolveAssetUrl } from "../../services/public/testimonialService";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    getPublicTestimonials()
      .then((data) => {
        if (mounted) setTestimonials(data);
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
    <section id="testimonials" className="bg-ivory py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-heading uppercase tracking-[0.3em] text-wine font-semibold text-sm">
            Testimonials
          </p>

          <h2 className="font-display text-4xl md:text-5xl text-ink mt-3">
            What Our Clients Say
          </h2>

          <p className="text-ink-muted mt-3 max-w-2xl mx-auto font-sans">
            Hear from our happy clients who trusted Adida Events to make
            their celebrations unforgettable.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 border-4 border-wine border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-ink-muted font-sans">
            We couldn&apos;t load testimonials right now. Please check back
            shortly.
          </p>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <p className="text-center text-ink-muted font-sans">
            Client stories will appear here soon.
          </p>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div
                key={item._id}
                className="bg-surface border border-border rounded-3xl p-8 transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(122,31,75,0.12)]"
              >
                <div className="flex mb-5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={17} className="fill-gold text-gold" />
                  ))}
                </div>

                <p className="text-ink-muted leading-8 italic font-display text-lg">
                  "{item.review}"
                </p>

                <div className="flex items-center mt-8">
                  {item.image ? (
                    <img
                      src={resolveAssetUrl(item.image)}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-wine"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blush border-2 border-wine flex items-center justify-center font-heading font-semibold text-wine">
                      {item.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div className="ml-4">
                    <h4 className="text-ink font-heading font-semibold">
                      {item.name}
                    </h4>
                    <p className="text-sm text-wine font-sans">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
