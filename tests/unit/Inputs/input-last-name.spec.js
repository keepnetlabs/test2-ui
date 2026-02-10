import { createLocalVue, mount } from '@vue/test-utils'
import TestInputLastNameWrapper from '@/components/TestHelpers/TestInputLastNameWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-last-name').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter last name')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input last name data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name data',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('accepts valid last name input', async () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('Smith', textInput, wrapper)
    expect(wrapper.find('input').element.value).toContain('Smith')
  })

  it('rejects input starting with space', async () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('  InvalidName', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Cannot start with space')).toBeTruthy()
  })

  it('displays required message when empty', async () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Required')).toBeTruthy()
  })

  it('enforces maximum character length', async () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    const longName = 'a'.repeat(256)
    await inputHelper.addData(longName, textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('cannot exceed')).toBeTruthy()
  })

  it('renders input with correct attributes', () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toEqual('Enter last name')
    expect(input.attributes('autocomplete')).toEqual('off')
  })

  describe('Component Rendering', () => {
    it('renders last name input component', () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      expect(wrapper.find('#test--input-last-name').exists()).toBeTruthy()
    })

    it('input field is visible', () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      expect(wrapper.find('input').isVisible()).toBe(true)
    })
  })

  describe('Input Attributes', () => {
    it('has correct placeholder', () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter last name')
    })

    it('has autocomplete disabled', () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('off')
    })

    it('is marked as required', () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })
  })

  describe('Space Validation', () => {
    it('rejects input starting with single space', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData(' Smith', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('rejects input starting with multiple spaces', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('   Johnson', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('accepts input without leading space', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Williams', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('Williams')
    })
  })

  describe('Maximum Length Handling', () => {
    it('enforces character limit', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const longName = 'a'.repeat(256)
      await inputHelper.addData(longName, textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text().includes('cannot exceed')).toBe(true)
    })

    it('accepts names within length limit', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const validName = 'a'.repeat(100)
      await inputHelper.addData(validName, textInput, wrapper)
      expect(wrapper.find('input').element.value).toBeTruthy()
    })
  })

  describe('Required Field Behavior', () => {
    it('shows required indicator on mount', () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('rejects empty input', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text().includes('Required')).toBe(true)
    })
  })

  describe('Valid Last Names', () => {
    it('accepts common last names', async () => {
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones']
      for (const name of lastNames) {
        const wrapper = mount(TestInputLastNameWrapper, {
          localVue
        })
        const inputHelper = new InputHelper()
        const textInput = wrapper.find('input')
        await inputHelper.addData(name, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(name)
      }
    })

    it('accepts names with hyphens', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Smith-Jones', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('Smith-Jones')
    })

    it('accepts names with apostrophes', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData("O'Brien", textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain("O'Brien")
    })

    it('accepts single character names', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('X', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('X')
    })
  })

  describe('Edge Cases', () => {
    it('handles names with numbers', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Smith123', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('Smith123')
    })

    it('handles Unicode characters', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Müller', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('Müller')
    })

    it('handles all-space input rejection', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('   ', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      if (errorMsg.exists()) {
        expect(errorMsg.text().includes('Cannot start with space')).toBe(true)
      }
    })
  })

  describe('Data Binding', () => {
    it('preserves input value', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const testName = 'TestName'
      await inputHelper.addData(testName, textInput, wrapper)
      expect(wrapper.vm.value).toBe(testName)
    })

    it('updates value on input change', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Anderson', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('Anderson')
    })
  })

  describe('Validation Sequences', () => {
    it('validates multiple checks', async () => {
      const wrapper = mount(TestInputLastNameWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' Invalid', textInput, wrapper)
      let errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)

      await inputHelper.addData('ValidName', textInput, wrapper)
      errorMsg = wrapper.find('.v-messages__message')
      expect(!errorMsg.exists() || !errorMsg.text().includes('Cannot start with space')).toBe(true)
    })
  })
})
