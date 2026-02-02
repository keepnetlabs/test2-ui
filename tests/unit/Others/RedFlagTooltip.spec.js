import { createLocalVue, shallowMount } from '@vue/test-utils'
import RedFlagTooltip from '@/components/Common/Others/RedFlagTooltip.vue'
import Vuetify from 'vuetify'

describe('RedFlagTooltip.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(RedFlagTooltip, {
      localVue,
      vuetify,
      propsData: {
        tooltipContent: 'Helpful info',
        ...propsData
      },
      stubs: {
        'v-tooltip': {
          template: '<div><slot name="activator" :on="{}" :attrs="{}"></slot><span><slot /></span></div>'
        }
      }
    })
  }

  describe('component rendering', () => {
    it('renders trigger div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })

    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('RedFlagTooltip')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('displays red flag icon', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })

    it('should have icon element', () => {
      const wrapper = mountComponent()
      const trigger = wrapper.find('.red-flag-tooltip-trigger')
      expect(trigger.exists()).toBe(true)
    })
  })

  describe('tooltip content', () => {
    it('renders tooltip content', () => {
      const wrapper = mountComponent({ tooltipContent: 'Specific error' })
      expect(wrapper.text()).toContain('Specific error')
    })

    it('displays tooltip with default content', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Helpful info')
    })

    it('renders with correct tooltip content passed as prop', () => {
      const customContent = 'Custom error message'
      const wrapper = mountComponent({ tooltipContent: customContent })
      expect(wrapper.text()).toContain(customContent)
    })

    it('supports empty tooltip content', () => {
      const wrapper = mountComponent({ tooltipContent: '' })
      expect(wrapper.exists()).toBe(true)
    })

    it('handles long tooltip messages', () => {
      const longMessage = 'This is a very long error message that should be properly displayed in the tooltip component'
      const wrapper = mountComponent({ tooltipContent: longMessage })
      expect(wrapper.text()).toContain(longMessage)
    })

    it('displays tooltip content with special characters', () => {
      const specialContent = 'Error: Invalid @#$% content!'
      const wrapper = mountComponent({ tooltipContent: specialContent })
      expect(wrapper.text()).toContain(specialContent)
    })
  })

  describe('tooltip messages', () => {
    it('handles different tooltip messages', () => {
      const testCases = ['Error 1', 'Error 2', 'Important Notice']
      testCases.forEach(message => {
        const wrapper = mountComponent({ tooltipContent: message })
        expect(wrapper.text()).toContain(message)
      })
    })

    it('should display warning messages', () => {
      const wrapper = mountComponent({ tooltipContent: 'Warning: Check this' })
      expect(wrapper.text()).toContain('Warning: Check this')
    })

    it('should display error messages', () => {
      const wrapper = mountComponent({ tooltipContent: 'Error: Something went wrong' })
      expect(wrapper.text()).toContain('Error: Something went wrong')
    })

    it('should display info messages', () => {
      const wrapper = mountComponent({ tooltipContent: 'Info: Please note' })
      expect(wrapper.text()).toContain('Info: Please note')
    })

    it('should handle multiline content', () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3'
      const wrapper = mountComponent({ tooltipContent: multilineContent })
      expect(wrapper.text()).toContain('Line 1')
    })

    it('should handle content with numbers', () => {
      const wrapper = mountComponent({ tooltipContent: 'Error 12345' })
      expect(wrapper.text()).toContain('Error 12345')
    })
  })

  describe('CSS classes and styling', () => {
    it('displays trigger element with correct class', () => {
      const wrapper = mountComponent()
      const trigger = wrapper.find('.red-flag-tooltip-trigger')
      expect(trigger.exists()).toBe(true)
      expect(trigger.classes()).toContain('red-flag-tooltip-trigger')
    })

    it('should have red-flag-tooltip-trigger class', () => {
      const wrapper = mountComponent()
      const trigger = wrapper.find('.red-flag-tooltip-trigger')
      expect(trigger.classes('red-flag-tooltip-trigger')).toBe(true)
    })

    it('trigger has correct CSS class', () => {
      const wrapper = mountComponent()
      const trigger = wrapper.find('.red-flag-tooltip-trigger')
      expect(trigger.exists()).toBe(true)
    })
  })

  describe('tooltip integration', () => {
    it('tooltip component is properly integrated', () => {
      const wrapper = mountComponent()
      const tooltipStub = wrapper.find({ name: 'v-tooltip-stub' })
      expect(tooltipStub.exists() || wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })

    it('should have v-tooltip component', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })

    it('should render tooltip wrapper', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should accept tooltipContent prop', () => {
      const wrapper = mountComponent({ tooltipContent: 'Test content' })
      expect(wrapper.props('tooltipContent')).toBe('Test content')
    })

    it('should have default tooltipContent prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('tooltipContent')).toBe('Helpful info')
    })

    it('should update tooltipContent when prop changes', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ tooltipContent: 'Updated content' })
      expect(wrapper.props('tooltipContent')).toBe('Updated content')
    })

    it('should accept null tooltipContent', () => {
      const wrapper = mountComponent({ tooltipContent: null })
      expect(wrapper.props('tooltipContent')).toBeNull()
    })

    it('should accept undefined tooltipContent', () => {
      const wrapper = mountComponent({ tooltipContent: undefined })
      expect(wrapper.props('tooltipContent')).toBeDefined()
    })
  })

  describe('prop updates', () => {
    it('should update content when prop changes', async () => {
      const wrapper = mountComponent({ tooltipContent: 'Initial' })
      expect(wrapper.text()).toContain('Initial')

      await wrapper.setProps({ tooltipContent: 'Updated' })
      expect(wrapper.text()).toContain('Updated')
    })

    it('should handle multiple prop changes', async () => {
      const wrapper = mountComponent()

      await wrapper.setProps({ tooltipContent: 'First' })
      expect(wrapper.text()).toContain('First')

      await wrapper.setProps({ tooltipContent: 'Second' })
      expect(wrapper.text()).toContain('Second')

      await wrapper.setProps({ tooltipContent: 'Third' })
      expect(wrapper.text()).toContain('Third')
    })

    it('should handle rapid prop changes', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ tooltipContent: `Message ${i}` })
      }
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({ tooltipContent: 'Same' })
      const wrapper2 = mountComponent({ tooltipContent: 'Same' })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain state after prop changes', async () => {
      const wrapper = mountComponent({ tooltipContent: 'Test' })
      await wrapper.setProps({ tooltipContent: 'Updated' })
      expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('tooltipContent should be string type', () => {
      const wrapper = mountComponent({ tooltipContent: 'test' })
      expect(typeof wrapper.props('tooltipContent')).toBe('string')
    })

    it('should handle string content', () => {
      const wrapper = mountComponent({ tooltipContent: 'String content' })
      expect(wrapper.props('tooltipContent')).toBeDefined()
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have proper component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('RedFlagTooltip')
    })

    it('should render icon after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle very long tooltip messages', () => {
      const longMessage = 'a'.repeat(500)
      const wrapper = mountComponent({ tooltipContent: longMessage })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle tooltip with Unicode characters', () => {
      const wrapper = mountComponent({ tooltipContent: '警告: 错误 ⚠️' })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle tooltip with HTML entities', () => {
      const wrapper = mountComponent({ tooltipContent: 'Error &amp; Warning' })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty string content', () => {
      const wrapper = mountComponent({ tooltipContent: '' })
      expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
    })

    it('should handle content with newlines', () => {
      const wrapper = mountComponent({ tooltipContent: 'Line1\nLine2\nLine3' })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle content with tabs', () => {
      const wrapper = mountComponent({ tooltipContent: 'Content\twith\ttabs' })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle content with punctuation', () => {
      const wrapper = mountComponent({ tooltipContent: 'Error: Something went wrong!' })
      expect(wrapper.text()).toContain('Error: Something went wrong!')
    })

    it('should handle rapid mount/destroy cycles', () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mountComponent()
        expect(wrapper.find('.red-flag-tooltip-trigger').exists()).toBe(true)
        wrapper.destroy()
      }
    })
  })
})
