/**
 * For `import * as SomeApi from '@/api/...'` — named exports should be request functions.
 * Skips `export default { ... }` object bundles (common in this codebase); keeps `export default function`.
 * Avoids brittle tests that assert an exact export count.
 */
export function expectNamespaceExportsOnlyFunctions(apiModule) {
  const entries = Object.entries(apiModule).filter(([name, value]) => {
    if (name === 'default' && typeof value !== 'function') {
      return false
    }
    return true
  })
  expect(entries.length).toBeGreaterThan(0)
  const nonFunctions = entries.filter(([, v]) => typeof v !== 'function').map(([n]) => n)
  expect(nonFunctions).toEqual([])
}
