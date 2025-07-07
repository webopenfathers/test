import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // 配置 scss
  css: {
    preprocessorOptions: {
      scss: {
        // 为 Sass 添加全局变量文件---这样就会在每个scss文件的头部自动添加全局变量
        // 每个scss文件也可以直接使用 mixin.scss 中的函数或者混入，而不需要局部引入
        additionalData: `@use "@/assets/styles/mixin.scss" as *;`,
      },
    },
  },
  server: {
    open: true, // 启动时自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://106.14.223.52', // 代理目标地址
        changeOrigin: true, // 是否改变源地址
      },
      '/public': {
        target: 'http://106.14.223.52', // 代理目标地址
        changeOrigin: true, // 是否改变源地址
      },
    },
  },
});
