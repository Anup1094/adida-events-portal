import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save JWT Token
      localStorage.setItem("token", data.token);

      // Save Admin Details
      localStorage.setItem("user", JSON.stringify(data.admin));

      alert(data.message || "Login Successful");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink px-1 pt-3 py-20 text-white">
      <Link
  to="/"
  className="absolute left-6 top-5 z-20 flex items-center gap-2 rounded-full border border-wine/30 bg-ink/80 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-wine-light hover:bg-wine"
>
  <ArrowLeft size={18} />
  Back to Home
</Link>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,31,75,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(184,144,46,0.25),transparent_35%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-10rem)] w-full max-w-6xl mt-5 items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-wine-light/40 bg-wine/10 px-4 py-2  text-sm font-semibold text-blush backdrop-blur">
            <ShieldCheck size={17} /> Admin Secure Gateway
          </span>

          <h2 className="mt-6 max-w-2xl text-5xl font-black leading-tight">
            Control your events from a polished admin workspace.
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-8 text-border">
            Sign in to manage bookings, enquiries, gallery,
            services, testimonials and platform settings.
          </p>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <LayoutDashboard className="text-gold-light" />
              <h3 className="mt-4 font-bold">
                Dashboard Control
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Monitor business activity quickly.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <BadgeCheck className="text-gold-light" />
              <h3 className="mt-4 font-bold">
                Role Protected
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Admin-only account verification.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-ink/60 backdrop-blur-xl sm:p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-wine to-gold text-white shadow-lg shadow-ink/70">
            <KeyRound size={28} />
          </div>

          <h2 className="text-center text-3xl font-black">
            Admin Sign In
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-center text-border">
            Authorized access only. Please use your admin credentials.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-border">
                Admin Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  size={20}
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@adidaevents.com"
                  className="w-full rounded-2xl border border-white/10 bg-ink/70 py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-ink-muted focus:border-wine-light focus:ring-4 focus:ring-wine/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-border">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  size={20}
                />

                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-white/10 bg-ink/70 py-4 pt-3 pl-12 pr-4 text-white outline-none transition placeholder:text-ink-muted focus:border-wine-light focus:ring-4 focus:ring-wine/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-wine to-gold py-4 font-bold text-white shadow-xl shadow-ink/60 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                "Verifying Access..."
              ) : (
                <>
                  Enter Admin Panel
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-3 rounded-2xl border border-wine-light/20 bg-wine/10 p-4 text-center text-sm text-blush">
            <strong>Authorized Admin Access Only</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
