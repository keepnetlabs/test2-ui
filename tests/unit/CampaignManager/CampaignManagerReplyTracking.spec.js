import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReplyTracking from '@/components/CampaignManager/CampaignManagerReplyTracking'
import * as Validations from '@/utils/validations'

jest.mock('@/api/domains', () => ({
  getDomainsList: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [
          { domain: 'example.com' },
          { domain: 'test.com' },
          { domain: 'company.org' }
        ]
      }
    }
  })
}))

jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn(() => ({ pageSize: 1000 }))
}))

jest.mock('@/utils/validations')

describe('CampaignManagerReplyTracking.vue', () => {
  const localVue = createLocalVue()

  const defaultValue = {
    isEnabled: false,
    subDomain: '',
    domain: '',
    isSaveContentEnabled: false,
    isOutOfOfficeEnabled: false
  }

  const mountComponent = (propsData = {}) => {
    return shallowMount(CampaignManagerReplyTracking, {
      localVue,
      propsData: {
        value: defaultValue,
        ...propsData
      },
      stubs: {
        FormGroup: true,
        VSwitch: true,
        VTextField: true,
        KSelect: true,
        VCheckbox: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReplyTracking')
    })

    it('should render FormGroup component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'FormGroup' }).exists()).toBe(true)
    })

    it('should have main container div with class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-reply-tracking').exists()).toBe(true)
    })

    it('should render input elements for subdomain and domain', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'KSelect' }).exists()).toBe(true)
    })

    it('should render VCheckbox for content saving option', () => {
      const wrapper = mountComponent()
      const checkboxes = wrapper.findAllComponents({ name: 'VCheckbox' })
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    it('should render label with proper text', () => {
      const wrapper = mountComponent()
      const labels = wrapper.vm.labels
      expect(labels.ReplyTracking).toBeDefined()
    })
  })

  describe('Props', () => {
    it('should accept value prop', () => {
      const value = { ...defaultValue, isEnabled: true }
      const wrapper = mountComponent({ value })
      expect(wrapper.vm.value).toEqual(value)
    })

    it('should have default value prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.value).toEqual(defaultValue)
    })

    it('value prop should be of type Object', () => {
      expect(CampaignManagerReplyTracking.props.value.type).toBe(Object)
    })

    it('should handle value with all properties', () => {
      const value = {
        isEnabled: true,
        subDomain: 'mail',
        domain: 'example.com',
        isSaveContentEnabled: true,
        isOutOfOfficeEnabled: false
      }
      const wrapper = mountComponent({ value })
      expect(wrapper.vm.value.isEnabled).toBe(true)
      expect(wrapper.vm.value.subDomain).toBe('mail')
      expect(wrapper.vm.value.domain).toBe('example.com')
    })
  })

  describe('CSS Classes', () => {
    it('should apply disabled class when isEnabled is false', () => {
      const value = { ...defaultValue, isEnabled: false }
      const wrapper = mountComponent({ value })
      expect(wrapper.find('.campaign-manager-reply-tracking--disabled').exists()).toBe(true)
    })

    it('should not apply disabled class when isEnabled is true', () => {
      const value = { ...defaultValue, isEnabled: true }
      const wrapper = mountComponent({ value })
      expect(wrapper.find('.campaign-manager-reply-tracking--disabled').exists()).toBe(false)
    })

    it('should have main container class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-reply-tracking').exists()).toBe(true)
    })

    it('should apply disabled class to content section when not enabled', () => {
      const value = { ...defaultValue, isEnabled: false }
      const wrapper = mountComponent({ value })
      expect(wrapper.find('.campaign-manager-reply-tracking__content--disabled').exists()).toBe(true)
    })
  })

  describe('Data Initialization', () => {
    it('should initialize domainItems as empty array', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.domainItems)).toBe(true)
      expect(wrapper.vm.domainItems.length).toBe(0)
    })

    it('should initialize validation rules for subdomain', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.subdomainRules)).toBe(true)
      expect(wrapper.vm.subdomainRules.length).toBeGreaterThan(0)
    })

    it('should initialize validation rules for domain', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.domainRules)).toBe(true)
    })

    it('should initialize axiosPayload', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.axiosPayload).toBeDefined()
    })
  })

  describe('Lifecycle Hooks', () => {
    it('should initialize domainItems as empty array before loading', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.domainItems)).toBe(true)
    })

    it('should load domains on component creation', async () => {
      const wrapper = mountComponent()
      // Wait for promise resolution and view updates
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.domainItems).toHaveLength(3)
    })

    it('should map domain response correctly', async () => {
      const wrapper = mountComponent()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.domainItems[0]).toHaveProperty('text', 'example.com')
      expect(wrapper.vm.domainItems[0]).toHaveProperty('value', 'example.com')
    })
  })

  describe('Methods', () => {
    it('handleDomainChange should emit input event', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDomainChange('newmail')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('handleDomainChange should emit with updated subDomain', () => {
      const value = { ...defaultValue, domain: 'example.com' }
      const wrapper = mountComponent({ value })
      wrapper.vm.handleDomainChange('mail')
      const emitted = wrapper.emitted('input')[0][0]
      expect(emitted.subDomain).toBe('mail')
    })

    it('handleDomainChange should preserve other properties', () => {
      const value = {
        ...defaultValue,
        isEnabled: true,
        domain: 'example.com',
        isSaveContentEnabled: true
      }
      const wrapper = mountComponent({ value })
      wrapper.vm.handleDomainChange('newmail')
      const emitted = wrapper.emitted('input')[0][0]
      expect(emitted.isEnabled).toBe(true)
      expect(emitted.isSaveContentEnabled).toBe(true)
      expect(emitted.domain).toBe('example.com')
    })
  })

  describe('Event Emission', () => {
    it('should emit input event when subdomain changes', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDomainChange('test')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit input event with complete value object', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDomainChange('subdomain')
      const emitted = wrapper.emitted('input')[0][0]
      expect(emitted).toHaveProperty('isEnabled')
      expect(emitted).toHaveProperty('subDomain')
      expect(emitted).toHaveProperty('domain')
    })

    it('should handle multiple input changes', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDomainChange('mail1')
      wrapper.vm.handleDomainChange('mail2')
      wrapper.vm.handleDomainChange('mail3')
      expect(wrapper.emitted('input')).toHaveLength(3)
    })
  })

  describe('Validation Rules', () => {
    it('subdomainRules should include multiple validation functions', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.subdomainRules.length).toBeGreaterThanOrEqual(4)
    })

    it('subdomainRules should contain validation functions', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.subdomainRules.every(rule => typeof rule === 'function')).toBe(true)
    })

    it('domainRules should have required validation', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.domainRules.length).toBeGreaterThan(0)
      expect(wrapper.vm.domainRules.every(rule => typeof rule === 'function')).toBe(true)
    })

    it('subdomainRules validation should be callable', () => {
      const wrapper = mountComponent()
      const rules = wrapper.vm.subdomainRules
      expect(typeof rules[0]).toBe('function')
      // Call the validation - should not throw
      expect(() => {
        rules[0]('test')
      }).not.toThrow()
    })

    it('domainRules validation should be callable', () => {
      const wrapper = mountComponent()
      const rules = wrapper.vm.domainRules
      expect(typeof rules[0]).toBe('function')
      // Call the validation - should not throw
      expect(() => {
        rules[0]('example.com')
      }).not.toThrow()
    })
  })

  describe('Enable/Disable Functionality', () => {
    it('should apply disabled class when isEnabled is false', () => {
      const value = { ...defaultValue, isEnabled: false }
      const wrapper = mountComponent({ value })
      expect(wrapper.find('.campaign-manager-reply-tracking--disabled').exists()).toBe(true)
    })

    it('should not apply disabled class when isEnabled is true', () => {
      const value = { ...defaultValue, isEnabled: true }
      const wrapper = mountComponent({ value })
      expect(wrapper.find('.campaign-manager-reply-tracking--disabled').exists()).toBe(false)
    })

    it('should apply disabled class to content section when not enabled', () => {
      const value = { ...defaultValue, isEnabled: false }
      const wrapper = mountComponent({ value })
      expect(wrapper.find('.campaign-manager-reply-tracking__content--disabled').exists()).toBe(true)
    })

    it('should not apply disabled class to content section when enabled', () => {
      const value = { ...defaultValue, isEnabled: true }
      const wrapper = mountComponent({ value })
      expect(wrapper.find('.campaign-manager-reply-tracking__content--disabled').exists()).toBe(false)
    })

    it('should have proper structure for form elements', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-reply-tracking__content').exists()).toBe(true)
    })

    it('should maintain isEnabled state when provided', () => {
      const value = { ...defaultValue, isEnabled: true }
      const wrapper = mountComponent({ value })
      expect(wrapper.vm.value.isEnabled).toBe(true)
    })
  })

  describe('Domain Items Loading', () => {
    it('should populate domainItems after loading', async () => {
      const wrapper = mountComponent()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.domainItems.length).toBe(3)
    })

    it('domain items should have correct structure', async () => {
      const wrapper = mountComponent()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()
      wrapper.vm.domainItems.forEach(item => {
        expect(item).toHaveProperty('text')
        expect(item).toHaveProperty('value')
      })
    })

    it('domain items should map correctly from API response', async () => {
      const wrapper = mountComponent()
      await new Promise(resolve => setTimeout(resolve, 10))
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.domainItems[0].text).toBe('example.com')
      expect(wrapper.vm.domainItems[0].value).toBe('example.com')
      expect(wrapper.vm.domainItems[1].text).toBe('test.com')
      expect(wrapper.vm.domainItems[2].text).toBe('company.org')
    })

    it('should handle domain loading without errors', async () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.vm.$nextTick()
      }).not.toThrow()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const value1 = { ...defaultValue, subDomain: 'mail1', isEnabled: true }
      const value2 = { ...defaultValue, subDomain: 'mail2', isEnabled: false }
      const wrapper1 = mountComponent({ value: value1 })
      const wrapper2 = mountComponent({ value: value2 })

      expect(wrapper1.vm.value.subDomain).toBe('mail1')
      expect(wrapper2.vm.value.subDomain).toBe('mail2')
    })

    it('multiple instances should emit independently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.handleDomainChange('mail1')
      wrapper2.vm.handleDomainChange('mail2')

      expect(wrapper1.emitted('input')[0][0].subDomain).toBe('mail1')
      expect(wrapper2.emitted('input')[0][0].subDomain).toBe('mail2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete reply tracking configuration workflow', () => {
      const value = {
        isEnabled: true,
        subDomain: 'mail',
        domain: 'example.com',
        isSaveContentEnabled: true,
        isOutOfOfficeEnabled: false
      }
      const wrapper = mountComponent({ value })

      expect(wrapper.vm.value.isEnabled).toBe(true)
      expect(wrapper.vm.value.subDomain).toBe('mail')
      expect(wrapper.vm.value.domain).toBe('example.com')
      expect(wrapper.vm.value.isSaveContentEnabled).toBe(true)
    })

    it('should handle enabling and configuring reply tracking', async () => {
      const wrapper = mountComponent({ value: defaultValue })

      // Enable tracking
      await wrapper.setProps({
        value: { ...defaultValue, isEnabled: true }
      })
      expect(wrapper.vm.value.isEnabled).toBe(true)

      // Configure subdomain
      wrapper.vm.handleDomainChange('mail')
      expect(wrapper.emitted('input')[0][0].subDomain).toBe('mail')
    })

    it('should handle switching between disabled and enabled states', async () => {
      const wrapper = mountComponent({ value: defaultValue })

      // Enable
      await wrapper.setProps({
        value: { ...defaultValue, isEnabled: true }
      })
      let textField = wrapper.findComponent({ name: 'VTextField' })
      expect(textField.props('disabled')).toBe(false)

      // Disable
      await wrapper.setProps({
        value: { ...defaultValue, isEnabled: false }
      })
      textField = wrapper.findComponent({ name: 'VTextField' })
      expect(textField.props('disabled')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty subdomain', () => {
      const value = { ...defaultValue, subDomain: '', isEnabled: true }
      const wrapper = mountComponent({ value })
      wrapper.vm.handleDomainChange('')
      expect(wrapper.emitted('input')[0][0].subDomain).toBe('')
    })

    it('should handle subdomain with special characters', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleDomainChange('mail-server-1')
      expect(wrapper.emitted('input')[0][0].subDomain).toBe('mail-server-1')
    })

    it('should handle very long subdomain', () => {
      const longSubdomain = 'a'.repeat(100)
      const wrapper = mountComponent()
      wrapper.vm.handleDomainChange(longSubdomain)
      expect(wrapper.emitted('input')[0][0].subDomain).toBe(longSubdomain)
    })

    it('should handle rapid value changes', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 10; i++) {
        await wrapper.setProps({
          value: { ...defaultValue, isEnabled: i % 2 === 0 }
        })
      }
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('handleDomainChange should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleDomainChange(`mail${i}`)
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('should load domains efficiently', async () => {
      const start = Date.now()
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(500)
    })
  })
})
