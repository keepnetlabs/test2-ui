import { shallowMount, createLocalVue } from '@vue/test-utils'

// ninja-keys (a Lit web component, untransformed ESM) is stubbed globally via
// jest.config.js moduleNameMapper, so importing CommandPalette is safe here.
import CommandPalette from '@/components/CommandPalette.vue'

const localVue = createLocalVue()
localVue.config.ignoredElements = ['ninja-keys']

const makeRoutes = () => [
  {
    path: '/',
    children: [
      { path: '/', name: 'Dashboard', meta: { isAuthenticated: true } },
      {
        path: '/phishing-simulator',
        name: 'Phishing Simulator',
        meta: { isAuthenticated: true, parentName: 'Dashboard' }
      }
    ]
  }
]

const mountPalette = (route = { path: '/' }, propsData = {}) => {
  const push = jest.fn(() => Promise.resolve())
  const wrapper = shallowMount(CommandPalette, {
    localVue,
    propsData,
    mocks: {
      $router: { options: { routes: makeRoutes() }, push },
      $store: { getters: {} },
      $route: route
    }
  })
  return { wrapper, push }
}

describe('CommandPalette.vue', () => {
  beforeEach(() => localStorage.clear())

  it('feeds router-derived actions into the ninja-keys element', () => {
    const { wrapper } = mountPalette()
    const el = wrapper.vm.$refs.ninja
    expect(Array.isArray(el.data)).toBe(true)
    expect(el.data.map(a => a.title)).toEqual(
      expect.arrayContaining(['Dashboard', 'Phishing Simulator'])
    )
    // Custom-icon mode: never auto-load the Material Icons web font.
    expect(el.noAutoLoadMdIcons).toBe(true)
  })

  it('open() delegates to the ninja-keys element', () => {
    const { wrapper } = mountPalette()
    const el = wrapper.vm.$refs.ninja
    el.open = jest.fn()
    wrapper.vm.open()
    expect(el.open).toHaveBeenCalled()
  })

  it('navigate() pushes to a different route', () => {
    const { wrapper, push } = mountPalette({ path: '/' })
    wrapper.vm.navigate('/phishing-simulator')
    expect(push).toHaveBeenCalledWith('/phishing-simulator')
  })

  it('navigate() skips pushing to the current route', () => {
    const { wrapper, push } = mountPalette({ path: '/phishing-simulator' })
    wrapper.vm.navigate('/phishing-simulator')
    expect(push).not.toHaveBeenCalled()
  })

  it('detaches the selected listener on destroy', () => {
    const { wrapper } = mountPalette()
    const el = wrapper.vm.$refs.ninja
    const spy = jest.spyOn(el, 'removeEventListener')
    wrapper.destroy()
    expect(spy).toHaveBeenCalledWith('selected', expect.any(Function))
  })

  it('prepends a "Recent" section from stored recent pages', () => {
    localStorage.setItem(
      'commandPalette.recentPages',
      JSON.stringify(['Phishing Simulator'])
    )
    const { wrapper } = mountPalette({ path: '/', name: 'Dashboard' })
    const el = wrapper.vm.$refs.ninja
    expect(el.data[0]).toMatchObject({
      id: 'recent:Phishing Simulator',
      section: 'Recent'
    })
  })

  it('records the current authenticated page on mount', () => {
    mountPalette({
      path: '/phishing-simulator',
      name: 'Phishing Simulator',
      meta: { isAuthenticated: true },
      params: {}
    })
    expect(
      JSON.parse(localStorage.getItem('commandPalette.recentPages'))
    ).toContain('Phishing Simulator')
  })

  it('does not record an unauthenticated or unnamed route', () => {
    mountPalette({ path: '/', meta: { isAuthenticated: false }, params: {} })
    expect(localStorage.getItem('commandPalette.recentPages')).toBeNull()
  })

  it('omits the "Account" section when no accountAction is provided', () => {
    const { wrapper } = mountPalette()
    const el = wrapper.vm.$refs.ninja
    expect(el.data.some(a => a.section === 'Account')).toBe(false)
  })

  it('wires account commands to the host dispatcher when provided', () => {
    const accountAction = jest.fn()
    const { wrapper } = mountPalette(
      { path: '/' },
      { accountAction, canSwitchCompany: true, canReturnToMainAccount: false }
    )
    const el = wrapper.vm.$refs.ninja
    const account = el.data.filter(a => a.section === 'Account')
    const titles = account.map(a => a.title)
    expect(titles).toEqual(
      expect.arrayContaining(['Open settings', 'Log out', 'Switch company'])
    )
    // Conditional command gated off stays hidden.
    expect(titles).not.toContain('Return to main account')
    account.find(a => a.title === 'Log out').handler()
    expect(accountAction).toHaveBeenCalledWith('logout')
  })

  it('omits documentation when the whitelabel gate is off', () => {
    const { wrapper } = mountPalette(
      { path: '/' },
      { helpDocumentationEnabled: false }
    )
    const el = wrapper.vm.$refs.ninja
    expect(el.data.some(a => a.id === 'help-documentation')).toBe(false)
  })

  it('builds Help entries and opens external targets via a transient anchor', () => {
    const { wrapper } = mountPalette(
      { path: '/' },
      { supportEmail: 'help@acme.test' }
    )
    const el = wrapper.vm.$refs.ninja
    const help = el.data.filter(a => a.section === 'Help').map(a => a.title)
    expect(help).toEqual(
      expect.arrayContaining(['Open documentation', 'Contact support'])
    )

    const anchor = { href: '', target: '', rel: '', click: jest.fn() }
    const createSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(anchor)
    wrapper.vm.openExternalUrl('https://doc.keepnetlabs.com')
    expect(anchor.href).toBe('https://doc.keepnetlabs.com')
    expect(anchor.target).toBe('_blank')
    expect(anchor.rel).toBe('noopener noreferrer')
    expect(anchor.click).toHaveBeenCalled()

    // mailto must NOT open a new tab (the OS mail client takes over).
    anchor.target = ''
    wrapper.vm.openExternalUrl('mailto:help@acme.test')
    expect(anchor.href).toBe('mailto:help@acme.test')
    expect(anchor.target).toBe('')
    createSpy.mockRestore()
  })
})
