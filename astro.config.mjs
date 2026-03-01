// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import { execSync } from 'child_process';

let commitHash = "unknown";
let commitDate = new Date().toISOString();

try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  commitDate = execSync('git log -1 --format=%cd --date=iso-strict').toString().trim();
} catch (e) {
  // ignore
}

// https://astro.build/config
export default defineConfig({
  site: 'https://mihranrazaa.info',
  output: 'server',
  adapter: cloudflare(),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    define: {
      __COMMIT_HASH__: JSON.stringify(process.env.CF_PAGES_COMMIT_SHA ? process.env.CF_PAGES_COMMIT_SHA.substring(0, 7) : commitHash),
      __COMMIT_DATE__: JSON.stringify(commitDate),
    }
  }
});