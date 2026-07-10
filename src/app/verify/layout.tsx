import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - Pantry",
  description: "Verify your email address",
  openGraph: {
    title: "Verify Email - Pantry",
    description: "Verify your email address",
    type: "website",
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
