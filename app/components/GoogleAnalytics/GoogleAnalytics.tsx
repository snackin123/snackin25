import { useEffect } from "react";

interface GoogleAnalyticsProps {
  trackingId: string;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GoogleAnalyticsClient = ({ trackingId }: GoogleAnalyticsProps) => {
  useEffect(() => {
    if (typeof window !== "undefined" && trackingId) {
      // Load Google Analytics asynchronously
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", trackingId);
      };
    }
  }, [trackingId]);

  return null;
};

export default GoogleAnalyticsClient;
