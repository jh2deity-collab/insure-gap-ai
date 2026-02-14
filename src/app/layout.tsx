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
  title: "InsureGap AI | 금융 & 보험 보장 분석 솔루션",
  description: "AI 기반으로 당신의 보험 보장 공백과 재무 상태를 입체적으로 분석합니다. 놓치고 있는 인생의 Gap을 찾아 완벽한 미래를 설계하세요.",
  keywords: ["보험 분석", "재무 설계", "AI 금융 진단", "보험 리모델링", "노후 준비", "자산 관리", "파이어족"],
  authors: [{ name: "InsureGap Team" }],
  openGraph: {
    title: "InsureGap AI - 내 인생의 빈틈을 채우다",
    description: "3분 만에 끝나는 AI 정밀 보장 분석. 당신의 보험과 자산 현황을 점수로 확인해보세요.",
    url: "https://insuregap.ai",
    siteName: "InsureGap AI",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Need to ensure this image exists or use a placeholder path
        width: 1200,
        height: 630,
        alt: "InsureGap AI Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InsureGap AI | 금융 & 보험 보장 분석",
    description: "AI가 진단하는 내 금융 건강 점수는? 지금 바로 확인하세요.",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
