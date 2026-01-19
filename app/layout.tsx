import { Poppins } from "next/font/google";
import { Metadata, Viewport } from 'next';
import { metadata as siteMetadata } from "../utils/metadata";
import { seoMeta } from "../utils/SeoMeta";
import "./globals.css";

// Import client components
import ClientLayout from "./ClientLayout";

// Import CartProvider
import { CartProvider } from "@/lib/cart-context";
import { ReactNode } from 'react';
import GoogleAnalytics from "@/app/components/GoogleAnalytics";
import MarketingPopup from "@/app/components/MarketingPopup/MarketingPopup";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "600"],
  display: "swap",
});

interface RootLayoutProps {
  children: ReactNode;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  robots: siteMetadata.robots,
  icons: siteMetadata.icons,
  appleWebApp: {
    title: siteMetadata.appleWebApp?.title,
    statusBarStyle: 'default',
  },
  openGraph: {
    ...seoMeta.openGraph,
    images: seoMeta.openGraph.images?.map(img => ({
      url: img.url,
      width: img.width,
      height: img.height,
      alt: img.alt,
    })),
  },
  twitter: {
    card: 'summary_large_image',
    images: seoMeta.twitter?.image ? [seoMeta.twitter.image] : [],
  },
  metadataBase: new URL('https://snackinofficial.com'),
};

const alternateLinks = [
  { rel: 'sitemap', href: '/sitemap.xml', type: 'application/xml' },
];

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="antialiased">
        {/* Wrap entire app in CartProvider */}
        <CartProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <MarketingPopup /> {/* Add the marketing popup here */}
        </CartProvider>
      </body>
    </html>
  );
}
