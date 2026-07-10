import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account - Pantry",
  description: "Manage your account settings",
  openGraph: {
    title: "My Account - Pantry",
    description: "Manage your account settings",
    type: "website",
  },
};

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
