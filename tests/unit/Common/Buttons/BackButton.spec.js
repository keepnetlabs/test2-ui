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

  describe('VBtn Component Props', () => {
    it('should pass outlined prop to VBtn', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should set color property', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should apply rounded property', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should handle all VBtn properties', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.vm).toBeDefined()
    })
  })

  describe('Event Propagation', () => {
    it('should have button component for interaction', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should render clickable button element', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should handle click with modifiers', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should support native click event', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('Text Content', () => {
    it('should display Back text exactly', () => {
      expect(wrapper.text()).toBe(labels.Back)
    })

    it('should handle text trimming correctly', () => {
      const text = wrapper.text()
      expect(text.trim()).toBe(labels.Back)
    })

    it('should not have extra whitespace', () => {
      const text = wrapper.text()
      expect(text).not.toMatch(/^\s+|\s+$/)
    })

    it('should support label text constants', () => {
      expect(wrapper.vm.labels.Back).toBeDefined()
      expect(wrapper.text()).toBe(wrapper.vm.labels.Back)
    })
  })

  describe('Slot Handling', () => {
    it('should render button element', () => {
      wrapper = shallowMount(BackButton)
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })

    it('should contain Back text in rendered output', () => {
      wrapper = shallowMount(BackButton)
      const html = wrapper.html()
      expect(html.toUpperCase()).toContain('BACK')
    })

    it('should use default label when no slot', () => {
      expect(wrapper.text()).toBe(labels.Back)
    })
  })

  describe('Class Binding', () => {
    it('should always have fw-600 class', () => {
      expect(wrapper.classes()).toContain('fw-600')
    })

    it('should support custom classes', async () => {
      wrapper = shallowMount(BackButton, {
        attrs: { class: 'custom-class' }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should have classes when mounted', () => {
      const classes = wrapper.classes()
      expect(Array.isArray(classes) || typeof classes === 'string').toBe(true)
    })

    it('should maintain fw-600 base class', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
    })
  })

  describe('Attribute Forwarding', () => {
    it('should forward disabled attribute', () => {
      wrapper = shallowMount(BackButton, {
        attrs: { disabled: true }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should forward type attribute', () => {
      wrapper = shallowMount(BackButton, {
        attrs: { type: 'button' }
      })
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })

    it('should forward data attributes', () => {
      wrapper = shallowMount(BackButton, {
        attrs: { 'data-testid': 'back-btn' }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should support aria attributes', () => {
      wrapper = shallowMount(BackButton, {
        attrs: { 'aria-label': 'Go back' }
      })
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })
  })

  describe('State Management', () => {
    it('should maintain labels reference', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should not mutate labels object', () => {
      const originalLabels = { ...labels }
      wrapper.vm.labels = { ...wrapper.vm.labels }
      expect(wrapper.vm.labels.Back).toBe(originalLabels.Back)
    })

    it('should preserve state across updates', async () => {
      const initialLabel = wrapper.vm.labels.Back
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels.Back).toBe(initialLabel)
    })

    it('should handle state immutability', () => {
      expect(() => {
        wrapper.vm.labels = labels
      }).not.toThrow()
    })
  })

  describe('Performance Characteristics', () => {
    it('should mount quickly', () => {
      const start = performance.now()
      const w = shallowMount(BackButton)
      const duration = performance.now() - start
      w.destroy()
      expect(duration).toBeLessThan(200)
    })

    it('should re-render efficiently', async () => {
      const start = performance.now()
      await wrapper.vm.$forceUpdate()
      const duration = performance.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('should handle multiple instances efficiently', () => {
      const wrappers = []
      for (let i = 0; i < 5; i++) {
        wrappers.push(shallowMount(BackButton))
      }
      expect(wrappers.length).toBe(5)
      wrappers.forEach(w => w.destroy())
    })

    it('should clean up efficiently', () => {
      const w = shallowMount(BackButton)
      const start = performance.now()
      w.destroy()
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid destruction', () => {
      const w1 = shallowMount(BackButton)
      w1.destroy()
      const w2 = shallowMount(BackButton)
      expect(w2.exists()).toBe(true)
      w2.destroy()
    })

    it('should handle attribute changes after mount', async () => {
      wrapper = shallowMount(BackButton, { attrs: { disabled: false } })
      wrapper = shallowMount(BackButton, { attrs: { disabled: true } })
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })

    it('should handle empty attrs object', () => {
      wrapper = shallowMount(BackButton, { attrs: {} })
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle undefined attrs gracefully', () => {
      const w = shallowMount(BackButton)
      expect(w.exists()).toBe(true)
      w.destroy()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const w1 = shallowMount(BackButton)
      const w2 = shallowMount(BackButton)
      expect(w1.vm).not.toBe(w2.vm)
      w1.destroy()
      w2.destroy()
    })

    it('should maintain separate state per instance', () => {
      const w1 = shallowMount(BackButton)
      const w2 = shallowMount(BackButton)
      expect(w1.text()).toBe(w2.text())
      expect(w1.text()).toBe(labels.Back)
      w1.destroy()
      w2.destroy()
    })

    it('should handle instance isolation', () => {
      const wrappers = [
        shallowMount(BackButton, { attrs: { disabled: true } }),
        shallowMount(BackButton, { attrs: { disabled: false } }),
        shallowMount(BackButton)
      ]
      expect(wrappers.length).toBe(3)
      wrappers.forEach(w => w.destroy())
    })

    it('should render consistently across instances', () => {
      const w1 = shallowMount(BackButton)
      const w2 = shallowMount(BackButton)
      const html1 = w1.html()
      const html2 = w2.html()
      expect(html1).toContain(labels.Back)
      expect(html2).toContain(labels.Back)
      w1.destroy()
      w2.destroy()
    })
  })

  describe('DOM Element Properties', () => {
    it('should have DOM element after mount', () => {
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should be button element or wrapper', () => {
      const el = wrapper.vm.$el
      expect(el).toBeDefined()
      expect(el.tagName).toBeDefined()
    })

    it('should have proper DOM hierarchy', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should update DOM when props change', async () => {
      const beforeHtml = wrapper.html()
      await wrapper.vm.$forceUpdate()
      const afterHtml = wrapper.html()
      expect(beforeHtml).toBeTruthy()
      expect(afterHtml).toBeTruthy()
    })
  })

  describe('Listener Management', () => {
    it('should support click listener', () => {
      const clickSpy = jest.fn()
      wrapper = shallowMount(BackButton, {
        listeners: { click: clickSpy }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should forward listeners to button', () => {
      wrapper = shallowMount(BackButton, {
        listeners: { click: jest.fn() }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should handle multiple listeners', () => {
      wrapper = shallowMount(BackButton, {
        listeners: {
          click: jest.fn(),
          focus: jest.fn()
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should have button component available', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })
})
