"use client";

import { useState, useEffect } from "react";
import styles from "../styles/Cart.module.css";
import { useRouter } from "next/router";
import {
  getCart,
  loadUserDataFromBackend,
  removeFromCart,
  updateCartQuantity,
} from "@/utils/shopState";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3C/svg%3E";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "https://doppey-admin-backend.onrender.com";

const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER;
  if (imagePath.startsWith("http")) return imagePath;
  return `${BACKEND_URL}/${imagePath}`;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const updateCart = () => {
      const formattedCart = getCart().map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCartItems(formattedCart);
    };

    const refreshCart = async () => {
      await loadUserDataFromBackend();
      updateCart();
    };

    refreshCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("user-login", refreshCart);

    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("user-login", refreshCart);
    };
  }, []);

  const getPriceNumber = (price) => {
    return Number(String(price).replace(/[^\d]/g, ""));
  };

  const getDiscountedPrice = (item) => {
    return item.discount
      ? Math.round(item.price - (item.price * item.discount) / 100)
      : getPriceNumber(item.price);
  };

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    const updated = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: qty } : item
    );
    setCartItems(updated);
    updateCartQuantity(id, qty);
  };

  const handleRemove = (id) => {
    const updated = removeFromCart(id);
    setCartItems(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + getDiscountedPrice(item) * item.quantity;
  }, 0);

  const shipping = cartItems.length > 0 ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <div className={styles.cartPage}>
      <div className={styles.heading}>
        <h1>Shopping Cart</h1>
        <span>{cartItems.reduce((total, item) => total + item.quantity, 0)} Items</span>
      </div>

      <div className={styles.checkoutSteps}>
        <div className={styles.activeStep}><span>1</span> Cart</div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}><span>2</span> Checkout</div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}><span>3</span> Complete</div>
      </div>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <h2>Your Cart Is Empty</h2>
          <p>Looks like you haven't added any products yet.</p>
          <button onClick={() => router.push("/")}>Continue Shopping</button>
        </div>
      ) : (
        <div className={styles.cartContainer}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item._id} className={styles.cartItem}>

                <div className={styles.imageWrapper}>
                  <img
                    src={getImageUrl(item.images?.[0] || item.img1 || item.image)}
                    alt={item.name}
                    width={300}
                    height={400}
                    className={styles.productImage}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>

                  <p className={styles.price}>
                    ₹{getDiscountedPrice(item).toLocaleString("en-IN")}
                    {item.discount > 0 && (
                      <del style={{ marginLeft: "8px", color: "#999", fontSize: "13px" }}>
                        ₹{item.price.toLocaleString("en-IN")}
                      </del>
                    )}
                    {item.discount > 0 && (
                      <span style={{ marginLeft: "8px", color: "green", fontSize: "12px", fontWeight: 600 }}>
                        {item.discount}% off
                      </span>
                    )}
                  </p>

                  <div className={styles.quantityBox}>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  ₹{(getDiscountedPrice(item) * item.quantity).toLocaleString("en-IN")}
                </div>

              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Order Summary</h2>

            <div className={styles.shippingProgress}>
              <p>
                {subtotal >= 3000
                  ? "🎉 You unlocked FREE Shipping!"
                  : `Add ₹${(3000 - subtotal).toLocaleString()} more for FREE Shipping`}
              </p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.min((subtotal / 3000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>₹{shipping.toLocaleString("en-IN")}</span>
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <div className={styles.trustBadges}>
              <div>✓ Secure Checkout</div>
              <div>✓ Easy Returns</div>
              <div>✓ Cash On Delivery</div>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => router.push("/checkout")}
            >
              Proceed To Checkout
            </button>

            <p className={styles.secureText}>🔒 100% Secure Checkout</p>
          </div>
        </div>
      )}
    </div>
  );
}
