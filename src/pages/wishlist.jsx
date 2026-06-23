"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Heart } from "lucide-react";
import styles from "../styles/Wishlist.module.css";
import {
  addToCart as addProductToCart,
  getWishlist,
  toggleWishlist as toggleProductWishlist,
} from "@/utils/shopState";
import { getImageUrl, getProductId } from "@/utils/productHelpers";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] =
    useState([]);

  useEffect(() => {
    setWishlistItems(getWishlist());
  }, []);

  const handleRemove = (item) => {
    const { wishlist: updated } = toggleProductWishlist(item);
    setWishlistItems(updated);
  };

  const handleAddToCart = (item) => {
    addProductToCart(item, 1);
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
                  key={getProductId(item)}
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
                        getImageUrl(item.images?.[0] || item.img1 || item.img)
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
                          item
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
