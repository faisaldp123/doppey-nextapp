"use client";
import { useState } from "react";
import styles from "../styles/TrackOrder.module.css";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();

    // Simulated API response (replace with actual API integration)
    const mockStatus = {
      id: orderId,
      email: email,
      status: "Shipped",
      estimatedDelivery: "2025-10-25",
    };

    setOrderStatus(mockStatus);
  };

  return (
    <div className={styles.trackPage}>
      <div className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Track Your Order</h1>
          <p>Enter your Order ID and Email to check the status of your order.</p>
        </div>
      </div>

      <section className={styles.trackSection}>
        <form onSubmit={handleTrack} className={styles.trackForm}>
          <input
            type="text"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Track Order</button>
        </form>

        {orderStatus && (
          <div className={styles.statusCard}>
            <h2>Order Status</h2>
            <p><strong>Order ID:</strong> {orderStatus.id}</p>
            <p><strong>Email:</strong> {orderStatus.email}</p>
            <p><strong>Status:</strong> {orderStatus.status}</p>
            <p><strong>Estimated Delivery:</strong> {orderStatus.estimatedDelivery}</p>
          </div>
        )}
      </section>
    </div>
  );
}
