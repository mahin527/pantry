
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pantry | Products Details Page",
    description: "Pantry - grocery shop products details page  ",
};

export default function ProductPageLayout({
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
