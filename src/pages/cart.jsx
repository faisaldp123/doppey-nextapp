"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/Cart.module.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product One",
      image: "/products/product-one.jpg",
      price: 25,
      quantity: 1,
    },
    {
      id: 2,
      name: "Product Two",
      image: "/products/product-two.jpg",
      price: 40,
      quantity: 2,
    },
  ]);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  return (
    <div className={styles.cartPage}>
      <h1>My Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cartContainer}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className={styles.productImage}
                />
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <div className={styles.quantity}>
                    <label>Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                    />
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            <p>
              Subtotal: <span>${subtotal.toFixed(2)}</span>
            </p>
            <p>
              Shipping: <span>${shipping.toFixed(2)}</span>
            </p>
            <h3>
              Total: <span>${total.toFixed(2)}</span>
            </h3>
            <button className={styles.checkoutBtn}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
