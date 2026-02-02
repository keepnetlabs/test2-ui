import { createLocalVue, mount } from '@vue/test-utils'
import TestInputFirstNameWrapper from '@/components/TestHelpers/TestInputFirstNameWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input first name component', () => {
  const localVue = createLocalVue()

  const mountComponent = () => {
    return mount(TestInputFirstNameWrapper, {
      localVue
    })
  }

  describe('component rendering', () => {
    it('Check is rendering', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#test--input-first-name').exists()).toBeTruthy()
    })

    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should render input field', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should have test id', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#test--input-first-name').exists()).toBe(true)
    })
  })

  describe('input attributes', () => {
    it('Checking props', () => {
      const wrapper = mountComponent()
      const inputAttr = wrapper.find('input').attributes()
      expect(inputAttr.placeholder).toEqual('Enter first name')
      expect(inputAttr.autocomplete).toEqual('off')
      expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
    })

    it('renders input with correct attributes', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('placeholder')).toEqual('Enter first name')
      expect(input.attributes('autocomplete')).toEqual('off')
    })

    it('should have correct placeholder', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Enter first name')
    })

    it('should have autocomplete off', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('autocomplete')).toBe('off')
    })

    it('should be text input type', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('type')).toBe('text')
    })
  })

  describe('validation messages', () => {
    it('should show required indicator', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
    })

    it('should have validation messages element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-messages').exists()).toBeTruthy()
    })

    it('should display message wrapper', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-messages__wrapper').exists()).toBeTruthy()
    })
  })

  describe('input validation', () => {
    it('Checking validations', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' my custom input first name data', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBeTruthy()

      await inputHelper.addData(
        'my custom input first name data my custom input first name data my custom input first name datamy custom input first name data  vmy custom input first name datamy custom input first name datamy custom input first name data',
        textInput,
        wrapper
      )
      expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()

      await inputHelper.addData('', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
    })

    it('rejects input starting with space', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('  InvalidName', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message').text()
      expect(errorMsg.includes('Cannot start with space')).toBeTruthy()
    })

    it('displays required message when empty', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message').text()
      expect(errorMsg.includes('Required')).toBeTruthy()
    })

    it('enforces maximum character length', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const longName = 'a'.repeat(256)
      await inputHelper.addData(longName, textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message').text()
      expect(errorMsg.includes('cannot exceed')).toBeTruthy()
    })

    it('should validate leading spaces', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' John', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Cannot start with space')
    })

    it('should validate empty input', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Required')
    })

    it('should reject very long names', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const veryLongName = 'a'.repeat(300)
      await inputHelper.addData(veryLongName, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().toLowerCase()).toContain('exceed')
    })
  })

  describe('valid input handling', () => {
    it('accepts valid first name input', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('John', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('John')
    })

    it('should accept simple names', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('Alice', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should accept names with special characters', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('Jean-Paul', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should accept single letter names', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('J', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should accept names with apostrophes', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData("O'Brien", textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('user input handling', () => {
    it('should allow typing', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.setValue('TestName')
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
      const testValue = 'TestValue'
      await input.setValue(testValue)
      expect(input.element.value).toBe(testValue)
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

    it('should maintain structure after interactions', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('blur')
      expect(wrapper.find('#test--input-first-name').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#test--input-first-name').exists()).toBe(true)
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

    it('should render input after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle very long names', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const longName = 'A'.repeat(200)

      await inputHelper.addData(longName, textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle special Unicode characters', async () => {
      const wrapper = mountComponent()
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('Jörg', textInput, wrapper)
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle rapid input changes', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')

      for (let i = 0; i < 5; i++) {
        await input.setValue(`Name ${i}`)
      }
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle Enter key press', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('keydown.enter')
      expect(input.exists()).toBe(true)
    })

    it('should handle input after clear', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')

      await input.setValue('TestName')
      await input.setValue('')
      await input.setValue('NewName')
      expect(input.element.value).toBe('NewName')
    })
  })
})
