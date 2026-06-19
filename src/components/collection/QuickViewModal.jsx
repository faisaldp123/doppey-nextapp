"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Heart, ShoppingBag } from "lucide-react";

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

    if (url.startsWith("http")) {
      return url;
    }

    if (url.startsWith("/")) {
      return `${BASE_URL}${url}`;
    }

    return `${BASE_URL}/${url}`;
  };

  const productImage = getImageUrl(
    product.images?.[0] || product.image
  );

  const isWishlisted = wishlist?.some(
    (item) => item._id === product._id
  );

  const toggleWishlist = () => {
    let updated = [...wishlist];

    const exists = updated.find(
      (item) => item._id === product._id
    );

    if (exists) {
      updated = updated.filter(
        (item) => item._id !== product._id
      );
    } else {
      updated.push(product);
    }

    setWishlist(updated);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("storage")
    );
  };

  const addToCart = () => {
    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const exists = cart.find(
      (item) => item._id === product._id
    );

    if (exists) {
      alert("Product already added to cart");
      return;
    }

    cart.push({
      ...product,
      quantity: 1,
    });

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("storage")
    );

    alert(`${product.name} added to cart`);
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
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
              ₹{product.price}
            </span>

            {product.discount > 0 && (
              <>
                <span
                  className={styles.oldPrice}
                >
                  ₹
                  {Math.round(
                    product.price /
                      (1 -
                        product.discount /
                          100)
                  )}
                </span>

                <span
                  className={styles.discount}
                >
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className={styles.description}>
            {product.description}
          </p>

          {product.sizes?.length > 0 && (
            <div
              className={
                styles.sizeSection
              }
            >
              <h4>
                Available Sizes
              </h4>

              <div
                className={
                  styles.sizeGrid
                }
              >
                {product.sizes.map(
                  (size) => (
                    <span
                      key={size}
                      className={
                        styles.size
                      }
                    >
                      {size}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          <div
            className={
              styles.actionButtons
            }
          >
            <button
              className={
                styles.cartBtn
              }
              onClick={addToCart}
            >
              <ShoppingBag size={18} />
              Add To Cart
            </button>

            <button
              className={
                styles.wishlistBtn
              }
              onClick={
                toggleWishlist
              }
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
            className={
              styles.viewDetails
            }
          >
            View Full Product →
          </Link>

          <div
            className={
              styles.trustBadges
            }
          >
            <div>✓ Secure Checkout</div>
            <div>✓ Easy Returns</div>
            <div>✓ COD Available</div>
          </div>
        </div>
      </div>
    </div>
  );
}