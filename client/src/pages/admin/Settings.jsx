import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Loader2 } from "lucide-react";
import { fetchSettings, saveSettings } from "../../services/admin/settingsService";

const fields = [
  { label: "Company Name", name: "companyName" },
  { label: "Email", name: "email" },
  { label: "Phone", name: "phone" },
  { label: "Address", name: "address" },
  { label: "Website", name: "website" },
  { label: "Instagram", name: "instagram" },
  { label: "Facebook", name: "facebook" },
  { label: "YouTube", name: "youtube" },
];

const emptyForm = {
  companyName: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

const Settings = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  useEffect(() => {
    let mounted = true;

    fetchSettings().then((result) => {
      if (!mounted) return;
      if (result.success && result.settings) {
        const { _id, __v, createdAt, updatedAt, ...rest } = result.settings;
        setFormData({ ...emptyForm, ...rest });
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);

    const result = await saveSettings(formData);

    if (result.success) {
      setStatus({ type: "success", message: "Settings saved successfully." });
    } else {
      setStatus({ type: "error", message: result.message });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Settings</h1>
        <p className="text-ink-muted mt-2">
          Manage your website information.
        </p>
      </div>

      <motion.div
        whileHover={{ y: -3 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-8"
      >
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-muted gap-2">
            <Loader2 className="animate-spin" size={20} />
            Loading settings...
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block mb-2 font-medium text-ink">
                    {field.label}
                  </label>

                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-wine focus:ring-2 focus:ring-blush"
                  />
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <label className="block mb-2 font-medium text-ink">
                  Company Logo
                </label>

                <div
                  title="Logo upload isn't wired up yet — coming in a future update"
                  className="w-full border-2 border-dashed border-border rounded-xl py-10 flex flex-col items-center gap-2 text-ink-muted cursor-not-allowed opacity-70"
                >
                  <Upload />
                  Coming Soon
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-ink">
                  Hero Banner
                </label>

                <div
                  title="Banner upload isn't wired up yet — coming in a future update"
                  className="w-full border-2 border-dashed border-border rounded-xl py-10 flex flex-col items-center gap-2 text-ink-muted cursor-not-allowed opacity-70"
                >
                  <Upload />
                  Coming Soon
                </div>
              </div>
            </div>

            {status && (
              <p
                className={`mt-6 text-sm font-medium ${
                  status.type === "success" ? "text-green-700" : "text-red-600"
                }`}
              >
                {status.message}
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-wine to-gold text-white px-8 py-3 rounded-xl hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
