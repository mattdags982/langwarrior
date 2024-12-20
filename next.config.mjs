import withPWAInit from "@ducanh2912/next-pwa";
/** @type {import('next').NextConfig} */


const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
  extendDefaultRuntimeCaching: true,
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
    domains: ["tailwindui.com", "images.unsplash.com", "lh3.googleusercontent.com"],
  },
};

export default withPWA(nextConfig);
