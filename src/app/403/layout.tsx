import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied - Pantry",
  description: "You don't have permission",
  openGraph: {
    title: "Access Denied - Pantry",
    description: "You don't have permission",
    type: "website",
  },
};

export default function AccessDeniedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
