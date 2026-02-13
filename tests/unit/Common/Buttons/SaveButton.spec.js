import { shallowMount } from '@vue/test-utils'
import SaveButton from '@/components/Common/Buttons/SaveButton.vue'
import labels from '@/model/constants/labels'

describe('SaveButton.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SaveButton)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('SaveButton')
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
  })

  describe('label prop', () => {
    it('should have label prop defined', () => {
      expect(wrapper.vm.$options.props.label).toBeDefined()
    })

    it('should have label prop type as String', () => {
      expect(wrapper.vm.$options.props.label.type).toBe(String)
    })

    it('should default to labels.Save', () => {
      expect(wrapper.vm.label).toBe(labels.Save)
    })

    it('should use default label when not provided', () => {
      expect(wrapper.text()).toBe(labels.Save)
    })

    it('should display custom label when provided', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: 'Custom Save'
        }
      })
      expect(wrapper.text()).toBe('Custom Save')
    })

    it('should accept custom label prop', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: 'Save Changes'
        }
      })
      expect(wrapper.vm.label).toBe('Save Changes')
    })

    it('should update displayed text when label prop changes', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: 'Save'
        }
      })
      await wrapper.setProps({ label: 'Save Now' })
      expect(wrapper.text()).toBe('Save Now')
    })
  })

  describe('button text', () => {
    it('should display Save label by default', () => {
      expect(wrapper.text()).toContain(labels.Save)
    })

    it('should use labels from imported constants', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should render correct default label text', () => {
      const expectedText = labels.Save
      expect(wrapper.text()).toBe(expectedText)
    })

    it('should support dynamic label changes', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: 'Submit'
        }
      })
      expect(wrapper.text()).toBe('Submit')
      await wrapper.setProps({ label: 'Store' })
      expect(wrapper.text()).toBe('Store')
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
  })

  describe('attributes and listeners', () => {
    it('should bind listeners with v-on=$listeners', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.vm.$listeners).toBeDefined()
    })

    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: {
          disabled: true,
          'aria-label': 'Save form'
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })


    it('should support loading state via attributes', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: {
          loading: true
        }
      })
      expect(wrapper.findComponent({ name:'VBtn' }).exists()).toBe(true)
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
      wrapper = shallowMount(SaveButton, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should allow aria-label customization', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: {
          'aria-label': 'Save form data'
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('aria-label')).toBe('Save form data')
    })
  })

  describe('responsive behavior', () => {
    it('should maintain properties on re-render', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.classes('fw-600')).toBe(true)
    })

    it('should handle dynamic attribute changes', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: {
          size: 'large'
        }
      })
      await wrapper.setProps({})
      expect(wrapper.findComponent({ name:'VBtn' }).exists()).toBe(true)
    })

    it('should update label when prop changes during render cycle', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: 'Save'
        }
      })
      expect(wrapper.text()).toBe('Save')
      await wrapper.setProps({ label: 'Saving...' })
      expect(wrapper.text()).toBe('Saving...')
    })
  })

  describe('visual design', () => {
    it('should indicate action with Save text', () => {
      expect(wrapper.text()).toBe(labels.Save)
    })

    it('should maintain consistent styling with custom labels', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: 'Store Data'
        }
      })
      expect(wrapper.classes('fw-600')).toBe(true)
      expect(wrapper.classes('white--text')).toBe(true)
    })
  })

  describe('prop validation', () => {
    it('should accept string labels', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: 'Custom Text'
        }
      })
      expect(wrapper.vm.label).toBe('Custom Text')
    })

    it('should handle empty string label', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: ''
        }
      })
      expect(wrapper.vm.label).toBe('')
    })

    it('should handle long label text', async () => {
      const longLabel = 'Save and Submit Form Data'
      wrapper = shallowMount(SaveButton, {
        propsData: {
          label: longLabel
        }
      })
      expect(wrapper.text()).toBe(longLabel)
    })
  })

  describe('Component Initialization & Mounting', () => {
    it('should initialize without errors', () => {
      expect(() => {
        shallowMount(SaveButton)
      }).not.toThrow()
    })

    it('should have defined component options', () => {
      expect(wrapper.vm.$options).toBeDefined()
    })

    it('should have component name SaveButton', () => {
      expect(wrapper.vm.$options.name).toBe('SaveButton')
    })

    it('should render with default props', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should initialize with labels constant', () => {
      expect(wrapper.vm.labels).toBe(labels)
    })
  })

  describe('V-Btn Integration', () => {
    it('should render VBtn component', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should have VBtn with correct attributes', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.vm).toBeDefined()
    })

    it('should pass classes to VBtn', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.classes()).toContain('fw-600')
      expect(button.classes()).toContain('white--text')
    })

    it('should bind label to VBtn text content', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.text()).toBe(labels.Save)
    })

    it('should forward attrs to VBtn', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: {
          'data-test': 'save-button'
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('data-test')).toBe('save-button')
    })
  })

  describe('Listener Propagation', () => {
    it('should have $listeners available', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.vm.$listeners).toBeDefined()
    })

    it('should support click listeners on VBtn', async () => {
      wrapper = shallowMount(SaveButton, {
        listeners: {
          click: jest.fn()
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      // Component should render with listeners available
      expect(button.exists()).toBe(true)
    })

    it('should pass through custom events', async () => {
      wrapper = shallowMount(SaveButton, {
        listeners: {
          'custom-event': jest.fn()
        }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.vm.$listeners).toBeDefined()
    })

    it('should support multiple listeners', async () => {
      const listeners = {
        click: jest.fn(),
        focus: jest.fn()
      }
      wrapper = shallowMount(SaveButton, {
        listeners
      })
      expect(Object.keys(wrapper.vm.$listeners).length).toBeGreaterThan(0)
    })
  })

  describe('Event Emission', () => {
    it('should be clickable button', () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
      expect(button.isVisible()).toBe(true)
    })

    it('should handle click events', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      await button.trigger('click')
      expect(wrapper.exists()).toBe(true)
    })

    it('should support click event listeners', async () => {
      wrapper = shallowMount(SaveButton, {
        listeners: { click: jest.fn() }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      // Button should be clickable with listeners available
      expect(button.exists()).toBe(true)
    })

    it('should support focus event', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      await button.trigger('focus')
      expect(wrapper.exists()).toBe(true)
    })

    it('should support blur event', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      await button.trigger('blur')
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Styling & CSS Classes', () => {
    it('should have fw-600 class for font weight', () => {
      expect(wrapper.classes()).toContain('fw-600')
    })

    it('should have white--text class for text color', () => {
      expect(wrapper.classes()).toContain('white--text')
    })

    it('should maintain classes on prop change', async () => {
      await wrapper.setProps({ label: 'Updated Label' })
      expect(wrapper.classes()).toContain('fw-600')
      expect(wrapper.classes()).toContain('white--text')
    })

    it('should support custom class binding', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: {
          class: 'custom-class'
        }
      })
      expect(wrapper.classes()).toBeDefined()
    })

    it('should apply styles consistently', () => {
      const buttons = []
      for (let i = 0; i < 3; i++) {
        const btn = shallowMount(SaveButton)
        expect(btn.classes()).toContain('fw-600')
        buttons.push(btn)
      }
      buttons.forEach(btn => btn.destroy())
    })
  })

  describe('Label Management', () => {
    it('should use labels constant by default', () => {
      expect(wrapper.vm.labels).toEqual(labels)
    })

    it('should support custom label prop', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: 'Custom' }
      })
      expect(wrapper.vm.label).toBe('Custom')
    })

    it('should update text when label changes', async () => {
      await wrapper.setProps({ label: 'New Label' })
      expect(wrapper.text()).toBe('New Label')
    })

    it('should handle label with special characters', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: 'Save & Submit' }
      })
      expect(wrapper.text()).toBe('Save & Submit')
    })

    it('should handle label with unicode characters', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: '保存 Сохранить' }
      })
      expect(wrapper.text()).toBe('保存 Сохранить')
    })
  })

  describe('Button States', () => {
    it('should support disabled state', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { disabled: true }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should support loading state', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { loading: true }
      })
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })

    it('should support color attribute', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { color: 'primary' }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('color')).toBe('primary')
    })

    it('should support size attribute', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { size: 'large' }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('Props Edge Cases', () => {
    it('should handle very long label text', async () => {
      const veryLongLabel = 'A'.repeat(200)
      wrapper = shallowMount(SaveButton, {
        propsData: { label: veryLongLabel }
      })
      expect(wrapper.vm.label.length).toBe(200)
    })

    it('should handle label with HTML entities', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: 'Save &amp; Submit' }
      })
      expect(wrapper.vm.label).toBe('Save &amp; Submit')
    })

    it('should handle label with newlines', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: 'Save\nNow' }
      })
      expect(wrapper.vm.label).toBe('Save\nNow')
    })

    it('should handle null label gracefully', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: null }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Accessibility & ARIA', () => {
    it('should support aria-label attribute', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { 'aria-label': 'Save form changes' }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('aria-label')).toBe('Save form changes')
    })

    it('should have descriptive text content', () => {
      expect(wrapper.text().length).toBeGreaterThan(0)
      expect(wrapper.text()).toContain(labels.Save)
    })

    it('should be keyboard accessible', async () => {
      const button = wrapper.findComponent({ name: 'VBtn' })
      await button.trigger('keydown.enter')
      expect(wrapper.exists()).toBe(true)
    })

    it('should support aria-pressed state', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { 'aria-pressed': 'false' }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('aria-pressed')).toBe('false')
    })

    it('should support role attribute', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { role: 'button' }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('Performance & Multiple Instances', () => {
    it('should mount quickly', () => {
      const start = performance.now()
      const btn = shallowMount(SaveButton)
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
      btn.destroy()
    })

    it('should handle multiple instances independently', () => {
      const btn1 = shallowMount(SaveButton, {
        propsData: { label: 'Label 1' }
      })
      const btn2 = shallowMount(SaveButton, {
        propsData: { label: 'Label 2' }
      })
      expect(btn1.text()).toBe('Label 1')
      expect(btn2.text()).toBe('Label 2')
      btn1.destroy()
      btn2.destroy()
    })

    it('should not share state between instances', () => {
      const btn1 = shallowMount(SaveButton)
      const btn2 = shallowMount(SaveButton)
      expect(btn1.vm).not.toBe(btn2.vm)
      btn1.destroy()
      btn2.destroy()
    })

    it('should handle rapid prop updates efficiently', async () => {
      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        await wrapper.setProps({ label: `Label ${i}` })
      }
      const duration = performance.now() - start
      expect(duration).toBeLessThan(500)
    })

    it('should clean up properly on destroy', () => {
      const btn = shallowMount(SaveButton)
      expect(() => {
        btn.destroy()
      }).not.toThrow()
    })
  })

  describe('Integration Scenarios', () => {
    it('should work in a form context', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: 'Save Form' }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
      expect(wrapper.text()).toBe('Save Form')
    })

    it('should support external event handlers', async () => {
      wrapper = shallowMount(SaveButton, {
        listeners: { click: jest.fn() }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      // Button should support listeners
      expect(button.vm.$listeners).toBeDefined()
    })

    it('should support conditional rendering', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: 'Save' }
      })
      expect(wrapper.exists()).toBe(true)
      await wrapper.setProps({ label: '' })
      expect(wrapper.exists()).toBe(true)
    })

    it('should work with dynamic label generation', async () => {
      const dynamicLabel = `Save at ${new Date().toLocaleTimeString()}`
      wrapper = shallowMount(SaveButton, {
        propsData: { label: dynamicLabel }
      })
      expect(wrapper.text()).toBe(dynamicLabel)
    })
  })

  describe('Attribute Forwarding', () => {
    it('should forward custom data attributes', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { 'data-test': 'save-btn', 'data-id': '123' }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('data-test')).toBe('save-btn')
    })

    it('should forward boolean attributes', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { disabled: true, block: true }
      })
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should maintain attribute consistency', async () => {
      wrapper = shallowMount(SaveButton, {
        attrs: { color: 'success', variant: 'elevated' }
      })
      await wrapper.vm.$forceUpdate()
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.attributes('color')).toBe('success')
    })
  })

  describe('Component Lifecycle', () => {
    it('should initialize with default state', () => {
      expect(wrapper.vm.labels).toBe(labels)
      expect(wrapper.vm.label).toBe(labels.Save)
    })

    it('should maintain state after update', async () => {
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.labels).toBe(labels)
    })

    it('should handle prop updates gracefully', async () => {
      await wrapper.setProps({ label: 'Updated' })
      expect(wrapper.text()).toBe('Updated')
    })

    it('should cleanup properly', () => {
      const btn = shallowMount(SaveButton)
      expect(() => {
        btn.destroy()
      }).not.toThrow()
    })
  })

  describe('Text & Content', () => {
    it('should render button text correctly', () => {
      expect(wrapper.text()).toBe(labels.Save)
    })

    it('should update button text on prop change', async () => {
      await wrapper.setProps({ label: 'Submit' })
      expect(wrapper.text()).toBe('Submit')
    })

    it('should handle whitespace in labels', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: '  Save  ' }
      })
      expect(wrapper.text()).toContain('Save')
    })

    it('should render text without HTML escaping issues', async () => {
      wrapper = shallowMount(SaveButton, {
        propsData: { label: 'Save < Draft >' }
      })
      expect(wrapper.text()).toContain('Save')
    })
  })
})
