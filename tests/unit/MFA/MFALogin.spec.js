import { createLocalVue } from '@vue/test-utils'
import MFALogin from '../Objects/MFALogin'

describe('MFA Login component', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return new MFALogin(localVue, propsData).wrapper
  }

  describe('rendering', () => {
    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBeTruthy()
    })
    it('should have correct title', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.login-title').text()).toContain('Multi-factor Authentication')
    })
    it('should have correct description', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.login-desc').text()).toContain('Please enter your verification code')
    })
    it('should render input field', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('.verification-code-wrapper--textfield').exists()).toBe(true)
    })
    it('should show required hint', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-messages').text()).toContain('*Required')
    })
    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('MFALogin')
    })
    it('should render card structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.v-card__text').exists()).toBe(true)
      expect(wrapper.find('.v-card__actions').exists()).toBe(true)
    })
  })

  describe('input field', () => {
    it('should have text input field', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
    })
    it('should have placeholder', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Verification Code')
    })
    it('should require input', () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      expect(input.attributes('required')).toBeDefined()
    })
    it('should validate on blur', () => {
      const wrapper = mountComponent()
      const textField = wrapper.findComponent({ name: 'VTextField' })
      expect(textField.props('validateOnBlur')).toBe(true)
    })
    it('should update verificationCode on input', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ verificationCode: '123456' })
      expect(wrapper.props('verificationCode')).toBe('123456')
    })
  })

  describe('buttons', () => {
    it('should have continue button', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#btn--login-continue').exists()).toBe(true)
    })
    it('button should be clickable', () => {
      const wrapper = mountComponent()
      const button = wrapper.find('#btn--login-continue')
      expect(button.isVisible()).toBe(true)
    })
    it('should have cant login link', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.verification-code-wrapper__cant-login').exists()).toBeTruthy()
    })
  })

  describe('events', () => {
    it('should emit verificationCodeLogin on button click', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ verificationCode: 'test123' })
      const button = wrapper.find('#btn--login-continue')
      await button.trigger('click')
      expect(wrapper.emitted()['verificationCodeLogin']).toBeTruthy()
    })
    it('should emit with correct event data', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ verificationCode: 'custom data' })
      const button = wrapper.find('#btn--login-continue')
      await button.trigger('click')
      const emitted = wrapper.emitted()['verificationCodeLogin']
      expect(emitted[0][1]).toBe('custom data')
    })
    it('should emit onCantLoginButtonClick when cant login clicked', async () => {
      const wrapper = mountComponent()
      const cantLogin = wrapper.find('.verification-code-wrapper__cant-login')
      await cantLogin.trigger('click')
      expect(wrapper.emitted()['onCantLoginButtonClick']).toBeTruthy()
    })
    it('should emit on Enter key press', async () => {
      const wrapper = mountComponent()
      const input = wrapper.find('input')
      await input.trigger('keyup.enter')
      expect(wrapper.emitted()['verificationCodeLogin']).toBeTruthy()
    })
  })

  describe('checkbox', () => {
    it('should have remember checkbox', () => {
      const wrapper = mountComponent()
      const checkbox = wrapper.findComponent({ name: 'VCheckbox' })
      expect(checkbox.exists()).toBe(true)
    })
    it('should have correct checkbox label', () => {
      const wrapper = mountComponent()
      const checkbox = wrapper.findComponent({ name: 'VCheckbox' })
      expect(checkbox.props('label')).toContain('Don\'t ask again')
    })
    it('should update remember state', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ rememberMeOnThisDevice: true })
      expect(wrapper.props('rememberMeOnThisDevice')).toBe(true)
    })
  })

  describe('props', () => {
    it('should accept verificationCode prop', () => {
      const wrapper = mountComponent({ verificationCode: '999999' })
      expect(wrapper.props('verificationCode')).toBe('999999')
    })
    it('should accept rememberMeOnThisDevice prop', () => {
      const wrapper = mountComponent({ rememberMeOnThisDevice: true })
      expect(wrapper.props('rememberMeOnThisDevice')).toBe(true)
    })
    it('should handle empty verificationCode', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ verificationCode: '' })
      expect(wrapper.props('verificationCode')).toBe('')
    })
  })

  describe('consistency', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })
    it('should handle destruction', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })
    it('should maintain state', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ verificationCode: 'test' })
      expect(wrapper.props('verificationCode')).toBe('test')
    })
  })

  describe('edge cases', () => {
    it('should handle long verification codes', () => {
      const wrapper = mountComponent({ verificationCode: '1234567890123456' })
      expect(wrapper.props('verificationCode')).toBe('1234567890123456')
    })
    it('should handle rapid prop changes', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ verificationCode: `${i}${i}${i}${i}${i}${i}` })
      }
      expect(wrapper.exists()).toBe(true)
    })
    it('should handle multiple button clicks', async () => {
      const wrapper = mountComponent()
      const button = wrapper.find('#btn--login-continue')
      for (let i = 0; i < 3; i++) {
        await button.trigger('click')
      }
      expect(wrapper.emitted()['verificationCodeLogin'].length).toBe(3)
    })
  })
})
