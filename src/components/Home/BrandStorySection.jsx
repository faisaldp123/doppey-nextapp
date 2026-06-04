"use client";

import Image from "next/image";
import styles from "../../styles/BrandStorySection.module.css";

export default function BrandStorySection() {
  return (
    <section className={styles.section}>
      <div className={styles.imageSide}>
        <Image
          src="/products/product-seven.jpg"
          alt="Doppey Brand Story"
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.contentSide}>
        <span className={styles.subtitle}>
          OUR STORY
        </span>

        <h2>
          Fashion That Feels Like You
        </h2>

        <p>
          At Doppey, we believe fashion is
          more than clothing. It's a way to
          express confidence, creativity and
          individuality.
        </p>

        <p>
          Every collection is designed with
          modern lifestyles in mind — premium
          fabrics, relaxed silhouettes and
          timeless streetwear aesthetics.
        </p>

        <p>
          From oversized essentials to
          statement pieces, we create apparel
          that blends comfort with style.
        </p>

        <button>
          EXPLORE OUR STORY
        </button>
      </div>
    </section>
  );
}