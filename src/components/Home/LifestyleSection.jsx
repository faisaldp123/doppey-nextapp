"use client";

import Image from "next/image";
import styles from "../../styles/LifestyleSection.module.css";

export default function LifestyleSection() {
  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <Image
          src="/rare/big-one.webp"
          alt="Lifestyle Fashion"
          fill
          className={styles.image}
        />

        <div className={styles.overlay}>
          <span>NEW COLLECTION</span>
          <h2>Streetwear That Speaks Your Style</h2>
          <p>
            Discover premium oversized fits,
            trending essentials and everyday
            fashion made for modern lifestyles.
          </p>

          <button>
            SHOP COLLECTION
          </button>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.smallCard}>
          <Image
            src="/products/product-one.jpg"
            alt="Fashion"
            fill
            className={styles.image}
          />

          <div className={styles.smallOverlay}>
            <h3>Oversized Fits</h3>
          </div>
        </div>

        <div className={styles.smallCard}>
          <Image
            src="/products/product-two.jpg"
            alt="Fashion"
            fill
            className={styles.image}
          />

          <div className={styles.smallOverlay}>
            <h3>Premium Essentials</h3>
          </div>
        </div>
      </div>
    </section>
  );
}