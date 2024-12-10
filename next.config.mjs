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
});

const nextConfig = {
  images: {
    domains: ["tailwindui.com", "images.unsplash.com"],
  },
};

export default withPWA(nextConfig);
