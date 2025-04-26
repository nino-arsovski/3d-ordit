import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Allow access from outside localhost
    port: 3000, // Specify the port you want to use
  },
});
