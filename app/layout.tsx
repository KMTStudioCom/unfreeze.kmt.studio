import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "立法院總預算解凍進度",
  description:
    "追蹤立法院各委員會總預算解凍進度，即時掌握最新動態。包含內政、外交及國防、經濟、財政、教育及文化、交通、司法及法制、社會福利及衛生環境等委員會的預算解凍狀況。",
  metadataBase: new URL("https://unfreeze.kmt.studio"),
  openGraph: {
    title: "立法院總預算解凍進度",
    description:
      "追蹤立法院各委員會總預算解凍進度，即時掌握最新動態。包含內政、外交及國防、經濟、財政、教育及文化、交通、司法及法制、社會福利及衛生環境等委員會的預算解凍狀況。",
    url: "https://unfreeze.kmt.studio",
    siteName: "立法院總預算解凍進度",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "立法院總預算解凍進度追蹤網站",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "立法院總預算解凍進度",
    description: "追蹤立法院各委員會總預算解凍進度，即時掌握最新動態。",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} font-sans text-gray-950 antialiased dark:text-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
