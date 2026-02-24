import { shallowMount } from '@vue/test-utils'
import ChatPanel from '@/components/layout/ChatPanel.vue'

jest.mock('@/api/auth', () => ({
  getAgentLoginUrl: jest.fn(() => Promise.resolve({ data: { data: { url: 'https://chat.example.com' } } }))
}))

describe('ChatPanel.vue', () => {
  const createWrapper = (storeGetters = {}) =>
    shallowMount(ChatPanel, {
      mocks: {
        $store: {
          getters: {
            'login/getAgenticAIEnabled': true,
            ...storeGetters
          },
          state: {
            auth: {
              user: { id: 'u1', firstName: 'Test' },
              selectedCompanyName: 'Demo'
            }
          }
        }
      }
    })

  beforeEach(() => {
    localStorage.setItem('hostId', 'host1')
    localStorage.setItem('userData', JSON.stringify({ email: 'test@example.com', id: 'u1' }))
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('toggleChat toggles isExpanded', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isExpanded).toBe(false)
    wrapper.vm.toggleChat()
    expect(wrapper.vm.isExpanded).toBe(true)
    wrapper.vm.toggleChat()
    expect(wrapper.vm.isExpanded).toBe(false)
  })

  it('toggleFullWidth toggles isFullWidth', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isFullWidth).toBe(false)
    wrapper.vm.toggleFullWidth()
    expect(wrapper.vm.isFullWidth).toBe(true)
  })

  it('getAbsoluteUrl returns URL for valid input', () => {
    const wrapper = createWrapper()
    const url = wrapper.vm.getAbsoluteUrl('/path')
    expect(url).toBeInstanceOf(URL)
    expect(url.pathname).toContain('path')
  })

  it('onIframeLoad sets iframeLoaded true', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.iframeLoaded).toBe(false)
    wrapper.vm.onIframeLoad()
    expect(wrapper.vm.iframeLoaded).toBe(true)
  })
})
