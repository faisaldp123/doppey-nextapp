"use client";

import API from "@/utils/api";
import { startRazorpayPayment } from "@/utils/razorpay";
import { requireLogin } from "@/utils/auth";
import { clearCart, getCart, loadUserDataFromBackend } from "@/utils/shopState";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";  
import styles from "../styles/Checkout.module.css";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3C/svg%3E";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER;
  if (imagePath.startsWith("http")) return imagePath;
  return `${BACKEND_URL}/${imagePath}`;
};

export default function Checkout() {
  const router = useRouter();

  const [cartItems, setCartItems]   = useState([]);
  const [user, setUser]             = useState(null);
  const [mounted, setMounted]       = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [formData, setFormData]     = useState({
    fullName: "", email: "", phone: "",
    address: "", landmark: "", city: "", state: "", pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ── Coupon dropdown (backend-driven) ──────────────────────────
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [couponsOpen, setCouponsOpen] = useState(false);
  const [applyingCode, setApplyingCode] = useState(null);

  useEffect(() => {
    setMounted(true);
    const loadCheckoutState = async () => {
      setLoadingCart(true);
      try {
        await loadUserDataFromBackend();
        setCartItems(getCart());
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } finally {
        setLoadingCart(false);
      }
    };

    const updateCart = () => setCartItems(getCart());

    loadCheckoutState();
    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("user-login", loadCheckoutState);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("user-login", loadCheckoutState);
    };
  }, []);

  // Fetch live, active coupons from the backend for the dropdown
  useEffect(() => {
    const fetchCoupons = async () => {
      setCouponsLoading(true);
      try {
        const res = await API.get("/coupons/public");
        setAvailableCoupons(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load coupons:", err);
        setAvailableCoupons([]);
      } finally {
        setCouponsLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const getPriceNumber = (price) =>
    Number(String(price).replace(/[^\d]/g, ""));

  // ← SAME as Cart.jsx — applies discount correctly
  const getDiscountedPrice = (item) => {
    const base = getPriceNumber(item.price);
    return item.discount
      ? Math.round(base - (base * item.discount) / 100)
      : base;
  };

  // ← Uses discounted price now
  const subtotal = cartItems.reduce(
    (acc, item) => acc + getDiscountedPrice(item) * (item.quantity || 1),
    0
  );

  const COD_CHARGE = 99;
const COD_FREE_LIMIT = 1999;

const shipping = 0;

const codCharge =
  paymentMethod === "cod"
    ? subtotal >= COD_FREE_LIMIT
      ? 0
      : COD_CHARGE
    : 0;

const discountedSubtotal = Math.max(
  0,
  subtotal - couponDiscount
);

const total =
  discountedSubtotal + codCharge;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim())                   newErrors.fullName = "Full name is required";
    if (!formData.email.trim())                      newErrors.email    = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))     newErrors.email    = "Enter valid email";
    if (!/^\d{10}$/.test(formData.phone))            newErrors.phone    = "Enter valid mobile number";
    if (!formData.address.trim())                    newErrors.address  = "Address is required";
    if (!formData.city.trim())                       newErrors.city     = "City is required";
    if (!formData.state.trim())                      newErrors.state    = "State is required";
    if (!/^\d{6}$/.test(formData.pincode))           newErrors.pincode  = "Enter valid pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Helpers for rendering each backend coupon's terms ─────────
  const getCouponSavings = (coupon) => {
    let discount =
      coupon.discountType === "PERCENT"
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    return Math.round(discount);
  };

  const isCouponUsable = (coupon) => subtotal >= (coupon.minOrderValue || 0);

  const applyCoupon = async (codeOverride) => {
    const codeToApply = (codeOverride || couponCode).trim();

    if (!codeToApply) {
      setCouponMessage("Please enter coupon code");
      return;
    }

    setApplyingCode(codeToApply.toUpperCase());
    try {
      const res = await API.post(
        "/coupons/apply",
        {
          code: codeToApply,
          orderAmount: subtotal,
        }
      );

      setCouponDiscount(res.data.discount);
      setAppliedCoupon(codeToApply.toUpperCase());
      setCouponCode(codeToApply.toUpperCase());
      setCouponMessage(
        `Coupon applied successfully! You saved ₹${res.data.discount}`
      );
      setCouponsOpen(false);
    } catch (err) {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage(
        err.response?.data?.message || "Invalid coupon"
      );
    } finally {
      setApplyingCode(null);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setAppliedCoupon(null);
    setCouponMessage("");
  };

  const handlePlaceOrder = async () => {
    if (!requireLogin()) return;
    if (!validate()) return;

    // ← Send discounted price to backend
    const orderItems = cartItems.map((item) => ({
      product:  item._id,
      price:    getDiscountedPrice(item),
      quantity: item.quantity || 1,
    }));

    const address = {
      fullName: formData.fullName,
      phone:    formData.phone,
      street:   formData.address,
      city:     formData.city,
      state:    formData.state,
      pincode:  formData.pincode,
    };

    if (paymentMethod === "cod") {
      try {
        const response = await API.post("/orders", {
  items: orderItems,
  address,
  shipping,
  codCharge,
  couponCode: appliedCoupon,
  couponDiscount,
  total,
  paymentMethod,
});
        localStorage.setItem("latestOrder", JSON.stringify(response.data.order));
        clearCart();
        router.push("/order-success");
      } catch (err) {
        console.error(err);
        alert("Failed to place order. Please try again.");
      }
      return;
    }

    try {
      await startRazorpayPayment({
        amount: discountedSubtotal,
        customer: {
          fullName: formData.fullName,
          email:    formData.email,
          phone:    formData.phone,
        },
        onSuccess: async (paymentResponse) => {
          try {
            const verifyRes = await API.post("/payments/verify", {
              razorpay_order_id:   paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature:  paymentResponse.razorpay_signature,
            });

            if (!verifyRes.data?.success) {
              alert("Payment verification failed. Please contact support.");
              return;
            }

            const response = await API.post("/orders", {
              items: orderItems, address, shipping, codCharge, total, paymentMethod,
            });

            localStorage.setItem("latestOrder", JSON.stringify(response.data.order));
            clearCart();
            router.push("/order-success");
          } catch (err) {
            console.error("Verification/Order failed:", err);
            alert("Payment verification failed. If debited, contact customer support.");
          }
        },
      });
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    }
  };

  if (!mounted || loadingCart) {
    return (
      <div className={styles.checkoutPage}>
        <h2 style={{ textAlign: "center", padding: "60px 0" }}>Loading checkout...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <h2 style={{ textAlign: "center", padding: "60px 0" }}>
          Your cart is empty.{" "}
          <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => router.push("/")}>
            Shop now
          </span>
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <h1>Checkout</h1>

      <div className={styles.checkoutSteps}>
        <div className={styles.activeStep}><span>1</span> Cart</div>
        <div className={styles.stepLine}></div>
        <div className={styles.activeStep}><span>2</span> Checkout</div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}><span>3</span> Complete</div>
      </div>

      <div className={styles.checkoutGrid}>

        <div className={styles.formSection}>
          <div className={styles.card}>
            <h2>Contact Information</h2>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
              {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input type="tel" placeholder="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>
          </div>

          <div className={styles.card}>
            <h2>Delivery Address</h2>
            <div className={styles.inputGroup}>
              <textarea placeholder="Address" rows="4" name="address" value={formData.address} onChange={handleChange} />
              {errors.address && <span className={styles.error}>{errors.address}</span>}
            </div>
            <input type="text" placeholder="Landmark (Optional)" name="landmark" value={formData.landmark} onChange={handleChange} />
            <div className={styles.twoColumn}>
              <div className={styles.inputGroup}>
                <input type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
                {errors.city && <span className={styles.error}>{errors.city}</span>}
              </div>
              <div className={styles.inputGroup}>
                <select name="state" value={formData.state} onChange={handleChange}>
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
                {errors.state && <span className={styles.error}>{errors.state}</span>}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
              {errors.pincode && <span className={styles.error}>{errors.pincode}</span>}
            </div>
          </div>

          <div className={styles.card}>
            <h2>Payment Method</h2>
            <label className={styles.paymentOption}>
              <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              Cash On Delivery
              <span
  style={{
    fontSize: "12px",
    color: "#888",
    marginLeft: "8px",
  }}
>
  {subtotal >= COD_FREE_LIMIT
    ? "(FREE COD)"
    : "(+₹99 COD charge)"}
</span>
            </label>
            <label className={styles.paymentOption}>
              <input type="radio" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
              UPI / Card / Net Banking
            </label>
          </div>
        </div>

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

            {/* ← Now shows discounted price correctly */}
            {cartItems.map((item) => {
              const discountedPrice = getDiscountedPrice(item);
              return (
                <div key={item._id} className={styles.productRow}>
                  <img
                    src={getImageUrl(item.images?.[0])}
                    alt={item.name}
                    width={70}
                    height={90}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                  <div className={styles.productInfo}>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity || 1}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span>₹{discountedPrice.toLocaleString("en-IN")}</span>
                      {item.discount > 0 && (
                        <>
                          <del style={{ color: "#999", fontSize: "12px" }}>
                            ₹{getPriceNumber(item.price).toLocaleString("en-IN")}
                          </del>
                          <span style={{ color: "green", fontSize: "11px", fontWeight: 600 }}>
                            {item.discount}% off
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── Coupons (backend-driven dropdown) ────────────── */}
            <div className={styles.offersCard}>
              <div className={styles.couponBox}>
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  disabled={!!appliedCoupon}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                {appliedCoupon ? (
                  <button type="button" className={styles.removeCouponBtn} onClick={removeCoupon}>
                    Remove
                  </button>
                ) : (
                  <button type="button" onClick={() => applyCoupon()}>
                    Apply
                  </button>
                )}
              </div>

              {couponMessage && (
                <p className={couponDiscount > 0 ? styles.couponMsgSuccess : styles.couponMsgError}>
                  {couponMessage}
                </p>
              )}

              <button
                type="button"
                className={styles.couponDropdownToggle}
                onClick={() => setCouponsOpen((v) => !v)}
              >
                <span>🏷️ View Available Coupons {availableCoupons.length > 0 && `(${availableCoupons.length})`}</span>
                <span className={`${styles.chevron} ${couponsOpen ? styles.chevronOpen : ""}`}>▾</span>
              </button>

              {couponsOpen && (
                <div className={styles.offersList}>
                  {couponsLoading && (
                    <p className={styles.noOffers}>Loading coupons...</p>
                  )}

                  {!couponsLoading && availableCoupons.length === 0 && (
                    <p className={styles.noOffers}>No active coupons right now.</p>
                  )}

                  {!couponsLoading &&
                    availableCoupons.map((coupon) => {
                      const usable = isCouponUsable(coupon);
                      const savings = getCouponSavings(coupon);
                      return (
                        <div
                          key={coupon._id || coupon.code}
                          className={`${styles.offerItem} ${!usable ? styles.offerItemDisabled : ""}`}
                        >
                          <div className={styles.offerRow}>
                            <span className={usable ? styles.offerIcon : styles.offerIconDisabled}>%</span>
                            <span className={styles.offerCode}>{coupon.code}</span>
                            {appliedCoupon === coupon.code ? (
                              <span className={styles.offerAppliedTag}>✓ Applied</span>
                            ) : usable ? (
                              <button
                                type="button"
                                className={styles.offerApplyLink}
                                disabled={applyingCode === coupon.code}
                                onClick={() => applyCoupon(coupon.code)}
                              >
                                {applyingCode === coupon.code ? "Applying..." : "Apply"}
                              </button>
                            ) : (
                              <span className={styles.offerAddLink}>Not eligible</span>
                            )}
                          </div>

                          {usable ? (
                            <p className={styles.offerSavings}>You save ₹{savings.toLocaleString("en-IN")}</p>
                          ) : (
                            <p className={styles.offerUnavailableReason}>
                              Add items worth ₹{(coupon.minOrderValue - subtotal).toLocaleString("en-IN")} more to avail
                            </p>
                          )}

                          <p className={styles.offerDesc}>
                            {coupon.description ||
                              (coupon.discountType === "PERCENT"
                                ? `${coupon.discountValue}% off${coupon.maxDiscount ? ` up to ₹${coupon.maxDiscount}` : ""}`
                                : `Flat ₹${coupon.discountValue} off`)}
                            {coupon.minOrderValue > 0 && ` on orders above ₹${coupon.minOrderValue.toLocaleString("en-IN")}`}
                          </p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className={styles.shippingProgress}>
  <p>
    {subtotal >= COD_FREE_LIMIT
      ? "🎉 You unlocked FREE COD"
      : `Add ₹${(
          COD_FREE_LIMIT - subtotal
        ).toLocaleString(
          "en-IN"
        )} more for FREE COD`}
  </p>

  <div className={styles.progressBar}>
    <div
      className={styles.progressFill}
      style={{
        width: `${Math.min(
          (subtotal /
            COD_FREE_LIMIT) *
            100,
          100
        )}%`,
      }}
    />
  </div>
</div>

            <div className={styles.priceRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {couponDiscount > 0 && (
  <div className={styles.priceRow}>
    <span>
      After Discount
    </span>

    <span>
      ₹
      {discountedSubtotal.toLocaleString(
        "en-IN"
      )}
    </span>
  </div>
)}
            {couponDiscount > 0 && (
              <div className={styles.priceRow}>
                <span>Coupon Discount ({appliedCoupon})</span>
                <span style={{ color: "green" }}>
                  -₹{couponDiscount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className={styles.priceRow}>
  <span>Shipping</span>
  <span>FREE</span>
</div>

            {paymentMethod === "cod" && (
  <div className={styles.priceRow}>
    <span>COD Charge</span>
    <span>
      {codCharge === 0
        ? "FREE"
        : `₹${codCharge.toLocaleString(
            "en-IN"
          )}`}
    </span>
  </div>
)}

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
