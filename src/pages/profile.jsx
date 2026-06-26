"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api";
import styles from "@/styles/ProfilePage.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("open-login-modal"));
      router.push("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await API.get("/profile");
        setForm({
          name: res.data?.name || "",
          email: res.data?.email || "",
          phone: res.data?.phone || "",
        });
      } catch (err) {
        console.error("Profile load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await API.put("/profile", form);
      const user = res.data?.user;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("user-login"));
      }
      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.profile_container}>Loading profile...</div>;
  }

  return (
    <div className={styles.profile_container}>
      <aside className={styles.sidebar}>
        <div className={styles.user_box}>
          <div className={styles.avatarFallback}>
            {(form.name || form.phone || "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h4>{form.name || "My Profile"}</h4>
            <p>{form.phone ? `+91 ${form.phone}` : form.email || "Update your details"}</p>
          </div>
        </div>
      </aside>

      <section className={styles.content}>
        <form className={styles.section_box} onSubmit={handleSave}>
          <h3>Profile Details</h3>
          <p>Keep your contact details updated for orders, returns and delivery calls.</p>

          <label>Name</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" />

          <label>Email</label>
          <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email address" />

          <label>Mobile Number</label>
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile number"
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>
    </div>
  );
}
