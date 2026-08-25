import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-16">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#172044]">
            TERMS OF SERVICE
          </h1>

          <div className="w-11 h-1 bg-[#ed3156] mx-auto mt-5 rounded-full" />
        </div>

        <div className="space-y-8 text-[15px] leading-6 text-[#505766]">

          <p>
            Welcome to Adida Events. These terms and conditions outline the
            rules and regulations for the use of Adida Events' website and
            services. By accessing this website, we assume you accept these
            terms and conditions in full. Do not continue to use Adida Events'
            website if you do not accept all of the terms and conditions
            stated on this page.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              1. Introduction
            </h2>

            <p>
              Adida Events is a premier event management company dedicated to
              creating unforgettable experiences for both corporate and
              personal events. Our services are provided with utmost
              professionalism, creativity, and attention to detail.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              2. Intellectual Property Rights
            </h2>

            <p>
              Unless otherwise stated, Adida Events and/or its licensors own
              the intellectual property rights for all material on Adida
              Events. All intellectual property rights are reserved. You may
              view and/or print pages from Adida Events for your own personal
              use subject to restrictions set in these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              3. Restrictions
            </h2>

            <p className="mb-4">
              You are specifically restricted from all of the following:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Publishing any website material in any other media without
                prior written consent.
              </li>

              <li>
                Selling, sublicensing, and/or otherwise commercializing any
                website material.
              </li>

              <li>
                Using this website in any way that is or may be damaging to
                this website.
              </li>

              <li>
                Using this website in any way that impacts user access to this
                website.
              </li>

              <li>
                Using this website contrary to applicable laws and regulations,
                or in any way that may cause harm to the website, or to any
                person or business entity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              4. Limitation of Liability
            </h2>

            <p>
              In no event shall Adida Events, nor any of its officers,
              directors, and employees, be liable for anything arising out of
              or in any way connected with your use of this website whether
              such liability is under contract. Adida Events, including its
              officers, directors, and employees shall not be held liable for
              any indirect, consequential, or special liability arising out of
              or in any way related to your use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl text-[#303746] mb-4">
              5. Governing Law &amp; Jurisdiction
            </h2>

            <p>
              These terms will be governed by and interpreted in accordance
              with the laws of the State of Delhi, and you submit to the
              non-exclusive jurisdiction of the state and federal courts
              located in Delhi for the resolution of any disputes.
            </p>
          </section>

        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-6">
          <Link
            to="/"
            className="text-[#ed3156] hover:text-[#c92043] font-medium"
          >
            ← Back to Home
          </Link>

          <Link
            to="/privacy-policy"
            className="text-[#ed3156] hover:text-[#c92043] font-medium"
          >
            Privacy Policy →
          </Link>
        </div>

      </main>

    </div>
  );
};

export default TermsOfService;