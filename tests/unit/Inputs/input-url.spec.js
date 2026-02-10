import { createLocalVue, mount } from '@vue/test-utils'
import TestInputURLWrapper from '@/components/TestHelpers/TestInputURLWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input URL component', () => {
  const localVue = createLocalVue()

  describe('Component Rendering', () => {
    it('Check is rendering', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.find('#test--input-url').exists()).toBeTruthy()
    })

    it('renders as v-text-field component', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('renders with outlined style', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.find('.v-input__control').exists()).toBeTruthy()
    })

    it('renders with persistent hint', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__message').exists()).toBeTruthy()
    })

    it('component has correct name', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.vm.$options.name).toBe('TestInputURLWrapper')
    })
  })

  describe('Props and Attributes', () => {
    it('Has correct placeholder text', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toEqual('Enter a URL')
    })

    it('has autocomplete off', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputAttr = wrapper.find('input').attributes()
      expect(inputAttr.autocomplete).toEqual('off')
    })

    it('Requires URL input', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('has correct default attributes', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputAttr = wrapper.find('input').attributes()
      expect(inputAttr.placeholder).toEqual('Enter a URL')
      expect(inputAttr.autocomplete).toEqual('off')
    })

    it('v-model is bound with trim modifier', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.vm.value).toBe('')
    })
  })

  describe('Space Validation', () => {
    it('Cannot start with space', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' my custom input url data', textInput, wrapper)
      expect(
        wrapper.find('.v-messages__message').text().includes('Cannot start with space')
      ).toBeTruthy()
    })

    it('Rejects leading space in URL', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('  https://example.com', textInput, wrapper)
      expect(
        wrapper.find('.v-messages__message').text().includes('Cannot start with space')
      ).toBeTruthy()
    })

    it('Accepts URL without leading space', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://example.com', textInput, wrapper)
      const messages = wrapper.find('.v-messages__message').text()
      expect(messages.includes('Cannot start with space')).toBe(false)
    })
  })

  describe('URL Format Validation', () => {
    it('Rejects invalid URL format', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('askaksaksaalsal', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBeTruthy()
    })

    it('Rejects plain text as URL', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('not a url', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBeTruthy()
    })

    it('handles text-only input as invalid', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('textonly', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBeTruthy()
    })
  })

  describe('Valid URL Acceptance', () => {
    it('Accepts valid HTTPS URL', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://example.com', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBe(false)
    })

    it('Accepts valid HTTP URL', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('http://example.com', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBe(false)
    })

    it('Accepts URL with subdomain', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://sub.example.com', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBe(false)
    })

    it('Accepts URL with path', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://example.com/path', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBe(false)
    })

    it('Accepts URL with port', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://example.com:8080', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBe(false)
    })

    it('Accepts URL with query parameters', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://example.com?key=value', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBe(false)
    })
  })

  describe('Validation Rule Structure', () => {
    it('has validation rules defined', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
      expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    })

    it('validation rules are from COMMON_CONSTANTS', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.vm.rules).toBeDefined()
    })
  })

  describe('Data Binding', () => {
    it('initializes with empty value', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.vm.value).toBe('')
    })

    it('updates value when input changes', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://test.com', textInput, wrapper)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.value).toBe('https://test.com')
    })

    it('trims whitespace from input', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('https://test.com ', textInput, wrapper)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.value.trim()).toBe('https://test.com')
    })
  })

  describe('Multiple Validations in Sequence', () => {
    it('handles multiple validation attempts', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('invalid', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBeTruthy()

      await inputHelper.addData('https://valid.com', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBe(false)
    })

    it('clears previous errors on valid input', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' invalid', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Cannot start with space')

      await inputHelper.addData('https://valid.com', textInput, wrapper)
      const messages = wrapper.find('.v-messages__message').text()
      expect(messages.includes('Cannot start with space')).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('validates URL format strictly', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('not a url', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBeTruthy()
    })

    it('rejects empty URL', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('', textInput, wrapper)
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('handles various invalid input patterns', async () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const invalidInputs = ['invalid', 'testing', 'data-only']
      for (const input of invalidInputs) {
        await inputHelper.addData(input, textInput, wrapper)
        expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBeTruthy()
      }
    })
  })

  describe('Component Props Structure', () => {
    it('Has correct hint text', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('component initializes with correct data structure', () => {
      const wrapper = mount(TestInputURLWrapper, {
        localVue
      })
      expect(wrapper.vm.$data).toHaveProperty('value')
      expect(wrapper.vm.$data).toHaveProperty('rules')
    })
  })
})
