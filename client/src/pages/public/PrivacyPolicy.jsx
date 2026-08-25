import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#f5f6fb] text-[#303746]">

      {/* Header */}
      <header className="bg-[#0b1028] h-[52px] flex items-center px-5">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-white"
        >
          ADIDA <span className="text-[#ed3156]">EVENTS</span>
        </Link>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-16">

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#172044]">
            PRIVACY POLICY
          </h1>

          <div className="w-11 h-1 bg-[#ed3156] mx-auto mt-5 rounded-full" />
        </div>

        <div className="space-y-8 text-[15px] leading-6 text-[#505766]">

          <p>
            At Adida Events, we respect your privacy and are committed to
            protecting the personal information you share with us. This
            Privacy Policy explains how information is collected, used, and
            protected when you use our website and services.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              1. Information We Collect
            </h2>

            <p>
              We may collect information that you voluntarily provide when
              contacting us or submitting an enquiry, including your name,
              phone number, email address, location, event details, and other
              information necessary to respond to your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              2. How We Use Your Information
            </h2>

            <p>
              The information we collect may be used to respond to enquiries,
              communicate with clients, understand event requirements,
              provide requested services, and improve our website and
              services.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              3. Protection of Information
            </h2>

            <p>
              We take reasonable steps to protect the information provided to
              us against unauthorized access, misuse, alteration, or
              disclosure. However, no method of electronic transmission or
              storage can be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              4. Cookies
            </h2>

            <p>
              Our website may use cookies or similar technologies to improve
              website functionality and user experience. You may choose to
              disable cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              5. Third-Party Links
            </h2>

            <p>
              Our website may contain links to third-party websites and social
              media platforms. Adida Events is not responsible for the privacy
              practices, content, or policies of external websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              6. Changes to This Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              7. Contact Us
            </h2>

            <p>
              If you have any questions regarding this Privacy Policy, please
              contact Adida Events using the contact information available on
              our website.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6">
          <Link
            to="/"
            className="text-[#ed3156] hover:text-[#c92043] font-medium"
          >
            ← Back to Home
          </Link>

          <Link
            to="/terms-of-service"
            className="text-[#ed3156] hover:text-[#c92043] font-medium"
          >
            ← Terms of Service
          </Link>
        </div>

      </main>

    </div>
  );
};

export default PrivacyPolicy;