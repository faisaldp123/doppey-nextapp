"use client";

import { useRouter } from "next/router";
import styles from "../styles/ReturnSuccess.module.css";
import { useEffect, useState } from "react";
import API from "@/utils/api";

export default function ReturnSuccess() {
  const router = useRouter();
  const { id } = router.query;

  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;

    fetchReturn();
  }, [router.isReady, id]);

  const fetchReturn = async () => {
    try {
      const res = await API.get(`/returns/${id}`);
      setReturnData(res.data);
    } catch (error) {
      console.error("Failed to fetch return:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "100px",
          textAlign: "center",
          fontSize: "20px",
        }}
      >
        Loading Return Details...
      </div>
    );
  }

  const requestId = returnData?._id
    ? returnData._id.slice(-8).toUpperCase()
    : "PENDING";

  const productName =
    returnData?.product?.name || "Your product";

  const orderId =
    returnData?.orderId?._id ||
    returnData?.orderId ||
    "";

  const status = returnData?.status || "Pending";

  const currentStep = {
    Pending: 1,
    Approved: 2,
    "Pickup Scheduled": 3,
    "Picked Up": 3,
    "Quality Check": 3,
    "Refund Approved": 4,
    "Refund Completed": 4,
    Rejected: 0,
  }[status] || 1;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
          {status === "Rejected" ? "✕" : "✓"}
        </div>

        <div className={styles.badge}>
          {status === "Rejected"
            ? "RETURN REQUEST REJECTED"
            : "RETURN REQUEST SUBMITTED"}
        </div>

        <h1>
          Return Request
          <span>
            {status === "Rejected"
              ? " Rejected"
              : " Submitted Successfully"}
          </span>
        </h1>

        <p className={styles.description}>
          {status === "Rejected"
            ? "Unfortunately, your return request has been rejected. Please contact support for further assistance."
            : `Thank you. Your return request for ${productName} has been received and is currently under review. Our team will verify the details and update you shortly.`}
        </p>

        <div className={styles.requestBox}>
          <span>Request ID</span>
          <strong>{requestId}</strong>
        </div>

        {orderId && (
          <div className={styles.requestBox}>
            <span>Order ID</span>
            <strong>
              {String(orderId)
                .slice(-8)
                .toUpperCase()}
            </strong>
          </div>
        )}

        <div className={styles.requestBox}>
          <span>Current Status</span>
          <strong>{status}</strong>
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          <div
            className={
              currentStep >= 1
                ? styles.active
                : ""
            }
          >
            <span>
              {currentStep >= 1
                ? "✓"
                : "1"}
            </span>
            Request Submitted
          </div>

          <div
            className={
              currentStep >= 2
                ? styles.active
                : ""
            }
          >
            <span>
              {currentStep >= 2
                ? "✓"
                : "2"}
            </span>
            Review Pending
          </div>

          <div
            className={
              currentStep >= 3
                ? styles.active
                : ""
            }
          >
            <span>
              {currentStep >= 3
                ? "✓"
                : "3"}
            </span>
            Pickup Scheduled
          </div>

          <div
            className={
              currentStep >= 4
                ? styles.active
                : ""
            }
          >
            <span>
              {currentStep >= 4
                ? "✓"
                : "4"}
            </span>
            Refund Processed
          </div>

          {status === "Rejected" && (
            <div className={styles.rejected}>
              <span>✕</span>
              Return Rejected
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>Review Time</h3>
            <p>
              Usually within
              24-48 hours.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>Pickup</h3>
            <p>
              Doorstep pickup
              will be arranged.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>Refund</h3>
            <p>
              Processed after
              product inspection.
            </p>
          </div>
        </div>

        {/* Refund Info */}
        {returnData?.refundAmount >
          0 && (
          <div
            className={
              styles.requestBox
            }
          >
            <span>
              Refund Amount
            </span>
            <strong>
              ₹
              {returnData.refundAmount.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        )}

        {returnData?.refundMethod && (
          <div
            className={
              styles.requestBox
            }
          >
            <span>
              Refund Method
            </span>
            <strong>
              {
                returnData.refundMethod
              }
            </strong>
          </div>
        )}

        {returnData?.adminRemark && (
          <div
            className={
              styles.requestBox
            }
          >
            <span>
              Admin Remark
            </span>
            <strong>
              {
                returnData.adminRemark
              }
            </strong>
          </div>
        )}

        {/* Buttons */}
        <div
          className={
            styles.actionButtons
          }
        >
          <button
            className={
              styles.primaryBtn
            }
            onClick={() =>
              router.push(
                "/my-orders"
              )
            }
          >
            View My Orders
          </button>

          <button
            className={
              styles.secondaryBtn
            }
            onClick={() =>
              router.push(
                `/track-order?id=${orderId}`
              )
            }
          >
            Track Order
          </button>

          <button
            className={
              styles.outlineBtn
            }
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