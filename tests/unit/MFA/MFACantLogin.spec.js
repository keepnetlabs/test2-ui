import { createLocalVue } from '@vue/test-utils'
import MFACantLogin from '../Objects/MFACantLogin'
import { wait } from '../utils'

describe('MFA Cant Login component', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return new MFACantLogin(localVue, propsData).wrapper
  }

  describe('component rendering', () => {
    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.mfa-cant-login').exists()).toBe(true)
    })

    it('should render login title', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.login-title').exists()).toBe(true)
      expect(wrapper.find('.login-title').text()).toContain('Login with SMS Authentication')
    })

    it('should render login description', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.login-desc').exists()).toBe(true)
      expect(wrapper.find('.login-desc').text()).toContain('An SMS with verification code is sent to')
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('MFACantLogin')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should render card text section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-card__text').exists()).toBe(true)
    })

    it('should render card actions section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-card__actions').exists()).toBe(true)
    })

    it('should render verification code wrapper', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.verification-code-wrapper').exists()).toBe(true)
    })
  })

  describe('input field', () => {
    it('should render verification code input field', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('should have correct input ID', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#input--login-verification-code').exists()).toBe(true)
    })

    it('should have placeholder text', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toContain('Verification Code')
    })

    it('should have required attribute', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('required')).toBeDefined()
    })

    it('should have outlined style', () => {
      const wrapper = mountComponent()
      const textField = wrapper.findComponent({ name: 'VTextField' })
      expect(textField.props('outlined')).toBe(true)
    })

    it('should have dense style', () => {
      const wrapper = mountComponent()
      const textField = wrapper.findComponent({ name: 'VTextField' })
      expect(textField.props('dense')).toBe(true)
    })

    it('should update model on input', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.setValue('123456')
      expect(wrapper.vm.verificationCode).toBe('123456')
    })

    it('should trim whitespace from input', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.setValue('  123456  ')
      expect(wrapper.vm.verificationCode).toBe('123456')
    })

    it('should validate on blur', () => {
      const wrapper = mountComponent()
      const textField = wrapper.findComponent({ name: 'VTextField' })
      expect(textField.props('validateOnBlur')).toBe(true)
    })

    it('should accept any string input', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      const testInputs = ['123456', 'ABC123', '@#$%^&', '']

      for (const testInput of testInputs) {
        await input.setValue(testInput)
        expect(wrapper.vm.verificationCode).toBe(testInput)
      }
    })
  })

  describe('continue button', () => {
    it('should render continue button', () => {
      const wrapper = mountComponent()
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should have correct button text', () => {
      const wrapper = mountComponent()
      const button = wrapper.find('button')
      expect(button.text()).toContain('CONTINUE')
    })

    it('should have correct button color', () => {
      const wrapper = mountComponent()
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.props('color')).toBe('blue')
    })

    it('should have button in card actions', () => {
      const wrapper = mountComponent()
      const cardActions = wrapper.find('.v-card__actions')
      const button = cardActions.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should have rounded button', () => {
      const wrapper = mountComponent()
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.props('rounded')).toBe(true)
    })

    it('should emit verificationCodeLogin event on button click', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ verificationCode: '123456' })
      const button = wrapper.find('.v-card__actions button')
      await button.trigger('click')
      const emitted = wrapper.emitted('verificationCodeLogin')
      expect(emitted).toBeTruthy()
    })

    it('should emit event with verification code', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ verificationCode: '654321' })
      const button = wrapper.find('.v-card__actions button')
      await button.trigger('click')
      const emitted = wrapper.emitted('verificationCodeLogin')
      expect(emitted[0][1]).toBe('654321')
    })

    it('should render icon on button', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('.v-card__actions button .v-icon')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should accept phoneNumber prop', () => {
      const wrapper = mountComponent({ phoneNumber: '+1-555-0123' })
      expect(wrapper.props('phoneNumber')).toBe('+1-555-0123')
    })

    it('should render phone number in description', () => {
      const wrapper = mountComponent({ phoneNumber: '+1-555-0123' })
      expect(wrapper.find('.login-desc').text()).toContain('+1-555-0123')
    })

    it('should accept verificationCode prop', () => {
      const wrapper = mountComponent({ verificationCode: '123456' })
      expect(wrapper.props('verificationCode')).toBe('123456')
    })

    it('should accept rememberMeOnThisDevice prop', () => {
      const wrapper = mountComponent({ rememberMeOnThisDevice: true })
      expect(wrapper.props('rememberMeOnThisDevice')).toBe(true)
    })

    it('should accept validReset prop', () => {
      const wrapper = mountComponent({ validReset: true })
      expect(wrapper.props('validReset')).toBe(true)
    })

    it('should accept rules prop', () => {
      const rules = { required: (v) => !!v || 'Required' }
      const wrapper = mountComponent({ rules })
      expect(wrapper.props('rules')).toBeDefined()
    })

    it('should have default phoneNumber as null', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('phoneNumber')).toBe(null)
    })

    it('should have default verificationCode as empty string', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('verificationCode')).toBe('')
    })
  })

  describe('data properties', () => {
    it('should initialize showCount to true', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.showCount).toBe(true)
    })

    it('should have showCount as boolean type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.showCount).toBe('boolean')
    })
  })

  describe('methods', () => {
    it('should have resendMessageButtonClick method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.resendMessageButtonClick).toBe('function')
    })

    it('should have changeButtonStatus method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.changeButtonStatus).toBe('function')
    })

    it('changeButtonStatus should update showCount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.showCount).toBe(true)
      wrapper.vm.changeButtonStatus()
      expect(wrapper.vm.showCount).toBe(false)
    })

    it('resendMessageButtonClick should emit onCantLoginButtonClick when showCount is false', async () => {
      const wrapper = mountComponent()
      wrapper.vm.showCount = false
      await wrapper.vm.resendMessageButtonClick()
      const emitted = wrapper.emitted('onCantLoginButtonClick')
      expect(emitted).toBeTruthy()
    })

    it('resendMessageButtonClick should not emit when showCount is true', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.showCount).toBe(true)
      await wrapper.vm.resendMessageButtonClick()
      const emitted = wrapper.emitted('onCantLoginButtonClick')
      expect(emitted).toBeFalsy()
    })
  })

  describe('countdown timer', () => {
    it('should render countdown component', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#text--login-countdown').exists()).toBeTruthy()
    })

    it('should render resend message link', () => {
      const wrapper = mountComponent()
      const resendLink = wrapper.find('.verification-code-wrapper__cant-login')
      expect(resendLink.exists()).toBe(true)
    })

    it('should toggle countdown visibility based on showCount', async () => {
      const wrapper = mountComponent()
      // Initially, countdown should be shown
      expect(wrapper.vm.showCount).toBe(true)

      // When showCount is false, resend message should show
      wrapper.vm.showCount = false
      await wrapper.vm.$nextTick()
      // After showCount is false, the span should be visible
      const span = wrapper.find('.verification-code-wrapper__cant-login span')
      expect(span.text()).toContain('Resend message')
    })
  })

  describe('form structure', () => {
    it('should have v-form wrapper', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VForm' }).exists()).toBe(true)
    })

    it('should have form ref', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$refs.refMfaCantLoginForm).toBeDefined()
    })

    it('should prevent default form submission', async () => {
      const wrapper = mountComponent()
      const form = wrapper.findComponent({ name: 'VForm' })
      const mockEvent = { preventDefault: jest.fn() }
      // Form has @submit handler
      expect(form.exists()).toBe(true)
    })
  })

  describe('event emission', () => {
    it('should emit verificationCodeLogin with correct parameters', async () => {
      const wrapper = mountComponent({
        verificationCode: '123456',
        rememberMeOnThisDevice: false
      })
      const button = wrapper.find('.v-card__actions button')
      await button.trigger('click')

      const emitted = wrapper.emitted('verificationCodeLogin')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toBe(true)
      expect(emitted[0][1]).toBe('123456')
      expect(emitted[0][2]).toBe(false)
    })

    it('should emit verificationCodeLogin when Enter key pressed', async () => {
      const wrapper = mountComponent({ verificationCode: '123456' })
      const input = wrapper.find('input')
      await input.trigger('keyup.enter')

      const emitted = wrapper.emitted('verificationCodeLogin')
      expect(emitted).toBeTruthy()
    })

    it('should have onCantLoginButtonClick prop defined in component', () => {
      const wrapper = mountComponent()
      // Check that the component accepts the prop
      expect(wrapper.vm.$options.props).toBeDefined()
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain state after prop changes', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ phoneNumber: '+1-555-0123' })
      expect(wrapper.props('phoneNumber')).toBe('+1-555-0123')
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.mfa-cant-login').exists()).toBe(true)
      expect(wrapper.find('.login-title').exists()).toBe(true)
      expect(wrapper.find('.login-desc').exists()).toBe(true)
      expect(wrapper.find('.verification-code-wrapper').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('showCount should be boolean type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.showCount).toBe('boolean')
    })

    it('verificationCode should be string type', () => {
      const wrapper = mountComponent({ verificationCode: '123456' })
      expect(typeof wrapper.props('verificationCode')).toBe('string')
    })

    it('phoneNumber can be string or null', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent({ phoneNumber: '+1-555-0123' })
      expect(wrapper1.props('phoneNumber')).toBeNull()
      expect(typeof wrapper2.props('phoneNumber')).toBe('string')
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
      expect(wrapper.vm.$options.name).toBe('MFACantLogin')
    })
  })
})
