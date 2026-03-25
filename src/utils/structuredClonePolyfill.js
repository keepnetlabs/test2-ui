/**
 * Fallback when native structuredClone is missing (older runtimes, some embedded contexts).
 * Matches plain-object/array cloning via JSON; omit undefined in objects, circular refs, etc.
 */
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = function structuredClone(value) {
    if (value === undefined) {
      return undefined
    }
    return JSON.parse(JSON.stringify(value))
  }
}
