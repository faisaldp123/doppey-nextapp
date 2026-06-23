"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "../collection/ProductCard";
import API from "@/utils/api";
import { productsData } from "@/constant/productsData";
import {
  getProductId,
  productMatchesPage,
} from "@/utils/productHelpers";

import styles from "../../styles/ProductSection.module.css";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products/public");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch summer collection:", error);
        setProducts(productsData);
      }
    };

    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    loadProducts();
  }, []);

  const summerProducts = useMemo(
    () =>
      products
        .filter((product) =>
          productMatchesPage(product, "summer-collection")
        )
        .slice(0, 10),
    [products]
  );

  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <div>
          <h2>SUMMER COLLECTION</h2>
          <p>Lightweight styles for warm days</p>
        </div>

        <Link href="/summer-collection" className={styles.viewAll}>
          View All
        </Link>
      </div>

      {summerProducts.length ? (
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4.2 },
          }}
        >
          {summerProducts.map((product) => (
            <SwiperSlide key={getProductId(product)}>
              <ProductCard
                product={product}
                wishlist={wishlist}
                setWishlist={setWishlist}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className={styles.emptyText}>Summer products are coming soon.</p>
      )}
    </section>
  );
}
