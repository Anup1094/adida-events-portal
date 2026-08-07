import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, User, Lock } from "lucide-react";
import { fetchProfile, updateProfile } from "../../services/admin/profileService";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let mounted = true;

    fetchProfile().then((result) => {
      if (!mounted) return;
      if (result.success) {
        setFormData({
          name: result.user.name || "",
          email: result.user.email || "",
          phone: result.user.phone || "",
        });
      } else {
        setStatus({ type: "error", message: result.message });
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus({ type: "error", message: "Name and email are required." });
      return;
    }

    // If the person is trying to change their password, validate it client-side first
    if (passwordData.newPassword || passwordData.confirmPassword || passwordData.currentPassword) {
      if (!passwordData.currentPassword) {
        setStatus({ type: "error", message: "Please enter your current password to set a new one." });
        return;
      }
      if (passwordData.newPassword.length < 6) {
        setStatus({ type: "error", message: "New password must be at least 6 characters long." });
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setStatus({ type: "error", message: "New password and confirm password do not match." });
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (passwordData.newPassword) {
        payload.currentPassword = passwordData.currentPassword;
        payload.newPassword = passwordData.newPassword;
      }

      const result = await updateProfile(payload);

      if (result.success) {
        setStatus({ type: "success", message: result.message || "Profile updated successfully." });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });

        // Keep the sidebar/header in sync with the latest name/email
        const stored = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem(
          "user",
          JSON.stringify({ ...stored, ...result.user })
        );
      } else {
        setStatus({ type: "error", message: result.message });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 text-center text-ink-muted">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">My Profile</h1>
        <p className="text-ink-muted mt-1">
          View and update your account details.
        </p>
      </div>

      {status && (
        <div
          className={`rounded-xl border px-5 py-4 ${
            status.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-wine to-gold flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-semibold text-ink">
            Account Details
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
              placeholder="Administrator"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
              placeholder="admin@adidaevents.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-ink mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pb-2 pt-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-wine to-gold flex items-center justify-center">
            <Lock size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Change Password
            </h2>
            <p className="text-sm text-ink-muted">
              Leave blank if you don't want to change your password.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-wine text-white hover:bg-wine-dark disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Profile;