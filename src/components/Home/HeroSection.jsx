"use client";
import { useEffect } from "react";
import styles from "../../styles/HeroSection.module.css";
import Image from "next/image";

export default function HeroSection() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const slides = [
    { img: "/hero/first.jpg" },
    { img: "/hero/second.jpg" },
    { img: "/hero/third.jpg" },
  ];

  return (
    <div
      id="heroCarousel"
      className={`carousel slide ${styles.heroSection}`}
      data-bs-ride="carousel"
      data-bs-interval="4000"
    >
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <Image
            width={1600}
            height={500}
              src={slide.img}
              alt=""
              className={`${styles.heroImage} h-auto w-100`}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className={`carousel-control-prev ${styles.arrowBtn}`}
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button
        className={`carousel-control-next ${styles.arrowBtn}`}
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
}
