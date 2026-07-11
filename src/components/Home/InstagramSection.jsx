"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";
import styles from "../../styles/InstagramSection.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const staticPosts = [
  { _id: "static-1", image: "/products/product-three.jpg", link: "https://instagram.com" },
  { _id: "static-2", image: "/products/product-two.jpg", link: "https://instagram.com" },
  { _id: "static-3", image: "/products/product-three.jpg", link: "https://instagram.com" },
  { _id: "static-4", image: "/products/product-one.jpg", link: "https://instagram.com" },
  { _id: "static-5", image: "/products/product-three.jpg", link: "https://instagram.com" },
];

export default function InstagramSection() {
  const [posts, setPosts] = useState(staticPosts);

  useEffect(() => {
    fetch(`${API_URL}/instagram-posts/public`)
      .then((res) => {
        if (!res.ok) throw new Error(`instagram-posts request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch((err) => console.error("InstagramSection fetch error:", err.message));
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span>@DOPPEYOFFICIAL</span>

        <h2>FOLLOW US ON INSTAGRAM</h2>

        <p>
          Discover daily inspiration, new arrivals,
          streetwear looks and community styles.
        </p>
      </div>

      <div className={styles.grid}>
        {posts.map((post, index) => (
          <a
            key={post._id}
            href={post.link || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <Image
              src={post.image}
              alt={`Instagram ${index + 1}`}
              fill
              className={styles.image}
            />

            <div className={styles.overlay}>
              <Instagram size={32} />
            </div>
          </a>
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.followBtn}
        >
          FOLLOW US →
        </a>
      </div>
    </section>
  );
}