"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import styles from "../../styles/ReviewSection.module.css";

export default function ReviewSection() {
  const reviews = [
    {
      name: "Aarav Sharma",
      image: "/products/product-three.jpg",
      rating: 5,
      review:
        "Amazing quality. The oversized fit is exactly what I wanted. The fabric feels premium and looks great after multiple washes.",
    },
    {
      name: "Priya Singh",
      image: "/products/product-three.jpg",
      rating: 5,
      review:
        "Fabric feels premium and delivery was super fast. Packaging was excellent and the fit was perfect.",
    },
    {
      name: "Rohan Mehta",
      image: "/products/product-three.jpg",
      rating: 5,
      review:
        "Best streetwear brand I've purchased from recently. The quality exceeded my expectations.",
    },
    {
      name: "Ananya Gupta",
      image: "/products/product-three.jpg",
      rating: 5,
      review:
        "The fit and quality exceeded my expectations. Definitely purchasing again.",
    },
    {
      name: "Karan Verma",
      image: "/products/product-three.jpg",
      rating: 5,
      review:
        "Loved the packaging and premium feel. Every detail feels carefully designed.",
    },
    {
      name: "Neha Kapoor",
      image: "/products/product-three.jpg",
      rating: 5,
      review:
        "Will definitely order again from Doppey. Great customer support and amazing products.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span>REAL CUSTOMER STORIES</span>

        <div className={styles.ratingSummary}>
          ⭐⭐⭐⭐⭐ <strong>4.8/5 Rating</strong>
        </div>

        <p className={styles.reviewCount}>
          Based on 12,000+ Reviews
        </p>

        <h2>WHAT OUR CUSTOMERS SAY</h2>
      </div>

      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className={styles.card}>
              <Image
                src={review.image}
                alt={review.name}
                width={500}
                height={500}
                className={styles.image}
              />

              <div className={styles.content}>
                <Quote
                  size={28}
                  className={styles.quote}
                />

                <div className={styles.stars}>
                  {[...Array(review.rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill="currentColor"
                      />
                    )
                  )}
                </div>

                <h4>{review.name}</h4>

                <span className={styles.verified}>
                  ✓ Verified Buyer
                </span>

                <p
                  className={styles.reviewText}
                  title={review.review}
                >
                  {review.review}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}