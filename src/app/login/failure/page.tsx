// src/app/login/failure/page.tsx
"use client";

export default function FailurePage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Something went wrong</h1>
      <p>We couldn’t complete the connection. Please try again.</p>
      <a href="/login" style={{ marginTop: "1rem", display: "inline-block" }}>
        Go back to login
      </a>
    </div>
  );
}
