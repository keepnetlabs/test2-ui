import { shallowMount } from '@vue/test-utils'
import OtherSettings from '@/components/PhishingReporter/Settings/OtherSettings.vue'

global.APP_CONFIG = global.APP_CONFIG || {
  VUE_APP_API_KEY: 'test-key',
  VUE_APP_PHISHING_REPORTER_URL: 'https://test.com/api'
}

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  scrollToComponent: jest.fn()
}))

describe('OtherSettings.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(OtherSettings, {
      propsData: {
        showHeader: true,
        showFooter: true,
        showForm: true,
        formData: null,
        ...propsData
      },
      stubs: { PhishingSettingsFooter: true }
    })

  describe('submit', () => {
    it('emits updateForm and returns formValues when validation passes', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      wrapper.setData({
        formValues: {
          apiUrl: 'https://test.com',
          apiKey: 'test-key',
          companyKey: 'company-1'
        }
      })
      const result = wrapper.vm.submit({}, false)
      expect(wrapper.emitted('updateForm')).toBeTruthy()
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: false })
      expect(result).toMatchObject({ apiUrl: 'https://test.com' })
    })

    it('emits updateForm with isAddIn true', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      wrapper.setData({
        formValues: {
          apiUrl: 'https://test.com',
          apiKey: 'key',
          companyKey: 'c1'
        }
      })
      wrapper.vm.submit({}, true)
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: true })
    })

    it('returns false when validation fails', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {
        refForm: {
          validate: () => false,
          $el: { querySelector: () => document.createElement('div') }
        }
      }
      const result = wrapper.vm.submit({})
      expect(result).toBe(false)
      expect(wrapper.emitted('updateForm')).toBeFalsy()
    })
  })

  describe('getCurrentValues', () => {
    it('returns formValues', () => {
      const wrapper = createWrapper()
      const result = wrapper.vm.getCurrentValues()
      expect(result).toHaveProperty('apiUrl')
      expect(result).toHaveProperty('apiKey')
      expect(result).toHaveProperty('companyKey')
    })
  })

  describe('getFormValues', () => {
    it('returns formValues when validation passes', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      wrapper.setData({
        formValues: {
          apiUrl: 'https://test.com',
          apiKey: 'key',
          companyKey: 'c1'
        }
      })
      const result = wrapper.vm.getFormValues()
      expect(result).toMatchObject({ apiUrl: 'https://test.com' })
    })

    it('returns false when validation fails', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = { refForm: { validate: () => false } }
      const result = wrapper.vm.getFormValues()
      expect(result).toBe(false)
    })
  })

  describe('formData watcher', () => {
    it('updates formValues when formData changes', async () => {
      const wrapper = createWrapper()
      const formData = {
        companyKey: 'new-company',
        enterpriseVaultUrl: 'https://vault.com',
        apiUrl: 'https://api.com',
        isEnableProxy: true,
        apiKey: 'new-key'
      }
      wrapper.setProps({ formData })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.formValues.companyKey).toBe('new-company')
      expect(wrapper.vm.formValues.enterpriseVaultUrl).toBe('https://vault.com')
      expect(wrapper.vm.formValues.apiUrl).toBe('https://api.com')
      expect(wrapper.vm.formValues.isEnableProxy).toBe(true)
      expect(wrapper.vm.formValues.apiKey).toBe('new-key')
    })
  })

  describe('formValues watcher', () => {
    it('emits formValuesChanged when formValues differ from initial', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          apiUrl: 'https://changed.com'
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('formValuesChanged')).toBeTruthy()
    })
  })

  describe('rules when showForm is false', () => {
    it('siteUrlRules returns empty array', () => {
      const wrapper = createWrapper({ showForm: false })
      expect(wrapper.vm.siteUrlRules).toEqual([])
    })

    it('apiKeyRules returns empty array', () => {
      const wrapper = createWrapper({ showForm: false })
      expect(wrapper.vm.apiKeyRules).toEqual([])
    })
  })

  describe('getVaultUrlRules', () => {
    it('returns empty array when enableEnterpriseVault is false', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, enableEnterpriseVault: false }
      })
      expect(wrapper.vm.getVaultUrlRules).toEqual([])
    })

    it('returns rules when enableEnterpriseVault is true and showForm', () => {
      const wrapper = createWrapper({ showForm: true })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, enableEnterpriseVault: true }
      })
      expect(wrapper.vm.getVaultUrlRules.length).toBeGreaterThan(0)
    })

    it('returns empty array when showForm is false', () => {
      const wrapper = createWrapper({ showForm: false })
      wrapper.setData({
        formValues: { ...wrapper.vm.formValues, enableEnterpriseVault: true }
      })
      expect(wrapper.vm.getVaultUrlRules).toEqual([])
    })
  })

  describe('created', () => {
    it('emits getInitialFormValues on mount', () => {
      const wrapper = createWrapper()
      expect(wrapper.emitted('getInitialFormValues')).toBeTruthy()
      expect(wrapper.emitted('getInitialFormValues')[0][0]).toMatchObject({
        isEnableProxy: false
      })
    })
  })

  describe('handleEnterpriseVaultChange', () => {
    it('clears enterpriseVaultUrl when value is false', () => {
      const ctx = {
        formValues: { enterpriseVaultUrl: 'https://vault.com' },
        enterpriseVaultDisabled: false
      }
      OtherSettings.methods.handleEnterpriseVaultChange.call(ctx, false)
      expect(ctx.formValues.enterpriseVaultUrl).toBe('')
      expect(ctx.enterpriseVaultDisabled).toBe(true)
    })

    it('does not clear when value is true', () => {
      const ctx = {
        formValues: { enterpriseVaultUrl: 'https://vault.com' },
        enterpriseVaultDisabled: true
      }
      OtherSettings.methods.handleEnterpriseVaultChange.call(ctx, true)
      expect(ctx.formValues.enterpriseVaultUrl).toBe('https://vault.com')
      expect(ctx.enterpriseVaultDisabled).toBe(false)
    })
  })
})
