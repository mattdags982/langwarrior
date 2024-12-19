import withPWAInit from "@ducanh2912/next-pwa";
/** @type {import('next').NextConfig} */


const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\/audio\/.*\.mp3$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'cloudinary-audio-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig = {
  images: {
    domains: ["tailwindui.com", "images.unsplash.com"],
  },
};

export default withPWA(nextConfig);
