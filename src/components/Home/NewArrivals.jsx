"use client";

import Image from "next/image";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "../../styles/NewArrivals.module.css";

export default function NewArrivals() {
const products = [
{
img1: "/products/product-one.jpg",
img2: "/products/product-two.jpg",
name: "Oversized Graphic Tee",
rating: 4.8,
reviews: 245,
salePrice: "₹899",
originalPrice: "₹1499",
discount: "40% OFF",
badge: "BESTSELLER",
},
{
img1: "/products/product-three.jpg",
img2: "/products/product-four.jpg",
name: "Premium Hoodie",
rating: 4.7,
reviews: 183,
salePrice: "₹1499",
originalPrice: "₹2299",
discount: "35% OFF",
badge: "NEW",
},
{
img1: "/products/product-five.jpg",
img2: "/products/product-six.jpg",
name: "Streetwear Sweatshirt",
rating: 4.9,
reviews: 312,
salePrice: "₹1199",
originalPrice: "₹1899",
discount: "37% OFF",
badge: "TRENDING",
},
{
img1: "/products/product-seven.jpg",
img2: "/products/product-eight.jpg",
name: "Urban Fit Tee",
rating: 4.6,
reviews: 165,
salePrice: "₹799",
originalPrice: "₹1299",
discount: "38% OFF",
badge: "SALE",
},
{
img1: "/products/product-one.jpg",
img2: "/products/product-two.jpg",
name: "Classic Hoodie",
rating: 4.8,
reviews: 220,
salePrice: "₹1399",
originalPrice: "₹1999",
discount: "30% OFF",
badge: "NEW",
},
];

return ( <section className={styles.section}> <h2>NEW ARRIVALS</h2> <p>Latest Fashion Collection</p>

  <Swiper
    modules={[Navigation, Autoplay]}
    navigation
    autoplay={{
      delay: 3500,
      disableOnInteraction: false,
    }}
    spaceBetween={20}
    breakpoints={{
      0: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    }}
  >
    {products.map((product, index) => (
      <SwiperSlide key={index}>
        <ProductCard product={product} />
      </SwiperSlide>
    ))}
  </Swiper>
</section>

);
}

function ProductCard({ product }) {
const [hover, setHover] = useState(false);

return (
<div
className={styles.pro}
onMouseEnter={() => setHover(true)}
onMouseLeave={() => setHover(false)}
> <div className={styles.imageWrapper}> <span className={styles.badge}>
{product.badge} </span>

    <Image
      src={hover ? product.img2 : product.img1}
      alt={product.name}
      width={600}
      height={700}
      quality={100}
      className={styles.proImg}
    />

    <button className={styles.quickBtn}>
      QUICK VIEW
    </button>
  </div>

  <div className={styles.des}>
    <h5>{product.name}</h5>

    <div className={styles.rating}>
      ⭐ {product.rating}
      <span>
        ({product.reviews} Reviews)
      </span>
    </div>

    <div className={styles.priceRow}>
      <span className={styles.salePrice}>
        {product.salePrice}
      </span>

      <span className={styles.originalPrice}>
        {product.originalPrice}
      </span>

      <span className={styles.discount}>
        {product.discount}
      </span>
    </div>
  </div>
</div>

);
}
