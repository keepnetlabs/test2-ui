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

  it('handles null and nested plain objects like native structuredClone', () => {
    expect(globalThis.structuredClone(null)).toBeNull()
    expect(globalThis.structuredClone({ nested: { x: 1 }, arr: [1, 2] })).toEqual({
      nested: { x: 1 },
      arr: [1, 2]
    })
  })
})
