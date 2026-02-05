import { shallowMount } from '@vue/test-utils'

// Mock the Widgets component to avoid loading its dependencies
jest.mock('@/views/Widgets', () => ({
  name: 'Widgets',
  template: '<div></div>'
}))

// Must import after mocking
import Dashboard from '@/views/Dashboard.vue'

describe('Dashboard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Dashboard, {
      mocks: {
        $store: {
          getters: {
            'permissions/getWidgetsPermissions': () => []
          }
        }
      },
      stubs: {
        Widgets: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('Component Setup', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should have Widgets component registered', () => {
      const components = wrapper.vm.$options.components
      expect(components.Widgets).toBeDefined()
    })
  })

  describe('Computed Properties', () => {
    it('should map permissions from store', () => {
      expect(wrapper.vm.permissions).toBeDefined()
    })
  })

  describe('Template Structure', () => {
    it('should have div wrapper element', () => {
      expect(wrapper.element.tagName).toBe('DIV')
    })
  })
})
