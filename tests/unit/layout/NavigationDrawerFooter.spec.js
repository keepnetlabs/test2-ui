import NavigationDrawerFooter from '@/layout/NavigationDrawerFooter.vue'

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

  it('handleFeedbackClick dispatches changeFeedbackPopup', () => {
    const dispatch = jest.fn()
    const ctx = { $store: { dispatch } }
    NavigationDrawerFooter.methods.handleFeedbackClick.call(ctx)
    expect(dispatch).toHaveBeenCalledWith('dashboard/changeFeedbackPopup', true)
  })
})
