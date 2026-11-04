import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Utan globals: true i vite.config.ts känner RTL inte av vitest automatiskt,
// så DOM:en städas inte mellan tester i samma fil utan detta.
afterEach(() => {
  cleanup()
})
