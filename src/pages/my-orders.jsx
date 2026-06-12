"use client";

import { useRouter } from "next/router";
import styles from "../styles/MyOrder.module.css";

export default function MyOrders() {
  const router = useRouter();

  const orders = [
    {
      id: "DP123456",
      status: "Delivered",
      date: "10 June 2026",
      total: 1499,
      image: "/products/product-one.jpg",
      name: "Premium Cargo Trouser",
      size: "M",
      qty: 1,
    },
    {
      id: "DP123457",
      status: "Shipped",
      date: "12 June 2026",
      total: 1999,
      image: "/products/product-two.jpg",
      name: "Oversized Black Tee",
      size: "L",
      qty: 1,
    },
  ];

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Orders</h1>
          <p>
            Track orders, manage returns and
            view purchase history.
          </p>
        </div>

        <div className={styles.ordersGrid}>
          {orders.map((order) => (
            <div
              key={order.id}
              className={styles.orderCard}
            >
              <div className={styles.imageWrap}>
                <img
                  src={order.image}
                  alt={order.name}
                />
              </div>

              <div className={styles.orderContent}>
                <div className={styles.topRow}>
                  <span className={styles.orderId}>
                    {order.id}
                  </span>

                  <span
                    className={`${styles.status}
                    ${
                      order.status ===
                      "Delivered"
                        ? styles.delivered
                        : styles.shipped
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <h3>{order.name}</h3>

                <p>
                  Size: {order.size}
                </p>

                <p>
                  Qty: {order.qty}
                </p>

                <p>
                  Ordered on {order.date}
                </p>

                <strong>
                  ₹{order.total}
                </strong>

                <div className={styles.actions}>
                  <button
                    className={styles.trackBtn}
                    onClick={() =>
                      router.push(
                        "/track-order"
                      )
                    }
                  >
                    Track Order
                  </button>

                  {order.status ===
                    "Delivered" && (
                    <button
                      className={
                        styles.returnBtn
                      }
                      onClick={() =>
                        router.push(
                          `/return-request/${order.id}`
                        )
                      }
                    >
                      Return Product
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}