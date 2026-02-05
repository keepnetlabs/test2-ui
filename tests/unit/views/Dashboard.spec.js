import { shallowMount } from '@vue/test-utils'
import Dashboard from '@/views/Dashboard.vue'
import Widgets from '@/views/Widgets'

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
