"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/BrandStorySection.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const staticStory = {
  _id: "static-1",
  subtitle: "OUR STORY",
  heading: "Fashion That Feels Like You",
  paragraphOne:
    "At Doppey, we believe fashion is more than clothing. It's a way to express confidence, creativity and individuality.",
  paragraphTwo:
    "Every collection is designed with modern lifestyles in mind — premium fabrics, relaxed silhouettes and timeless streetwear aesthetics.",
  paragraphThree:
    "From oversized essentials to statement pieces, we create apparel that blends comfort with style.",
  buttonText: "EXPLORE OUR STORY",
  buttonLink: "/",
  image: "/products/product-seven.jpg",
};

export default function BrandStorySection() {
  const [story, setStory] = useState(staticStory);

  useEffect(() => {
    fetch(`${API_URL}/brand-story/public`)
      .then((res) => {
        if (!res.ok) throw new Error(`brand-story request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStory(data[0]);
        }
      })
      .catch((err) => console.error("BrandStorySection fetch error:", err.message));
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.imageSide}>
        <Image
          src={story.image}
          alt={story.heading || "Doppey Brand Story"}
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.contentSide}>
        {story.subtitle && <span className={styles.subtitle}>{story.subtitle}</span>}

        {story.heading && <h2>{story.heading}</h2>}

        {story.paragraphOne && <p>{story.paragraphOne}</p>}
        {story.paragraphTwo && <p>{story.paragraphTwo}</p>}
        {story.paragraphThree && <p>{story.paragraphThree}</p>}

        <Link href={story.buttonLink || "/"}>
          <button>{story.buttonText || "EXPLORE"}</button>
        </Link>
      </div>
    </section>
  );
}