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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mygasapp.vercel.app"),
  title: "MyGasApp - Real-Time Fuel Prices",
  description: "Get instant, accurate fuel prices powered by crowdsourced data from real travelers. Download RestStop, FuelFinder, or TripPlanner today.",
  keywords: ["fuel prices", "gas prices", "crowdsourced", "real-time", "travel", "trip planning"],
  authors: [{ name: "MyGasApp" }],
  icons: {
    icon: [
      { url: "/website_favicon_logo/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
  },
  openGraph: {
    title: "MyGasApp - Real-Time Fuel Prices",
    description: "Get instant, accurate fuel prices powered by crowdsourced data from real travelers.",
    url: "https://mygasapp.com",
    siteName: "MyGasApp",
    images: [
      {
        url: "/website_favicon_logo/logo.png",
        width: 1200,
        height: 630,
        alt: "MyGasApp - Real-Time Fuel Prices",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyGasApp - Real-Time Fuel Prices",
    description: "Get instant, accurate fuel prices powered by crowdsourced data from real travelers.",
    images: ["/website_favicon_logo/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}
      >
        {children}
      </body>
    </html>
  );
}
