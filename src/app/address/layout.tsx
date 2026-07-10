import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Address Book - Pantry",
  description: "Manage your delivery addresses",
  openGraph: {
    title: "Address Book - Pantry",
    description: "Manage your delivery addresses",
    type: "website",
  },
};

export default function AddressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
