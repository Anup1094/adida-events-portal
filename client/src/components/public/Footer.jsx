import { FaFacebookF, FaInstagram } from "react-icons/fa";
import logo from "../../assets/logo.svg";

const usefulLinks = [
  { label: "About Us", href: "#aboutus" },
  { label: "Services", href: "#services" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
];

const moreLinks = [
  { label: "Testimonials", href: "#testimonials" },
  { label: "Book an Event", href: "#contact" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-ink text-ivory/90">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div>
            <p className="font-display italic text-2xl md:text-3xl text-ivory">
              Planning something special?
            </p>
            <p className="mt-1 text-sm text-ivory/60 font-sans">
              Tell us the occasion — we&apos;ll handle the rest.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 rounded-full bg-gold px-7 py-3 font-heading text-sm font-semibold text-ink transition-colors duration-300 hover:bg-gold-light"
          >
            Start Enquiry
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:grid-cols-2">
        {/* Company */}
        <div>
          <img src={logo} alt="Adida Events" className="h-9 w-auto invert" />
          <p className="mt-5 text-sm leading-6 text-ivory/60 max-w-xs">
            A premier event management studio crafting unforgettable
            weddings, celebrations, and corporate experiences with
            creativity, precision, and care.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href="https://www.facebook.com/xav_ig_profile_web"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center transition-colors duration-300 hover:bg-gold hover:text-ink hover:border-gold"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://www.instagram.com/adidaevents"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center transition-colors duration-300 hover:bg-gold hover:text-ink hover:border-gold"
            >
              <FaInstagram size={16} />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-heading uppercase text-sm tracking-widest text-ivory mb-5">
            Explore
          </h3>
          <ul className="space-y-3.5">
            {usefulLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-ivory/60 transition-colors duration-300 hover:text-gold-light"
                >
                  <span className="diamond shrink-0" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* More Links */}
        <div>
          <h3 className="font-heading uppercase text-sm tracking-widest text-ivory mb-5">
            Company
          </h3>
          <ul className="space-y-3.5">
            {moreLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-ivory/60 transition-colors duration-300 hover:text-gold-light"
                >
                  <span className="diamond shrink-0" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading uppercase text-sm tracking-widest text-ivory mb-5">
            Reach Us
          </h3>
          <div className="space-y-3 text-sm text-ivory/60 leading-6">
            <p>
              1/6979 Street No-2, Shivaji Park
              <br />
              Shahdara, Delhi-110032
            </p>
            <p>
              <span className="text-ivory/90 font-medium">Phone:</span>{" "}
              9650466106
            </p>
            <p>
              <span className="text-ivory/90 font-medium">Email:</span>{" "}
              adidaevents@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-5 text-center text-xs text-ivory/40 font-sans">
        © 2026 <span className="text-ivory/70 font-medium">Adida Events Pvt. Ltd.</span>{" "}
        All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
