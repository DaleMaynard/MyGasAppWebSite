import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyGasApp - Real-Time Fuel Prices",
  description: "Get instant, accurate fuel prices powered by crowdsourced data from real travelers. Download RestStop, FuelFinder, or TripPlanner today.",
  keywords: ["fuel prices", "gas prices", "crowdsourced", "real-time", "travel", "trip planning"],
  authors: [{ name: "MyGasApp" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}
      >
        {children}
      </body>
    </html>
  );
}
