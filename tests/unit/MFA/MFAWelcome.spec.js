import { createLocalVue } from '@vue/test-utils'
import MFAWelcome from '../Objects/MFAWelcome'

describe('MFA Setup component', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return new MFAWelcome(localVue, propsData).wrapper
  }

  const createObject = (propsData = {}) => new MFAWelcome(localVue, propsData)

  describe('Object getWrapper coverage', () => {
    it('getWrapper returns the same as .wrapper', () => {
      const obj = createObject()
      expect(obj.getWrapper()).toBe(obj.wrapper)
      expect(obj.getWrapper().vm.$options.name).toBe('MFAWelcome')
    })
  })

  describe('component rendering', () => {
    it('should render component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should render mfa-welcome container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.mfa-welcome').exists()).toBeTruthy()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('MFAWelcome')
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

    it('should have centered actions', () => {
      const wrapper = mountComponent()
      const actions = wrapper.find('.v-card__actions')
      expect(actions.classes()).toContain('justify-center')
    })
  })

  describe('title and description', () => {
    it('should display welcome title', () => {
      const wrapper = mountComponent()
      const title = wrapper.find('.login-title')
      expect(title.text()).toContain('Setup Multi-factor Authentication')
    })

    it('should display authentication requirement message', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('You must enable multi-factor')
    })

    it('should have correct title element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.login-title').exists()).toBe(true)
    })

    it('should have description section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.login-desc').exists()).toBe(true)
    })

    it('should display complete welcome message', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Setup Multi-factor Authentication')
      expect(wrapper.text()).toContain('You must enable multi-factor')
    })
  })

  describe('buttons rendering', () => {
    it('should have setup MFA button', () => {
      const wrapper = mountComponent()
      const setupButton = wrapper.find('#btn--login-setup-mfa')
      expect(setupButton.exists()).toBe(true)
    })

    it('should have setup MFA button with correct text', () => {
      const wrapper = mountComponent()
      const setupButton = wrapper.find('#btn--login-setup-mfa')
      expect(setupButton.text()).toContain('SETUP MFA')
    })

    it('should have setup MFA button visible', () => {
      const wrapper = mountComponent()
      const setupButton = wrapper.find('button')
      expect(setupButton.isVisible()).toBe(true)
    })

    it('should have button enabled by default', () => {
      const wrapper = mountComponent()
      const setupButton = wrapper.find('button')
      expect(setupButton.attributes('disabled')).toBeFalsy()
    })

    it('should render icon on setup MFA button', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('#btn--login-setup-mfa .v-icon')
      expect(icon.exists()).toBe(true)
    })

    it('should have icon on setup button', () => {
      const wrapper = mountComponent()
      const icon = wrapper.find('#btn--login-setup-mfa .v-icon')
      expect(icon.exists()).toBe(true)
    })

    it('should have blue color on button', () => {
      const wrapper = mountComponent()
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.props('color')).toBe('blue')
    })

    it('should have rounded style on button', () => {
      const wrapper = mountComponent()
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.props('rounded')).toBe(true)
    })

    it('should have styled button component', () => {
      const wrapper = mountComponent()
      const button = wrapper.findComponent({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })
  })

  describe('continue without MFA button', () => {
    it('should render continue without MFA button when not expired', () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      const continueButton = wrapper.find('#btn--login-continue-without-mfa')
      expect(continueButton.exists()).toBe(true)
    })

    it('should hide continue without MFA button when expired', () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: true } })
      const continueButton = wrapper.find('#btn--login-continue-without-mfa')
      expect(continueButton.exists()).toBe(false)
    })

    it('should hide continue without MFA button when no mfaDetails', () => {
      const wrapper = mountComponent()
      const continueButton = wrapper.find('#btn--login-continue-without-mfa')
      expect(continueButton.exists()).toBe(false)
    })

    it('should display correct text on continue button', () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      const continueButton = wrapper.find('#btn--login-continue-without-mfa')
      expect(continueButton.text()).toContain('CONTINUE WITHOUT MFA')
    })
  })

  describe('event emission', () => {
    it('should emit setupMFA event when setup button clicked', async () => {
      const wrapper = mountComponent()
      const setupButton = wrapper.find('#btn--login-setup-mfa')
      await setupButton.trigger('click')
      expect(wrapper.emitted()['setupMFA']).toBeTruthy()
    })

    it('should emit withoutContinueMFA when continue button clicked', async () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      const continueButton = wrapper.find('#btn--login-continue-without-mfa')
      await continueButton.trigger('click')
      expect(wrapper.emitted()['withoutContinueMFA']).toBeTruthy()
    })

    it('should emit setupMFA with correct event format', async () => {
      const wrapper = mountComponent()
      const button = wrapper.find('#btn--login-setup-mfa')
      await button.trigger('click')
      const emitted = wrapper.emitted()['setupMFA']
      expect(emitted.length).toBe(1)
      expect(emitted[0][0]).toStrictEqual(undefined)
    })

    it('should handle multiple setupMFA clicks', async () => {
      const wrapper = mountComponent()
      const button = wrapper.find('#btn--login-setup-mfa')

      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')

      const emitted = wrapper.emitted()['setupMFA']
      expect(emitted.length).toBe(3)
    })

    it('should emit setupMFA event on button click', async () => {
      const wrapper = mountComponent()
      const button = wrapper.find('#btn--login-setup-mfa')
      await button.trigger('click')
      const emitted = wrapper.emitted()['setupMFA']
      expect(emitted).toBeTruthy()
      expect(emitted.length).toBeGreaterThan(0)
    })

    it('should handle continue without MFA event', async () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      const continueButton = wrapper.find('#btn--login-continue-without-mfa')
      await continueButton.trigger('click')
      expect(wrapper.emitted()['withoutContinueMFA']).toBeTruthy()
    })
  })

  describe('props handling', () => {
    it('should accept mfaDetails prop', () => {
      const mfaDetails = { IsExpired: false, ExpireTime: '2025-12-31' }
      const wrapper = mountComponent({ mfaDetails })
      expect(wrapper.props('mfaDetails')).toEqual(mfaDetails)
    })

    it('should accept rules prop', () => {
      const rules = { required: (v) => !!v || 'Required' }
      const wrapper = mountComponent({ rules })
      expect(wrapper.props('rules')).toBeDefined()
    })

    it('should handle null mfaDetails', () => {
      const wrapper = mountComponent({ mfaDetails: null })
      expect(wrapper.props('mfaDetails')).toBeNull()
    })

    it('should handle undefined mfaDetails', () => {
      const wrapper = mountComponent({ mfaDetails: undefined })
      expect(wrapper.props('mfaDetails')).toBeUndefined()
    })

    it('should handle empty mfaDetails object', () => {
      const wrapper = mountComponent({ mfaDetails: {} })
      expect(wrapper.props('mfaDetails')).toEqual({})
    })
  })

  describe('conditional rendering', () => {
    it('should render based on mfaDetails.IsExpired', () => {
      const notExpired = mountComponent({ mfaDetails: { IsExpired: false } })
      const expired = mountComponent({ mfaDetails: { IsExpired: true } })

      expect(notExpired.find('#btn--login-continue-without-mfa').exists()).toBe(true)
      expect(expired.find('#btn--login-continue-without-mfa').exists()).toBe(false)
    })

    it('should always render setup MFA button', () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: true } })
      expect(wrapper.find('#btn--login-setup-mfa').exists()).toBe(true)
    })

    it('should handle mfaDetails changes', async () => {
      const wrapper = mountComponent()
      expect(wrapper.find('#btn--login-continue-without-mfa').exists()).toBe(false)

      await wrapper.setProps({ mfaDetails: { IsExpired: false } })
      expect(wrapper.find('#btn--login-continue-without-mfa').exists()).toBe(true)
    })
  })

  describe('computed properties', () => {
    it('should have getExpireTime computed property', () => {
      const wrapper = mountComponent({ mfaDetails: { ExpireTime: '2025-12-31T00:00:00Z' } })
      expect(wrapper.vm.getExpireTime).toBeDefined()
    })

    it('should return false when no mfaDetails', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getExpireTime).toBe(false)
    })

    it('should return false when no ExpireTime', () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      expect(wrapper.vm.getExpireTime).toBe(false)
    })

    it('should format expire time when provided', () => {
      const wrapper = mountComponent({ mfaDetails: { ExpireTime: '2025-12-31' } })
      expect(wrapper.vm.getExpireTime).toBeDefined()
    })
  })

  describe('CSS classes and styling', () => {
    it('should have mfa-welcome class on container', () => {
      const wrapper = mountComponent()
      const container = wrapper.find('.mfa-welcome')
      expect(container.classes()).toContain('mfa-welcome')
    })

    it('should have login-title class on title', () => {
      const wrapper = mountComponent()
      const title = wrapper.find('.login-title')
      expect(title.exists()).toBe(true)
    })

    it('should have login-desc class on description', () => {
      const wrapper = mountComponent()
      const desc = wrapper.find('.login-desc')
      expect(desc.exists()).toBe(true)
    })

    it('should have button element styled correctly', () => {
      const wrapper = mountComponent()
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.classes().length).toBeGreaterThan(0)
    })

    it('should have correct button classes', () => {
      const wrapper = mountComponent()
      const setupButton = wrapper.find('#btn--login-setup-mfa')
      expect(setupButton.classes()).toContain('login_setup-mfa-button')
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

    it('should maintain state after lifecycle', async () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#btn--login-setup-mfa').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.mfa-welcome').exists()).toBe(true)
      expect(wrapper.find('.login-title').exists()).toBe(true)
      expect(wrapper.find('#btn--login-setup-mfa').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('mfaDetails should accept object type', () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      expect(typeof wrapper.props('mfaDetails')).toBe('object')
    })

    it('emitted events should be in correct format', async () => {
      const wrapper = mountComponent()
      const button = wrapper.find('button')
      await button.trigger('click')
      const emitted = wrapper.emitted()
      expect(Array.isArray(emitted['setupMFA'])).toBe(true)
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
      expect(wrapper.vm.$options.name).toBe('MFAWelcome')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid button clicks', async () => {
      const wrapper = mountComponent()
      const button = wrapper.find('#btn--login-setup-mfa')
      for (let i = 0; i < 5; i++) {
        await button.trigger('click')
      }
      expect(wrapper.emitted()['setupMFA'].length).toBe(5)
    })

    it('should handle mfaDetails with extra properties', () => {
      const mfaDetails = { IsExpired: false, ExpireTime: '2025-12-31', extraProp: 'value' }
      const wrapper = mountComponent({ mfaDetails })
      expect(wrapper.props('mfaDetails')).toEqual(mfaDetails)
    })

    it('should handle switching between expired and not expired states', async () => {
      const wrapper = mountComponent({ mfaDetails: { IsExpired: false } })
      expect(wrapper.find('#btn--login-continue-without-mfa').exists()).toBe(true)

      await wrapper.setProps({ mfaDetails: { IsExpired: true } })
      expect(wrapper.find('#btn--login-continue-without-mfa').exists()).toBe(false)

      await wrapper.setProps({ mfaDetails: { IsExpired: false } })
      expect(wrapper.find('#btn--login-continue-without-mfa').exists()).toBe(true)
    })

    it('should handle multiple prop changes', async () => {
      const wrapper = mountComponent()
      await wrapper.setProps({ mfaDetails: { IsExpired: false } })
      await wrapper.setProps({ mfaDetails: { IsExpired: true } })
      await wrapper.setProps({ rules: { required: (v) => !!v } })
      expect(wrapper.exists()).toBe(true)
    })
  })
})
