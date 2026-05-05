import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GovBot from "@/components/GovBot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GovBridge India | Personalized Government Benefits Portal",
  description: "Bridging the gap between citizens and government benefits. Find scholarships, farmer subsidies, and social welfare schemes tailored to your profile.",
  keywords: ["Government Schemes", "India", "Scholarships", "Farmer Benefits", "Personalized Welfare"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <GovBot />
        <Footer />
      </body>
    </html>
  );
}
