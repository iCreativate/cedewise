/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Single Leaflet instance for app + leaflet.heat UMD (avoids missing heatLayer / blank layers).
  transpilePackages: ['leaflet', 'leaflet.heat'],
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ['cedewise-storage.s3.amazonaws.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  async headers() {
    const sharedSecurityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
    ]

    // In development, omit CSP: Next.js HMR / devtools / source maps can trip strict CSP and
    // Chrome shows generic "script-src blocked" even when extensions inject scripts.
    // Production keeps a full CSP (includes unsafe-eval for remaining legacy bundles; tighten over time).
    if (process.env.NODE_ENV !== 'production') {
      return [{ source: '/:path*', headers: sharedSecurityHeaders }]
    }

    const csp = `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://maps.googleapis.com https://maps.gstatic.com;
              worker-src 'self' blob:;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: blob: https://cedewise-storage.s3.amazonaws.com https://*.basemaps.cartocdn.com https://basemaps.cartocdn.com https://*.cartocdn.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com;
              connect-src 'self' https://*.amazonaws.com https://nominatim.openstreetmap.org https://maps.googleapis.com https://*.basemaps.cartocdn.com https://basemaps.cartocdn.com;
              frame-src 'self' https://www.google.com https://*.google.com;
            `
      .replace(/\s{2,}/g, ' ')
      .trim()

    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }, ...sharedSecurityHeaders],
      },
    ]
  }
};

module.exports = nextConfig; 