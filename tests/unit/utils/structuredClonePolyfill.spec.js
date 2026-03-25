describe('structuredClonePolyfill', () => {
  it('installs fallback when global structuredClone is removed', () => {
    const previous = globalThis.structuredClone
    Reflect.deleteProperty(globalThis, 'structuredClone')
    if (typeof globalThis.structuredClone !== 'undefined') {
      globalThis.structuredClone = previous
      expect(typeof previous).toBe('function')
      return
    }
    try {
      jest.isolateModules(() => {
        require('@/utils/structuredClonePolyfill')
      })
      expect(typeof globalThis.structuredClone).toBe('function')
      expect(globalThis.structuredClone({ a: 1, b: [2] })).toEqual({ a: 1, b: [2] })
      expect(globalThis.structuredClone(undefined)).toBeUndefined()
    } finally {
      globalThis.structuredClone = previous
    }
  })

  it('leaves native structuredClone in place when already defined', () => {
    const current = globalThis.structuredClone
    if (typeof current !== 'function') {
      return
    }
    jest.isolateModules(() => {
      require('@/utils/structuredClonePolyfill')
    })
    expect(globalThis.structuredClone).toBe(current)
  })
})
