/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // avoid cache issues in dev
  ...require('./next-pwa.config.js'),
});

const nextConfig = {
  experimental: {
    appDir: true, // <- for App Router
  },images: {
    domains: ['s1.ticketm.net','media.ticketmaster.eu','images.universe.com'],
  },
  // other config
};

module.exports = withPWA(nextConfig);
