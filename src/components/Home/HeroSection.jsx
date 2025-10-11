"use client";
import { useEffect } from "react";
import Image from "next/image";
import styles from "../../styles/HeroSection.module.css";

export default function HeroSection() {
  // ✅ Bootstrap JS should load only on client
  useEffect(() => {
  import("bootstrap/dist/js/bootstrap.bundle.min.js").then(() => {
    // Force a reflow
    const carousel = document.getElementById("heroCarousel");
    if (carousel) {
      carousel.offsetHeight; // read to trigger reflow
    }
  });
}, []);

  const slides = [
    {
      img: "/hero/first.jpg",
      // title: "Empower Your Future",
      // desc: "Join top online programs designed for career success",
      // btn: "Explore Now",
    },
    {
      img: "/hero/second.jpg",
      // title: "Learn Anytime, Anywhere",
      // desc: "Flexible courses tailored to your schedule",
      // btn: "Get Started",
    },
    {
      img: "/hero/third.jpg",
      // title: "Trusted by Thousands",
      // desc: "Take the next step in your education journey",
      // btn: "Enroll Today",
    }
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
  alt={slide.title || ""}
  width={1920}  // actual image width
  height={1080} // actual image height
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
            </div>
            {/* <div className={`carousel-caption ${styles.caption}`}>
              <h2>{slide.title}</h2>
              <p>{slide.desc}</p>
              <button className="btn btn-primary">{slide.btn}</button>
            </div> */}
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
