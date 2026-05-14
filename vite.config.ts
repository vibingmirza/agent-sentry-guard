import { defineConfig } from "@lovable/sdk"; // or whatever your top line says
// Ensure nitro is added to your plugin options if it isn't already:
export default defineConfig({
  // ... your existing config
  nitro: {
    preset: "vercel"
  }
});
