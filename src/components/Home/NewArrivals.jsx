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
  sortNewestFirst,
} from "@/utils/productHelpers";

import styles from "../../styles/NewArrivals.module.css";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products/public");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
        setProducts(productsData);
      }
    };

    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    loadProducts();
  }, []);

  const newArrivals = useMemo(
    () =>
      sortNewestFirst(
        products.filter((product) =>
          productMatchesPage(product, "new-arrivals")
        )
      ).slice(0, 10),
    [products]
  );

  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <div>
          <h2>NEW ARRIVALS</h2>
          <p>Latest Fashion Collection</p>
        </div>

        <Link href="/new-arrivals" className={styles.viewAll}>
          View All
        </Link>
      </div>

      {newArrivals.length ? (
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {newArrivals.map((product) => (
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
        <p className={styles.emptyText}>New products are coming soon.</p>
      )}
    </section>
  );
}
