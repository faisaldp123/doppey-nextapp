"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api";
import styles from "../../styles/ReturnRequest.module.css";


const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E";

const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER;
  if (imagePath.startsWith("http")) return imagePath;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${imagePath}`;
};

const reasons = [
  "Wrong Size",
  "Damaged Product",
  "Received Wrong Item",
  "Quality Issue",
  "Color Different From Image",
  "Other",
];

export default function ReturnRequest() {

  
  const router = useRouter();

const { orderId } = router.query;
const productId = router.query.productId;

  const [order, setOrder]     = useState(null);
  const [product, setProduct] = useState(null);
  const [reason, setReason]   = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages]   = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch order and product details
  useEffect(() => {
    if (!router.isReady || !orderId) return;

    const fetchOrder = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/orders/${orderId}`);
        const orderData = res.data;

        console.log("ORDER DATA:", orderData);
console.log("ITEMS:", orderData.items);
console.log("ROUTER QUERY:", router.query);

        setOrder(orderData);

        // Find the specific product in the order
        // Find the specific product in the order
if (productId && orderData.items?.length) {
  const orderItem = orderData.items.find((item) => {
  const id =
    typeof item.product === "object"
      ? item.product._id.toString()
      : item.product.toString();

  return id === productId;
});

setProduct(orderItem ? orderItem.product : orderData.items[0].product);

  if (orderItem) {
    setProduct(orderItem.product);
  } else {
    setProduct(orderData.items[0].product);
  }
} else {
  setProduct(orderData.items?.[0]?.product);
}
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchOrder();
  }, [router.isReady, orderId, productId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!reason) {
      alert("Please select a return reason");
      return;
    }
    if (!orderId) {
      alert("Order ID is missing");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("orderId",   orderId);
      formData.append("productId", productId || product?._id || "");
      formData.append("reason",    reason);
      formData.append("comment",   comment);
      images.forEach((img) => formData.append("images", img));

      const res = await API.post("/returns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/return-success?id=${res.data?._id}`);
    } catch (err) {
      console.error("Return request failed:", err);
      alert("Failed to submit return request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>
        Loading order details...
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1>Return Product</h1>
          <p>Submit your return request. Our team will review and process it shortly.</p>
        </div>

        {/* Product Card — dynamic */}
        {product && (
          <div className={styles.productCard}>
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name || "Product"}
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            <div>
              <h3>{product.name || "Product"}</h3>
              <p>Order ID: {orderId}</p>
              {order?.address?.fullName && (
                <p>Customer: {order.address.fullName}</p>
              )}
              <strong>
                ₹{product.price?.toLocaleString("en-IN") || ""}
              </strong>
            </div>
          </div>
        )}

        {/* Return Reason */}
        <div className={styles.section}>
          <h2>Select Return Reason</h2>
          <div className={styles.reasonGrid}>
            {reasons.map((item) => (
              <button
                key={item}
                onClick={() => setReason(item)}
                className={reason === item ? styles.activeReason : styles.reasonBtn}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className={styles.section}>
          <h2>Additional Comments</h2>
          <textarea
            placeholder="Tell us more about the issue..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Images */}
        <div className={styles.section}>
          <h2>Upload Images (Optional)</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {previews.length > 0 && (
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                />
              ))}
            </div>
          )}
          {images.length > 0 && (
            <p className={styles.imageCount}>{images.length} image(s) selected</p>
          )}
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <h3>Return Summary</h3>
          <div>
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div>
            <span>Product</span>
            <strong>{product?.name || "—"}</strong>
          </div>
          <div>
            <span>Reason</span>
            <strong>{reason || "Not Selected"}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>Pending Review</strong>
          </div>
        </div>

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Return Request"}
        </button>

      </div>
    </div>
  );
}
