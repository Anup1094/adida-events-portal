import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import {
  getPublicGallery,
  resolveAssetUrl,
} from "../../services/public/galleryService";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    getPublicGallery()
      .then((data) => {
        if (mounted) setImages(data);
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
    <section
      id="gallery"
      className="relative overflow-hidden bg-blush pt-2 py-20"
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 -top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold/10 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-16 mt-2 text-center">
          <p className="text-sm font-heading font-semibold uppercase tracking-[0.3em] text-wine">
            Our Gallery
          </p>

          <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-display text-ink">
            Moments We Crafted
          </h2>

          <p className="mx-auto mt-1 max-w-2xl text-ink-muted leading-8">
            Explore our weddings, birthdays, corporate events,
            engagements and unforgettable celebrations.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-wine border-t-transparent" />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-ink-muted">
            Unable to load gallery.
          </p>
        )}

        {!loading && !error && images.length === 0 && (
          <p className="text-center text-ink-muted">
            Gallery will appear here shortly.
          </p>
        )}

        {!loading && !error && images.length > 0 && (
          <Swiper
            modules={[
              Navigation,
              Pagination,
              Autoplay,
              EffectCoverflow,
            ]}
            effect="coverflow"
            centeredSlides
            loop={images.length > 2}
            grabCursor
            speed={700}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            slidesPerView={1.2}
            spaceBetween={20}
            breakpoints={{
              640: {
                slidesPerView: 1.8,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2.8,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3.2,
                spaceBetween: 30,
              },
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 120,
              modifier: 1,
              scale: 0.88,
              slideShadows: false,
            }}
            className="gallerySwiper -mt-8 pb-16"
          >
            {images.map((image) => (
              <SwiperSlide key={image._id}>
                <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-lg transition-all duration-500 hover:shadow-2xl">
                  <img
                    src={resolveAssetUrl(image.image)}
                    alt={image.title}
                    loading="lazy"
                   className="h-[280px] md:h-[300px] lg:h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}