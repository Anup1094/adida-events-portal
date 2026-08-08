import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";

// ================= PUBLIC COMPONENTS =================

import Navbar from "./components/public/Navbar";
import HeroBanner from "./components/public/HeroBanner";
import AboutUs from "./components/public/AboutUs";
import ServicesPreview from "./components/public/ServicesPreview";
import EventsPreview from "./components/public/EventsPreview";
import Gallery from "./components/public/Gallery";
import Testimonials from "./components/public/Testimonials";
import ContactForm from "./components/public/ContactForm";
import Footer from "./components/public/Footer";

// ================= LAYOUT =================

import AdminLayout from "./layouts/AdminLayout";

// ================= LAZY IMPORTS =================

//const PublicLogin = lazy(() => import("./pages/public/Login"));
//const PublicSignup = lazy(() => import("./pages/public/Signup"));

const AdminLogin = lazy(() =>
  import("./pages/admin/Login")
);

const Dashboard = lazy(() =>
  import("./pages/admin/Dashboard")
);

const Events = lazy(() =>
  import("./pages/admin/Events")
);

const EventForm = lazy(() =>
  import("./pages/admin/EventForm")
);

const GalleryManager = lazy(() =>
  import("./pages/admin/GalleryManager")
);

const GalleryForm = lazy(() =>
  import("./pages/admin/GalleryForm")
);

const ServicesManager = lazy(() =>
  import("./pages/admin/ServicesManager")
);

const Enquiries = lazy(() =>
  import("./pages/admin/Enquiries")
);

const AdminTestimonials = lazy(() =>
  import("./pages/admin/Testimonials")
);

const Settings = lazy(() =>
  import("./pages/admin/Settings")
);

const Profile = lazy(() =>
  import("./pages/admin/Profile")
);

// ================= LOADER =================

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-ivory">
    <div className="h-12 w-12 border-4 border-wine border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ================= HOME PAGE =================

const HomePage = () => {
  return (
    <main className="flex flex-col pt-[68px] bg-ivory">

      <section id="hero">
        <HeroBanner />
      </section>

      <section id="aboutus">
        <AboutUs />
      </section>

      <section id="services">
        <ServicesPreview />
      </section>

      <section id="events">
        <EventsPreview />
      </section>

      <section id="gallery">
        <Gallery />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="contact">
        <ContactForm />
      </section>

      <Footer />

    </main>
  );
};
// ===================== APP CONTENT =====================

const AppContent = () => {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-ivory scroll-smooth">

      {!hideNavbar && <Navbar />}

      <main className="flex-grow">

        <Suspense fallback={<PageLoader />}>

          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}

            <Route path="/" element={<HomePage />} />

            <Route
              path="/services"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="/gallery"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="/contact"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="/testimonials"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="/aboutus"
              element={<Navigate to="/" replace />}
            />

            {/* ================= CUSTOMER AUTH ================= */}

            {/*
<Route
  path="/login"
  element={<PublicLogin />}
/>

<Route
  path="/signup"
  element={<PublicSignup />}
/>
*/}

            {/* ================= ADMIN LOGIN ================= */}

            <Route
              path="/admin/login"
              element={<AdminLogin />}
            />

            {/* ================= ADMIN PANEL ================= */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Dashboard />}
              />

              <Route
                path="dashboard"
                element={<Dashboard />}
              />

              {/* ================= EVENTS ================= */}

              <Route
                path="events"
                element={<Events />}
              />

              <Route
                path="events/add"
                element={<EventForm />}
              />

              <Route
                path="events/edit/:id"
                element={<EventForm />}
              />

              {/* ================= GALLERY ================= */}

              <Route
                path="gallery"
                element={<GalleryManager />}
              />

              <Route
                path="gallery/add"
                element={<GalleryForm />}
              />

              <Route
                path="gallery/edit/:id"
                element={<GalleryForm />}
              />

              {/* ================= SERVICES ================= */}

              <Route
                path="services"
                element={<ServicesManager />}
              />

              {/* ================= ENQUIRIES ================= */}

              <Route
                path="enquiries"
                element={<Enquiries />}
              />

              {/* ================= TESTIMONIALS ================= */}

              <Route
                path="testimonials"
                element={<AdminTestimonials />}
              />

              {/* ================= SETTINGS ================= */}

              <Route
                path="settings"
                element={<Settings />}
              />

              {/* ================= MY PROFILE ================= */}

              <Route
                path="profile"
                element={<Profile />}
              />

            </Route>
                        {/* ================= 404 ================= */}

            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-ivory">
                  <div className="text-center">
                    <h1 className="font-display text-8xl font-semibold text-wine">
                      404
                    </h1>

                    <p className="mt-4 text-lg text-ink-muted font-sans">
                      Page Not Found
                    </p>

                    <button
                      onClick={() => (window.location.href = "/")}
                      className="mt-6 rounded-full bg-wine px-6 py-3 font-heading text-sm font-semibold text-ivory transition-colors hover:bg-wine-dark"
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              }
            />

          </Routes>

        </Suspense>

      </main>

    </div>
  );
};

// ================= APP =================

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#241528",
            border: "1px solid #e8dadf",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#7a1f4b", secondary: "#ffffff" } },
        }}
      />
      <AppContent />
    </Router>
  );
}

export default App;