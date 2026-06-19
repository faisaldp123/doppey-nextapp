"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Package, Heart, MapPin, CreditCard, Headphones, Info, LogOut } from "lucide-react";
import styles from "@/styles/AccountModal.module.css";

export default function AccountModal({ open, onClose, user }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginPhone");
    window.dispatchEvent(new Event("user-login"));
    onClose();
    window.location.href = "/";
  };

  if (!open || !user) return null;

  const initials = (user.name || user.phone || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel} ref={ref}>
        {/* User info */}
        <div className={styles.userSection}>
          <div className={styles.avatar}>{initials}</div>
          <p className={styles.userName}>{user.name || "My Account"}</p>
          <p className={styles.userPhone}>{user.phone ? `+91 ${user.phone}` : ""}</p>
        </div>

        <nav className={styles.links}>
          <Link href="/orders" className={styles.link} onClick={onClose}>
            <Package size={17} /> My orders
          </Link>
          <Link href="/wishlist" className={styles.link} onClick={onClose}>
            <Heart size={17} /> Wishlist
          </Link>
          <Link href="/addresses" className={styles.link} onClick={onClose}>
            <MapPin size={17} /> Saved addresses
          </Link>
          <Link href="/payments" className={styles.link} onClick={onClose}>
            <CreditCard size={17} /> Payment methods
          </Link>

          <div className={styles.divider} />

          <Link href="/help" className={styles.link} onClick={onClose}>
            <Headphones size={17} /> Help center
          </Link>
          <Link href="/about" className={styles.link} onClick={onClose}>
            <Info size={17} /> About Doppey
          </Link>

          <div className={styles.divider} />

          <button className={styles.logout} onClick={handleLogout}>
            <LogOut size={17} /> Logout
          </button>
        </nav>
      </div>
    </>
  );
}