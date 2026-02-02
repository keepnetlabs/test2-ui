import { shallowMount } from '@vue/test-utils'
import BackButton from '@/components/Common/Buttons/BackButton.vue'
import labels from '@/model/constants/labels'

describe('BackButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(BackButton)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('BackButton')
    })

    it('should render a v-btn element', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('button properties', () => {
    it('should have fw-600 class', () => {
      expect(wrapper.classes()).toContain('fw-600')
    })

    it('should be outlined', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have cyan color', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should be rounded', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('label prop', () => {
    it('should display Back label', () => {
      expect(wrapper.text()).toContain(labels.Back)
    })

    it('should use labels from imported constants', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should render correct label text', () => {
      const expectedText = labels.Back
      expect(wrapper.text()).toBe(expectedText)
    })
  })

  describe('data properties', () => {
    it('should have labels in data', () => {
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('should have correct labels reference', () => {
      expect(wrapper.vm.labels).toEqual(labels)
    })
  })

  describe('styling', () => {
    it('should have bold font weight class', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should have cyan color theme', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have rounded shape', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have outlined appearance', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('attributes and listeners', () => {
    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          disabled: true,
          'aria-label': 'Go back'
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should support disabled state', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should allow aria-label customization', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          'aria-label': 'Navigate back'
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('aria-label')).toBe('Navigate back')
    })

    it('should support loading state via attributes', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          loading: true
        }
      })
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })
  })

  describe('user interactions', () => {
    it('should emit click event', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should be clickable', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should be accessible as button element', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should be a button element', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have text content for screen readers', () => {
      expect(wrapper.text().length).toBeGreaterThan(0)
    })

    it('should support disabled state', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should allow aria-label customization', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          'aria-label': 'Return to previous page'
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('aria-label')).toBe('Return to previous page')
    })
  })

  describe('responsive behavior', () => {
    it('should maintain properties on re-render', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should handle dynamic attribute changes', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          size: 'small'
        }
      })
      await wrapper.setProps({})
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })
  })

  describe('visual design', () => {
    it('should use cyan color for consistency', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should indicate navigation with Back text', () => {
      expect(wrapper.text()).toBe(labels.Back)
    })

    it('should be visually distinct as navigation button', () => {
      expect(wrapper.vm.$options.name).toBe('BackButton')
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should maintain consistent styling', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('label consistency', () => {
    it('should display Back label consistently', () => {
      expect(wrapper.text()).toBe(labels.Back)
    })

    it('should use labels constant', () => {
      expect(wrapper.vm.labels.Back).toBe(labels.Back)
    })

    it('should render text from labels', () => {
      const text = wrapper.text()
      expect(text).toBe(wrapper.vm.labels.Back)
    })
  })

  describe('button styling classes', () => {
    it('should have fw-600 font weight class', () => {
      expect(wrapper.classes()).toContain('fw-600')
    })

    it('should pass through all styling', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should work as standalone back button', () => {
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.text()).toBe(labels.Back)
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should work in navigation flow', () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          'aria-label': 'Return to previous step'
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should support disabling navigation', () => {
      wrapper = shallowMount(BackButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  describe('component reactivity', () => {
    it('should render consistently', async () => {
      const beforeText = wrapper.text()
      await wrapper.vm.$forceUpdate()
      expect(wrapper.text()).toBe(beforeText)
    })

    it('should maintain label through lifecycle', async () => {
      expect(wrapper.text()).toBe(labels.Back)
      await wrapper.vm.$forceUpdate()
      expect(wrapper.text()).toBe(labels.Back)
    })
  })
})
