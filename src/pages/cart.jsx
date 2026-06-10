"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/Cart.module.css";
import { useRouter } from "next/router";

export default function Cart() {
const [cartItems, setCartItems] = useState([]);
const router = useRouter();

useEffect(() => {
const cart =
JSON.parse(localStorage.getItem("cart")) || [];


const formattedCart = cart.map((item) => ({
  ...item,
  quantity: item.quantity || 1,
}));

setCartItems(formattedCart);


}, []);

const getPriceNumber = (price) => {
return Number(
String(price).replace(/[^\d]/g, "")
);
};

const handleQuantityChange = (id, qty) => {
if (qty < 1) return;

const updated = cartItems.map((item) =>
  item.id === id
    ? { ...item, quantity: qty }
    : item
);

setCartItems(updated);

localStorage.setItem(
  "cart",
  JSON.stringify(updated)
);

window.dispatchEvent(
  new Event("storage")
);

};

const handleRemove = (id) => {
  const updated =
    cartItems.filter(
      (item) => item.id !== id
    );

  setCartItems(updated);

  localStorage.setItem(
    "cart",
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new Event("storage")
  );
};

const subtotal = cartItems.reduce(
(acc, item) =>
acc +
getPriceNumber(item.price) *
item.quantity,
0
);

const shipping =
cartItems.length > 0 ? 99 : 0;

const total = subtotal + shipping;

return ( <div className={styles.cartPage}> 
<div className={styles.heading}>
  <h1>Shopping Cart</h1>

  <span>
  {cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  )} Items
</span>
</div>

<div className={styles.checkoutSteps}>
  <div className={styles.activeStep}>
    <span>1</span>
    Cart
  </div>

  <div className={styles.stepLine}></div>

  <div className={styles.step}>
    <span>2</span>
    Checkout
  </div>

  <div className={styles.stepLine}></div>

  <div className={styles.step}>
    <span>3</span>
    Complete
  </div>
</div>

  {cartItems.length === 0 ? (
    <div className={styles.emptyCart}>
      <h2>Your Cart Is Empty</h2>

      <p>
        Looks like you haven't added
        any products yet.
      </p>

      <button
  onClick={() => router.push("/")}
>
  Continue Shopping
</button>
    </div>
  ) : (
    <div className={styles.cartContainer}>
      <div className={styles.cartItems}>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className={styles.cartItem}
          >
            <div
              className={
                styles.imageWrapper
              }
            >
              <Image
  src={item.img1 || item.image}
  alt={item.name}
  width={300}
  height={400}
  className={styles.productImage}
/>
            </div>

            <div
              className={styles.itemInfo}
            >
              <h3>{item.name}</h3>

              <p className={styles.price}>
                {item.price}
              </p>

              <div
                className={
                  styles.quantityBox
                }
              >
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.quantity - 1
                    )
                  }
                >
                  -
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              <button
                className={
                  styles.removeBtn
                }
                onClick={() =>
                  handleRemove(item.id)
                }
              >
                Remove
              </button>
            </div>

            <div
              className={
                styles.itemTotal
              }
            >
              ₹
              {(
                getPriceNumber(
                  item.price
                ) * item.quantity
              ).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div
        className={styles.summary}
      >
        <h2>Order Summary</h2>

        <div className={styles.shippingProgress}>
  <p>
    {subtotal >= 3000
      ? "🎉 You unlocked FREE Shipping!"
      : `Add ₹${(
          3000 - subtotal
        ).toLocaleString()} more for FREE Shipping`}
  </p>

  <div className={styles.progressBar}>
    <div
      className={styles.progressFill}
      style={{
        width: `${Math.min(
          (subtotal / 3000) * 100,
          100
        )}%`,
      }}
    />
  </div>
</div>

        <div
          className={
            styles.summaryRow
          }
        >
          <span>Subtotal</span>
          <span>
            ₹
            {subtotal.toLocaleString()}
          </span>
        </div>

        <div
          className={
            styles.summaryRow
          }
        >
          <span>Shipping</span>
          <span>
            ₹
            {shipping.toLocaleString()}
          </span>
        </div>

        <div
          className={
            styles.totalRow
          }
        >
          <span>Total</span>
          <span>
            ₹{total.toLocaleString()}
          </span>
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

        <p
          className={
            styles.secureText
          }
        >
          🔒 100% Secure Checkout
        </p>
      </div>
    </div>
  )}
</div>

);
}
