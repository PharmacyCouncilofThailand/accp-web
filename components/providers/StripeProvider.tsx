"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ReactNode } from "react";
import { useLocale } from "next-intl";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

export default function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  const locale = useLocale();

  const appearance: import("@stripe/stripe-js").Appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#00C853",
      colorBackground: "#ffffff",
      colorText: "#1a1a2e",
      colorDanger: "#ff6b6b",
      fontFamily: "inherit",
      borderRadius: "8px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        border: "1px solid #ddd",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input:focus": {
        border: "2px solid #00C853",
        boxShadow: "0 0 0 1px #00C853",
      },
      ".Label": {
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "8px",
      },
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
        locale: locale === "th" ? "th" : "en",
      }}
    >
      {children}
    </Elements>
  );
}
