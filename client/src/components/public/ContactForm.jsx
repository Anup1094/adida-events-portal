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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      await API.post("/contact/submit", formData);
      setStatus("Message sent successfully!");
      setFormData(initialState);
    } catch (error) {
      setStatus(
        error.response?.data?.message || "Server error. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-blush py-2 pt-0.5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left: Info */}
          <div>
            <p className="font-heading uppercase tracking-[0.3em] text-wine font-semibold text-sm">
              Contact Us
            </p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl text-ink">
              Get in Touch
            </h2>
            <p className="mt-2 text-ink-muted leading-7 font-sans max-w-md">
              Ready to plan your next big event? Contact us today for a free
              consultation and quotation.
            </p>

            <div className="mt-3 space-y-5 font-sans">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-wine">
                  <MapPin size={17} />
                </span>
                <span className="text-ink-muted leading-6 mt-0.5">
                  1/6979 Street No-2, Shivaji Park
                  <br />
                  Shahdara, Delhi-110032
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex h-3 w-9 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-wine">
                  <Phone size={17} />
                </span>
                <span className="text-ink-muted">9650466106</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-wine">
                  <Mail size={17} />
                </span>
                <span className="text-ink-muted">adidaevents@gmail.com</span>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-border shadow-[0_20px_50px_rgba(36,21,40,0.08)]">
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

          {/* Right: Form */}
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-[0_20px_50px_rgba(36,21,40,0.08)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
              {fields.map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.name !== "phone" && field.name !== "location"}
                  className="rounded-xl border border-border bg-ivory px-4 py-3.5 text-ink outline-none transition placeholder:text-ink-muted focus:border-wine focus:ring-4 focus:ring-wine/10"
                />
              ))}

              <textarea
                name="message"
                placeholder="Message / Event Type"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="rounded-xl border border-border bg-ivory px-4 py-3.5 text-ink outline-none transition placeholder:text-ink-muted focus:border-wine focus:ring-4 focus:ring-wine/10 resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 rounded-xl bg-wine py-3.5 font-heading font-semibold text-ivory transition-colors duration-300 hover:bg-wine-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending..." : "Send Enquiry"}
              </button>
            </form>

            {status && (
              <p
                className={`mt-4 text-center text-sm font-heading font-medium ${
                  status.includes("successfully") ? "text-green-700" : "text-red-600"
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
