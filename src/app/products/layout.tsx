
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pantry | Products Page",
    description: "Pantry - grocery shop products page  ",
};

export default function ProductsPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
