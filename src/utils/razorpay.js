import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const startRazorpayPayment = async ({
  amount,
  customer,
  onSuccess,
}) => {
  try {
    const response = await fetch(
  `${API_URL}/payments/create-order`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
    }),
  }
);

const data = await response.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,

      name: "Doppey",
      description: "Fashion Order",

      prefill: {
        name: customer.fullName,
        email: customer.email,
        contact: customer.phone,
      },

      theme: {
        color: "#111",
      },

      handler: function (response) {
        onSuccess(response);
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error(error);
    alert("Payment initialization failed");
  }
};