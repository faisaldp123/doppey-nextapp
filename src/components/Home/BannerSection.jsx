"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/BannerSection.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const staticBanner = {
  _id: "static-1",
  subtitle: "Winter Sale",
  title: 'Up to <span>70% Off</span> – All T-Shirts & Accessories',
  buttonText: "Explore More",
  buttonLink: "/",
  backgroundImage: null,
};

export default function BannerSection() {
  const [banner, setBanner] = useState(staticBanner);

  useEffect(() => {
    fetch(`${API_URL}/promo-banners/public`)
      .then((res) => {
        if (!res.ok) throw new Error(`promo-banners request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanner(data[0]);
        }
      })
      .catch((err) => console.error("BannerSection fetch error:", err.message));
  }, []);

  const isStatic = banner._id === "static-1";

  return (
    <section
      className={styles.banner}
      style={
        banner.backgroundImage
          ? { backgroundImage: `url(${banner.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {banner.subtitle && <h4>{banner.subtitle}</h4>}

      {isStatic ? (
        <h2 dangerouslySetInnerHTML={{ __html: banner.title }} />
      ) : (
        banner.title && <h2>{banner.title}</h2>
      )}

      <Link href={banner.buttonLink || "/"}>
        <button className={styles.normal}>{banner.buttonText || "Explore More"}</button>
      </Link>
    </section>
  );
}