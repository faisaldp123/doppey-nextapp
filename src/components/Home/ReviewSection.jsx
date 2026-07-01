"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import API from "@/utils/api";
import { productsData } from "@/constant/productsData";
import {
  getImageUrl,
  getProductId,
  getProductImages,
  getStoredReviews,
} from "@/utils/productHelpers";

import styles from "../../styles/ReviewSection.module.css";

const fallbackReviews = [
  {
    name: "Aarav Sharma",
    image: "/products/product-three.jpg",
    rating: 5,
    comment:
      "Amazing quality. The oversized fit is exactly what I wanted. The fabric feels premium and looks great after multiple washes.",
  },
  {
    name: "Priya Singh",
    image: "/products/product-three.jpg",
    rating: 5,
    comment:
      "Fabric feels premium and delivery was super fast. Packaging was excellent and the fit was perfect.",
  },
];

export default function ReviewSection() {
  const [products, setProducts] = useState([]);
  const [storedReviews, setStoredReviews] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products/public");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch review products:", error);
        setProducts(productsData);
      }
    };

    const refreshReviews = () => setStoredReviews(getStoredReviews());

    loadProducts();
    refreshReviews();
    window.addEventListener("product-reviews-updated", refreshReviews);

    return () =>
      window.removeEventListener("product-reviews-updated", refreshReviews);
  }, []);

  const reviews = useMemo(() => {
    const dynamicReviews = products.flatMap((product) => {
      const productReviews = [
        ...(product.reviews || product.customerReviews || []),
        ...(storedReviews[getProductId(product)] || []),
      ];

      return productReviews.map((review) => ({
        name: review.name || review.userName || "Verified Buyer",
        rating: Number(review.rating || 5),
        comment: review.comment || review.review || review.message || "",
        image: getImageUrl(getProductImages(product)[0]),
      }));
    });

    return dynamicReviews.filter((review) => review.comment).slice(-12).reverse();
  }, [products, storedReviews]);

  const visibleReviews = reviews.length ? reviews : fallbackReviews;
  const averageRating =
    visibleReviews.reduce((sum, review) => sum + Number(review.rating || 5), 0) /
    visibleReviews.length;

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span>REAL CUSTOMER STORIES</span>
        <div className={styles.ratingSummary}>
          <strong>{averageRating.toFixed(1)} ★ Rating</strong>
        </div>
        <p className={styles.reviewCount}>Based on {visibleReviews.length} Reviews</p>
        <h2>WHAT OUR CUSTOMERS SAY</h2>
      </div>

      <Swiper
        modules={[Autoplay]}
        loop={visibleReviews.length > 4}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          576: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {visibleReviews.map((review, index) => (
          <SwiperSlide key={`${review.name}-${index}`}>
  <div className={styles.card}>
    {/* Product image */}
    <div className={styles.productImage}>
      <Image
        src={review.image}
        alt={review.name}
        fill
        sizes="300px"
        className={styles.image}
      />
    </div>

    {/* Card content */}
    <div className={styles.content}>
      <div className={styles.stars}>
        {[...Array(Math.round(review.rating || 5))].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill="currentColor"
            stroke="none"
          />
        ))}
      </div>

      <p className={styles.reviewText}>
        "{review.comment}"
      </p>

      <div className={styles.footer}>
        <div>
          <h4>{review.name}</h4>
          <span className={styles.verified}>
            ✓ Verified Buyer
          </span>
        </div>
      </div>
    </div>
  </div>
</SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}