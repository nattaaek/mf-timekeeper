import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { getRemoteEntryUrl } from 'mf-timekeeper';

export default defineConfig(async () => {
  // Fetching the remote entry URL asynchronously
  ;

  return {
    plugins: [
      react(),
      federation({
        name: 'host-app',
        remotes: {
          //remoteApp: url
          remoteApp: {
            external: getRemoteEntryUrl('localhost:4173/assets', 'egg', '127.0.0.1:8000'),
            external: `fetch('http://localhost:8000/api/versions').then(response=>response.json()).then(data=>data.mf_version.version)`,
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
