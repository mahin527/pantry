import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/providers/AppProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Pantry | Fresh Grocery Delivery",
    template: "%s | Pantry",
  },
  description: "Order fresh groceries online from Pantry. Wide selection of fruits, vegetables, meats, dairy, bakery, beverages and snacks with fast delivery.",
  keywords: ["grocery", "online grocery", "fresh food", "delivery", "pantry", "food delivery"],
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/favicon/apple-touch-icon.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Pantry",
    title: "Pantry | Fresh Grocery Delivery",
    description: "Order fresh groceries online from Pantry. Fast delivery on fruits, vegetables, meats, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pantry | Fresh Grocery Delivery",
    description: "Order fresh groceries online from Pantry.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AppProvider>
            <Header />
            {children}
            <Footer />
            <Toaster position="bottom-right" />
            <Analytics />
            <SpeedInsights />
          </AppProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
