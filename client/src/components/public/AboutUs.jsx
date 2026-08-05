import React from "react";

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "500+", label: "Events Delivered" },
  { value: "50+", label: "Corporate Partners" },
];

export default function AboutUs() {
  return (
    <section id="aboutus" className="bg-blush py-14 ">
      <div className="max-w-5xl mx-auto px-3 ">

        <p className="font-heading uppercase tracking-[0.3em] text-wine font-semibold text-sm ">
          About Adida Events
        </p>

        <h2 className="mt-4 font-display text-4xl md:text-5xl text-ink leading-tight">
          Where Every Detail Is{" "}
          <span className="italic text-wine">
            Planned With Care
          </span>
        </h2>

        <p className="mt-7 text-ink-muted leading-8">
          Adida Events is a Delhi-based premium event management company
          specializing in weddings, engagements, birthdays, corporate events,
          luxury celebrations, product launches, and social gatherings. We
          transform ideas into unforgettable experiences through creative
          planning, elegant décor, seamless coordination, and flawless
          execution.
        </p>

        <p className="mt-5 text-ink-muted leading-8">
          From your first consultation to the final celebration, our dedicated
          team manages every detail with precision and passion. Our goal is to
          let you enjoy your special moments while we take care of everything
          behind the scenes.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-l-4 border-wine pl-4"
            >
              <h3 className="font-display text-4xl text-wine">
                {stat.value}
              </h3>

              <p className="mt-2 text-sm text-ink-muted leading-6">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}