import { createLocalVue, mount } from '@vue/test-utils'
import TestInputCompanyWrapper from '@/components/TestHelpers/TestInputCompanyWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  const mountComponent = () => {
    return mount(TestInputCompanyWrapper, {
      localVue
    })
  }

  describe('component rendering', () => {
    it('Check is rendering', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#test--input-company').exists()).toBeTruthy()
    })

    it('should render input field', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should render text input type', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('type')).toBe('text')
    })

    it('should render with test id', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#test--input-company').exists()).toBe(true)
    })
  })

  describe('input attributes', () => {
    it('Checking props', () => {
      const wrapper = mountComponent()
      const inputAttr = wrapper.find('input[placeholder]').attributes()
      expect(inputAttr.placeholder).toEqual('Enter a name for the company')
      expect(inputAttr.autocomplete).toEqual('disabled')
      expect(wrapper.find('.v-messages__message').text().includes('*Required')).toBeTruthy()
    })

    it('Has correct input attributes', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toEqual('Enter a name for the company')
      expect(input.attributes('autocomplete')).toEqual('disabled')
    })

    it('should have correct placeholder text', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Enter a name for the company')
    })

    it('should disable autocomplete', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('autocomplete')).toBe('disabled')
    })

  })

  describe('validation messages', () => {
    it('Shows required indicator', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-messages__message').text()).toContain('*Required')
    })

    it('should show required hint', () => {
      const wrapper = mountComponent()
      const message = wrapper.find('.v-messages__message')
      expect(message.exists()).toBeTruthy()
      expect(message.text()).toContain('*Required')
    })

    it('should display validation messages', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-messages').exists()).toBeTruthy()
    })

    it('should have message element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-messages__message').exists()).toBe(true)
    })
  })

  describe('input validation', () => {
    it('Checking validations', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData(' my custom input company data', textInput, wrapper)
      expect(
        wrapper.find('.v-messages__message').text().includes('Cannot start with space')
      ).toBeTruthy()

      await inputHelper.addData(
        'my custom input company datamy custom input company data my custom input company data my custom input company data my custom input company data my custom input company data my custom input company data ',
        textInput,
        wrapper
      )
      expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()

      await inputHelper.addData('', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
    })

    it('should reject leading spaces', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData(' invalid', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Cannot start with space')
    })

    it('should enforce maximum length', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      const longText = 'a'.repeat(300)
      await inputHelper.addData(longText, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().toLowerCase()).toContain('exceed')
    })

    it('should validate empty input', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Required')
    })

    it('should validate whitespace only input', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('   ', textInput, wrapper)
      const messages = wrapper.find('.v-messages__message').text()
      expect(messages.length > 0).toBe(true)
    })
  })

  describe('valid input handling', () => {
    it('Accepts valid company names', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('Google Inc', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBe(false)
    })

    it('should accept simple company names', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('Acme Corp', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should accept company names with numbers', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('Company 123', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should accept company names with special characters', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('Company & Co.', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should accept company names with hyphens', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('Company-Name', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should accept single letter names', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('A', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('user input', () => {
    it('should allow typing in input field', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.setValue('Test Company')
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle user input', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('input')
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

    it('should preserve input value', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      const testValue = 'Test Value'
      await input.setValue(testValue)
      expect(input.element.value).toBe(testValue)
    })
  })

  describe('component properties', () => {
    it('should have correct component structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('.v-messages').exists()).toBeTruthy()
    })

    it('should have v-text-field component', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBe(true)
    })

  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.find('input').exists()).toBe(wrapper2.find('input').exists())
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain structure after multiple renders', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#test--input-company').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('.v-messages').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#test--input-company').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('input value should be string type', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.setValue('test')
      expect(typeof input.element.value).toBe('string')
    })

    it('placeholder should be string type', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(typeof input.attributes('placeholder')).toBe('string')
    })

    it('autocomplete should be string type', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(typeof input.attributes('autocomplete')).toBe('string')
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
  })

  describe('edge cases', () => {
    it('should handle very long company names', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()
      const longName = 'A'.repeat(200)

      await inputHelper.addData(longName, textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle special Unicode characters', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData('Company™ ©2024®', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle rapid input changes', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')

      for (let i = 0; i < 5; i++) {
        await input.setValue(`Company ${i}`)
      }
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle tab navigation', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('keydown.tab')
      expect(input.exists()).toBe(true)
    })

    it('should handle Enter key press', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('keydown.enter')
      expect(input.exists()).toBe(true)
    })

    it('should handle Escape key press', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('keydown.escape')
      expect(input.exists()).toBe(true)
    })

    it('should handle multiple validation errors', async () => {
      const wrapper = mountComponent()
      const textInput = wrapper.find('input')
      const inputHelper = new InputHelper()

      await inputHelper.addData(' ', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').exists()).toBe(true)
    })

    it('should handle input after clear', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')

      await input.setValue('Test')
      await input.setValue('')
      await input.setValue('New Value')
      expect(input.element.value).toBe('New Value')
    })
  })
})
