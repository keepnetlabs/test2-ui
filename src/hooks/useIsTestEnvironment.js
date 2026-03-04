import { isTestEnvironment } from '@/utils/isTestEnvironment'

/**
 * Mixin that provides isTestEnvironment computed property.
 * Use for components that need to conditionally show test-only UI.
 */
export default {
  computed: {
    isTestEnvironment() {
      return isTestEnvironment()
    }
  }
}
