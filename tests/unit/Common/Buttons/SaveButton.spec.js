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
})
