"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/LifestyleSection.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const staticSections = [
  {
    _id: "static-1",
    label: "NEW COLLECTION",
    heading: "Streetwear That Speaks Your Style",
    description:
      "Discover premium oversized fits, trending essentials and everyday fashion made for modern lifestyles.",
    buttonText: "SHOP COLLECTION",
    buttonLink: "/",
    leftImage: "/rare/big-one.webp",
    rightTopImage: "/products/product-one.jpg",
    rightTopTitle: "Oversized Fits",
    rightBottomImage: "/products/product-two.jpg",
    rightBottomTitle: "Premium Essentials",
  },
];

export default function LifestyleSection() {
  const [sections, setSections] = useState(staticSections);

  useEffect(() => {
    fetch(`${API_URL}/lifestyle-sections/public`)
      .then((res) => {
        if (!res.ok) throw new Error(`lifestyle-sections request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSections(data);
        }
      })
      .catch((err) => console.error("LifestyleSection fetch error:", err.message));
  }, []);

  return (
    <>
      {sections.map((s) => (
        <section className={styles.section} key={s._id}>
          <div className={styles.left}>
            <Image
              src={s.leftImage}
              alt={s.heading || "Lifestyle"}
              fill
              className={styles.image}
            />

            <div className={styles.overlay}>
              {s.label && <span>{s.label}</span>}
              {s.heading && <h2>{s.heading}</h2>}
              {s.description && <p>{s.description}</p>}

              <Link href={s.buttonLink || "/"}>
                <button>{s.buttonText || "SHOP NOW"}</button>
              </Link>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.smallCard}>
              <Image
                src={s.rightTopImage}
                alt={s.rightTopTitle || "Fashion"}
                fill
                className={styles.image}
              />
              {s.rightTopTitle && (
                <div className={styles.smallOverlay}>
                  <h3>{s.rightTopTitle}</h3>
                </div>
              )}
            </div>

            <div className={styles.smallCard}>
              <Image
                src={s.rightBottomImage}
                alt={s.rightBottomTitle || "Fashion"}
                fill
                className={styles.image}
              />
              {s.rightBottomTitle && (
                <div className={styles.smallOverlay}>
                  <h3>{s.rightBottomTitle}</h3>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}