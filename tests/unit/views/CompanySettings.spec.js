import CompanySettings from '@/views/CompanySettings.vue'

describe('CompanySettings.vue', () => {
  it('has correct component name', () => {
    expect(CompanySettings.name).toBe('CompanySettings')
  })

  it('tab watcher dispatches getAgenticAIEnabled when switching to agentic-ai-settings', () => {
    const dispatch = jest.fn()
    const ctx = {
      tab: 'agentic-ai-settings',
      hasAgenticAILicense: true,
      $store: { dispatch }
    }
    CompanySettings.watch.tab.call(ctx, 'agentic-ai-settings')
    expect(dispatch).toHaveBeenCalledWith('login/getAgenticAIEnabled')
  })

  it('tab watcher does not dispatch outside agentic-ai tab or license', () => {
    const dispatch = jest.fn()
    CompanySettings.watch.tab.call(
      {
        hasAgenticAILicense: true,
        $store: { dispatch }
      },
      'smtp-settings'
    )
    CompanySettings.watch.tab.call(
      {
        hasAgenticAILicense: false,
        $store: { dispatch }
      },
      'agentic-ai-settings'
    )
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('created picks first permitted tab and calls changeTabByRoute', () => {
    const changeTabByRoute = jest.fn()
    const ctx = {
      tab: 'smtp-settings',
      changeTabByRoute,
      getAccountPrivacyPermission: false,
      hasAgenticAILicense: false,
      getAIAllySettingsGetPermissions: false,
      getSMTPSettingsSearchPermissions: true,
      getDirectEmailCreationSearchPermissions: true,
      getNotificationTemplatesSearchPermissions: true,
      getMicrosoftTeamsSettingsGetPermissions: true,
      getGoogleUserProvisionGetPermissions: true,
      getRestApiSearchPermissions: true,
      getWhiteLabelingGetPermissions: true,
      getProxySettingsSearchPermissions: true,
      getSAMLIntegrationSearchPermissions: true,
      getSCIMSettingsSearchPermissions: true,
      getSIEMIntegrationSearchPermissions: true,
      getLDAPDetailPermission: true,
      getAllowListPermissionsSearch: true
    }

    CompanySettings.created.call(ctx)

    expect(ctx.tab).toBe('smtp-settings')
    expect(changeTabByRoute).toHaveBeenCalledTimes(1)
  })

  it('changeTabByRoute handles google and microsoft callback timeout flows', () => {
    jest.useFakeTimers()

    const googleCtx = {
      tab: 'privacy',
      timeoutId: null,
      $route: { query: { tab: 'google-user-provisioning', state: 's', code: 'c' } }
    }
    CompanySettings.methods.changeTabByRoute.call(googleCtx)
    expect(googleCtx.tab).toBe('privacy')
    jest.advanceTimersByTime(800)
    expect(googleCtx.tab).toBe('google-user-provisioning')

    const microsoftCtx = {
      tab: 'privacy',
      timeoutId: null,
      $route: { query: { code: 'x', state: 'y' } }
    }
    CompanySettings.methods.changeTabByRoute.call(microsoftCtx)
    jest.advanceTimersByTime(800)
    expect(microsoftCtx.tab).toBe('microsoft-teams-settings')

    jest.useRealTimers()
  })

  it('changeTabByRoute handles direct-email branch and missing tab query', () => {
    const directEmailCtx = {
      tab: 'privacy',
      $route: { query: { tenant: 'abc' } }
    }
    CompanySettings.methods.changeTabByRoute.call(directEmailCtx)
    expect(directEmailCtx.tab).toBe('direct-email-creation')

    const noTabCtx = {
      tab: 'smtp-settings',
      $route: { query: {} }
    }
    CompanySettings.methods.changeTabByRoute.call(noTabCtx)
    expect(noTabCtx.tab).toBe('smtp-settings')
  })

  it('changeTabByRoute skips agentic-ai tab without license and cleans route otherwise', () => {
    const replace = jest.fn()
    const nextTick = (cb) => cb()

    const noLicenseCtx = {
      tab: 'privacy',
      hasAgenticAILicense: false,
      $route: { query: { tab: 'agentic-ai-settings' } }
    }
    CompanySettings.methods.changeTabByRoute.call(noLicenseCtx)
    expect(noLicenseCtx.tab).toBe('privacy')

    const validCtx = {
      tab: 'privacy',
      hasAgenticAILicense: true,
      $route: {
        query: { tab: 'proxy-settings' },
        fullPath: '/company-settings?tab=proxy-settings&x=1'
      },
      $router: { replace },
      $nextTick: nextTick
    }
    CompanySettings.methods.changeTabByRoute.call(validCtx)
    expect(validCtx.tab).toBe('proxy-settings')
    expect(replace).toHaveBeenCalledWith('/company-settings?&x=1')
  })

  it('beforeRouteLeave covers smtp/scim/allowed-list and allow branches', () => {
    const next = jest.fn()

    const smtpCtx = {
      $refs: {
        refSmtpSettings: { newSmtpModalStatus: true, checkIfCanCloseSmtpModal: jest.fn() }
      }
    }
    CompanySettings.beforeRouteLeave.call(smtpCtx, {}, {}, next)
    expect(smtpCtx.$refs.refSmtpSettings.checkIfCanCloseSmtpModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const scimCtx = {
      $refs: {
        refScimSettings: {
          isShowAddOrEditModal: true,
          checkIfCanCloseScimAddOrEditModal: jest.fn()
        }
      }
    }
    CompanySettings.beforeRouteLeave.call(scimCtx, {}, {}, next)
    expect(scimCtx.$refs.refScimSettings.checkIfCanCloseScimAddOrEditModal).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()

    const allowedListCtx = {
      $refs: {
        refAllowedList: {
          modalStatus: true,
          checkIfCanCLoseNewModal: jest.fn()
        }
      }
    }
    CompanySettings.beforeRouteLeave.call(allowedListCtx, {}, {}, next)
    expect(allowedListCtx.$refs.refAllowedList.checkIfCanCLoseNewModal).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()

    next.mockClear()
    CompanySettings.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeDestroy clears timeout only when timeoutId exists', () => {
    const clearSpy = jest.spyOn(global, 'clearTimeout')
    CompanySettings.beforeDestroy.call({ timeoutId: 123 })
    CompanySettings.beforeDestroy.call({ timeoutId: null })
    expect(clearSpy).toHaveBeenCalledTimes(1)
    clearSpy.mockRestore()
  })
})
