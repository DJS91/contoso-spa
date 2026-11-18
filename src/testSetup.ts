import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach((): void => {
  window.localStorage.clear()
})

afterEach((): void => {
  cleanup()
  vi.restoreAllMocks()
})
