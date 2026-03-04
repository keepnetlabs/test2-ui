/**
 * Returns true when running in test or local environment (test-ui.devkeepnet.com or localhost).
 * Use to conditionally show features that should not appear in production.
 * @returns {boolean}
 */
export function isTestEnvironment() {
  return (
    globalThis.location.hostname.includes('test-ui.devkeepnet.com') ||
    globalThis.location.hostname.includes('localhost')
  )
}
