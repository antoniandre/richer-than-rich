import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import pkg from './package.json'

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} Antoni Andre
  * @license MIT
  */`

const bundlingConf = {
  lib: {
    entry: resolve(__dirname, '/src/richer-than-rich/index.vue'),
    name: 'RicherThanRich',
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
      banner,
      // Provide global variables to use in the UMD build for externalized deps.
      globals: { vue: 'Vue' },
      entryFileNames: 'richer.[format].js',
      chunkFileNames: '[name].js'
    }
  }
}

const build = process.env.BUNDLE ? bundlingConf : { outDir: 'docs' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: { whitespace: 'preserve' }
      }
    })
  ],
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
    },
    postcss: {
      plugins: [autoprefixer]
    }
  },
  build
})
