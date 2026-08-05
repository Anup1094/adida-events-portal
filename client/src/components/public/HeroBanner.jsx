import React from "react";
import hero from "../../assets/hero.webp";

const HeroBanner = () => {
  return (
    <section id="hero" className="relative bg-ivory pt-2 pb-14 px-6">
      <div className="max-w-7x0.5 mx-auto">
        <div className="rounded-3xl min-h-[480px] bg-surface border border-border overflow-hidden grid lg:grid-cols-[0.9fr_1.1fr] items-center shadow-[0_30px_80px_rgba(36,21,40,0.06)]">
          {/* Left Image */}
          <div className="relative h-[300px] lg:h-full">
            <img
              src={hero}
              alt="Adida Events — premium event planning"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ivory/0" />
          </div>

          {/* Right Content */}
          <div className="px-8 lg:px-12 py-10">
            <div className="flex gap-10 mb-6">
              <div className="border-l-2 border-gold pl-4">
                <p className="font-heading text-xs uppercase tracking-[0.2em] text-ink-muted">
                  10+ Years
                </p>
                <p className="text-sm text-ink-muted font-sans">
                  Creating memorable events
                </p>
              </div>

              <div className="border-l-2 border-gold pl-4">
                <p className="font-heading text-xs uppercase tracking-[0.2em] text-ink-muted">
                  500+
                </p>
                <p className="text-sm text-ink-muted font-sans">
                  Successful celebrations
                </p>
              </div>
            </div>

            <h1 className="font-display text-4xl xl:text-6xl leading-tight text-ink">
              Transform Every
              <br />
              Celebration Into
              <br />
              <span className="italic text-wine">A Lifetime Memory</span>
            </h1>

            <p className="mt-8 text-base text-ink-muted leading-8 max-w-xl font-sans">
              At Adida Events, we craft premium weddings, corporate gatherings,
              birthdays, product launches and luxury celebrations with flawless
              planning, creative concepts and exceptional execution that leave
              lasting impressions.
            </p>

            <div className="flex flex-wrap gap-4 mt-8 font-heading">
              <a
                href="#contact"
                className="bg-wine text-ivory px-8 py-4 rounded-full font-semibold transition-colors duration-300 hover:bg-wine-dark"
              >
                Book Your Event →
              </a>

              <a
                href="#gallery"
                className="border border-border text-ink px-8 py-4 rounded-full transition-colors duration-300 hover:border-wine hover:text-wine"
              >
                Explore Gallery
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
