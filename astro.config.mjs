import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  server: {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST",
      "access-control-allow-headers": "x-requested-with, content-type, authorization"
      },
  }
});