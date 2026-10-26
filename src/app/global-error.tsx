"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Nebras] Fatal application error:", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#0a0b1f",
            color: "#fff",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>تعذّر تحميل منصة نبراس</h1>
            <p style={{ color: "#c8cce9", lineHeight: 1.8, marginBottom: 24 }}>
              حدث خطأ حرج غير متوقع. الرجاء إعادة تحميل الصفحة، فريقنا يعمل على حل أي مشكلة فور ظهورها.
            </p>
            <button
              onClick={() => reset()}
              style={{
                background: "#f2990b",
                color: "#0a0b1f",
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
