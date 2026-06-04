"use client";

import Image from "next/image";
import styles from "../../styles/HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.imageWrapper}>
        <Image
          src="/hero/newww.webp"
          alt="Doppey Fashion"
          fill
          priority
          quality={100}
          sizes="100vw"
          className={styles.heroImage}
        />

        <div className={styles.overlay}></div>

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            NEW COLLECTION
          </span>

          <h1>
            STREETWEAR
            <br />
            REDEFINED
          </h1>

          <p>
            Premium oversized fits designed
            for everyday comfort.
          </p>

          <button className={styles.heroBtn}>
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
}