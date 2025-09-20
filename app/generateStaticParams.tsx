import sitemap from './sitemap';

// This function helps with static generation in the App Router
export function generateStaticParams() {
  const routes = sitemap();
  return routes.map(route => ({
    slug: route.url === 'https://snackinofficial.com/' ? [''] : 
         route.url.replace('https://snackinofficial.com', '').split('/').filter(Boolean)
  }));
}

// Helper function to get static paths
export function getStaticPaths() {
  const routes = sitemap();
  return {
    paths: routes.map(route => ({
      params: { 
        slug: route.url === 'https://snackinofficial.com/' ? [] : 
              route.url.replace('https://snackinofficial.com', '').split('/').filter(Boolean)
      }
    })),
    fallback: false
  };
}
