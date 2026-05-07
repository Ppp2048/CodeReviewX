import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "CodeReviewX",
  description: "AI-assisted pull request review workspace scaffold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
