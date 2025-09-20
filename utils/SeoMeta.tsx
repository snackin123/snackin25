// /app/utils/seoMeta.js

export const seoMeta = {
    openGraph: {
      type: "website",
      url: "https://snackinofficial.com/",
      title: "snackin' Official - Healthy and Flavorful Snacks",
      description: "Snack smart and discover healthy, guilt-free snacks at snackin'. Delicious, nutritious, and satisfying.",
      images: [
        {
          url: "https://snackinofficial.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Healthy Snacks by snackin'",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      image: "https://snackinofficial.com/twitter-image.jpg",
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "snackin' Official",
      "url": "https://snackinofficial.com/",
      "publisher": {
        "@type": "Organization",
        "name": "snackin' Official",
        "logo": {
          "@type": "ImageObject",
          "url": "https://snackinofficial.com/logo.png",
          "width": 300,
          "height": 300,
        },
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://snackinofficial.com/search?q={search_term}",
        "query-input": "required name=search_term",
      },
    },
  };
  