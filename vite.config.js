import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Replace 'hostel-hub' with your exact GitHub repo name
  base: '/hostel-hub/',
});
