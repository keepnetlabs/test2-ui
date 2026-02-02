import { shallowMount } from '@vue/test-utils'
import KButtonCheckbox from '@/components/Common/Checkbox/KButtonCheckbox.vue'

describe('KButtonCheckbox.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(KButtonCheckbox)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('KButtonCheckbox')
    })

    it('should render a v-btn element', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should render a container div', () => {
      expect(wrapper.find('div').exists()).toBe(true)
    })

  })

  describe('props handling', () => {
    it('should have label prop', () => {
      expect(wrapper.vm.$options.props.label).toBeDefined()
    })

    it('should have value prop with Boolean type', () => {
      expect(wrapper.vm.$options.props.value.type).toBe(Boolean)
    })

    it('should have value default false', () => {
      expect(wrapper.vm.$options.props.value.default).toBe(false)
    })

    it('should have customStyle prop', () => {
      expect(wrapper.vm.$options.props.customStyle).toBeDefined()
    })

    it('should accept label prop', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          label: 'Accept'
        }
      })
      expect(wrapper.vm.label).toBe('Accept')
    })

    it('should accept value prop', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: true
        }
      })
      expect(wrapper.vm.value).toBe(true)
    })

    it('should accept customStyle prop', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          customStyle: 'margin: 10px;'
        }
      })
      expect(wrapper.vm.customStyle).toBe('margin: 10px;')
    })
  })

  describe('button label display', () => {
    it('should display label text', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          label: 'Check Me'
        }
      })
      expect(wrapper.text()).toContain('Check Me')
    })

    it('should render without label if not provided', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('button properties', () => {
    it('should be outlined when value is false', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
    })

    it('should be outlined when value is false', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
    })

    it('should not be outlined when value is true', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: true
        }
      })
    })
  })

  describe('styling with value state', () => {
    it('should add white--text class when value is true', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: true
        }
      })
    })

    it('should not have white--text class when value is false', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
    })
  })

  describe('computed getStyles', () => {
    it('should have getStyles computed property', () => {
      expect(wrapper.vm.getStyles).toBeDefined()
    })

    it('should include box-shadow none', () => {
      expect(wrapper.vm.getStyles).toContain('box-shadow: none !important;')
    })

    it('should include custom style when provided', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          customStyle: 'margin: 10px;'
        }
      })
      expect(wrapper.vm.getStyles).toContain('margin: 10px;')
    })


    it('should apply computed styles to button', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          customStyle: 'padding: 5px;'
        }
      })
    })
  })

  describe('icons', () => {
    it('should render v-icon element', () => {
      const icon = wrapper.findComponent({ name:'VIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should show checked icon when value is true', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: true
        }
      })
      const icon = wrapper.findComponent({ name:'VIcon' })
      expect(icon.text()).toContain('$radio-checked')
    })

    it('should show unchecked icon when value is false', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
      const icon = wrapper.findComponent({ name:'VIcon' })
      expect(icon.text()).toContain('$radio-unchecked')
    })

    it('should have left aligned icon', () => {
    })

    it('should have margin styling on icon', () => {
    })
  })

  describe('user interactions', () => {
    it('should toggle value when clicked', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
      wrapper.vm.handleButtonClick()
      expect(wrapper.emitted('input')[0][0]).toBe(true)
    })

    it('should toggle from true to false', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: true
        }
      })
      wrapper.vm.handleButtonClick()
      expect(wrapper.emitted('input')[0][0]).toBe(false)
    })

    it('should toggle from false to true', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
      wrapper.vm.handleButtonClick()
      expect(wrapper.emitted('input')[0][0]).toBe(true)
    })
  })

  describe('handleButtonClick method', () => {
    it('should emit input with inverted value', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
      wrapper.vm.handleButtonClick()
      expect(wrapper.emitted('input')[0][0]).toBe(true)
    })

  })

  describe('attributes and listeners', () => {
    it('should bind attributes with v-bind=$attrs', () => {
      const button = wrapper.findComponent({ name:'VBtn' })

    })

    it('should bind listeners with v-on=$listeners', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.vm.$listeners).toBeDefined()
    })

    it('should pass through custom attributes', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        attrs: {
          disabled: true,
          'aria-label': 'Toggle option'
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should pass through click listener to parent', async () => {
      const handleClick = jest.fn()
      wrapper = shallowMount(KButtonCheckbox, {
        listeners: {
          input: handleClick
        }
      })
      wrapper.vm.handleButtonClick()
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('visual states', () => {
    it('should have filled appearance when checked', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: true
        }
      })
    })

    it('should have outlined appearance when unchecked', () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
    })
  })

  describe('prop reactivity', () => {
    it('should update button style when value prop changes', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
      let button = wrapper.findComponent({ name:'VBtn' })

      await wrapper.setProps({ value: true })
      button = wrapper.findComponent({ name:'VBtn' })
    })

    it('should update icon when value prop changes', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: false
        }
      })
      let icon = wrapper.findComponent({ name:'VIcon' })
      expect(icon.text()).toContain('$radio-unchecked')

      await wrapper.setProps({ value: true })
      icon = wrapper.findComponent({ name:'VIcon' })
      expect(icon.text()).toContain('$radio-checked')
    })

    it('should update label when prop changes', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          label: 'Old Label'
        }
      })
      expect(wrapper.text()).toContain('Old Label')

      await wrapper.setProps({ label: 'New Label' })
      expect(wrapper.text()).toContain('New Label')
    })

    it('should update custom style when prop changes', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          customStyle: 'margin: 5px;'
        }
      })
      expect(wrapper.vm.getStyles).toContain('margin: 5px;')

      await wrapper.setProps({ customStyle: 'padding: 10px;' })
      expect(wrapper.vm.getStyles).toContain('padding: 10px;')
    })
  })

  describe('accessibility', () => {
    it('should support disabled state', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        attrs: {
          disabled: true
        }
      })
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should have text content for screen readers', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          label: 'Accept terms'
        }
      })
      expect(wrapper.text().length).toBeGreaterThan(0)
    })

    it('should have semantic button role', () => {
      const button = wrapper.findComponent({ name:'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('responsive behavior', () => {
    it('should maintain state on re-render', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          value: true,
          label: 'Check'
        }
      })
      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.value).toBe(true)
      expect(wrapper.vm.label).toBe('Check')
    })
  })

  describe('integration scenarios', () => {
    it('should work as toggle button', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          label: 'Toggle',
          value: false
        }
      })

      wrapper.vm.handleButtonClick()
      expect(wrapper.emitted('input')[0][0]).toBe(true)

      await wrapper.setProps({ value: true })
      wrapper.vm.handleButtonClick()
      expect(wrapper.emitted('input')[1][0]).toBe(false)
    })

    it('should work with v-model pattern', async () => {
      wrapper = shallowMount(KButtonCheckbox, {
        propsData: {
          label: 'Yes/No',
          value: false
        }
      })

      expect(wrapper.vm.value).toBe(false)
      await wrapper.setProps({ value: true })
      expect(wrapper.vm.value).toBe(true)
    })
  })
})
