/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
            },
            {
                protocol: 'https',
                hostname: 'example.com', // Add example.com here
            },
        ],

    },
    i18n: {
        locales: ["en", "hi", "mr"], // Supported languages
        defaultLocale: "en", // Default language
      },
    experimental: {},
  };
  
  module.exports = nextConfig;
  