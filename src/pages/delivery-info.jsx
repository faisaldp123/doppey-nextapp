"use client";
import styles from "../styles/Delivery.module.css";

export default function DeliveryInfoPage() {
  return (
    <section className={styles.delivery}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Delivery Information</h1>
          <p>Fast, reliable, and transparent delivery for your Doppey orders.</p>
        </div>
      </div>

      {/* Delivery Details */}
      <div className={styles.container}>
        <div className={styles.section}>
          <h2>Shipping Methods</h2>
          <p>
            Doppey offers multiple shipping options to ensure your order reaches you safely and on time:
          </p>
          <ul>
            <li><strong>Standard Delivery:</strong> 3-7 business days.</li>
            <li><strong>Express Delivery:</strong> 1-3 business days for faster shipping.</li>
            <li><strong>Free Delivery:</strong> On orders over ₹1,499.</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Order Processing</h2>
          <p>
            All orders are processed within 24-48 hours. You will receive a confirmation email with tracking details as soon as your order ships.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Tracking Your Order</h2>
          <p>
            You can track your order through your account dashboard or via the tracking link provided in your shipping confirmation email.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Delivery Areas</h2>
          <p>
            We currently ship across India. For international shipping inquiries, please contact our support team.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Returns & Exchanges</h2>
          <p>
            If you are not satisfied with your purchase, Doppey offers hassle-free returns and exchanges within 15 days of delivery. Make sure items are unworn and in original packaging.
          </p>
        </div>
      </div>
    </section>
  );
}
