"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/ShopCategories.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const staticCategories = [
  { _id: "static-1", title: "ALL", image: "/products/product-one.jpg", link: "/" },
  { _id: "static-2", title: "MEN", image: "/products/product-two.jpg", link: "/" },
  { _id: "static-3", title: "WOMEN", image: "/products/product-three.jpg", link: "/" },
  { _id: "static-4", title: "KIDS", image: "/products/product-four.jpg", link: "/" },
];

export default function ShopCategories() {
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    fetch(`${API_URL}/shop-categories/public`)
      .then((res) => {
        if (!res.ok) throw new Error(`shop-categories request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("ShopCategories fetch error:", err.message));
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>SHOP BY CATEGORY</h2>
        <p>Explore the latest collections</p>
      </div>

      <div className={styles.grid}>
        {categories.map((item) => (
          <Link href={item.link || "/"} className={styles.card} key={item._id}>
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={700}
              className={styles.image}
            />

            <div className={styles.overlay}>
              <h3>{item.title}</h3>
              <button>SHOP NOW</button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}