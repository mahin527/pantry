"use client"

import { useEffect } from "react"
import { Button } from "@mui/material"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[GlobalError]", error)
    }
  }, [error])

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "6rem", fontWeight: 800, color: "#3B82F6", margin: 0, lineHeight: 1 }}>
            500
          </h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#374151", marginTop: "0.5rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#6B7280", marginTop: "0.5rem", maxWidth: 400 }}>
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          <Button
            variant="contained"
            onClick={reset}
            style={{ marginTop: "1.5rem" }}
          >
            Try Again
          </Button>
        </div>
      </body>
    </html>
  )
}