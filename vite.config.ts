
import { defineConfig } from 'vite'

export default defineConfig({
  base: "./",
  build: {
    target: 'node16',
    lib: {
      entry: 'server.ts',
      name: 'server',
      formats: ['cjs'],
      fileName: 'server'
    },
    rollupOptions: {
      external: ['express', '@lark-base-open/node-sdk', 'axios']
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  esbuild: {
    platform: 'node'
  }
})
