"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "4rem" }}>
      <h1 className="title" style={{ color: "var(--error)" }}>
        Something went wrong!
      </h1>
      <p style={{ marginBottom: "2rem" }}>
        We encountered an unexpected error. Please try again later.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button className="button" onClick={() => reset()}>
          Try Again
        </button>
        <Link href="/" className="button" style={{ background: "#444" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
