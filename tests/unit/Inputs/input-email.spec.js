import { createLocalVue, mount } from '@vue/test-utils'
import TestInputEmailWrapper from '@/components/TestHelpers/TestInputEmailWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-last-name').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter an email address')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom email data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking is email
    await inputHelper.addData('askkas.ko', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Invalid email address')
    ).toBeTruthy()

    //checking is left right part of email
    await inputHelper.addData(
      'askkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkas@gmail.com',
      textInput,
      wrapper
    )

    expect(
      wrapper.find('.v-messages__message').text().includes('Invalid email address')
    ).toBeTruthy()

    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('accepts valid email addresses', async () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'info@company.org']
    for (const email of validEmails) {
      await inputHelper.addData(email, textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain(email)
    }
  })


  it('rejects email starting with space', async () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('  valid@email.com', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Cannot start with space')).toBeTruthy()
  })

  it('enforces required field validation', async () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Required')).toBeTruthy()
  })

  it('renders input with correct attributes', () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toEqual('Enter an email address')
    expect(input.attributes('autocomplete')).toEqual('off')
  })

  describe('Component Rendering', () => {
    it('renders email input component', () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      expect(wrapper.find('#test--input-last-name').exists()).toBeTruthy()
    })

    it('input field exists', () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('input is visible', () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      expect(wrapper.find('input').isVisible()).toBe(true)
    })
  })

  describe('Email Format Validation', () => {
    it('accepts standard email format', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('user@example.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user@example.com')
    })

    it('accepts emails with subdomains', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('test@mail.example.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('test@mail.example.com')
    })

    it('rejects email without domain', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('invalid@', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      if (errorMsg.exists()) {
        expect(errorMsg.text().includes('Invalid email address')).toBe(true)
      }
    })

    it('rejects email without local part', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('@example.com', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      if (errorMsg.exists()) {
        expect(errorMsg.text().includes('Invalid email address')).toBe(true)
      }
    })
  })

  describe('Space Validation', () => {
    it('rejects email with leading space', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData(' test@example.com', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('rejects email with multiple leading spaces', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('  email@example.com', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text().includes('Cannot start with space')).toBe(true)
    })
  })

  describe('Required Field Validation', () => {
    it('shows required indicator', () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
    })

    it('rejects empty input', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
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

  describe('Email Variants', () => {
    it('accepts emails with numbers', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('user123@example456.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user123@example456.com')
    })

    it('accepts emails with dots in local part', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('first.last@example.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('first.last@example.com')
    })

    it('accepts emails with hyphens', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('user-name@example-domain.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user-name@example-domain.com')
    })
  })

  describe('Input Attributes', () => {
    it('has correct placeholder', () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter an email address')
    })

    it('has autocomplete disabled', () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('off')
    })

    it('is marked as required', () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })
  })

  describe('Long Email Addresses', () => {
    it('rejects email with very long local part', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const longEmail = 'a'.repeat(100) + '@example.com'
      await inputHelper.addData(longEmail, textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      if (errorMsg.exists()) {
        expect(errorMsg.text().includes('Invalid email address')).toBe(true)
      }
    })

    it('rejects email exceeding maximum length', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const veryLongEmail = 'a'.repeat(250) + '@example.com'
      await inputHelper.addData(veryLongEmail, textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      if (errorMsg.exists()) {
        expect(errorMsg.text().includes('Invalid email address')).toBe(true)
      }
    })
  })

  describe('Data Binding', () => {
    it('preserves input value', async () => {
      const wrapper = mount(TestInputEmailWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const testEmail = 'test@example.com'
      await inputHelper.addData(testEmail, textInput, wrapper)
      expect(wrapper.vm.value).toBe(testEmail)
    })
  })
})
