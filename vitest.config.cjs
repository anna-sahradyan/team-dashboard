/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,           // чтобы можно было писать it/describe без import
        environment: 'jsdom',    // для тестирования компонентов React
        setupFiles: './setupTests.ts', // если есть файл с глобальной настройкой
        include: ['**/*.test.{ts,tsx}'], // где искать тесты
    },
});
