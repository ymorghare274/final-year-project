import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yukta Jewellery | Premium Handcrafted Gold & Diamond Jewellery",
  description: "Shop the finest collection of gold, silver, and diamond jewellery at Yukta Jewellery. Experience timeless elegance with our premium handcrafted sets, bridal collections, and everyday luxury.",
  keywords: ["jewellery", "gold", "diamond", "bridal jewellery", "rings", "necklaces", "Yukta Store", "luxury jewellery"],
  authors: [{ name: "Yukta Jewellery Team" }],
  openGraph: {
    title: "Yukta Jewellery | Premium Jewellery E-commerce",
    description: "Discover timeless beauty and handcrafted excellence in every piece.",
    url: "https://yukta-jewellery.vercel.app",
    siteName: "Yukta Jewellery",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yukta Jewellery Showcase",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yukta Jewellery",
    description: "Premium Handcrafted Jewellery for Every Occasion.",
    images: ["/og-image.jpg"],
  },
};

import CustomCursor from "@/components/layout/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}>
        <Toaster position="bottom-right" />
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
