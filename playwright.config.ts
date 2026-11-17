import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir:'./tests',testMatch:'**/*.spec.ts',use:{baseURL:process.env.PREVIEW_URL || 'http://127.0.0.1:8084',viewport:{width:390,height:844},screenshot:'only-on-failure'},outputDir:'../work/test-results',reporter:'list',timeout:60000 });
