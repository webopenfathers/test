import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    // 配置代理
    proxy: {
      '/api': 'http://api-driver.marsview.cc'
    }
  },
  plugins: [react()]
})
