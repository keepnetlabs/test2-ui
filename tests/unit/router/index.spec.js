/**
 * Router is globally mocked in tests/unit/index.js.
 * This spec verifies the router module exports the interface the app expects.
 */
import router from '@/router/index'

describe('router/index.js', () => {
  it('exports router module', () => {
    expect(router).toBeDefined()
  })

  it('provides navigation methods', () => {
    expect(typeof router.push).toBe('function')
    expect(typeof router.replace).toBe('function')
    expect(typeof router.go).toBe('function')
  })

  it('provides currentRoute', () => {
    expect(router.currentRoute).toBeDefined()
    expect(router.currentRoute).toHaveProperty('path')
    expect(router.currentRoute).toHaveProperty('name')
  })
})
