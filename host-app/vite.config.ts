import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import getRemoteEntryUrl from 'mf-timekeeper';

export default defineConfig(async () => {
  // Fetching the remote entry URL asynchronously
  const url = await getRemoteEntryUrl('http://localhost:8000', 'egg');

  return {
    plugins: [
      react(),
      federation({
        name: 'host-app',
        remotes: {
          remoteApp: url, // Dynamically setting the URL from fetched data
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
  };
});
