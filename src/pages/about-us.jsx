"use client";
import Link from "next/link";
import styles from "../styles/About.module.css";

export default function AboutPage() {
  return (
    <section className={styles.about}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>About Doppey</h1>
          <p>Where style meets comfort — redefining everyday fashion.</p>
        </div>
      </div>

      {/* Our Story */}
      <div className={styles.container}>
        <div className={styles.storySection}>
          <div className={styles.text}>
            <h2>Our Story</h2>
            <p>
              Founded in <strong>India</strong>, <strong>Doppey</strong> was born from a simple idea — 
              to make fashion expressive, comfortable, and accessible to everyone. 
              We started with a passion for clean designs, high-quality fabrics, 
              and the belief that what you wear should reflect who you are.
            </p>
            <p>
              Every Doppey piece is crafted with attention to detail and individuality. 
              From minimal streetwear to bold seasonal drops, our collections 
              are inspired by youth culture, creativity, and confidence.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className={styles.missionSection}>
          <div className={styles.text}>
            <h2>Our Mission</h2>
            <p>
              Our mission is to empower people to express themselves through 
              effortless fashion. Doppey stands for freedom, inclusivity, and 
              confidence — whether you’re chilling at home, heading out, or 
              making moves in the city.
            </p>
            <p>
              We’re committed to sustainability and ethical production. 
              Our team constantly explores new ways to reduce waste and 
              bring responsibly made apparel that looks good and feels even better.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className={styles.values}>
          <h2>What We Believe In</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>Authenticity</h3>
              <p>Every Doppey product represents real people, real stories, and genuine creativity.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Comfort</h3>
              <p>We design with wearability in mind — premium fabrics that move with you.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Community</h3>
              <p>We’re more than a brand — we’re a culture of dreamers, doers, and creators.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h2>Join the Doppey Movement</h2>
          <p>Follow us on social media, explore our latest drops, and be part of the Doppey community.</p>
          <Link href="/mens" className={styles.shopBtn}>
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
