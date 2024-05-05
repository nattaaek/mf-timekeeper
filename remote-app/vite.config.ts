import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation";
import { updateVersion } from 'mf-timekeeper';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const timestamp = Date.now();
  if (process.env.VITE_BUILD_MODE === 'build') {
    await updateVersion('127.0.0.1:8000', 'egg', timestamp.toString());
  }
  return {
    plugins: [react(),
      federation({
        name: "remote_app",
        filename: `${timestamp}_remoteEntry.js`,
        exposes: {
          "./SampleDialog": "./src/SampleDialog",
        },
        shared: ["react", "react-dom"],
      })
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    }
  }
})
