import NavigationDrawerFooter from '@/layout/NavigationDrawerFooter.vue'
import { shallowMount } from '@vue/test-utils'

describe('NavigationDrawerFooter.vue', () => {
  it('isRelaseInformation returns true when release notes or version shown', () => {
    expect(
      NavigationDrawerFooter.computed.isRelaseInformation.call({
        navigatorMenuProps: { isShowReleaseNotes: true }
      })
    ).toBe(true)
    expect(
      NavigationDrawerFooter.computed.isRelaseInformation.call({
        navigatorMenuProps: { isShowReleaseVersionNumber: true }
      })
    ).toBe(true)
    expect(
      NavigationDrawerFooter.computed.isRelaseInformation.call({
        navigatorMenuProps: {}
      })
    ).toBe(false)
  })

  it('getReleaseVersion returns systemVersion or 0', () => {
    expect(
      NavigationDrawerFooter.computed.getReleaseVersion.call({
        navigatorMenuProps: { systemVersion: '1.2.3' }
      })
    ).toBe('1.2.3')
    expect(
      NavigationDrawerFooter.computed.getReleaseVersion.call({
        navigatorMenuProps: {}
      })
    ).toBe('0')
  })

  it('isDocumentationLinkEnabled defaults to true', () => {
    expect(
      NavigationDrawerFooter.computed.isDocumentationLinkEnabled.call({
        navigatorMenuProps: {}
      })
    ).toBe(true)
  })

  it('isDocumentationLinkEnabled follows explicit false config', () => {
    expect(
      NavigationDrawerFooter.computed.isDocumentationLinkEnabled.call({
        navigatorMenuProps: { isDocumentationLinkEnabled: false }
      })
    ).toBe(false)
  })

  it('release flags depend on mini mode and props', () => {
    expect(
      NavigationDrawerFooter.computed.isReleaseNotes.call({
        isMini: false,
        navigatorMenuProps: { isShowReleaseNotes: true }
      })
    ).toBe(true)
    expect(
      NavigationDrawerFooter.computed.isReleaseNotes.call({
        isMini: true,
        navigatorMenuProps: { isShowReleaseNotes: true }
      })
    ).toBe(false)

    expect(
      NavigationDrawerFooter.computed.isReleaseVersion.call({
        isMini: false,
        navigatorMenuProps: { isShowReleaseVersionNumber: true }
      })
    ).toBe(true)
    expect(
      NavigationDrawerFooter.computed.isMiniReleaseVersion.call({
        isMini: true,
        navigatorMenuProps: { isShowReleaseVersionNumber: true }
      })
    ).toBe(true)

    expect(
      NavigationDrawerFooter.computed.isReleaseVersion.call({
        isMini: true,
        navigatorMenuProps: { isShowReleaseVersionNumber: true }
      })
    ).toBe(false)
    expect(
      NavigationDrawerFooter.computed.isMiniReleaseVersion.call({
        isMini: false,
        navigatorMenuProps: { isShowReleaseVersionNumber: true }
      })
    ).toBe(false)
  })

  it('getReleaseNotesUrl returns configured URL or empty string', () => {
    expect(
      NavigationDrawerFooter.computed.getReleaseNotesUrl.call({
        navigatorMenuProps: { releaseNotesUrl: 'https://example.com/notes' }
      })
    ).toBe('https://example.com/notes')
    expect(
      NavigationDrawerFooter.computed.getReleaseNotesUrl.call({
        navigatorMenuProps: {}
      })
    ).toBe('')
  })

  it('handleDocumentationClick creates and clicks anchor', () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const anchor = { click, href: '', target: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return anchor
      }
      return originalCreateElement(tag)
    })

    NavigationDrawerFooter.methods.handleDocumentationClick.call({})
    expect(click).toHaveBeenCalledTimes(1)
    expect(anchor.href).toBe('https://doc.keepnetlabs.com')
    expect(anchor.target).toBe('_blank')
    createElementSpy.mockRestore()
  })

  it('data() exposes mdi icons', () => {
    const data = NavigationDrawerFooter.data.call({})
    expect(data.mdiHelpCircleOutline).toBeDefined()
    expect(data.mdiMessageAlertOutline).toBeDefined()
  })

  it('handleFeedbackClick dispatches changeFeedbackPopup', () => {
    const dispatch = jest.fn()
    const ctx = { $store: { dispatch } }
    NavigationDrawerFooter.methods.handleFeedbackClick.call(ctx)
    expect(dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', true)
  })

  it('renders full release version and release notes when mini mode is off', () => {
    const wrapper = shallowMount(NavigationDrawerFooter, {
      propsData: {
        isMini: false,
        navigatorMenuProps: {
          isShowReleaseVersionNumber: true,
          isShowReleaseNotes: true,
          systemVersion: '12.34.56',
          releaseNotesUrl: 'https://example.com/release'
        }
      },
      stubs: {
        VList: true,
        VListItem: true,
        VListItemIcon: true,
        VListItemTitle: true,
        VIcon: true
      }
    })

    expect(wrapper.text()).toContain('Version 12.34.56 -')
    const releaseLink = wrapper.find('#btn--navigation-drawer-release-notes')
    expect(releaseLink.exists()).toBe(true)
    expect(releaseLink.attributes('href')).toBe('https://example.com/release')
  })

  it('renders mini release version prefix and hides release notes in mini mode', () => {
    const wrapper = shallowMount(NavigationDrawerFooter, {
      propsData: {
        isMini: true,
        navigatorMenuProps: {
          isShowReleaseVersionNumber: true,
          isShowReleaseNotes: true,
          systemVersion: '12.34.56',
          releaseNotesUrl: 'https://example.com/release'
        }
      },
      stubs: {
        VList: true,
        VListItem: true,
        VListItemIcon: true,
        VListItemTitle: true,
        VIcon: true
      }
    })

    expect(wrapper.text()).toContain('12.')
    expect(wrapper.text()).not.toContain('Version 12.34.56')
    expect(wrapper.find('#btn--navigation-drawer-release-notes').exists()).toBe(false)
  })
})
