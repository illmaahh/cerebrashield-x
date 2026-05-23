import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CerebraShield X — Cognitive Security Platform",
  description: "Real-time AI ecosystem defense against cognitive attacks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scanlines">
      <body>{children}</body>
    </html>
  );
}
