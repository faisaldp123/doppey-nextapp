"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Heart, ShoppingBag } from "lucide-react";

import {
  addToCart as addProductToCart,
  toggleWishlist as toggleProductWishlist,
} from "@/utils/shopState";

import { getProductId } from "@/utils/productHelpers";

import styles from "../../styles/QuickViewModal.module.css";

export default function QuickViewModal({
  product,
  onClose,
  wishlist,
  setWishlist,
}) {
  if (!product) return null;

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "https://doppey-admin-backend.onrender.com";

  const getImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";

    if (url.startsWith("http")) return url;

    if (url.startsWith("/")) {
      return `${BASE_URL}${url}`;
    }

    return `${BASE_URL}/${url}`;
  };

  // SAME LOGIC AS PRODUCT DETAIL PAGE
  const originalPrice = Number(product.price || 0);

  const discountedPrice =
    product.discount > 0
      ? Math.round(
          originalPrice -
            (originalPrice * product.discount) / 100
        )
      : originalPrice;

  const productImage = getImageUrl(
    product.images?.[0] || product.image
  );

  const isWishlisted = wishlist?.some(
    (item) => getProductId(item) === getProductId(product)
  );

  const handleWishlist = () => {
    const { wishlist: updated } =
      toggleProductWishlist(product);

    setWishlist(updated);
  };

  const addToCart = () => {
    addProductToCart(product, 1);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className={styles.left}>
          <Image
            src={productImage}
            alt={product.name}
            width={700}
            height={900}
            className={styles.image}
          />
        </div>

        <div className={styles.right}>
          <span className={styles.brand}>
            {product.brand}
          </span>

          <h2>{product.name}</h2>

          <div className={styles.rating}>
            ⭐ {product.rating || 5}
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>
              ₹{discountedPrice.toLocaleString("en-IN")}
            </span>

            {product.discount > 0 && (
              <>
                <span className={styles.oldPrice}>
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>

                <span className={styles.discount}>
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className={styles.description}>
            {product.description}
          </p>

          {product.sizes?.length > 0 && (
            <div className={styles.sizeSection}>
              <h4>Available Sizes</h4>

              <div className={styles.sizeGrid}>
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className={styles.size}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actionButtons}>
            <button
              className={styles.cartBtn}
              onClick={addToCart}
            >
              <ShoppingBag size={18} />
              Add To Cart
            </button>

            <button
              className={styles.wishlistBtn}
              onClick={handleWishlist}
            >
              <Heart
                size={18}
                fill={
                  isWishlisted
                    ? "#111"
                    : "none"
                }
              />
              Wishlist
            </button>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className={styles.viewDetails}
          >
            View Full Product →
          </Link>

          <div className={styles.trustBadges}>
            <div>✓ Secure Checkout</div>
            <div>✓ Easy Returns</div>
            <div>✓ COD Available</div>
          </div>
        </div>
      </div>
    </div>
  );
}