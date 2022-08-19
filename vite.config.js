import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

const bundlingConf = {
  lib: {
    entry: resolve(__dirname, '/src/richer-than-you/index.js'),
    name: 'RicherThanYou',
    formats: ['es', 'umd', 'cjs']
  },
  rollupOptions: {
    plugins: [
      // Rollup generates all the files, then remove what we don't want.
      // Delete({ targets: ['dist/{images}', 'dist/*.{ico,txt,html}'], hook: 'generateBundle' })
    ],
    // Make sure to externalize deps that shouldn't be bundled into library.
    external: ['vue'],
    output: {
      // Provide global variables to use in the UMD build for externalized deps.
      globals: { vue: 'Vue' }
    }
  }
}

const build = process.env.BUNDLE ? bundlingConf : { outDir: 'docs' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/documentation/scss/variables";'
      }
    }
  },
  build
})
