import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import API from "../../services/api";

const initialState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  message: "",
};

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "phone", label: "Phone Number", type: "tel" },
  { name: "email", label: "Email", type: "email" },
  { name: "location", label: "Location", type: "text" },
];

const ContactForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      await API.post("/contact/submit", formData);

      setStatus("Enquiry sent successfully!");
      setFormData(initialState);
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          "Server error. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-blush py-16 md:py-20 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: Contact Information */}
          <div>
            <p className="font-heading uppercase tracking-[0.3em] text-wine font-semibold text-sm">
              Book Your Event
            </p>

            <h2 className="mt-3 font-display text-4xl md:text-5xl text-ink leading-tight">
              Let&apos;s Create Something Unforgettable
            </h2>

            <p className="mt-4 text-ink-muted leading-7 font-sans max-w-md">
              Tell us about your event and our team will get in touch with
              you to discuss your requirements, ideas, and planning details.
            </p>

            {/* Contact Details */}
            <div className="mt-8 space-y-5 font-sans">

              {/* Address */}
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-wine">
                  <MapPin size={17} />
                </span>

                <span className="text-ink-muted leading-6 mt-0.5">
                  1/6979 Street No-2, Shivaji Park
                  <br />
                  Shahdara, Delhi-110032
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-wine">
                  <Phone size={17} />
                </span>

                <span className="text-ink-muted">
                  9650466106
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-wine">
                  <Mail size={17} />
                </span>

                <span className="text-ink-muted">
                  adidaevents@gmail.com
                </span>
              </div>

            </div>

            {/* Map */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-[0_20px_50px_rgba(36,21,40,0.08)]">
              <iframe
                title="Adida Events Location"
                width="100%"
                height="240"
                src="https://maps.google.com/maps?width=520&height=400&hl=en&q=1/6979%20Delhi%20(Adida%20Events%20Pvt%20Ltd)&t=&z=12&ie=UTF8&iwloc=B&output=embed"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          {/* Right: Event Enquiry Form */}
          <div className="rounded-3xl border border-border bg-surface p-7 md:p-8 shadow-[0_20px_50px_rgba(36,21,40,0.08)]">

            {/* Form Header */}
            <div className="mb-6">
              <p className="font-heading uppercase tracking-[0.2em] text-wine text-xs font-semibold">
                Event Enquiry
              </p>

              <h3 className="mt-2 font-heading text-2xl text-ink">
                Tell Us About Your Event
              </h3>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Share a few details and we&apos;ll get back to you shortly.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 font-sans"
            >
              {/* Inputs */}
              {fields.map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={
                    field.name !== "phone" &&
                    field.name !== "location"
                  }
                  className="rounded-xl border border-border bg-ivory px-4 py-3.5 text-ink outline-none transition placeholder:text-ink-muted focus:border-wine focus:ring-4 focus:ring-wine/10"
                />
              ))}

              {/* Message */}
              <textarea
                name="message"
                placeholder="Message / Event Type"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="rounded-xl border border-border bg-ivory px-4 py-3.5 text-ink outline-none transition placeholder:text-ink-muted focus:border-wine focus:ring-4 focus:ring-wine/10 resize-none"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-1 rounded-xl bg-wine py-3.5 font-heading font-semibold text-ivory transition-all duration-300 hover:bg-wine-dark hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? "Sending Enquiry..."
                  : "Book My Event"}
              </button>
            </form>

            {/* Status Message */}
            {status && (
              <p
                className={`mt-4 text-center text-sm font-heading font-medium ${
                  status.includes("successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;