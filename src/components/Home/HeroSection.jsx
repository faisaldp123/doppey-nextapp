"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import API from "@/utils/api";
import styles from "../../styles/HeroSection.module.css";

export default function HeroSection() {
  const [banners, setBanners]   = useState([]);
  const [current, setCurrent]   = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await API.get("/banners/public");

      const slides = [];

      res.data.forEach((banner) => {
        const images = isMobile
          ? (banner.mobileImages || [])
          : (banner.desktopImages || []);

        images.forEach((img) => {
          slides.push({
            _id: `${banner._id}-${img.url}`,
            type: "image",
            url: img.url,
            href: img.href || "/shop",
          });
        });

        if (banner.video) {
          slides.push({
            _id: `${banner._id}-video`,
            type: "video",
            url: banner.video,
            href: banner.videoHref || "/shop",
          });
        }
      });

      setBanners(slides);
    } catch (err) {
      console.error(err);
    }
  };

  fetchBanners();
}, [isMobile]);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, [banners]);

  if (!mounted || banners.length === 0) {
    return <div className={styles.heroPlaceholder} />;
  }

  return (
    <section className={styles.heroSection}>
     {banners.map((slide, index) => (
  <div
    key={slide._id}
    className={`${styles.slide} ${
      current === index ? styles.active : ""
    }`}
  >
    {slide.type === "video" ? (
      <>
        <video
          src={slide.url}
          autoPlay
          muted
          loop
          playsInline
          className={styles.heroVideo}
        />
        <Link
          href={slide.href}
          className={styles.slideLink}
        />
      </>
    ) : (
      <>
        <Image
          src={slide.url}
          alt={`Banner ${index + 1}`}
          fill
          priority={index === 0}
          sizes="100vw"
          className={styles.heroImage}
        />
        <Link
          href={slide.href}
          className={styles.slideLink}
        />
      </>
    )}
  </div>
))}

      <div className={styles.dots}>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={current === index ? styles.activeDot : styles.dot}
          />
        ))}
      </div>
    </section>
  );
}