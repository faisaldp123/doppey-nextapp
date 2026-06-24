"use client";

import { useState, useRef, useEffect } from "react";
import API from "@/utils/api";
import { X, ArrowLeft } from "lucide-react";
import {
  loadUserDataFromBackend,
  syncLocalShopStateToBackend,
} from "@/utils/shopState";
import styles from "@/styles/LoginModal.module.css";

export default function LoginModal({ open, onClose }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step !== 2) return;
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      await API.post("/request-otp", { phone: mobile });
      setStep(2);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) { alert("Enter the 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res = await API.post("/verify-otp", { phone: mobile, otp: code });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ← Sync cart and wishlist from backend after login
      await syncLocalShopStateToBackend();
      await loadUserDataFromBackend();
      window.dispatchEvent(new Event("user-login"));

      onClose();
      resetModal();
    } catch {
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setOtp(["", "", "", "", "", ""]);
    await API.post("/request-otp", { phone: mobile });
    setTimer(30);
  };

  const resetModal = () => {
    setMobile("");
    setOtp(["", "", "", "", "", ""]);
    setStep(1);
    setTimer(30);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");

      const firebaseConfig = {
        apiKey:     process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId:      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
        alert("Google login is not configured. Please add Firebase env values.");
        return;
      }

      const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const res = await API.post("/google-login", {
        email:    googleUser.email,
        name:     googleUser.displayName,
        googleId: googleUser.uid,
        photo:    googleUser.photoURL,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ← Sync cart and wishlist from backend after Google login
      await syncLocalShopStateToBackend();
      await loadUserDataFromBackend();
      window.dispatchEvent(new Event("user-login"));

      onClose();
      resetModal();
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);
      alert(`${err.code} - ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={handleClose}>
          <X size={20} />
        </button>

        {step === 1 && (
          <>
            <div className={styles.brandRow}>
              <div className={styles.brandDot}>D</div>
              <span className={styles.brandName}>Doppey</span>
            </div>

            <h2 className={styles.title}>Login or create account</h2>
            <p className={styles.sub}>Enter your phone number to continue shopping</p>

            <div className={styles.inputWrap}>
              <span className={styles.prefix}>+91</span>
              <input
                className={styles.input}
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                autoFocus
              />
            </div>

            <button className={styles.ctaBtn} onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Continue"}
            </button>

            <div className={styles.divider}><span>or</span></div>

            <button className={styles.googleBtn} onClick={handleGoogleLogin} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className={styles.terms}>
              By continuing, you agree to our <a href="/terms">Terms</a> &amp; <a href="/privacy">Privacy Policy</a>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <button className={styles.backBtn} onClick={() => setStep(1)}>
              <ArrowLeft size={18} />
            </button>

            <div className={styles.otpIcon}>💬</div>

            <h2 className={styles.title}>Verify your number</h2>
            <p className={styles.sub}>
              We sent a 6-digit OTP to <strong>+91 {mobile}</strong>
              <button className={styles.editPhone} onClick={() => setStep(1)}>Edit</button>
            </p>

            <div className={styles.otpRow} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className={`${styles.otpBox} ${digit ? styles.otpFilled : ""}`}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            <button
              className={styles.ctaBtn}
              onClick={handleVerifyOtp}
              disabled={loading || otp.join("").length < 6}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <p className={styles.resendRow}>
              Didn&apos;t receive it?{" "}
              {timer > 0 ? (
                <span className={styles.timer}>Resend in {timer}s</span>
              ) : (
                <button className={styles.resendBtn} onClick={handleResend}>Resend OTP</button>
              )}
            </p>
          </>
        )}

      </div>
    </div>
  );
}
