"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/ShopToast.module.css";

export default function ShopToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      setToast(event.detail);
      window.clearTimeout(window.__doppeyToastTimer);
      window.__doppeyToastTimer = window.setTimeout(() => setToast(null), 3000);
    };

    window.addEventListener("shop-toast", handler);
    return () => window.removeEventListener("shop-toast", handler);
  }, []);

  if (!toast) return null;

  return (
    <div className={`${styles.toast} ${styles[toast.type] || ""}`}>
      <div className={styles.icon}>
        {toast.type === "cart" ? "Bag" : toast.type === "wishlist" ? "Heart" : "Done"}
      </div>
      <div>
        <h4>
          {toast.type === "cart"
            ? "Cart Updated"
            : toast.type === "wishlist"
            ? "Wishlist Updated"
            : "Updated"}
        </h4>
        <p>{toast.message}</p>
      </div>
    </div>
  );
}
