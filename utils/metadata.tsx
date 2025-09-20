// /app/utils/metadata.js

export const metadata = {
  title: "snackin' Official - Healthy and Flavorful Snacks",
  description: "Discover a wide range of healthy, delicious, and guilt-free snacks at snackin'. Snack smart and enjoy flavorful bites.",
  keywords: "healthy snacks, guilt-free snacks, tasty bites, snackin', flavorful snacks",
  robots: "index, follow", // Allows search engines to index the page
  icons: {
    icon: "/Images/favicon.ico",
    apple: "/apple-touch-icon.png",
    favicon: [
      { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
    ],
    manifest: "/site.webmanifest",
  },
  appleWebApp: {
    title: "snackin' - Healthy Snacks",
    statusBarStyle: "default",
  },
  alternates: {
    canonical: "https://snackinofficial.com/",
  },
  other: [
    { rel: "sitemap", href: "/sitemap.xml", type: "application/xml" },
  ],
};
