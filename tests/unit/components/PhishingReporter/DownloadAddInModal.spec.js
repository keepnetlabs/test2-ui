import { createLocalVue, shallowMount } from '@vue/test-utils'
import DownloadAddInModal from '@/components/PhishingReporter/DownloadAddInModal.vue'
import Vuetify from 'vuetify'

const mockBlobLike = { size: 0, type: '' }
jest.mock('@/api/phishingReporter', () => ({
  connectGraphAccount: jest.fn(() => Promise.resolve({ data: { data: { applicationId: 'app-1', redirectUri: 'http://test.com', appPermissionAuthorizationUrl: 'http://auth.com' } } })),
  deleteGraphAccount: jest.fn(() => Promise.resolve()),
  downloadDiagnosticTool: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  downloadOutlookAddIn: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  downloadSpamReport: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  generateDiagnosticTool: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'res-1' } } })),
  generateGoogleWorkSpaceAddIn: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  generateO365AddIn: jest.fn(() => Promise.resolve({ data: mockBlobLike })),
  generateOutlookAddIn: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'res-1' } } })),
  updateApplicationLevelAccount: jest.fn(() => Promise.resolve())
}))

describe('DownloadAddInModal.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
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
      propsData: {
        status: true,
        ...propsData
      },
      stubs,
      directives,
      ...options
    })

  it('renders and shows content when status is true', async () => {
    const wrapper = mountComponent({ status: true })
    await wrapper.vm.$nextTick()
    jest.advanceTimersByTime(20)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Download Add-in')
    expect(wrapper.text()).toContain('Integration Type')
  })

  it('shows Download Add-in title', async () => {
    const wrapper = mountComponent({ status: true })
    await wrapper.vm.$nextTick()
    jest.advanceTimersByTime(20)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Download Add-in')
  })

  it('has drawerId and isVisible in data', () => {
    const wrapper = mountComponent({ status: false })
    expect(wrapper.vm.drawerId).toBeDefined()
    expect(typeof wrapper.vm.drawerId).toBe('string')
    expect(wrapper.vm.drawerId).toMatch(/^download-add-in-drawer-/)
    expect(wrapper.vm.isVisible).toBe(false)
  })

  it('sets isVisible true when status becomes true', async () => {
    const wrapper = mountComponent({ status: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isVisible).toBe(true)
  })

  it('emits handleClose when handleClose is called', () => {
    const wrapper = mountComponent({ status: true })
    wrapper.vm.handleClose()
    jest.advanceTimersByTime(300)
    expect(wrapper.emitted('handleClose')).toBeTruthy()
  })

  it('does not close drawer when handleDrawerClickOutside is called with snackbar element', () => {
    const wrapper = mountComponent({ status: true })
    const mockEvent = {
      target: {
        closest: jest.fn((sel) => (sel.includes('v-snack') ? {} : null))
      }
    }
    wrapper.vm.handleDrawerClickOutside(mockEvent)
    expect(wrapper.emitted('handleClose')).toBeFalsy()
  })

  it('does not close drawer when handleDrawerClickOutside is called with dialog element', () => {
    const wrapper = mountComponent({ status: true })
    const mockEvent = {
      target: {
        closest: jest.fn((sel) => (sel.includes('v-dialog') ? {} : null))
      }
    }
    wrapper.vm.handleDrawerClickOutside(mockEvent)
    expect(wrapper.emitted('handleClose')).toBeFalsy()
  })

  it('does not close drawer when authorization dialogs are open', () => {
    const wrapper = mountComponent({ status: true })
    wrapper.setData({ showDelegatedLevelAuthorizationDialog: true })
    wrapper.vm.handleDrawerClickOutside({ target: document.createElement('div') })
    expect(wrapper.emitted('handleClose')).toBeFalsy()
  })

  it('closes drawer when handleDrawerClickOutside is called with outside click', () => {
    const wrapper = mountComponent({ status: true })
    const mockEvent = {
      target: {
        closest: jest.fn(() => null)
      }
    }
    wrapper.vm.handleDrawerClickOutside(mockEvent)
    jest.advanceTimersByTime(300)
    expect(wrapper.emitted('handleClose')).toBeTruthy()
  })

  it('currentContentComponent returns Microsoft365Content by default', () => {
    const wrapper = mountComponent({ status: false })
    expect(wrapper.vm.currentContentComponent).toBe('Microsoft365Content')
  })

  it('currentContentComponent returns correct component for each integration type', () => {
    const wrapper = mountComponent({ status: false })
    const types = ['microsoft365', 'googleWorkspace', 'outlook', 'diagnosticTool']
    const expected = ['Microsoft365Content', 'GoogleWorkspaceContent', 'OutlookContent', 'DiagnosticToolContent']
    types.forEach((type, i) => {
      wrapper.setData({ selectedIntegrationType: type })
      expect(wrapper.vm.currentContentComponent).toBe(expected[i])
    })
  })

  it('opens delegated level dialog when handleDelegatedGraphAPIAccess is called', () => {
    const wrapper = mountComponent({ status: false })
    wrapper.vm.handleDelegatedGraphAPIAccess()
    expect(wrapper.vm.showDelegatedLevelAuthorizationDialog).toBe(true)
  })

  it('opens application level dialog when handleApplicationLevelGraphAPIAccess is called', () => {
    const wrapper = mountComponent({ status: false })
    wrapper.vm.handleApplicationLevelGraphAPIAccess()
    expect(wrapper.vm.showApplicationLevelDialog).toBe(true)
  })

  it('has 4 integration types', () => {
    const wrapper = mountComponent({ status: false })
    expect(wrapper.vm.integrationTypes).toHaveLength(4)
    expect(wrapper.vm.integrationTypes.map((t) => t.id)).toEqual([
      'microsoft365',
      'googleWorkspace',
      'outlook',
      'diagnosticTool'
    ])
  })

  it('sets body overflow hidden when opening', async () => {
    const wrapper = mountComponent({ status: true })
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body overflow on beforeDestroy', () => {
    const wrapper = mountComponent({ status: true })
    document.body.style.overflow = 'hidden'
    wrapper.destroy()
    expect(document.body.style.overflow).toBe('')
  })
})
