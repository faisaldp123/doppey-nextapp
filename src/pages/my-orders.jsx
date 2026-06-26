"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import { useRouter } from "next/router";
import styles from "../styles/MyOrder.module.css";

export default function MyOrders() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    const res = await API.get("/orders");

    setOrders(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  const getImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http")) return url;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  if (loading) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.container}>
          Loading Orders...
        </div>
      </div>
    );
  }

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
              key={order._id}
              className={styles.orderCard}
            >
              <div className={styles.imageWrap}>
                <img
                  src={getImageUrl(order.items?.[0]?.product?.images?.[0])}
                  alt=""
                />
              </div>

              <div className={styles.orderContent}>
                <div className={styles.topRow}>
                  <span className={styles.orderId}>
                    {order._id.slice(-8).toUpperCase()}
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

                <h3>{order.items?.[0]?.product?.name}</h3>

                <p>
                  {order.items?.[0]?.product?.sizes?.[0] || "N/A"}
                </p>

                <p>
                  Qty: {order.items?.[0]?.quantity}
                </p>

                <p>
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <strong>
                  ₹{order.totalAmount}
                </strong>

                <div className={styles.actions}>
                  <button
                    className={styles.trackBtn}
                    onClick={() =>
                      router.push(`/track-order?id=${order._id}`)
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
                     onClick={() => {
  const validItem = order.items.find((item) => item.product);

  if (!validItem) {
    alert("No valid product found in this order.");
    return;
  }

  router.push(
    `/return-request/${order._id}?productId=${validItem.product._id}`
  );
}}
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