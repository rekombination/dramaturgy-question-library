import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://thedramaturgy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Dramaturgy | Community for Dramaturgical Questions",
    template: "%s | The Dramaturgy",
  },
  description:
    "The Dramaturgy is a community platform for dramaturgical questions and knowledge sharing in theatre and performing arts. Ask questions, get expert perspectives, and build your dramaturgical toolkit.",
  keywords: [
    "dramaturgy",
    "dramaturg",
    "theatre",
    "theater",
    "performing arts",
    "stage",
    "playwriting",
    "directing",
    "production",
    "rehearsal",
    "community",
    "questions",
    "knowledge base",
  ],
  authors: [{ name: "The Dramaturgy" }],
  creator: "The Dramaturgy",
  publisher: "The Dramaturgy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["de_DE"],
    url: siteUrl,
    siteName: "The Dramaturgy",
    title: "The Dramaturgy | Community for Dramaturgical Questions",
    description:
      "The Dramaturgy is a community platform for dramaturgical questions and knowledge sharing in theatre and performing arts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Dramaturgy - Question Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dramaturgy | Community for Dramaturgical Questions",
    description:
      "The Dramaturgy is a community platform for dramaturgical questions and knowledge sharing in theatre and performing arts.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": `${siteUrl}/en`,
      "de-DE": `${siteUrl}/de`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer className="hidden md:block" />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
