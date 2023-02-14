import { defineConfig, UserConfig } from 'vitest/config'

export const config: UserConfig = {
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  }
}

export default defineConfig(config)