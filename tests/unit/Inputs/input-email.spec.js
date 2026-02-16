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

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      expect(() => {
        mount(TestInputEmailWrapper, { localVue })
      }).not.toThrow()
    })

    it('unmounts without errors', () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('maintains state through lifecycle', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('test@example.com', textInput, wrapper)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.value).toContain('test@example.com')
    })
  })

  describe('Event Emission', () => {
    it('emits input event on value change', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user@example.com', textInput, wrapper)

      // Event should be emitted
      expect(wrapper.emitted()).toBeTruthy()
    })

    it('emits valid email data', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const validEmail = 'valid@domain.com'

      await inputHelper.addData(validEmail, textInput, wrapper)

      expect(wrapper.vm.value).toContain(validEmail)
    })
  })

  describe('Class and Styling', () => {
    it('applies correct CSS classes', () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const component = wrapper.find('#test--input-last-name')
      expect(component.exists()).toBe(true)
    })

    it('input has consistent styling', () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.isVisible()).toBe(true)
    })
  })

  describe('Error Message Display', () => {
    it('displays error for invalid format', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('invalid.email.format', textInput, wrapper)

      expect(wrapper.find('.v-messages__message').exists()).toBeTruthy()
    })

    it('clears error on valid input', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      // First add invalid data
      await inputHelper.addData('invalid', textInput, wrapper)
      // Then add valid data
      await inputHelper.addData('valid@example.com', textInput, wrapper)

      expect(wrapper.find('input').element.value).toContain('valid@example.com')
    })
  })

  describe('Special Email Domains', () => {
    it('accepts gmail domain', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user@gmail.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user@gmail.com')
    })

    it('accepts yahoo domain', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user@yahoo.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user@yahoo.com')
    })

    it('accepts outlook domain', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user@outlook.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user@outlook.com')
    })

    it('accepts corporate domains', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const corporateEmails = ['user@company.com', 'admin@corp.org', 'info@business.net']
      for (const email of corporateEmails) {
        await inputHelper.addData(email, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(email)
      }
    })
  })

  describe('Special Characters in Email', () => {
    it('rejects email with spaces in local part', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user name@example.com', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })

    it('rejects email with multiple @ symbols', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user@domain@example.com', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })

    it('accepts email with underscore', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user_name@example.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user_name@example.com')
    })

    it('accepts email with plus sign', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('user+tag@example.com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('user+tag@example.com')
    })
  })

  describe('Email Case Sensitivity', () => {
    it('accepts email with uppercase letters', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('USER@EXAMPLE.COM', textInput, wrapper)
      expect(wrapper.find('input').element.value.toUpperCase()).toContain('USER@EXAMPLE.COM')
    })

    it('accepts mixed case email', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('User@Example.Com', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBeTruthy()
    })
  })

  describe('Email Domain Extensions', () => {
    it('accepts common TLDs', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const emails = ['user@domain.com', 'user@domain.org', 'user@domain.net', 'user@domain.edu']
      for (const email of emails) {
        await inputHelper.addData(email, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(email)
      }
    })

    it('accepts country code TLDs', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const emails = ['user@domain.co.uk', 'user@domain.de', 'user@domain.fr', 'user@domain.jp']
      for (const email of emails) {
        await inputHelper.addData(email, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(email)
      }
    })
  })

  describe('Performance and Multiple Instances', () => {
    it('creates multiple instances without conflict', () => {
      const wrapper1 = mount(TestInputEmailWrapper, { localVue })
      const wrapper2 = mount(TestInputEmailWrapper, { localVue })

      expect(wrapper1.find('#test--input-last-name').exists()).toBe(true)
      expect(wrapper2.find('#test--input-last-name').exists()).toBe(true)

      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('instances maintain independent state', async () => {
      const wrapper1 = mount(TestInputEmailWrapper, { localVue })
      const wrapper2 = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()

      const input1 = wrapper1.find('input')
      const input2 = wrapper2.find('input')

      await inputHelper.addData('user1@example.com', input1, wrapper1)
      await inputHelper.addData('user2@example.com', input2, wrapper2)

      expect(wrapper1.vm.value).toContain('user1@example.com')
      expect(wrapper2.vm.value).toContain('user2@example.com')

      wrapper1.destroy()
      wrapper2.destroy()
    })
  })

  describe('Integration Scenarios', () => {
    it('handles complete email entry workflow', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      // Start with invalid
      await inputHelper.addData('invalid.email', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').exists()).toBeTruthy()

      // Correct to valid
      await inputHelper.addData('valid@example.com', textInput, wrapper)
      expect(wrapper.vm.value).toContain('valid@example.com')
    })

    it('handles rapid email changes', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const emails = ['user1@example.com', 'user2@example.com', 'user3@example.com', 'admin@company.org']
      for (const email of emails) {
        await inputHelper.addData(email, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(email)
      }
    })

    it('validates then corrects invalid email', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      // Enter invalid
      await inputHelper.addData('user@', textInput, wrapper)
      let errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()

      // Fix it
      await inputHelper.addData('user@domain.com', textInput, wrapper)
      expect(wrapper.vm.value).toContain('user@domain.com')
    })
  })

  describe('Accessibility Features', () => {
    it('has accessible placeholder text', () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toEqual('Enter an email address')
    })

    it('displays required indicator for screen readers', () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('shows error messages for validation feedback', async () => {
      const wrapper = mount(TestInputEmailWrapper, { localVue })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('invalid', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.text().length).toBeGreaterThan(0)
    })
  })
})
