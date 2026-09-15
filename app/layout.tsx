import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { EmergencyBanner } from "@/components/common/EmergencyBanner";

export const metadata: Metadata = {
  title: "HeartGuard AI | AI-Powered Heart Disease Risk Screening",
  description:
    "An educational healthcare platform estimating cardiovascular risk using machine learning models trained on the UCI Cleveland dataset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-full bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
