/**
 * Polyfill is loaded from tests/unit/index.js (same module as src/main.js).
 * Ensures Jest has structuredClone before any store/component that uses it.
 */
describe('structuredClonePolyfill', () => {
  it('defines global structuredClone and clones plain serializable values', () => {
    expect(typeof globalThis.structuredClone).toBe('function')
    expect(globalThis.structuredClone({ a: 1, b: [2] })).toEqual({ a: 1, b: [2] })
    expect(globalThis.structuredClone(undefined)).toBeUndefined()
  })
})
