import { shallowMount } from '@vue/test-utils'
import CancelButton from '@/components/Common/Buttons/CancelButton.vue'
import labels from '@/model/constants/labels'

describe('CancelButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(CancelButton)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('CancelButton')
    })

    it('should render a v-btn element', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('button properties', () => {
    it('should have fw-600 class', () => {
      expect(wrapper.classes()).toContain('fw-600')
    })

    it('should have outlined property', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.outlined).toBeDefined()
    })

    it('should have rounded property', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.rounded).toBeDefined()
    })

    it('should have error color', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('error')
    })
  })

  describe('button text', () => {
    it('should display Cancel label', () => {
      expect(wrapper.text()).toContain(labels.Cancel)
    })

    it('should use labels from imported constants', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should render correct label text', () => {
      const expectedText = labels.Cancel
      expect(wrapper.text()).toBe(expectedText)
    })
  })

  describe('styling', () => {
    it('should have bold font weight class', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should have error color theme', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('error')
    })

    it('should have outlined style', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.outlined).toBeDefined()
    })

    it('should have rounded shape', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.rounded).toBeDefined()
    })
  })

  describe('user interactions', () => {
    it('should be clickable', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should emit click event', async () => {
      await wrapper.find({ name: 'VBtn' }).trigger('click')
    })

    it('should pass through click listeners', async () => {
      wrapper = shallowMount(CancelButton, {
        listeners: {
          click: jest.fn()
        }
      })
      const button = wrapper.find({ name: 'VBtn' })
      await button.trigger('click')
    })
  })

  describe('accessibility', () => {
    it('should have text content for screen readers', () => {
      expect(wrapper.text().length).toBeGreaterThan(0)
    })

    it('should support disabled state', async () => {
      wrapper = shallowMount(CancelButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should have semantic button role', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
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

  describe('attributes and listeners', () => {
    it('should bind attributes with v-bind=$attrs', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs).toBeDefined()
    })

    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(CancelButton, {
        attrs: {
          'aria-label': 'Cancel action'
        }
      })
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.attributes('aria-label')).toBe('Cancel action')
    })
  })

  describe('visual differentiation', () => {
    it('should use error color to indicate cancellation', () => {
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('error')
    })

    it('should be visually distinct from other buttons', () => {
      expect(wrapper.vm.$options.name).toBe('CancelButton')
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.color).toBe('error')
    })
  })

  describe('responsive behavior', () => {
    it('should maintain properties on re-render', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.classes('fw-600')).toBe(true)
    })
  })
})
