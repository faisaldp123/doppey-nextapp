"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../styles/TrackOrder.module.css";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();

    // Replace later with API call

    const mockOrder = {
      orderId: orderId,
      email: email,
      trackingId: "TRK78456231",
      orderDate: "08 Aug 2026",
      estimatedDelivery: "12 Aug 2026",
      paymentMethod: "Cash On Delivery",
      status: "Shipped",

      product: {
        name: "Premium Cargo Trouser",
        image: "/products/product-one.jpg",
        qty: 1,
        size: "M",
        price: "₹1499",
      },

      address: {
        name: "Mohd Faisal",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110025",
        country: "India",
      },
    };

    setOrderStatus(mockOrder);
  };

  const getStepClass = (step) => {
    const statusOrder = [
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
    ];

    const currentIndex =
      statusOrder.indexOf(orderStatus?.status);

    const stepIndex =
      statusOrder.indexOf(step);

    if (stepIndex <= currentIndex)
      return styles.activeStep;

    return styles.pendingStep;
  };

  return (
    <div className={styles.trackPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Track Your Order</h1>

          <p>
            Enter your Order ID and Email
            Address to view order status.
          </p>
        </div>

        <div className={styles.trackCard}>
          <form
            onSubmit={handleTrack}
            className={styles.trackForm}
          >
            <input
              type="text"
              placeholder="Order ID"
              value={orderId}
              onChange={(e) =>
                setOrderId(e.target.value)
              }
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <button type="submit">
              Track Order
            </button>
          </form>
        </div>

        {orderStatus && (
          <>
            {/* ORDER INFO */}

            <div className={styles.orderInfo}>
              <div>
                <span>Order ID</span>
                <strong>
                  {orderStatus.orderId}
                </strong>
              </div>

              <div>
                <span>Tracking ID</span>
                <strong>
                  {orderStatus.trackingId}
                </strong>
              </div>

              <div>
                <span>Order Date</span>
                <strong>
                  {orderStatus.orderDate}
                </strong>
              </div>

              <div>
                <span>Delivery Date</span>
                <strong>
                  {
                    orderStatus.estimatedDelivery
                  }
                </strong>
              </div>
            </div>

            {/* TRACKING TIMELINE */}

            <div className={styles.timelineCard}>
              <h2>Order Status</h2>

              <div className={styles.timeline}>
                <div
                  className={getStepClass(
                    "Confirmed"
                  )}
                >
                  ✓ Confirmed
                </div>

                <div
                  className={getStepClass(
                    "Packed"
                  )}
                >
                  ✓ Packed
                </div>

                <div
                  className={getStepClass(
                    "Shipped"
                  )}
                >
                  ✓ Shipped
                </div>

                <div
                  className={getStepClass(
                    "Out For Delivery"
                  )}
                >
                  🚚 Out For Delivery
                </div>

                <div
                  className={getStepClass(
                    "Delivered"
                  )}
                >
                  📦 Delivered
                </div>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              {/* PRODUCT */}

              <div className={styles.card}>
                <h3>Product Details</h3>

                <div
                  className={
                    styles.productCard
                  }
                >
                  <Image
                    src={
                      orderStatus.product.image
                    }
                    alt={
                      orderStatus.product.name
                    }
                    width={120}
                    height={150}
                    className={
                      styles.productImage
                    }
                  />

                  <div>
                    <h4>
                      {
                        orderStatus.product
                          .name
                      }
                    </h4>

                    <p>
                      Qty:{" "}
                      {
                        orderStatus.product
                          .qty
                      }
                    </p>

                    <p>
                      Size:{" "}
                      {
                        orderStatus.product
                          .size
                      }
                    </p>

                    <strong>
                      {
                        orderStatus.product
                          .price
                      }
                    </strong>
                  </div>
                </div>
              </div>

              {/* DELIVERY */}

              <div className={styles.card}>
                <h3>
                  Delivery Address
                </h3>

                <p>
                  {
                    orderStatus.address
                      .name
                  }
                </p>

                <p>
                  {
                    orderStatus.address
                      .city
                  }
                  ,{" "}
                  {
                    orderStatus.address
                      .state
                  }
                </p>

                <p>
                  {
                    orderStatus.address
                      .pincode
                  }
                </p>

                <p>
                  {
                    orderStatus.address
                      .country
                  }
                </p>

                <div
                  className={
                    styles.deliveryBox
                  }
                >
                  <h4>
                    Estimated Delivery
                  </h4>

                  <p>
                    {
                      orderStatus.estimatedDelivery
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* HELP */}

            <div className={styles.helpCard}>
              <h3>Need Help?</h3>

              <p>
                For any order-related
                queries contact us.
              </p>

              <div
                className={
                  styles.helpDetails
                }
              >
                <span>
                  support@yourstore.com
                </span>

                <span>
                  +91 98765 43210
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}