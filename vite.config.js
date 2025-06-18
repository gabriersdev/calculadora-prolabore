import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {terser} from 'rollup-plugin-terser'
import {visualizer} from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({open: true})
  ],
  base: "/calculadora-prolabore/",
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        // Gera um único bundle
        // manualChunks: undefined,
        // Remoção definida manualmente
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        }
      },
      plugins: [
        terser({
          format: {
            // Remove comentários
            comments: false,
          },
          compress: {
            // Remove console.log
            drop_console: true,
            // Remove debugger
            drop_debugger: true,
            // Compressão mais agressiva
            passes: 3,
            pure_funcs: ['console.info', 'console.debug', 'console.warn'],
          }
        })
      ]
    }
  },
})