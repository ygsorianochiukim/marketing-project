import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The /auto_hiring/image route reads the hiring-poster backgrounds from
  // /public via fs with a computed filename. Next's file tracing can't see a
  // dynamic path, so on serverless (Vercel) the files would be missing and the
  // route would 500. Force them to be bundled with the function.
  outputFileTracingIncludes: {
    "/auto_hiring/image": ["./public/bg-hiring*.png", "./public/fonts/*"],
  },

  // Native/heavy modules that should not be bundled by Next.js — they get
  // required at runtime instead. Required for discord.js (uses native ws
  // bindings), puppeteer (Chromium binary), and sharp (libvips).
  serverExternalPackages: [
    'discord.js',
    '@discordjs/ws',
    '@discordjs/rest',
    '@discordjs/collection',
    '@discordjs/builders',
    'zlib-sync',
    'bufferutil',
    'utf-8-validate',
    'puppeteer',
    'puppeteer-core',
    'sharp',
  ],
};

export default nextConfig;
