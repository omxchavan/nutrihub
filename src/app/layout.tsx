import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import MobileNav from "@/components/ui/MobileNav";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriHub | AI Health Intelligence",
  description: "Futuristic AI-powered nutrition tracking and diet intelligence platform.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.variable} antialiased`}>
          <div className="min-h-dvh">
            <Navbar />
            <main>
              {children}
            </main>
            <MobileNav />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
