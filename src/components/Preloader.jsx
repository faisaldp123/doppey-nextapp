"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Preloader.module.css";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // adjust time
    return () => clearTimeout(timer);
  }, []);
  if (!loading) return null;
  return (
    <div className={styles.preloaderOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}
