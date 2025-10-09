"use client";
import styles from "../../styles/BannerSection.module.css";

export default function BannerSection() {
  return (
    <section className={styles.banner}>
      <h4>Winter Sale</h4>
      <h2>Up to <span>70% Off</span> – All T-Shirts & Accessories</h2>
      <button className={styles.normal}>Explore More</button>
    </section>
  );
}
