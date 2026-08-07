import { useEffect, useState } from "react";

import { getPublicServices, resolveAssetUrl } from "../../services/public/serviceService";

import wedding from "../../assets/services/wedding.jpg";
import engagement from "../../assets/services/engagement.jpg";
import birthday from "../../assets/services/birthday.jpg";
import anniversary from "../../assets/services/anniversary.jpg";
import corporate from "../../assets/services/corporate.jpg";
import babyshower from "../../assets/services/babyshower.jpg";

const fallbackImages = {
  Wedding: wedding,
  Engagement: engagement,
  Birthday: birthday,
  Anniversary: anniversary,
  Corporate: corporate,
  "Baby Shower": babyshower,
};

export default function ServicesPreview() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getPublicServices();
        setServices(services);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section
      id="services"
      className="bg-[#fbf7f7] pt-8 pb-20"
    >
      <div className="max-w-6xl mx-auto pt-2 px-6">

        {/* Heading */}

        <div className="text-center mb-8">

          <p className="uppercase tracking-[0.35em] text-[#8d3f71] text-sm font-semibold">
            Our Services
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-serif text-[#241528]">
            Celebrate Every Occasion
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-8">
            From intimate celebrations to grand luxury weddings,
            we transform your vision into unforgettable memories.
          </p>

        </div>

        {/* Loader */}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8d3f71] border-t-transparent"></div>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="text-center text-red-500">
            Unable to load services.
          </div>
        )}

        {/* Empty */}

        {!loading && !error && services.length === 0 && (
          <div className="text-center text-gray-500">
            No services available.
          </div>
        )}

        {/* Cards */}

        {!loading && !error && services.length > 0 && (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {services.map((service) => {

              const image = service.image
                ? resolveAssetUrl(service.image)
                : fallbackImages[service.title] || wedding;

              return (

                <div
                  key={service._id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >

                  {/* Image */}

                  <div className="relative overflow-hidden">

                    <img
                      src={image}
                      alt={service.title}
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold text-[#8d3f71] backdrop-blur">
                      {service.category}
                    </span>

                    <div className="absolute bottom-5 left-5">

                      <h3 className="text-2xl font-serif text-white">
                        {service.title}
                      </h3>

                    </div>

                  </div>

                  {/* Content */}

                  <div className="p-6">

                    <p className="text-gray-600 leading-7 line-clamp-3">
                      {service.description}
                    </p>

                    <button
                      className="mt-6 inline-flex items-center gap-2 font-semibold text-[#8d3f71] transition-all hover:gap-3"
                    >
                      Learn More →
                    </button>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>
    </section>
  );
}