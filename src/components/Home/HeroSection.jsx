"use client";
import { useEffect } from "react";
import Image from "next/image";
import styles from "../../styles/HeroSection.module.css";

export default function HeroSection() {
  // ✅ Bootstrap JS should load only on client
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const slides = [
    {
      img: "/home/hero4.png",
      title: "Empower Your Future",
      desc: "Join top online programs designed for career success",
      btn: "Explore Now",
    },
    {
      img: "/home/hero4.png",
      title: "Learn Anytime, Anywhere",
      desc: "Flexible courses tailored to your schedule",
      btn: "Get Started",
    },
    {
      img: "/home/hero4.png",
      title: "Trusted by Thousands",
      desc: "Take the next step in your education journey",
      btn: "Enroll Today",
    },
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
            className={`carousel-item ${index === 0 ? "active" : ""} ${
              styles.carouselItem
            }`}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                priority
                className={styles.heroImage}
              />
            </div>
            <div className={`carousel-caption ${styles.caption}`}>
              <h2>{slide.title}</h2>
              <p>{slide.desc}</p>
              <button className="btn btn-primary">{slide.btn}</button>
            </div>
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
