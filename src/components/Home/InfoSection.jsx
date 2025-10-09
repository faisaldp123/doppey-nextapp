"use client";
import Image from "next/image";
import styles from "../../styles/InfoSection.module.css";

export default function InfoSection() {
  const features = [
    { img: "/features/shipping.png", title: "Free Shipping" },
    { img: "/features/online.png", title: "Online Order" },
    { img: "/features/money.png", title: "Save Money" },
    { img: "/features/promotions.png", title: "Promotions" },
    { img: "/features/sell.png", title: "Happy Sell" },
    { img: "/features/support.png", title: "24/7 Support" },
  ];

  return (
    <section id="feature" className={styles.section}>
      {features.map((feature, index) => (
        <div key={index} className={styles.feBox}>
          <Image
            src={feature.img}
            alt={feature.title}
            width={80}
            height={60}
            className={styles.featureImage}
          />
          <h6>{feature.title}</h6>
        </div>
      ))}
    </section>
  );
}
