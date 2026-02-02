import { createLocalVue, mount } from '@vue/test-utils'
import InputDate from '@/components/Common/Inputs/InputDate'

describe('Input date component', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return mount(InputDate, {
      localVue,
      propsData
    })
  }

  describe('component rendering', () => {
    it('Check is rendering', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-date-editor').exists()).toBeTruthy()
    })

    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should render input field', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should render date editor element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-date-editor').exists()).toBe(true)
    })

    it('should have input element', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
    })
  })

  describe('input attributes', () => {
    it('Checking props', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      const attributes = input.attributes()
      expect(attributes.type.includes('text')).toBeTruthy()
      expect(attributes.placeholder.includes('Select a date')).toBeTruthy()
    })

    it('should have text input type', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      const attributes = input.attributes()
      expect(attributes.type).toBe('text')
    })

    it('should have correct placeholder', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toContain('Select a date')
    })

    it('should have placeholder text', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBeDefined()
    })

    it('should be of text input type', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('type')).toBe('text')
    })
  })

  describe('date type variations', () => {
    it('Changing type', async () => {
      const wrapper = mountComponent({ type: 'datetime' })
      expect(wrapper.find('.el-date-editor--datetime').exists()).toBeTruthy()
    })

    it('renders with default type as date', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-date-editor--date').exists()).toBeTruthy()
    })

    it('supports month type for date selection', () => {
      const wrapper = mountComponent({ type: 'month' })
      expect(wrapper.find('.el-date-editor--month').exists()).toBeTruthy()
    })

    it('supports datetimerange type', () => {
      const wrapper = mountComponent({ type: 'datetimerange' })
      expect(wrapper.find('.el-date-editor--datetimerange').exists()).toBeTruthy()
    })

    it('supports daterange type', () => {
      const wrapper = mountComponent({ type: 'daterange' })
      expect(wrapper.find('.el-date-editor--daterange').exists()).toBeTruthy()
    })

    it('should apply correct class for date type', () => {
      const wrapper = mountComponent({ type: 'date' })
      expect(wrapper.find('.el-date-editor--date').exists()).toBe(true)
    })

    it('should apply correct class for datetime type', () => {
      const wrapper = mountComponent({ type: 'datetime' })
      expect(wrapper.find('.el-date-editor--datetime').exists()).toBe(true)
    })

    it('should apply correct class for daterange type', () => {
      const wrapper = mountComponent({ type: 'daterange' })
      expect(wrapper.find('.el-date-editor--daterange').exists()).toBe(true)
    })

    it('should apply correct class for datetimerange type', () => {
      const wrapper = mountComponent({ type: 'datetimerange' })
      expect(wrapper.find('.el-date-editor--datetimerange').exists()).toBe(true)
    })

    it('should apply correct class for month type', () => {
      const wrapper = mountComponent({ type: 'month' })
      expect(wrapper.find('.el-date-editor--month').exists()).toBe(true)
    })

    it('should support year type', () => {
      const wrapper = mountComponent({ type: 'year' })
      expect(wrapper.find('.el-date-editor').exists()).toBe(true)
    })
  })

  describe('disabled state', () => {
    it('applies disabled state when prop is true', () => {
      const wrapper = mountComponent({ disabled: true })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('should apply disabled attribute', () => {
      const wrapper = mountComponent({ disabled: true })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('should not have disabled attribute when false', () => {
      const wrapper = mountComponent({ disabled: false })
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).not.toBeDefined()
    })

    it('should toggle disabled state', async () => {
      const wrapper = mountComponent({ disabled: false })
      let input = wrapper.find('input')
      expect(input.attributes('disabled')).not.toBeDefined()

      await wrapper.setProps({ disabled: true })
      input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  describe('user input and interaction', () => {
    it('should allow clicking input', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('click')
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle focus event', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('focus')
      expect(input.exists()).toBe(true)
    })

    it('should handle blur event', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('blur')
      expect(input.exists()).toBe(true)
    })

    it('should handle change event', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('change')
      expect(input.exists()).toBe(true)
    })

    it('should handle input event', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('input')
      expect(input.exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should accept type prop', () => {
      const wrapper = mountComponent({ type: 'datetime' })
      expect(wrapper.props('type')).toBe('datetime')
    })

    it('should accept disabled prop', () => {
      const wrapper = mountComponent({ disabled: true })
      expect(wrapper.props('disabled')).toBe(true)
    })

    it('should accept value prop', () => {
      const testDate = new Date('2024-01-15')
      const wrapper = mountComponent({ value: testDate })
      expect(wrapper.props('value')).toBeDefined()
    })

    it('should handle type prop changes', async () => {
      const wrapper = mountComponent({ type: 'date' })
      expect(wrapper.find('.el-date-editor--date').exists()).toBe(true)

      await wrapper.setProps({ type: 'datetime' })
      expect(wrapper.find('.el-date-editor--datetime').exists()).toBe(true)
    })
  })

  describe('component properties', () => {
    it('should have correct component structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-date-editor').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should have date editor container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-date-editor').exists()).toBe(true)
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({ type: 'date' })
      const wrapper2 = mountComponent({ type: 'date' })
      expect(wrapper1.find('input').exists()).toBe(wrapper2.find('input').exists())
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain structure after prop changes', async () => {
      const wrapper = mountComponent({ type: 'date' })
      await wrapper.setProps({ type: 'datetime' })
      expect(wrapper.find('.el-date-editor').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-date-editor').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('type prop should be string type', () => {
      const wrapper = mountComponent({ type: 'date' })
      expect(typeof wrapper.props('type')).toBe('string')
    })

    it('disabled prop should be boolean type', () => {
      const wrapper = mountComponent({ disabled: true })
      expect(typeof wrapper.props('disabled')).toBe('boolean')
    })

    it('input type attribute should be string', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(typeof input.attributes('type')).toBe('string')
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

    it('should render input element after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should render date editor after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-date-editor').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle rapid type changes', async () => {
      const wrapper = mountComponent()
      const types = ['date', 'datetime', 'month', 'year', 'daterange', 'datetimerange']

      for (const type of types) {
        await wrapper.setProps({ type })
      }
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle disabled state toggle', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ disabled: i % 2 === 0 })
      }
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle all date types', () => {
      const types = ['date', 'datetime', 'month', 'year', 'daterange', 'datetimerange']
      types.forEach(type => {
        const wrapper = mountComponent({ type })
        expect(wrapper.find('.el-date-editor').exists()).toBe(true)
      })
    })

    it('should handle multiple prop changes', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ type: 'datetime' })
      await wrapper.setProps({ disabled: true })
      await wrapper.setProps({ type: 'daterange' })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle focus and blur quickly', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      for (let i = 0; i < 5; i++) {
        await input.trigger('focus')
        await input.trigger('blur')
      }
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle disabled input click', async () => {
      const wrapper = mountComponent({ disabled: true })
      const input = wrapper.find('input')
      await input.trigger('click')
      expect(input.attributes('disabled')).toBeDefined()
    })
  })
})
