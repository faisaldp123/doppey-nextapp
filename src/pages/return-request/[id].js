"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/ReturnRequest.module.css";

export default function ReturnRequest() {
  const router = useRouter();
  const { id } = router.query;

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const reasons = [
    "Wrong Size",
    "Damaged Product",
    "Received Wrong Item",
    "Quality Issue",
    "Color Different From Image",
    "Other",
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    if (!reason) {
      alert("Please select a return reason");
      return;
    }

    // Backend API later
    console.log({
      orderId: id,
      reason,
      comment,
      images,
    });

    router.push("/return-success");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Return Product</h1>

          <p>
            Submit your return request. Our team will
            review and process it shortly.
          </p>
        </div>

        <div className={styles.productCard}>
          <img
            src="/products/product-one.jpg"
            alt="Product"
          />

          <div>
            <h3>Premium Cargo Trouser</h3>

            <p>Order ID: {id}</p>

            <p>Size: M</p>

            <strong>₹1499</strong>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Select Return Reason</h2>

          <div className={styles.reasonGrid}>
            {reasons.map((item) => (
              <button
                key={item}
                onClick={() => setReason(item)}
                className={
                  reason === item
                    ? styles.activeReason
                    : styles.reasonBtn
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Additional Comments</h2>

          <textarea
            placeholder="Tell us more about the issue..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />
        </div>

        <div className={styles.section}>
          <h2>Upload Images (Optional)</h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          {images.length > 0 && (
            <p className={styles.imageCount}>
              {images.length} image(s) selected
            </p>
          )}
        </div>

        <div className={styles.summary}>
          <h3>Return Summary</h3>

          <div>
            <span>Order ID</span>
            <strong>{id}</strong>
          </div>

          <div>
            <span>Reason</span>
            <strong>
              {reason || "Not Selected"}
            </strong>
          </div>
        </div>

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
        >
          Submit Return Request
        </button>
      </div>
    </div>
  );
}