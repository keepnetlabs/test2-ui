jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  scrollToComponent: jest.fn()
}))

jest.mock('@/api/phishingReporter', () => ({
  generateDiagnosticTool: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'id-1' } } })),
  downloadDiagnosticTool: jest.fn(() => Promise.resolve({ data: new Blob() }))
}))

import { shallowMount } from '@vue/test-utils'
import DiagnosticTool from '@/components/PhishingReporter/Settings/DiagnosticTool.vue'

const { generateDiagnosticTool, downloadDiagnosticTool } = require('@/api/phishingReporter')

describe('DiagnosticTool.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DiagnosticTool, {
      propsData: {
        showHeader: true,
        showFooter: true,
        showForm: true,
        formData: null,
        isInModal: false,
        ...propsData
      },
      mocks: {
        $store: {
          getters: { 'common/getTimezones': [] }
        }
      },
      stubs: {
        PhishingSettingsFooter: true,
        FormGroup: true,
        InputUrl: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')
  })

  describe('submit', () => {
    it('emits updateForm when validation passes', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      const result = wrapper.vm.submit({}, false)
      expect(wrapper.emitted('updateForm')).toBeTruthy()
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: false })
      expect(result).toBeDefined()
    })

    it('emits updateForm with isAddIn true', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = { refForm: { validate: () => true } }
      wrapper.vm.submit({}, true)
      expect(wrapper.emitted('updateForm')[0][0]).toMatchObject({ isAddIn: true })
    })

    it('calls scrollToComponent when validation fails', async () => {
      const scrollToComponent = require('@/utils/functions').scrollToComponent
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.$refs = {
        refForm: {
          validate: () => false,
          $el: { querySelector: () => document.createElement('div') }
        }
      }
      wrapper.vm.submit({})
      await wrapper.vm.$nextTick()
      expect(scrollToComponent).toHaveBeenCalled()
    })
  })

  describe('getCurrentValues', () => {
    it('returns formValues', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      const result = wrapper.vm.getCurrentValues()
      expect(result).toHaveProperty('proxyMode')
      expect(result).toHaveProperty('proxyAddress')
    })
  })

  describe('getFormValues', () => {
    it('returns formValues', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      const result = wrapper.vm.getFormValues()
      expect(result).toHaveProperty('proxyMode')
    })
  })

  describe('onPortChange', () => {
    it('sets proxyPort when valid number', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = { refTextField: { lazyValue: '' } }
      wrapper.vm.onPortChange('8080')
      expect(wrapper.vm.formValues.proxyPort).toBe('8080')
    })

    it('clears proxyPort when empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({ formValues: { ...wrapper.vm.formValues, proxyPort: '8080' } })
      wrapper.vm.$refs = { refTextField: { lazyValue: '8080' } }
      wrapper.vm.onPortChange('')
      expect(wrapper.vm.formValues.proxyPort).toBe('')
    })

    it('handles NaN by clearing', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = { refTextField: { lazyValue: '' } }
      wrapper.vm.onPortChange('abc')
      expect(wrapper.vm.formValues.proxyPort).toBe('')
    })
  })

  describe('handleAuthenticationMethodChange', () => {
    it('clears proxy credentials when val is 0', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          proxyUserName: 'user',
          proxyUserPassword: 'pass'
        }
      })
      wrapper.vm.handleAuthenticationMethodChange(0)
      expect(wrapper.vm.formValues.proxyUserName).toBe('')
      expect(wrapper.vm.formValues.proxyUserPassword).toBe('')
    })

    it('does not clear when val is 1', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          proxyUserName: 'user',
          proxyUserPassword: 'pass'
        }
      })
      wrapper.vm.handleAuthenticationMethodChange(1)
      expect(wrapper.vm.formValues.proxyUserName).toBe('user')
      expect(wrapper.vm.formValues.proxyUserPassword).toBe('pass')
    })
  })

  describe('getUserNameRules', () => {
    it('includes required when authenticationTypeId is 1', () => {
      const wrapper = createWrapper()
      wrapper.setData({ authenticationTypeId: 1 })
      const rules = wrapper.vm.getUserNameRules
      expect(rules.length).toBe(2)
    })

    it('excludes required when authenticationTypeId is 0', () => {
      const wrapper = createWrapper()
      wrapper.setData({ authenticationTypeId: 0 })
      const rules = wrapper.vm.getUserNameRules
      expect(rules.length).toBe(1)
    })
  })

  describe('getPasswordRules', () => {
    it('includes required when authenticationTypeId is 1', () => {
      const wrapper = createWrapper()
      wrapper.setData({ authenticationTypeId: 1 })
      const rules = wrapper.vm.getPasswordRules
      expect(rules.length).toBe(2)
    })

    it('excludes required when authenticationTypeId is 0', () => {
      const wrapper = createWrapper()
      wrapper.setData({ authenticationTypeId: 0 })
      const rules = wrapper.vm.getPasswordRules
      expect(rules.length).toBe(1)
    })
  })

  describe('formValues watcher', () => {
    it('emits formValuesChanged when formValues differ from initial', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.setData({
        formValues: {
          ...wrapper.vm.formValues,
          proxyMode: 2
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('formValuesChanged')).toBeTruthy()
    })
  })

  describe('created', () => {
    it('emits getInitialFormValues on mount', () => {
      const wrapper = createWrapper()
      expect(wrapper.emitted('getInitialFormValues')).toBeTruthy()
      expect(wrapper.emitted('getInitialFormValues')[0][0]).toMatchObject({
        proxyMode: 0,
        isEnableAddIn: false
      })
    })

    it('initializes from formData when provided', () => {
      const formData = {
        isEnableAddIn: true,
        proxyMode: 2,
        proxyAddress: 'proxy.com',
        proxyPort: '8080',
        proxyUserName: 'user',
        proxyUserPassword: 'pass'
      }
      const wrapper = createWrapper({ formData })
      expect(wrapper.vm.formValues.isEnableAddIn).toBe(true)
      expect(wrapper.vm.formValues.proxyMode).toBe(2)
      expect(wrapper.vm.formValues.proxyAddress).toBe('proxy.com')
      expect(wrapper.vm.formValues.proxyUserName).toBe('user')
      expect(wrapper.vm.authenticationTypeId).toBe(1)
    })
  })

  describe('callForGenerateDiagnosticTool', () => {
    it('calls generateDiagnosticTool and then download', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.vm.callForGenerateDiagnosticTool()
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))
      expect(generateDiagnosticTool).toHaveBeenCalled()
      expect(downloadDiagnosticTool).toHaveBeenCalledWith('id-1')
    })
  })

  describe('callForDownloadDiagnosticTool', () => {
    it('retries on 404', async () => {
      downloadDiagnosticTool
        .mockRejectedValueOnce({ response: { status: 404 } })
        .mockResolvedValueOnce({ data: new Blob() })
      jest.useFakeTimers()
      const wrapper = createWrapper()
      wrapper.vm.callForDownloadDiagnosticTool('id-1')
      await wrapper.vm.$nextTick()
      jest.advanceTimersByTime(7600)
      expect(downloadDiagnosticTool).toHaveBeenCalledTimes(2)
      jest.useRealTimers()
    })

    it('sets spinnerStatus false on non-404 error', async () => {
      downloadDiagnosticTool.mockRejectedValue({ response: { status: 500 } })
      const wrapper = createWrapper()
      wrapper.setData({ spinnerStatus: true })
      wrapper.vm.callForDownloadDiagnosticTool('id-1')
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))
      expect(wrapper.vm.spinnerStatus).toBe(false)
    })
  })
})
