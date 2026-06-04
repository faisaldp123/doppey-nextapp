"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";
import styles from "../../styles/InstagramSection.module.css";

export default function InstagramSection() {
  const posts = [
    "/products/product-three.jpg",
    "/products/product-two.jpg",
    "/products/product-three.jpg",
    "/products/product-one.jpg",
    "/products/product-three.jpg",
  ];

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span>@DOPPEYOFFICIAL</span>

        <h2>FOLLOW US ON INSTAGRAM</h2>

        <p>
          Discover daily inspiration, new arrivals,
          streetwear looks and community styles.
        </p>
      </div>

      <div className={styles.grid}>
        {posts.map((image, index) => (
          <div
            key={index}
            className={styles.card}
          >
            <Image
              src={image}
              alt={`Instagram ${index + 1}`}
              fill
              className={styles.image}
            />

            <div className={styles.overlay}>
              <Instagram size={32} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.followBtn}
        >
          FOLLOW US →
        </a>
      </div>
    </section>
  );
}