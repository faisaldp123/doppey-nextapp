"use client";
import { useState } from "react";
import styles from "../styles/SignIn.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import API from "@/utils/api";

export default function AuthPage() {
  const [mobile, setMobile] = useState("");
  const [agree, setAgree] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("BUTTON CLICKED");

  if (!agree) {
    alert("Accept Terms");
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    alert("Enter valid mobile number");
    return;
  }

  try {
    console.log("SENDING OTP REQUEST");
    
    console.log("API URL =", process.env.NEXT_PUBLIC_API_URL);

    const res = await API.post("/request-otp", {
      phone: mobile,
    });

    console.log("OTP RESPONSE:", res.data);

    localStorage.setItem("loginPhone", mobile);

    router.push("/verify-otp");
  } catch (err) {
    console.error("OTP ERROR:", err);
    alert("Failed to send OTP");
  }
};

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.left}>
          <img src="/products/product-one.jpg" alt="Promo Banner" />
        </div>
        <div className={styles.right}>
          <h2>Login or Signup</h2>
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <span>+91</span>
              <input
                type="text"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <label htmlFor="agree">
                By continuing, I agree to the{" "}
                <span><Link className={styles.terms} href="/terms-condition">Terms of Use</Link></span> & <span><Link className={styles.terms} href="privacy-policy">Privacy Policy</Link></span> and I am above 18 years old.
              </label>
            </div>

            <button type="submit">Continue</button>
          </form>
          <p className={styles.help}>
            Have trouble logging in? <span><Link className={styles.terms} href="/help">Get help</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
}
