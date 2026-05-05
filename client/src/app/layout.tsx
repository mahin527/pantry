// "use client"

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/context/AppContext"
// TODO: configure theme mode (dark/light/system)
export const metadata: Metadata = {
  title: "Pantry | Grocery Shop",
  description: "Grocery shop application created by next js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Header />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
