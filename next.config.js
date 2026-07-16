/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['pdfkit'],
    outputFileTracingIncludes: {
      '/api/quotes/[number]/pdf': [
        './assets/fonts/**/*',
        './node_modules/pdfkit/js/data/**/*'
      ]
    }
  }
};

module.exports = nextConfig;
