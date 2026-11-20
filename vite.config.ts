import {writeReadingPages} from './scripts/public-reading';
import {journals} from './app/data';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

writeReadingPages(journals);

export default defineConfig({ base: './', plugins: [react()], build: { outDir: 'docs', emptyOutDir: true }, server: { host: '0.0.0.0', port: 4173 } });
