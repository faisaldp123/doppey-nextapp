"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Heart } from "lucide-react";
import styles from "../styles/Wishlist.module.css";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] =
    useState([]);

  useEffect(() => {
    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    setWishlistItems(wishlist);
  }, []);

  const handleRemove = (id) => {
    const updated =
      wishlistItems.filter(
        (item) => item.id !== id
      );

    setWishlistItems(updated);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("storage")
    );
  };

  const handleAddToCart = (item) => {
    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const exists = cart.find(
      (product) =>
        product.id === item.id
    );

    if (!exists) {
      cart.push({
        ...item,
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
        `${item.name} added to cart`
      );
    } else {
      alert(
        "Product already in cart"
      );
    }
  };

  return (
    <div
      className={styles.wishlistPage}
    >
      <div
        className={styles.container}
      >
        <div
          className={styles.header}
        >
          <h1>My Wishlist</h1>

          <span>
            {wishlistItems.length} Item
            {wishlistItems.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div
            className={
              styles.emptyWishlist
            }
          >
            <Heart size={60} />

            <h2>
              Your Wishlist Is Empty
            </h2>

            <p>
              Save your favourite
              products here and shop
              later.
            </p>

            <Link href="/">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div
            className={
              styles.wishlistGrid
            }
          >
            {wishlistItems.map(
              (item) => (
                <div
                  key={item.id}
                  className={
                    styles.productCard
                  }
                >
                  <div
                    className={
                      styles.imageWrapper
                    }
                  >
                    <Image
                      src={
                        item.img1 ||
                        item.img
                      }
                      alt={item.name}
                      width={350}
                      height={450}
                      className={
                        styles.productImage
                      }
                    />

                    <button
                      className={
                        styles.removeBtn
                      }
                      onClick={() =>
                        handleRemove(
                          item.id
                        )
                      }
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div
                    className={
                      styles.productInfo
                    }
                  >
                    <h3>
                      {item.name}
                    </h3>

                    <div
                      className={
                        styles.priceBox
                      }
                    >
                      <span>
                        {item.price}
                      </span>

                      {item.oldPrice && (
                        <del>
                          {
                            item.oldPrice
                          }
                        </del>
                      )}
                    </div>

                    <button
                      className={
                        styles.cartBtn
                      }
                      onClick={() =>
                        handleAddToCart(
                          item
                        )
                      }
                    >
                      <ShoppingBag
                        size={18}
                      />
                      Move To Cart
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}