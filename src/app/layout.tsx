import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/providers/AppProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"

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
  icons: {
    icon: "/favicon.ico",
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
          </AppProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
