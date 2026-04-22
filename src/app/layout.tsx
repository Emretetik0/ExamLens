import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "ExamLens | PDR Performans Analiz Sistemi",
  description: "Öğrenci sınav performanslarını analiz edin, trendleri belirleyin ve riskli öğrencileri tespit edin.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased text-foreground bg-background`}>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
