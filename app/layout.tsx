import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaStudio",
  description: "AI-powered media strategy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
