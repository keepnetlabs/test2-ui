import { createLocalVue, shallowMount } from '@vue/test-utils'
import DownloadAddInModal from '@/components/PhishingReporter/DownloadAddInModal.vue'
import Vuetify from 'vuetify'
import {
  connectGraphAccount,
  deleteGraphAccount,
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  downloadSpamReport,
  generateDiagnosticTool,
  generateGoogleWorkSpaceAddIn,
  generateO365AddIn,
  generateOutlookAddIn,
  updateApplicationLevelAccount
} from '@/api/phishingReporter'

const mockBlobLike = { size: 0, type: '' }
const mockCreateObjectURL = jest.fn(() => 'blob:mock')
const mockRevokeObjectURL = jest.fn()

jest.mock('@/api/phishingReporter', () => ({
  connectGraphAccount: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          applicationId: 'app-1',
          redirectUri: 'http://test.com',
          appPermissionAuthorizationUrl: 'http://auth.com'
        }
      }
    })
  ),
  deleteGraphAccount: jest.fn(() => Promise.resolve()),
  downloadDiagnosticTool: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  downloadOutlookAddIn: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  downloadSpamReport: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  generateDiagnosticTool: jest.fn(() =>
    Promise.resolve({ data: { data: { resourceId: 'res-1' } } })
  ),
  generateGoogleWorkSpaceAddIn: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  generateO365AddIn: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  generateOutlookAddIn: jest.fn(() =>
    Promise.resolve({ data: { data: { resourceId: 'res-1' } } })
  ),
  updateApplicationLevelAccount: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  copyToClipboard: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DownloadAddInModal.vue (extra coverage)', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.useRealTimers()
    jest.clearAllMocks()
    globalThis.URL.createObjectURL = mockCreateObjectURL
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL
    delete globalThis.location
    globalThis.location = { href: '' }
  })

  afterEach(() => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  })

  const stubs = {
    'v-navigation-drawer': {
      template: '<div class="download-add-in-drawer-stub"><slot/></div>',
      props: ['value', 'width', 'height']
    },
    'v-list-item': '<div><slot/></div>',
    'v-list-item-content': '<div><slot/></div>',
    'v-list-item-title': '<div><slot/></div>',
    'v-list-item-subtitle': '<div><slot/></div>',
    'v-icon': '<span @click="$listeners.click"><slot/></span>',
    DelegatedLevelAuthorizationDialog: true,
    ApplicationLevelAuthorizationDialog: true,
    Microsoft365Content: true,
    GoogleWorkspaceContent: true,
    OutlookContent: true,
    DiagnosticToolContent: true
  }

  const directives = {
    'click-outside': {
      bind(el, binding) {
        el._clickOutside = (e) => binding.value(e)
        document.addEventListener('click', el._clickOutside)
      },
      unbind(el) {
        document.removeEventListener('click', el._clickOutside)
      }
    }
  }

  const mountComponent = (propsData = {}, options = {}) =>
    shallowMount(DownloadAddInModal, {
      localVue,
      vuetify,
      propsData: { status: true, ...propsData },
      stubs,
      directives,
      ...options
    })

  describe('currentContentProps', () => {
    it('returns Microsoft365 props when selectedIntegrationType is microsoft365', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({
        selectedIntegrationType: 'microsoft365',
        isAccountConnected: true,
        isApplicationLevelAuthorized: true,
        o365SpinnerStatus: true,
        gmailSpinnerStatus: false
      })
      const props = wrapper.vm.currentContentProps
      expect(props).toEqual({
        isAccountConnected: true,
        isApplicationLevelAuthorized: true,
        o365SpinnerStatus: true,
        pageViewSpinnerStatus: false
      })
    })

    it('returns GoogleWorkspace props when selectedIntegrationType is googleWorkspace', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({
        selectedIntegrationType: 'googleWorkspace',
        googleWorkSpaceSpinnerStatus: true
      })
      expect(wrapper.vm.currentContentProps).toEqual({ isLoading: true })
    })

    it('returns Outlook props when selectedIntegrationType is outlook', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({
        selectedIntegrationType: 'outlook',
        outlookSpinnerStatus: true
      })
      expect(wrapper.vm.currentContentProps).toEqual({ isLoading: true })
    })

    it('returns DiagnosticTool props when selectedIntegrationType is diagnosticTool', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({
        selectedIntegrationType: 'diagnosticTool',
        diagnosticToolSpinnerStatus: true
      })
      expect(wrapper.vm.currentContentProps).toEqual({ isLoading: true })
    })

    it('returns base object for unknown integration type', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({ selectedIntegrationType: 'unknown' })
      expect(wrapper.vm.currentContentProps).toEqual({})
    })
  })

  describe('currentContentListeners', () => {
    it('returns Microsoft365 listeners for microsoft365', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({ selectedIntegrationType: 'microsoft365' })
      const listeners = wrapper.vm.currentContentListeners
      expect(listeners['delegated-graph-access']).toBeDefined()
      expect(listeners['application-level-graph-access']).toBeDefined()
      expect(listeners['download-ribbon-view']).toBeDefined()
      expect(listeners['download-page-view']).toBeDefined()
    })

    it('returns download listener for googleWorkspace', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({ selectedIntegrationType: 'googleWorkspace' })
      expect(wrapper.vm.currentContentListeners.download).toBeDefined()
    })

    it('returns empty object for unknown integration type', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({ selectedIntegrationType: 'unknown' })
      expect(wrapper.vm.currentContentListeners).toEqual({})
    })
  })

  describe('currentContentComponent', () => {
    it('returns Microsoft365Content for unknown selectedIntegrationType', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({ selectedIntegrationType: 'invalid' })
      expect(wrapper.vm.currentContentComponent).toBe('Microsoft365Content')
    })
  })

  describe('formData watcher', () => {
    it('updates isAccountConnected and isApplicationLevelAuthorized when formData changes', async () => {
      const wrapper = mountComponent({
        status: false,
        formData: { isGraphAccountConnected: false, isAppPermissionAccessGranted: false }
      })
      expect(wrapper.vm.isAccountConnected).toBe(false)
      expect(wrapper.vm.isApplicationLevelAuthorized).toBe(false)

      wrapper.setProps({
        formData: { isGraphAccountConnected: true, isAppPermissionAccessGranted: true }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isAccountConnected).toBe(true)
      expect(wrapper.vm.isApplicationLevelAuthorized).toBe(true)
    })
  })

  describe('handleDrawerInput', () => {
    it('closes drawer when val is false', async () => {
      jest.useFakeTimers()
      const wrapper = mountComponent({ status: true })
      wrapper.vm.handleDrawerInput(false)
      jest.advanceTimersByTime(300)
      await Promise.resolve()
      expect(wrapper.emitted('handleClose')).toBeTruthy()
      jest.useRealTimers()
    })
  })

  describe('closeDelegatedLevelAuthorizationDialog', () => {
    it('hides delegated level dialog', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({ showDelegatedLevelAuthorizationDialog: true })
      wrapper.vm.closeDelegatedLevelAuthorizationDialog()
      expect(wrapper.vm.showDelegatedLevelAuthorizationDialog).toBe(false)
    })
  })

  describe('closeApplicationLevelDialog', () => {
    it('hides application level dialog and resets authorizing', () => {
      const wrapper = mountComponent({ status: false })
      wrapper.setData({
        showApplicationLevelDialog: true,
        isApplicationLevelAuthorizing: true
      })
      wrapper.vm.closeApplicationLevelDialog()
      expect(wrapper.vm.showApplicationLevelDialog).toBe(false)
      expect(wrapper.vm.isApplicationLevelAuthorizing).toBe(false)
    })
  })

  describe('handleCopyDelegatedLevelAuthorizationLink', () => {
    it('copies link and closes dialog', async () => {
      const { copyToClipboard } = require('@/utils/functions')
      const wrapper = mountComponent({ status: false })
      wrapper.vm.handleCopyDelegatedLevelAuthorizationLink()
      await flushPromises()
      expect(connectGraphAccount).toHaveBeenCalled()
      expect(copyToClipboard).toHaveBeenCalled()
      expect(wrapper.vm.showDelegatedLevelAuthorizationDialog).toBe(false)
    })
  })

  describe('handleAuthorizeDelegatedLevelNow', () => {
    it('redirects to link and closes dialog', async () => {
      const wrapper = mountComponent({ status: false })
      wrapper.vm.handleAuthorizeDelegatedLevelNow()
      await flushPromises()
      expect(connectGraphAccount).toHaveBeenCalled()
      expect(globalThis.location.href).toContain('login.microsoftonline.com')
      expect(wrapper.vm.showDelegatedLevelAuthorizationDialog).toBe(false)
    })
  })

  describe('handleCopyApplicationLevelLink', () => {
    it('copies app permission link and closes dialog', async () => {
      const { copyToClipboard } = require('@/utils/functions')
      const wrapper = mountComponent({ status: false })
      wrapper.vm.handleCopyApplicationLevelLink()
      await flushPromises()
      expect(connectGraphAccount).toHaveBeenCalled()
      expect(copyToClipboard).toHaveBeenCalledWith('http://auth.com')
      expect(wrapper.vm.showApplicationLevelDialog).toBe(false)
    })
  })

  describe('handleAuthorizeApplicationLevel', () => {
    it('redirects to app permission url and closes dialog', async () => {
      const wrapper = mountComponent({ status: false })
      wrapper.vm.handleAuthorizeApplicationLevel()
      await flushPromises()
      expect(globalThis.location.href).toBe('http://auth.com')
      expect(wrapper.vm.showApplicationLevelDialog).toBe(false)
    })
  })

  describe('handleRevokeDelegatedLevelAuthorization', () => {
    it('deletes graph account and updates state', async () => {
      const wrapper = mountComponent({
        status: false,
        formData: { isGraphAccountConnected: true }
      })
      wrapper.vm.handleRevokeDelegatedLevelAuthorization()
      await flushPromises()
      expect(deleteGraphAccount).toHaveBeenCalled()
      expect(wrapper.vm.isAccountConnected).toBe(false)
      expect(wrapper.vm.formData.isGraphAccountConnected).toBe(false)
      expect(wrapper.vm.showDelegatedLevelAuthorizationDialog).toBe(false)
    })
  })

  describe('handleRevokeApplicationLevelAuthorization', () => {
    it('updates application level account and state', async () => {
      const wrapper = mountComponent({
        status: false,
        formData: { isAppPermissionAccessGranted: true }
      })
      wrapper.vm.handleRevokeApplicationLevelAuthorization()
      await flushPromises()
      expect(updateApplicationLevelAccount).toHaveBeenCalledWith(false)
      expect(wrapper.vm.isApplicationLevelAuthorized).toBe(false)
      expect(wrapper.vm.formData.isAppPermissionAccessGranted).toBe(false)
    })
  })

  describe('callForGenerateGoogleWorkSpaceAddIn', () => {
    it('downloads Google Workspace add-in', async () => {
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateGoogleWorkSpaceAddIn()
      expect(wrapper.vm.googleWorkSpaceSpinnerStatus).toBe(true)
      await flushPromises()
      expect(generateGoogleWorkSpaceAddIn).toHaveBeenCalled()
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(wrapper.vm.googleWorkSpaceSpinnerStatus).toBe(false)
    })
  })

  describe('callForGenerateOutlookAddIn', () => {
    it('calls download when resourceId exists', async () => {
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateOutlookAddIn()
      await flushPromises()
      expect(generateOutlookAddIn).toHaveBeenCalled()
      expect(downloadOutlookAddIn).toHaveBeenCalledWith('res-1')
    })

    it('stops spinner when resourceId is missing', async () => {
      generateOutlookAddIn.mockResolvedValueOnce({ data: { data: {} } })
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateOutlookAddIn()
      await flushPromises()
      expect(wrapper.vm.outlookSpinnerStatus).toBe(false)
    })

    it('stops spinner on catch', async () => {
      generateOutlookAddIn.mockRejectedValueOnce(new Error('fail'))
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateOutlookAddIn()
      await flushPromises()
      expect(wrapper.vm.outlookSpinnerStatus).toBe(false)
    })
  })

  describe('callForGenerateO365AddIn', () => {
    it('downloads O365 add-in', async () => {
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateO365AddIn()
      await flushPromises()
      expect(generateO365AddIn).toHaveBeenCalled()
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(wrapper.vm.gmailSpinnerStatus).toBe(false)
    })
  })

  describe('callForGenerateO365SpamAddIn', () => {
    it('downloads spam report add-in', async () => {
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateO365SpamAddIn()
      await flushPromises()
      expect(downloadSpamReport).toHaveBeenCalled()
      expect(wrapper.vm.o365SpinnerStatus).toBe(false)
    })
  })

  describe('callForDownloadOutlookAddIn', () => {
    it('retries on 404', async () => {
      jest.useFakeTimers()
      downloadOutlookAddIn
        .mockRejectedValueOnce({ response: { status: 404 } })
        .mockResolvedValueOnce({ data: mockBlobLike })
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForDownloadOutlookAddIn('res-1')
      jest.advanceTimersByTime(1)
      await Promise.resolve()
      expect(wrapper.vm.outlookSpinnerStatus).toBe(true)
      jest.advanceTimersByTime(7600)
      await Promise.resolve()
      expect(downloadOutlookAddIn).toHaveBeenCalledTimes(2)
      jest.useRealTimers()
    })

    it('stops spinner on non-404 error', async () => {
      downloadOutlookAddIn.mockRejectedValueOnce({ response: { status: 500 } })
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForDownloadOutlookAddIn('res-1')
      await flushPromises()
      expect(wrapper.vm.outlookSpinnerStatus).toBe(false)
    })
  })

  describe('callForGenerateDiagnosticTool', () => {
    it('calls download when resourceId exists', async () => {
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateDiagnosticTool()
      await flushPromises()
      expect(generateDiagnosticTool).toHaveBeenCalled()
      expect(downloadDiagnosticTool).toHaveBeenCalledWith('res-1')
    })

    it('stops spinner when resourceId is missing', async () => {
      generateDiagnosticTool.mockResolvedValueOnce({ data: { data: {} } })
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateDiagnosticTool()
      await flushPromises()
      expect(wrapper.vm.diagnosticToolSpinnerStatus).toBe(false)
    })

    it('stops spinner on catch', async () => {
      generateDiagnosticTool.mockRejectedValueOnce(new Error('fail'))
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForGenerateDiagnosticTool()
      await flushPromises()
      expect(wrapper.vm.diagnosticToolSpinnerStatus).toBe(false)
    })
  })

  describe('callForDownloadDiagnosticTool', () => {
    it('retries on 404', async () => {
      jest.useFakeTimers()
      downloadDiagnosticTool
        .mockRejectedValueOnce({ response: { status: 404 } })
        .mockResolvedValueOnce({ data: mockBlobLike })
      const wrapper = mountComponent({ status: false })
      wrapper.vm.callForDownloadDiagnosticTool('res-1')
      jest.advanceTimersByTime(1)
      await Promise.resolve()
      expect(wrapper.vm.diagnosticToolSpinnerStatus).toBe(true)
      jest.advanceTimersByTime(7600)
      await Promise.resolve()
      expect(downloadDiagnosticTool).toHaveBeenCalledTimes(2)
      jest.useRealTimers()
    })
  })

  describe('handleConnectAccount', () => {
    it('returns admin consent URL with redirectUri when present', async () => {
      connectGraphAccount.mockResolvedValueOnce({
        data: {
          data: {
            applicationId: 'app-1',
            redirectUri: 'https://custom.com/callback'
          }
        }
      })
      const wrapper = mountComponent({ status: false })
      const url = await wrapper.vm.handleConnectAccount()
      expect(url).toContain('login.microsoftonline.com')
      expect(url).toContain('app-1')
      expect(url).toContain('https://custom.com/callback')
    })

    it('uses location.href when redirectUri is missing', async () => {
      connectGraphAccount.mockResolvedValueOnce({
        data: {
          data: {
            applicationId: 'app-1',
            redirectUri: null
          }
        }
      })
      globalThis.location.href = 'https://current.com'
      const wrapper = mountComponent({ status: false })
      const url = await wrapper.vm.handleConnectAccount()
      expect(url).toContain('https://current.com')
    })
  })

  describe('handleConnectApplicationLevelAccount', () => {
    it('returns appPermissionAuthorizationUrl', async () => {
      const wrapper = mountComponent({ status: false })
      const url = await wrapper.vm.handleConnectApplicationLevelAccount()
      expect(url).toBe('http://auth.com')
    })
  })
})
