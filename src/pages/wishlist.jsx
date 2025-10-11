"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X } from "lucide-react";
import styles from "../styles/Wishlist.module.css"; // create this CSS file

export default function Wishlist() {
  const wishlistItems = [
    {
      id: 1,
      name: "Blue T-Shirt",
      price: 499,
      img: "/products/product-one.jpg",
    },
    {
      id: 2,
      name: "Red Dress",
      price: 799,
      img: "/products/product-eight.jpg",
    },
    {
      id: 3,
      name: "Kids Shorts",
      price: 299,
      img: "/products/product-two.jpg",
    },
  ];

  const handleRemove = (id) => {
    alert(`Remove item with id ${id}`);
  };

  const handleAddToCart = (id) => {
    alert(`Add item with id ${id} to cart`);
  };

  return (
    <div className={styles.wishlistContainer}>
      <h2>My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>
          Your wishlist is empty. <Link href="/">Shop now!</Link>
        </p>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlistItems.map((item) => (
            <div key={item.id} className={styles.productCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.img}
                  alt={item.name}
                  width={250}
                  height={300}
                  className={styles.productImage}
                />
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.id)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className={styles.productInfo}>
                <h3>{item.name}</h3>
                <p className={styles.price}>₹{item.price}</p>
                <button
                  className={styles.cartBtn}
                  onClick={() => handleAddToCart(item.id)}
                >
                  <ShoppingBag size={16} className="me-1" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
