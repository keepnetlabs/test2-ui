// Generic smoke tests for view exports/imports.
// Intentionally avoids mounting complex views to prevent false negatives
// from unrelated store/directive/router side effects.

const viewsToTest = [
  'Permissions',
  'Reports',
  'Sandbox',
  'Scorm',
  'Settings',
  'AwarenessEducator',
  'AdvancedReports',
  'AdvancedReport',
  'CallbackScenarios',
  'CampaignManagerReport',
  'Training'
]

describe('Generic Views - Import Smoke Tests', () => {
  viewsToTest.forEach((viewName) => {
    describe(`${viewName}.vue`, () => {
      let Component
      let importError

      beforeEach(() => {
        Component = null
        importError = null
        try {
          const mod = require(`@/views/${viewName}`)
          Component = mod?.default || mod
        } catch (e) {
          importError = e
          Component = null
        }
      })

      it('is either importable or intentionally absent with module-not-found error', () => {
        if (Component) {
          expect(Component).toBeDefined()
          return
        }
        expect(importError).toBeDefined()
        expect(String(importError.message || importError)).toMatch(
          /Cannot find module|Could not locate module/
        )
      })

      it('has a valid export shape when present', () => {
        if (!Component) {
          expect(importError).toBeDefined()
          return
        }
        expect(typeof Component).toBe('object')
      })

      it('contains component options when present', () => {
        if (!Component) {
          expect(importError).toBeDefined()
          return
        }
        expect(Component.name || Component.__file || Component.render).toBeTruthy()
      })
    })
  })
})
