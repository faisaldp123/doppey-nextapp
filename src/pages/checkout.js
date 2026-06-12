"use client";

import { startRazorpayPayment } from "@/utils/razorpay";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Checkout.module.css";

export default function Checkout() {
const router = useRouter();

const [cartItems, setCartItems] = useState([]);

const [formData, setFormData] = useState({
fullName: "",
email: "",
phone: "",
address: "",
landmark: "",
city: "",
state: "",
pincode: "",
});

const [paymentMethod, setPaymentMethod] =
useState("cod");

const [errors, setErrors] = useState({});

useEffect(() => {
const cart =
JSON.parse(localStorage.getItem("cart")) || [];


setCartItems(cart);


}, []);

const getPriceNumber = (price) => {
return Number(
String(price).replace(/[^\d]/g, "")
);
};

const subtotal = cartItems.reduce(
(acc, item) =>
acc +
getPriceNumber(item.price) *
(item.quantity || 1),
0
);

const shipping =
cartItems.length > 0 ? 99 : 0;

const total = subtotal + shipping;

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const validate = () => {
const newErrors = {};


if (!formData.fullName.trim())
  newErrors.fullName =
    "Full name is required";

if (!formData.email.trim())
  newErrors.email =
    "Email is required";

if (
  !/^\S+@\S+\.\S+$/.test(
    formData.email
  )
)
  newErrors.email =
    "Enter valid email";

if (
  !/^\d{10}$/.test(formData.phone)
)
  newErrors.phone =
    "Enter valid mobile number";

if (!formData.address.trim())
  newErrors.address =
    "Address is required";

if (!formData.city.trim())
  newErrors.city =
    "City is required";

if (!formData.state.trim())
  newErrors.state =
    "State is required";

if (
  !/^\d{6}$/.test(
    formData.pincode
  )
)
  newErrors.pincode =
    "Enter valid pincode";

setErrors(newErrors);

return (
  Object.keys(newErrors).length ===
  0
);


};

const handlePlaceOrder = async () => {
  if (!validate()) return;

  const orderData = {
    orderNumber:
      "OD" +
      Math.floor(
        100000 + Math.random() * 900000
      ),

    customer: formData,

    paymentMethod,

    items: cartItems,

    subtotal,

    shipping,

    total,

    orderDate:
      new Date().toISOString(),
  };

  // CASH ON DELIVERY

  if (paymentMethod === "cod") {
    localStorage.setItem(
      "latestOrder",
      JSON.stringify(orderData)
    );

    localStorage.removeItem("cart");

    router.push("/order-success");

    return;
  }

  // ONLINE PAYMENT

  try {
    await startRazorpayPayment({
      amount: total,

      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },

      onSuccess: (paymentResponse) => {
        orderData.paymentStatus =
          "Paid";

        orderData.razorpayOrderId =
          paymentResponse.razorpay_order_id;

        orderData.razorpayPaymentId =
          paymentResponse.razorpay_payment_id;

        orderData.razorpaySignature =
          paymentResponse.razorpay_signature;

        localStorage.setItem(
          "latestOrder",
          JSON.stringify(orderData)
        );

        localStorage.removeItem("cart");

        router.push("/order-success");
      },
    });
  } catch (error) {
    console.error(error);

    alert(
      "Payment failed. Please try again."
    );
  }
};

return ( <div className={styles.checkoutPage}> <h1>Checkout</h1>

<div className={styles.checkoutSteps}>
  <div className={styles.activeStep}>
    <span>1</span>
    Cart
  </div>

  <div className={styles.stepLine}></div>

  <div className={styles.activeStep}>
    <span>2</span>
    Checkout
  </div>

  <div className={styles.stepLine}></div>

  <div className={styles.step}>
    <span>3</span>
    Complete
  </div>
</div>


  <div className={styles.checkoutGrid}>
    {/* LEFT SECTION */}

    <div className={styles.formSection}>
      <div className={styles.card}>
        <h2>
          Contact Information
        </h2>

        <div
          className={styles.inputGroup}
        >
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />

          {errors.fullName && (
            <span
              className={
                styles.error
              }
            >
              {errors.fullName}
            </span>
          )}
        </div>

        <div
          className={styles.inputGroup}
        >
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <span
              className={
                styles.error
              }
            >
              {errors.email}
            </span>
          )}
        </div>

        <div
          className={styles.inputGroup}
        >
          <input
            type="tel"
            placeholder="Mobile Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          {errors.phone && (
            <span
              className={
                styles.error
              }
            >
              {errors.phone}
            </span>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <h2>
          Delivery Address
        </h2>

        <div
          className={styles.inputGroup}
        >
          <textarea
            placeholder="Address"
            rows="4"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          {errors.address && (
            <span
              className={
                styles.error
              }
            >
              {errors.address}
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="Landmark (Optional)"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
        />

        <div
          className={
            styles.twoColumn
          }
        >
          <div
            className={
              styles.inputGroup
            }
          >
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />

            {errors.city && (
              <span
                className={
                  styles.error
                }
              >
                {errors.city}
              </span>
            )}
          </div>

          <div
            className={
              styles.inputGroup
            }
          >
            <select
  name="state"
  value={formData.state}
  onChange={handleChange}
>
  <option value="">Select State</option>
  <option value="Delhi">Delhi</option>
  <option value="Haryana">Haryana</option>
  <option value="Punjab">Punjab</option>
  <option value="Uttar Pradesh">Uttar Pradesh</option>
  <option value="Rajasthan">Rajasthan</option>
  <option value="Maharashtra">Maharashtra</option>
  <option value="Gujarat">Gujarat</option>
  <option value="Karnataka">Karnataka</option>
  <option value="Tamil Nadu">Tamil Nadu</option>
  <option value="West Bengal">West Bengal</option>
</select>

            {errors.state && (
              <span
                className={
                  styles.error
                }
              >
                {errors.state}
              </span>
            )}
          </div>
        </div>

        <div
          className={styles.inputGroup}
        >
          <input
            type="text"
            placeholder="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          {errors.pincode && (
            <span
              className={
                styles.error
              }
            >
              {errors.pincode}
            </span>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <h2>Payment Method</h2>

        <label
          className={
            styles.paymentOption
          }
        >
          <input
            type="radio"
            checked={
              paymentMethod === "cod"
            }
            onChange={() =>
              setPaymentMethod(
                "cod"
              )
            }
          />

          Cash On Delivery
        </label>

        <label
          className={
            styles.paymentOption
          }
        >
          <input
            type="radio"
            checked={
              paymentMethod ===
              "online"
            }
            onChange={() =>
              setPaymentMethod(
                "online"
              )
            }
          />

          UPI / Card / Net Banking
        </label>
      </div>
    </div>

    {/* RIGHT SECTION */}

    <div className={styles.summarySection}>
      <div className={styles.summaryCard}>
        <h2>Order Summary</h2>

        <div className={styles.deliveryBox}>
  <h4>🚚 Estimated Delivery</h4>
  <p>3 - 5 Business Days</p>
</div>

<div className={styles.trustBadges}>
  <div>✓ Secure Checkout</div>
  <div>✓ Easy Returns</div>
  <div>✓ Cash On Delivery</div>
</div>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className={
              styles.productRow
            }
          >
            <Image
              src={
                item.img1 ||
                item.image
              }
              alt={item.name}
              width={70}
              height={90}
            />

            <div className={styles.productInfo}>
  <h4>{item.name}</h4>

  <p>
    Qty: {item.quantity || 1}
  </p>

  <span>{item.price}</span>
</div>
          </div>
        ))}

        <div
          className={
            styles.couponBox
          }
        >
          <input
            type="text"
            placeholder="Coupon Code"
          />

          <button>
            Apply
          </button>
        </div>

        <div className={styles.shippingProgress}>
  <p>
    Add ₹
    {Math.max(0, 3000 - subtotal)}
    more for FREE Shipping
  </p>

  <div className={styles.progressBar}>
    <div
      className={styles.progressFill}
      style={{
        width: `${Math.min(
          (subtotal / 3000) * 100,
          100
        )}%`,
      }}
    />
  </div>
</div>

        <div
          className={
            styles.priceRow
          }
        >
          <span>Subtotal</span>
          <span>
            ₹
            {subtotal.toLocaleString()}
          </span>
        </div>

        <div
          className={
            styles.priceRow
          }
        >
          <span>Shipping</span>
          <span>
            ₹
            {shipping.toLocaleString()}
          </span>
        </div>

        <div
          className={
            styles.totalRow
          }
        >
          <span>Total</span>
          <span>
            ₹{total.toLocaleString()}
          </span>
        </div>

        <button
          className={
            styles.placeOrderBtn
          }
          onClick={
            handlePlaceOrder
          }
        >
          Place Order
        </button>
      </div>
    </div>
  </div>
</div>

);
}
