"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api";

export default function VerifyOTP() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPhone =
      localStorage.getItem("loginPhone");

    if (!savedPhone) {
      router.push("/signin");
      return;
    }

    setPhone(savedPhone);
  }, []);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/verify-otp",
        {
          phone,
          otp,
        }
      );

      localStorage.setItem(
  "token",
  response.data.token
);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

// Notify Header & other components
window.dispatchEvent(
  new Event("user-login")
);

localStorage.removeItem(
  "loginPhone"
);

alert("Login Successful");

router.push("/");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Verify OTP
        </h2>

        <p
          style={{
            marginBottom: "15px",
          }}
        >
          OTP sent to +91 {phone}
        </p>

        <form
          onSubmit={handleVerifyOTP}
        >
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}