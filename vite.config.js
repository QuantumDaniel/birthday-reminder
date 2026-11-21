import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset URLs relative so the build works on Netlify, Vercel,
// and GitHub Pages (including project sub-paths) without extra configuration.
export default defineConfig({
  base: './',
  plugins: [react()],
});
