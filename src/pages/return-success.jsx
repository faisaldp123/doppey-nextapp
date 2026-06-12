"use client";

import { useRouter } from "next/router";
import styles from "../styles/ReturnSuccess.module.css";

export default function ReturnSuccess() {
  const router = useRouter();

  const requestId =
    "RTN" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
          ✓
        </div>

        <div className={styles.badge}>
          RETURN REQUEST SUBMITTED
        </div>

        <h1>
          Return Request
          <span> Submitted Successfully</span>
        </h1>

        <p className={styles.description}>
          Thank you. Your return request has been
          received and is currently under review.
          Our team will verify the details and
          update you shortly.
        </p>

        <div className={styles.requestBox}>
          <span>Request ID</span>
          <strong>{requestId}</strong>
        </div>

        <div className={styles.timeline}>
          <div className={styles.active}>
            <span>✓</span>
            Request Submitted
          </div>

          <div>
            <span>2</span>
            Review Pending
          </div>

          <div>
            <span>3</span>
            Pickup Scheduled
          </div>

          <div>
            <span>4</span>
            Refund Processed
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>Review Time</h3>
            <p>
              Usually within 24-48 hours.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>Pickup</h3>
            <p>
              Doorstep pickup will be arranged.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>Refund</h3>
            <p>
              Processed after product inspection.
            </p>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={styles.primaryBtn}
            onClick={() =>
              router.push("/my-orders")
            }
          >
            View My Orders
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() =>
              router.push("/track-order")
            }
          >
            Track Order
          </button>

          <button
            className={styles.outlineBtn}
            onClick={() =>
              router.push("/")
            }
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}