"use client";

import {
  FaAward,
  FaUndo,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

import styles from "@/styles/TrustFeatures.module.css";

export default function TrustFeatures() {
  const features = [
    {
      icon: <FaAward />,
      title: "PREMIUM QUALITY",
      // subtitle: "Finest materials",
    },
    {
      icon: <FaUndo />,
      title: "EASY RETURNS",
      // subtitle: "Hassle free returns",
    },
    {
      icon: <FaShieldAlt />,
      title: "SECURE PAYMENTS",
      // subtitle: "100% safe & secure",
    },
    {
      icon: <FaHeadset />,
      title: "CUSTOMER SUPPORT",
      // subtitle: "We're here to help",
    },
  ];

  return (
    <section className={styles.wrapper}>
      <div className="container">
        <div className={styles.card}>
          {features.map((item, index) => (
            <div
              key={index}
              className={`${styles.item} ${
                index !== features.length - 1 ? styles.border : ""
              }`}
            >
              <div className={styles.icon}>
                {item.icon}
              </div>

              <div>
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}