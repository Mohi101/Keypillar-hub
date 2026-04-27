import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeyPillar Hub",
  description: "Business Operations Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
