"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/OrderSuccess.module.css";

export default function OrderSuccess() {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const latestOrder = JSON.parse(
      localStorage.getItem("latestOrder")
    );

    if (!latestOrder) {
      router.push("/");
      return;
    }

    setOrder(latestOrder);
  }, [router]);

  if (!order) return null;

  return (
    <div className={styles.successPage}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          ✓
        </div>

        <div className={styles.checkoutSteps}>
  <div className={styles.completedStep}>
    <span>✓</span>
    Cart
  </div>

  <div className={styles.stepLine}></div>

  <div className={styles.completedStep}>
    <span>✓</span>
    Checkout
  </div>

  <div className={styles.stepLine}></div>

  <div className={styles.completedStep}>
    <span>✓</span>
    Complete
  </div>
</div>

        <h1>Order Placed Successfully!</h1>

        <div className={styles.orderNumber}>
  Order ID: {order._id}
</div>
{order.waybill && (
  <div className={styles.orderNumber}>
    Tracking ID: {order.waybill}
  </div>
)}

        <p>
          Thank you{" "}
          <strong>
            {order?.address?.fullName || "Customer"}
          </strong>
          . Your order has been received.
        </p>

        <div className={styles.orderInfo}>
          <div>
            <span>Payment Method</span>
            <strong>
              {order.paymentMethod === "cod"
                ? "Cash On Delivery"
                : "Online Payment"}
            </strong>
          </div>

          <div>
            <span>Order Total</span>
            <strong>
              ₹{order.totalAmount?.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Items</span>
            <strong>
              {order.items.length}
            </strong>
          </div>
        </div>

        <div className={styles.btnGroup}>
          <button
            onClick={() =>
              router.push("/")
            }
          >
            Continue Shopping
          </button>

          <button
  className={styles.trackBtn}
  onClick={() =>
    router.push(
      `/track-order?id=${order._id}`
    )
  }
>
  Track Order
</button>

          <button
            className={styles.secondary}
            onClick={() =>
              router.push("/cart")
            }
          >
            Back To Cart
          </button>
        </div>
      </div>
    </div>
  );
}