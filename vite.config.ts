import { defineConfig } from 'vite';
export default defineConfig({ base: './', resolve: { preserveSymlinks: true }, server: { host: '127.0.0.1', port: 4180 }, build: { target: 'es2022' } });
