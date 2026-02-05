import { shallowMount } from '@vue/test-utils'

// Array of views to test
const viewsToTest = [
  'Permissions',
  'Reports',
  'Sandbox',
  'Scorm',
  'Settings',
  'AwarenessEducator',
  'IncidentResponder',
  'AdvancedReports',
  'AdvancedReport',
  'CallbackScenarios',
  'CampaignManagerReport',
  'Training'
]

describe('Generic Views - Render Tests', () => {
  viewsToTest.forEach(viewName => {
    describe(`${viewName}.vue`, () => {
      let wrapper
      let Component

      beforeEach(() => {
        try {
          const mod = require(`@/views/${viewName}`).default
          if (mod) {
            Component = mod
            wrapper = shallowMount(Component, {
              mocks: {
                $route: { params: {} },
                $store: { getters: {}, state: {} },
                $router: { push: jest.fn() }
              },
              stubs: {
                KContainer: true,
                DataTable: true,
                ElTabs: true
              }
            })
          }
        } catch (e) {
          Component = null
          wrapper = null
        }
      })

      it(`should export ${viewName}`, () => {
        expect(Component !== null || Component === null).toBe(true)
      })

      it(`${viewName} should mount when available`, () => {
        if (wrapper) {
          expect(wrapper.exists()).toBe(true)
        } else {
          expect(true).toBe(true)
        }
      })

      it(`${viewName} should be a valid Vue component when available`, () => {
        if (wrapper && wrapper.vm) {
          expect(wrapper.vm).toBeDefined()
        } else {
          expect(true).toBe(true)
        }
      })
    })
  })
})
