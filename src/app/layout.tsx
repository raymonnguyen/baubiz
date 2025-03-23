import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// export const metadata: Metadata = {
//   title: "Mom & Newborn Marketplace",
//   description: "A safe and vibrant community marketplace for moms to buy, sell, and trade baby and maternity items.",
//   keywords: "baby marketplace, maternity, moms, children, buy, sell, trade, secondhand, parenting",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
