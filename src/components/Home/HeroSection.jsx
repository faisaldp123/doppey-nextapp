"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../styles/HeroSection.module.css";

const slides = [
  {
    image: "/hero/banner1.webp",
    badge: "NEW COLLECTION",
    title: "STREETWEAR\nREDEFINED",
    desc: "Premium oversized fits designed for everyday comfort.",
  },
  {
    image: "/hero/banner2.webp",
    badge: "SUMMER DROP",
    title: "OVERSIZED\nESSENTIALS",
    desc: "Built for style, comfort and confidence.",
  },
  {
    image: "/hero/banner3.webp",
    badge: "LIMITED EDITION",
    title: "ELEVATE\nYOUR FIT",
    desc: "Fashion that speaks before you do.",
  },
  {
    image: "/hero/banner4.webp",
    badge: "BEST SELLERS",
    title: "DOPPEY\nSIGNATURE",
    desc: "Designed for modern street culture.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroSection}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.slide} ${
            current === index ? styles.active : ""
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className={styles.heroImage}
          />

          <div className={styles.overlay}></div>

          <div className={styles.heroContent}>
            <span className={styles.badge}>
              {slide.badge}
            </span>

            <h1>
              {slide.title
                .split("\n")
                .map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
            </h1>

            <p>{slide.desc}</p>

            <button className={styles.heroBtn}>
              SHOP NOW
            </button>
          </div>
        </div>
      ))}

      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={
              current === index
                ? styles.activeDot
                : styles.dot
            }
          />
        ))}
      </div>
    </section>
  );
}