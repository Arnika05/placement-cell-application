import type { NextConfig } from "next";


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Allow Cloudinary images
  },
};

module.exports = nextConfig;

export default nextConfig;
