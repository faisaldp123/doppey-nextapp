"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  ShoppingBag,
  Eye,
} from "lucide-react";

import {
  getImageUrl,
  getProductId,
  getProductImages,
  getProductSlug,
} from "@/utils/productHelpers";
import {
  addToCart as addProductToCart,
  toggleWishlist as toggleProductWishlist,
} from "@/utils/shopState";

import styles from "../../styles/PruductCard.module.css";

// ← Calculate discounted price correctly
const getDiscountedPrice = (product) => {
  const base = Number(product.price) || 0;
  return product.discount
    ? Math.round(base - (base * product.discount) / 100)
    : base;
};

export default function ProductCard({
  product,
  wishlist,
  setWishlist,
  onQuickView,
}) {
  const [hovered, setHovered] = useState(false);

  const productId   = getProductId(product);
  const productSlug = getProductSlug(product);
  const images      = getProductImages(product);
  const image1      = getImageUrl(images[0]);
  const image2      = getImageUrl(images[1] || images[0]);

  const discountedPrice = getDiscountedPrice(product);
  const originalPrice   = Number(product.price) || 0;
  const hasDiscount     = product.discount > 0;

  const isWishlisted = wishlist?.some(
    (item) => getProductId(item) === productId
  );

  const toggleWishlist = () => {
    const { wishlist: updated } = toggleProductWishlist(product);
    setWishlist(updated);
  };

  const addToCart = () => {
    addProductToCart(product, 1);
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div className={styles.imageWrapper}>
        <Link href={`/product/${productSlug}`}>
          <Image
            src={hovered ? image2 : image1}
            alt={product.name}
            width={600}
            height={800}
            className={styles.image}
          />
        </Link>

        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <span className={styles.discountBadge}>
            {product.discount}% OFF
          </span>
        )}

        {/* WISHLIST */}
        <button className={styles.wishlistBtn} onClick={toggleWishlist}>
          <Heart
            size={18}
            fill={isWishlisted ? "#111" : "none"}
          />
        </button>

        {/* QUICK VIEW */}
        <button
          className={styles.quickViewBtn}
          onClick={() => onQuickView?.(product)}
        >
          <Eye size={16} />
          Quick View
        </button>
      </div>

      {/* INFO */}
      <div className={styles.info}>
        <span className={styles.brand}>{product.brand}</span>

        <Link href={`/product/${productSlug}`} className={styles.productLink}>
          <h3>{product.name}</h3>
        </Link>

        <div className={styles.priceRow}>

          {/* ← Shows discounted price */}
          <span className={styles.price}>
            ₹{discountedPrice.toLocaleString("en-IN")}
          </span>

          {/* ← Shows original price with strikethrough only if discount exists */}
          {hasDiscount && (
            <span className={styles.oldPrice}>
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}

          {hasDiscount && (
            <span className={styles.discount}>
              {product.discount}% OFF
            </span>
          )}

        </div>

        <button className={styles.quickAddBtn} onClick={addToCart}>
          <ShoppingBag size={16} />
          QUICK ADD
        </button>
      </div>
    </div>
  );
}