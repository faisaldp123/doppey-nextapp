"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  ShoppingBag,
  Eye,
} from "lucide-react";

import styles from "../../styles/PruductCard.module.css";

export default function ProductCard({
  product,
  wishlist,
  setWishlist,
  onQuickView,
}) {
  const [hovered, setHovered] =
    useState(false);

  const isWishlisted =
    wishlist?.some(
      (item) => item.id === product.id
    );

  const toggleWishlist = () => {
    let updated = [...wishlist];

    const exists = updated.find(
      (item) => item.id === product.id
    );

    if (exists) {
      updated = updated.filter(
        (item) =>
          item.id !== product.id
      );
    } else {
      updated.push(product);
    }

    setWishlist(updated);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );
  };

  const addToCart = () => {
    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const exists = cart.find(
      (item) => item.id === product.id
    );

    if (exists) {
      alert(
        "Product already added to cart"
      );
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

    alert(
      `${product.name} added to cart`
    );
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
    >
      {/* IMAGE */}

      <div className={styles.imageWrapper}>
        <Link
          href={`/product/${product.id}`}
        >
          <Image
            src={
              hovered &&
              product.images?.[1]
                ? product.images[1]
                : product.image
            }
            alt={product.name}
            width={600}
            height={800}
            className={styles.image}
          />
        </Link>

        {/* WISHLIST */}

        <button
          className={styles.wishlistBtn}
          onClick={toggleWishlist}
        >
          <Heart
            size={18}
            fill={
              isWishlisted
                ? "#111"
                : "none"
            }
          />
        </button>

        {/* QUICK VIEW */}

        <button
          className={styles.quickViewBtn}
          onClick={() =>
            onQuickView(product)
          }
        >
          <Eye size={16} />
          Quick View
        </button>
      </div>

      {/* INFO */}

      <div className={styles.info}>
        <span className={styles.brand}>
          {product.brand}
        </span>

        <Link
          href={`/product/${product.id}`}
          className={styles.productLink}
        >
          <h3>{product.name}</h3>
        </Link>

        <div className={styles.priceRow}>
          <span className={styles.price}>
            ₹{product.price}
          </span>

          {product.discount > 0 && (
            <>
              <span
                className={
                  styles.oldPrice
                }
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
                className={
                  styles.discount
                }
              >
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>

        <button
          className={styles.quickAddBtn}
          onClick={addToCart}
        >
          <ShoppingBag size={16} />
          QUICK ADD
        </button>
      </div>
    </div>
  );
}