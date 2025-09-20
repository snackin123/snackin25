import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['snackinofficial.com'],
    unoptimized: true,
  },
  trailingSlash: true,
  // Server actions configuration
  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.1.101', 'localhost']
    }
  },
  // External packages for server components
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/components': path.resolve(__dirname, './components'),
      '@/app': path.resolve(__dirname, './app'),
      '@/types': path.resolve(__dirname, './types'),
    };

    // Add fallback configurations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    return config;
  },
};

// Only enable bundle analyzer when explicitly requested
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzerConfig(nextConfig);
