import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { getRemoteEntryUrl } from 'mf-timekeeper';

export default defineConfig(async () => {
  return {
    plugins: [
      react(),
      federation({
        name: 'host-app',
        remotes: {
          remoteApp: {
            external: await getRemoteEntryUrl('localhost:4173/assets', 'egg', '127.0.0.1:8000'),
            externalType: 'promise'
          }
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
