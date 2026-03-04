/**
 * Returns true when running in test or local environment (test-ui.devkeepnet.com or localhost).
 * Use to conditionally show features that should not appear in production.
 * @returns {boolean}
 */
export function isTestEnvironment() {
  const hostname = globalThis.location?.hostname
  if (!hostname || typeof hostname !== 'string') return false
  return (
    hostname.includes('test-ui.devkeepnet.com') || hostname.includes('localhost')
  )
}
