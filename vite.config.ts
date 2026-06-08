import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { 
      entry: "server",
      preset: "cloudflare-worker" // This forces Lovable's Vinxi engine to compile the preview for Workers
    },
  },
});
