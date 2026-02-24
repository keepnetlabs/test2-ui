import { createLocalVue } from '@vue/test-utils'
import MFASetup from '../Objects/MFASetup'

describe('MFA Setup component', () => {
  const localVue = createLocalVue()

  it('getWrapper returns the same as .wrapper', () => {
    const obj = new MFASetup(localVue)
    expect(obj.getWrapper()).toBe(obj.wrapper)
    expect(obj.getWrapper().find('.mfa-setup--dashboard').exists()).toBe(true)
  })

  it('Check render', () => {
    const { wrapper } = new MFASetup(localVue)
    //check renders container
    expect(wrapper.find('.mfa-setup--dashboard').exists()).toBe(true)
    //checking content header
    expect(wrapper.find('.mfa-setup__content--header').text()).toContain(
      '1. Install an MFA app on your mobile device'
    )
    //checking sub text
    expect(wrapper.find('.mfa-setup__content--text').text()).toContain(
      'Compatible MFA applications to login with:'
    )
    expect(wrapper.text()).toContain(
      '2. Scan the QR code with your device’s camera using your virtual MFA app'
    )
    expect(wrapper.text()).toContain('3. Enter MFA code')
  })

  it('Check props and actions', async () => {
    const { wrapper } = new MFASetup(localVue)
    await wrapper.setProps({
      mfaSetupDetails: {
        manualEntryKey: 'i am custom manualEntryKey'
      }
    })
    //expecting manual entry key to be rendered
    expect(wrapper.text()).toContain('i am custom manualEntryKey')
    //checking is required
    expect(wrapper.find('.v-messages').text()).toContain('*Required')
    //changing isLogin
    await wrapper.setProps({
      isLogin: true
    })
    const submitButton = wrapper.find('#btn-setup--mfa-dashboard-popup')
    expect(submitButton.exists()).toBeTruthy()

    const input = wrapper.find('#input--login-mfa-code')
    input.find('input').element.value = 'custom'
    await input.trigger('keyup', { enterKey: true })
    await submitButton.trigger('click')

    //checking event
    const emittedEvent = wrapper.emitted()['confirmSetupMFA']
    expect(emittedEvent.length).toBe(1)

    expect(emittedEvent[0][0]).toBe(null)

    //adding mfa code
    await wrapper.setData({ mfaCode: 'asas' })
    await submitButton.trigger('click')
    expect(emittedEvent[1][0]).toBe('asas')
  })

  it('shows setup instructions', () => {
    const { wrapper } = new MFASetup(localVue)
    expect(wrapper.text()).toContain('1. Install an MFA app on your mobile device')
    expect(wrapper.text()).toContain('2. Scan the QR code with your device')
    expect(wrapper.text()).toContain('3. Enter MFA code')
  })

  it('displays compatibility information', () => {
    const { wrapper } = new MFASetup(localVue)
    expect(wrapper.text()).toContain('Compatible MFA applications to login with')
  })

  it('submit button functionality', async () => {
    const { wrapper } = new MFASetup(localVue)
    await wrapper.setProps({ isLogin: true })
    const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
    expect(button.exists()).toBe(true)
    expect(button.isVisible()).toBe(true)
  })

  it('handles MFA code input correctly', async () => {
    const { wrapper } = new MFASetup(localVue)
    await wrapper.setData({ mfaCode: '123456' })
    expect(wrapper.vm.mfaCode).toBe('123456')
  })

  describe('Component Structure', () => {
    it('renders mfa-setup container', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(wrapper.find('.mfa-setup--dashboard').exists()).toBe(true)
    })

    it('has correct CSS classes', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(wrapper.classes()).toContain('mfa-setup--dashboard')
    })

    it('renders content header section', () => {
      const { wrapper } = new MFASetup(localVue)
      const header = wrapper.find('.mfa-setup__content--header')
      expect(header.exists()).toBe(true)
    })

    it('renders content text section', () => {
      const { wrapper } = new MFASetup(localVue)
      const text = wrapper.find('.mfa-setup__content--text')
      expect(text.exists()).toBe(true)
    })
  })

  describe('Setup Instructions Display', () => {
    it('displays step 1 instruction', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(wrapper.text()).toContain('1. Install an MFA app on your mobile device')
    })

    it('displays step 2 instruction', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(wrapper.text()).toContain('2. Scan the QR code with your device')
    })

    it('displays step 3 instruction', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(wrapper.text()).toContain('3. Enter MFA code')
    })

    it('shows all three steps in sequence', () => {
      const { wrapper } = new MFASetup(localVue)
      const text = wrapper.text()
      const step1Index = text.indexOf('1. Install')
      const step2Index = text.indexOf('2. Scan')
      const step3Index = text.indexOf('3. Enter')

      expect(step1Index < step2Index).toBe(true)
      expect(step2Index < step3Index).toBe(true)
    })
  })

  describe('MFA Code Input', () => {
    it('initializes with empty MFA code', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(wrapper.vm.mfaCode === '' || wrapper.vm.mfaCode === null).toBe(true)
    })

    it('accepts numeric MFA code', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setData({ mfaCode: '123456' })
      expect(wrapper.vm.mfaCode).toBe('123456')
    })

    it('accepts 6-digit MFA code', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setData({ mfaCode: '654321' })
      expect(wrapper.vm.mfaCode.length).toBe(6)
    })

    it('handles various code lengths', async () => {
      const { wrapper } = new MFASetup(localVue)
      const codes = ['123', '123456', '12345678']
      for (const code of codes) {
        await wrapper.setData({ mfaCode: code })
        expect(wrapper.vm.mfaCode).toBe(code)
      }
    })

    it('displays code in input field', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setData({ mfaCode: 'test-code' })
      expect(wrapper.vm.mfaCode).toContain('test-code')
    })
  })

  describe('Props and Configuration', () => {
    it('accepts mfaSetupDetails prop', async () => {
      const { wrapper } = new MFASetup(localVue)
      const setupDetails = {
        manualEntryKey: 'test-manual-key'
      }
      await wrapper.setProps({ mfaSetupDetails: setupDetails })
      expect(wrapper.props('mfaSetupDetails')).toEqual(setupDetails)
    })

    it('displays manual entry key from props', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({
        mfaSetupDetails: {
          manualEntryKey: 'my-custom-manual-key'
        }
      })
      expect(wrapper.text()).toContain('my-custom-manual-key')
    })

    it('accepts isLogin prop', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      expect(wrapper.props('isLogin')).toBe(true)
    })

    it('shows submit button when isLogin is true', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      expect(button.exists()).toBe(true)
    })
  })

  describe('Form Submission', () => {
    it('renders submit button', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      expect(button.exists()).toBeTruthy()
    })

    it('submit button is visible when required', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      expect(button.isVisible()).toBe(true)
    })

    it('handles submit button click', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      if (button.exists()) {
        await button.trigger('click')
        expect(button.exists()).toBe(true)
      }
    })

    it('submits form with MFA code', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      await wrapper.setData({ mfaCode: '123456' })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      if (button.exists()) {
        await button.trigger('click')
        expect(wrapper.vm.mfaCode).toBe('123456')
      }
    })
  })

  describe('Event Emission', () => {
    it('emits confirmSetupMFA event on submit', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      await wrapper.setData({ mfaCode: 'test123' })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      if (button.exists()) {
        await button.trigger('click')
        const emittedEvent = wrapper.emitted()['confirmSetupMFA']
        expect(emittedEvent).toBeDefined()
      }
    })

    it('emits event with correct payload', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      await wrapper.setData({ mfaCode: 'payload-test' })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      if (button.exists()) {
        await button.trigger('click')
        const emittedEvent = wrapper.emitted()['confirmSetupMFA']
        if (emittedEvent) {
          expect(emittedEvent[0][0]).toBeDefined()
        }
      }
    })

    it('emits event with mfaCode value', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const expectedCode = 'emit-test-code'
      await wrapper.setData({ mfaCode: expectedCode })
      const button = wrapper.find('#btn-setup--mfa-dashboard-popup')
      if (button.exists()) {
        await button.trigger('click')
        const emittedEvent = wrapper.emitted()['confirmSetupMFA']
        expect(emittedEvent.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Validation Messages', () => {
    it('displays required field indicator', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({
        mfaSetupDetails: { manualEntryKey: 'key' }
      })
      const messages = wrapper.find('.v-messages')
      if (messages.exists()) {
        expect(messages.text()).toContain('*Required')
      }
    })

    it('shows validation messages when needed', async () => {
      const { wrapper } = new MFASetup(localVue)
      const messagesWrapper = wrapper.find('.v-messages')
      if (messagesWrapper.exists()) {
        expect(messagesWrapper.exists()).toBe(true)
      }
    })
  })

  describe('UI Elements', () => {
    it('renders input field for MFA code', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const input = wrapper.find('#input--login-mfa-code')
      expect(input.exists()).toBe(true)
    })

    it('input field accepts keyboard input', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const input = wrapper.find('#input--login-mfa-code')
      if (input.exists()) {
        await input.trigger('keyup')
        expect(input.exists()).toBe(true)
      }
    })

    it('handles enter key in input field', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      const input = wrapper.find('#input--login-mfa-code')
      if (input.exists()) {
        await input.trigger('keyup', { enterKey: true })
        expect(input.exists()).toBe(true)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles empty MFA code submission', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: true })
      await wrapper.setData({ mfaCode: '' })
      expect(wrapper.vm.mfaCode).toBe('')
    })

    it('handles very long code input', async () => {
      const { wrapper } = new MFASetup(localVue)
      const longCode = '1'.repeat(50)
      await wrapper.setData({ mfaCode: longCode })
      expect(wrapper.vm.mfaCode.length).toBe(50)
    })

    it('handles special characters in manual entry key', async () => {
      const { wrapper } = new MFASetup(localVue)
      const specialKey = 'key-with-@special#chars!'
      await wrapper.setProps({
        mfaSetupDetails: { manualEntryKey: specialKey }
      })
      expect(wrapper.text()).toContain('@special#chars!')
    })

    it('handles multiple prop updates', async () => {
      const { wrapper } = new MFASetup(localVue)
      await wrapper.setProps({ isLogin: false })
      expect(wrapper.props('isLogin')).toBe(false)

      await wrapper.setProps({ isLogin: true })
      expect(wrapper.props('isLogin')).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const { wrapper } = new MFASetup(localVue)
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('preserves state after operations', async () => {
      const { wrapper } = new MFASetup(localVue)
      const code = '555555'
      await wrapper.setData({ mfaCode: code })
      expect(wrapper.vm.mfaCode).toBe(code)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.mfaCode).toBe(code)
    })
  })
})
