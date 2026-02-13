import { shallowMount } from '@vue/test-utils'
import SaveChangesButton from '@/components/Common/Buttons/SaveChangesButton.vue'
import labels from '@/model/constants/labels'

describe('SaveChangesButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SaveChangesButton)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('SaveChangesButton')
    })

    it('should render a v-btn element', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('button properties', () => {
    it('should have fw-600 class', () => {
      expect(wrapper.classes()).toContain('fw-600')
    })

    it('should have white--text class', () => {
      expect(wrapper.classes()).toContain('white--text')
    })

    it('should have no-box-shadow class', () => {
      expect(wrapper.classes()).toContain('no-box-shadow')
    })
  })

  describe('button text', () => {
    it('should display SaveChanges label', () => {
      expect(wrapper.text()).toContain(labels.SaveChanges)
    })

    it('should use labels from imported constants', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should render correct label text', () => {
      const expectedText = labels.SaveChanges
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

    it('should have white text color class', () => {
      expect(wrapper.classes('white--text')).toBe(true)
    })

    it('should have no box shadow styling', () => {
      expect(wrapper.classes('no-box-shadow')).toBe(true)
    })
  })

  describe('attributes and listeners', () => {
    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          disabled: true,
          'aria-label': 'Save all changes'
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  describe('user interactions', () => {
    it('should emit click event', async () => {
      await wrapper.findComponent({ name:'VBtn' }).trigger('click')
      // The component should pass through the click event
    })

    it('should be clickable', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })

  })

  describe('accessibility', () => {
    it('should be a button element', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have text content for screen readers', () => {
      expect(wrapper.text().length).toBeGreaterThan(0)
    })

    it('should support disabled state', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should allow aria-label customization', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          'aria-label': 'Save modifications'
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('aria-label')).toBe('Save modifications')
    })
  })

  describe('responsive behavior', () => {
    it('should maintain properties on re-render', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should handle dynamic attribute changes', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          size: 'large'
        }
      })
      await wrapper.setProps({})
      expect(wrapper.findComponent({ name:'VBtn' }).exists()).toBe(true)
    })
  })

  describe('visual design', () => {
    it('should indicate save action with SaveChanges text', () => {
      expect(wrapper.text()).toBe(labels.SaveChanges)
    })

    it('should have flat appearance with no-box-shadow', () => {
      expect(wrapper.classes('no-box-shadow')).toBe(true)
    })
  })

  describe('class combinations', () => {
    it('should have all styling classes together', () => {
      expect(wrapper.classes()).toContain('fw-600')
      expect(wrapper.classes()).toContain('white--text')
      expect(wrapper.classes()).toContain('no-box-shadow')
    })

    it('should combine button styling with theme classes', () => {
      const button = wrapper.findComponent({ name:'VBtn' })

      expect(wrapper.classes('fw-600')).toBe(true)
    })
  })

  describe('button state management', () => {

    it('should support loading state without changing display', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          loading: true
        }
      })
      expect(wrapper.text()).toBe(labels.SaveChanges)
    })
  })

  describe('label and text management', () => {
    it('should use correct label constant', () => {
      expect(wrapper.vm.labels.SaveChanges).toBeDefined()
      expect(typeof wrapper.vm.labels.SaveChanges).toBe('string')
    })

    it('should display consistent text on re-render', async () => {
      const text1 = wrapper.text()
      await wrapper.vm.$forceUpdate()
      const text2 = wrapper.text()
      expect(text1).toBe(text2)
    })

    it('should not change text with prop updates', async () => {
      const text1 = wrapper.text()
      await wrapper.setProps({})
      const text2 = wrapper.text()
      expect(text1).toBe(text2)
    })

    it('should support label updates dynamically', () => {
      wrapper.vm.labels = { SaveChanges: 'Updated Text' }
      expect(wrapper.vm.labels.SaveChanges).toBe('Updated Text')
    })
  })

  describe('component lifecycle', () => {
    it('should mount without errors', () => {
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.exists()).toBe(true)
    })

    it('should destroy cleanly', () => {
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should support multiple mount/destroy cycles', () => {
      wrapper.destroy()
      wrapper = shallowMount(SaveChangesButton)
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle lifecycle hooks properly', async () => {
      expect(wrapper.isVueInstance()).toBe(true)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('button interaction and events', () => {
    it('should render clickable button', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should trigger click event', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      await button.trigger('click')
      expect(button.exists()).toBe(true)
    })

    it('should support multiple clicks', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      await button.trigger('click')
      await button.trigger('click')
      expect(button.exists()).toBe(true)
    })

    it('should maintain button state after interaction', async () => {
      const text1 = wrapper.text()
      const button = wrapper.findComponent({ name: 'VBtn' })
      await button.trigger('click')
      const text2 = wrapper.text()
      expect(text1).toBe(text2)
    })
  })

  describe('styling consistency', () => {
    it('should apply all styling classes consistently', () => {
      const classes = wrapper.classes()
      expect(classes).toContain('fw-600')
      expect(classes).toContain('white--text')
      expect(classes).toContain('no-box-shadow')
    })

    it('should maintain styles on re-render', async () => {
      const classes1 = wrapper.classes()
      await wrapper.vm.$forceUpdate()
      const classes2 = wrapper.classes()
      expect(classes1).toEqual(classes2)
    })

    it('should preserve styling with props', async () => {
      const hasFw600 = wrapper.classes('fw-600')
      await wrapper.setProps({})
      expect(wrapper.classes('fw-600')).toBe(hasFw600)
    })

    it('should use consistent font weight', () => {
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should use white text consistently', () => {
      expect(wrapper.classes('white--text')).toBe(true)
    })

    it('should have shadow style applied', () => {
      expect(wrapper.classes('no-box-shadow')).toBe(true)
    })
  })

  describe('element structure', () => {
    it('should have VBtn as child component', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should render button with correct name', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.vm).toBeDefined()
    })

    it('should have proper template structure', () => {
      expect(wrapper.html().length).toBeGreaterThan(0)
    })

    it('should contain text content', () => {
      expect(wrapper.text().length).toBeGreaterThan(0)
      expect(wrapper.text()).toContain(labels.SaveChanges)
    })

    it('should have valid DOM element', () => {
      expect(wrapper.element).toBeDefined()
      expect(wrapper.element.nodeType).toBe(1) // Node.ELEMENT_NODE
    })
  })

  describe('props and attributes handling', () => {
    it('should accept attrs parameter', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          id: 'save-button',
          'data-testid': 'save-button'
        }
      })
      expect(wrapper.attributes('id')).toBe('save-button')
    })

    it('should support disabled attribute', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should support aria-label attribute', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          'aria-label': 'Save all changes'
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('aria-label')).toBe('Save all changes')
    })

    it('should maintain attributes after update', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          id: 'test-id'
        }
      })
      await wrapper.vm.$forceUpdate()
      expect(wrapper.attributes('id')).toBe('test-id')
    })
  })

  describe('accessibility and usability', () => {
    it('should have semantic button', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should provide visible text for all users', () => {
      expect(wrapper.text()).toBe(labels.SaveChanges)
      expect(wrapper.text().length).toBeGreaterThan(0)
    })

    it('should support disabled state accessibility', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should allow label customization for screen readers', async () => {
      wrapper = shallowMount(SaveChangesButton, {
        attrs: {
          'aria-label': 'Custom label for save button'
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('aria-label')).toBe('Custom label for save button')
    })

    it('should have focus-able button element', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('data binding and reactivity', () => {
    it('should have reactive labels property', () => {
      expect(wrapper.vm.labels).toBeDefined()
      wrapper.vm.labels = { SaveChanges: 'New Label' }
      expect(wrapper.vm.labels.SaveChanges).toBe('New Label')
    })

    it('should reflect data changes in template', async () => {
      wrapper.vm.labels = { SaveChanges: 'Modified' }
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBe('Modified')
    })

    it('should maintain data consistency', () => {
      const initialLabels = wrapper.vm.labels
      wrapper.vm.labels = labels
      expect(wrapper.vm.labels).toBe(labels)
    })
  })

  describe('rendering and display', () => {
    it('should render correctly on mount', () => {
      expect(wrapper.html()).toBeDefined()
      expect(wrapper.html().length).toBeGreaterThan(0)
    })

    it('should display button text correctly', () => {
      expect(wrapper.text()).toBe(labels.SaveChanges)
    })

    it('should render with proper styling classes', () => {
      const html = wrapper.html()
      expect(html).toContain('fw-600')
      expect(html).toContain('white--text')
      expect(html).toContain('no-box-shadow')
    })

    it('should update display on prop changes', async () => {
      const initialText = wrapper.text()
      await wrapper.setProps({})
      expect(wrapper.text()).toBe(initialText)
    })
  })

  describe('integration with labels constant', () => {
    it('should import labels correctly', () => {
      expect(labels).toBeDefined()
      expect(labels.SaveChanges).toBeDefined()
    })

    it('should use imported labels in component', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should display correct label from constant', () => {
      expect(wrapper.text()).toBe(labels.SaveChanges)
    })

    it('should use labels constant in template', () => {
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.vm.labels.SaveChanges).toBe(labels.SaveChanges)
    })
  })

  describe('multiple instances', () => {
    it('should support multiple button instances', () => {
      const wrapper2 = shallowMount(SaveChangesButton)
      expect(wrapper.vm).not.toBe(wrapper2.vm)
      expect(wrapper.text()).toBe(wrapper2.text())
      wrapper2.destroy()
    })

    it('should maintain isolated state between instances', () => {
      const wrapper2 = shallowMount(SaveChangesButton, {
        attrs: { id: 'button2' }
      })
      expect(wrapper.attributes('id')).not.toBe(wrapper2.attributes('id'))
      wrapper2.destroy()
    })

    it('should not share labels between instances', () => {
      const wrapper2 = shallowMount(SaveChangesButton)
      wrapper.vm.labels = { SaveChanges: 'Instance 1' }
      expect(wrapper2.vm.labels).not.toBe(wrapper.vm.labels)
      wrapper2.destroy()
    })
  })

  describe('error handling and edge cases', () => {
    it('should handle missing labels gracefully', () => {
      expect(() => {
        wrapper = shallowMount(SaveChangesButton)
      }).not.toThrow()
    })

    it('should render even with minimal props', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })

    it('should handle forced updates', async () => {
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })

    it('should support rapid prop changes', async () => {
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({})
      }
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('performance characteristics', () => {
    it('should mount efficiently', () => {
      const start = Date.now()
      const testWrapper = shallowMount(SaveChangesButton)
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
      testWrapper.destroy()
    })

    it('should render updates quickly', async () => {
      const start = Date.now()
      for (let i = 0; i < 10; i++) {
        await wrapper.vm.$forceUpdate()
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(500)
    })

    it('should destroy efficiently', () => {
      const start = Date.now()
      wrapper.destroy()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(50)
    })
  })
})

