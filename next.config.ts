import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
