import { defineConfig } from 'vitest/config'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  test: {
    // 将全局超时时间设置为 30 秒
    testTimeout: 30000,
  },
})
