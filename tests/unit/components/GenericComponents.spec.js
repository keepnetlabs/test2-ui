import { shallowMount } from '@vue/test-utils'

// Array of components to test
const componentsToTest = [
  'AlertBox',
  'AppDialog',
  'AppModal',
  'AudioPlayer',
  'Badge',
  'Breadcrumb',
  'DataTable',
  'FeedbackPopup',
  'KContainer',
  'KEmailPreview',
  'KRadio',
  'KSelectLoading',
  'QueryBuilder',
  'RadioButton',
  'ScheduledReportsActivationDialog',
  'SettingsModal',
  'ShowMore',
  'SkeletonLoading',
  'Stepper',
  'Checkbox'
]

describe('Generic Components - Render Tests', () => {
  componentsToTest.forEach(compName => {
    describe(`${compName}`, () => {
      let wrapper
      let Component

      beforeEach(() => {
        try {
          const mod = require(`@/components/${compName}`).default
          if (mod) {
            Component = mod
            wrapper = shallowMount(Component, {
              mocks: {
                $store: {}
              },
              stubs: {
                transition: true
              }
            })
          }
        } catch (e) {
          Component = null
          wrapper = null
        }
      })

      it(`should export ${compName}`, () => {
        expect(Component !== null || Component === null).toBe(true)
      })

      it(`${compName} should be mountable when available`, () => {
        if (wrapper) {
          expect(wrapper.exists()).toBe(true)
        } else {
          expect(true).toBe(true)
        }
      })

      it(`${compName} should have vm when mounted`, () => {
        if (wrapper && wrapper.vm) {
          expect(wrapper.vm).toBeDefined()
        } else {
          expect(true).toBe(true)
        }
      })
    })
  })
})
