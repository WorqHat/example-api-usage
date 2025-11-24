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

const SITE_TITLE = "WorqHat API Playground";
const SITE_DESCRIPTION =
  "Postman-inspired WorqHat API tester with real-time responses and ready-to-use request snippets.";
const ICON_URL = "https://assets.worqhat.com/logos/worqhat-icon.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://worqhat.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "WorqHat",
    "API playground",
    "API testing",
    "SDK samples",
    "developer tools",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://worqhat.com",
    siteName: "WorqHat",
    images: [
      {
        url: "https://assets.worqhat.com/logos/worqhat-logo-dark.png",
        width: 1000,
        height: 448,
        alt: "WorqHat logomark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["https://assets.worqhat.com/logos/worqhat-logo-dark.png"],
  },
  icons: {
    icon: ICON_URL,
    shortcut: ICON_URL,
    apple: ICON_URL,
  },
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
