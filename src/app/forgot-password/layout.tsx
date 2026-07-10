import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Pantry",
  description: "Reset your password",
  openGraph: {
    title: "Forgot Password - Pantry",
    description: "Reset your password",
    type: "website",
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
