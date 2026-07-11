import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api";
import styles from "../styles/TrackOrder.module.css";

export default function TrackOrder() {
  const router = useRouter();
  const { id: queryId } = router.query;

  const [orderIdInput, setOrderIdInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http")) return url;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  // Sync query parameter to input state
  useEffect(() => {
    if (!router.isReady) return;

    if (queryId) {
      setOrderIdInput(queryId);
      fetchTracking(queryId);
    } else {
      // If page is ready but no id is provided in the URL query, show a friendly prompt
      setError("Please enter an Order ID in the track form above to track your order.");
    }
  }, [queryId, router.isReady]);

  const fetchTracking = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    setTracking(null);

    try {
      // 1) Try Delhivery track endpoint
      const res = await API.get(`/track/${id}`);

console.log(
  "TRACK API RESPONSE:",
  res.data
);

setTracking(res.data);
    } catch (err) {
      console.error("/track error:", err?.response || err.message || err);

      // 2) Try GET /orders/:id
      try {
        const orderRes = await API.get(`/orders/${id}`);

console.log(
  "ORDER API RESPONSE:",
  orderRes.data
);

setTracking(orderRes.data);
      } catch (orderErr) {
        console.warn("/orders/:id not available or error:", orderErr?.response?.status || orderErr.message || orderErr);

        // 3) Try GET /orders list and find matching order
        try {
          const listRes = await API.get(`/orders`);
          const orders = listRes.data;
          if (Array.isArray(orders)) {
            const found = orders.find((o) => o._id === id);
            if (found) {
              setTracking(found);
              return;
            }
          }
        } catch (listErr) {
          console.warn("/orders list error:", listErr?.response?.status || listErr.message || listErr);
        }

        // 4) Try localStorage.latestOrder
        try {
          const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
          if (latestOrder && latestOrder._id === id) {
            setTracking(latestOrder);
            return;
          }
        } catch (storageErr) {
          console.warn("localStorage read error:", storageErr);
        }

        setError(
          "We couldn't find any tracking details for this Order ID. Please check the ID and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      setError("Please enter a valid Order ID");
      return;
    }
    // Update router query to trigger fetch tracking
    router.push(`/track-order?id=${orderIdInput.trim()}`, undefined, { shallow: true });
    fetchTracking(orderIdInput.trim());
  };

  const getStepClass = (stepNumber, currentStatus) => {
  const statusMap = {
    "Pending": 1,
    "Created": 2,
    "In Transit": 3,
    "Delivered": 4,
    "Cancelled": 0,
  };

  const currentNum =
    statusMap[currentStatus] || 1;

  return stepNumber <= currentNum
    ? styles.activeStep
    : styles.pendingStep;
};

console.log(
  "TRACKING STATE:",
  tracking
);

  return (
    <div className={styles.trackPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Track Your Order</h1>
          <p>
            Enter your Order ID below to track its real-time shipping status and delivery details.
          </p>
        </div>

        {/* Tracking Form Card */}
        <div className={styles.trackCard}>
          <form onSubmit={handleTrackSubmit} className={styles.trackForm}>
            <input
              type="text"
              placeholder="Order ID (e.g. 6a36cc9...)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number (Optional)"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <h3>Loading order details...</h3>
          </div>
        )}

        {error && !loading && (
          <div className={styles.card} style={{ textAlign: "center", padding: "40px", borderColor: "#fecdd3" }}>
            <h3 style={{ color: "#e11d48" }}>Tracking Status</h3>
            <p>{error}</p>
          </div>
        )}

        {tracking && !loading && (
          <>
            {/* Order Info Bar */}
            <div className={styles.orderInfo}>
              <div>
                <span>Order ID</span>
                <strong>{tracking._id || queryId}</strong>
              </div>
              <div>
                <span>Order Date</span>
                <strong>
                  {tracking.createdAt
                    ? new Date(tracking.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </strong>
              </div>
              <div>
                <span>Total Amount</span>
                <strong>₹{(tracking.totalAmount || tracking.total || 0).toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong
  style={{
    color:
      (
        tracking.trackingStatus ||
        tracking.status
      ) === "Cancelled"
        ? "#ef4444"
        : "#10b981",
  }}
>
  {tracking.trackingStatus ||
    tracking.status ||
    "Pending"}
</strong>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.timelineCard}>
              <h2>Shipping Timeline</h2>
              {tracking.status === "Cancelled" ? (
                <div className={styles.timeline}>
                  <div className={styles.activeStep} style={{ backgroundColor: "#ef4444" }}>
                    Cancelled
                  </div>
                </div>
              ) : (
                <div className={styles.timeline}>
                  <div
  className={getStepClass(
    1,
    tracking.trackingStatus ||
      tracking.status
  )}
>
  1. Order Placed
</div>

<div
  className={getStepClass(
    2,
    tracking.trackingStatus ||
      tracking.status
  )}
>
  2. AWB Generated
</div>

<div
  className={getStepClass(
    3,
    tracking.trackingStatus ||
      tracking.status
  )}
>
  3. In Transit
</div>

<div
  className={getStepClass(
    4,
    tracking.trackingStatus ||
      tracking.status
  )}
>
  4. Delivered
</div>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
              {/* Card 1: Items */}
              <div className={styles.card}>
                <h3>Items in Order</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {tracking.items && tracking.items.length > 0 ? (
                    tracking.items.map((item, idx) => (
                      <div key={idx} className={styles.productCard}>
                        <img
                          src={getImageUrl(item.product?.images?.[0])}
                          alt={item.product?.name || "Product"}
                          width={80}
                          height={100}
                          className={styles.productImage}
                        />
                        <div>
                          <h4>{item.product?.name || "Product Item"}</h4>
                          <p>Size: {item.product?.sizes?.[0] || "M"} | Qty: {item.quantity}</p>
                          <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No items details available.</p>
                  )}
                </div>
              </div>

              {/* Card 2: Address & Shipping */}
              <div className={styles.card}>
                <h3>Delivery Details</h3>
                <div className={styles.deliveryBox}>
                  <h4>Shipping Address</h4>
                  {tracking.address ? (
                    <p>
                      <strong>{tracking.address.fullName}</strong>
                      <br />
                      {tracking.address.street}
                      <br />
                      {tracking.address.city}, {tracking.address.state} - {tracking.address.pincode}
                      <br />
                      Phone: {tracking.address.phone}
                    </p>
                  ) : (
                    <p>No shipping address available.</p>
                  )}
                </div>

                {tracking.waybill && (
                  <div className={styles.deliveryBox} style={{ marginTop: "20px" }}>
                    <h4>Blue Dart Logistics</h4>

<p>
  <strong>AWB Number:</strong>{" "}
  {tracking.waybill}
</p>

<p>
  <strong>Tracking Status:</strong>{" "}
  {tracking.trackingStatus ||
    "Created"}
</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Help section */}
        <div className={styles.helpCard}>
          <h3>Need Help with Your Order?</h3>
          <p>If you have any questions or concerns about your delivery, please contact our support team.</p>
          <div className={styles.helpDetails}>
            <span>📧 info@doppey.com</span>
            <span>📞 +91 98765 43210</span>
          </div>
          <div className={styles.orderActions}>
            <button className={styles.ordersBtn} onClick={() => router.push("/my-orders")}>
              View All Orders
            </button>
            <button className={styles.ordersBtn} style={{ backgroundColor: "#555" }} onClick={() => router.push("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}