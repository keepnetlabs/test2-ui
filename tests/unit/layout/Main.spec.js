jest.mock('@/services/authentication', () => ({
  isAuthenticated: jest.fn(() => false)
}))

import Main from '@/layout/Main.vue'

describe('Main.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setDropdownVisibility returns isShowSwitchCompany for switchCompany', () => {
    const ctx = { isShowSwitchCompany: true }
    expect(
      Main.methods.setDropdownVisibility.call(ctx, { value: 'switchCompany' })
    ).toBe(true)
    expect(
      Main.methods.setDropdownVisibility.call(
        { isShowSwitchCompany: false },
        { value: 'switchCompany' }
      )
    ).toBe(false)
  })

  it('setDropdownVisibility returns true for other items', () => {
    const ctx = {}
    expect(
      Main.methods.setDropdownVisibility.call(ctx, { value: 'changeSettings' })
    ).toBe(true)
    expect(
      Main.methods.setDropdownVisibility.call(ctx, { value: 'logout' })
    ).toBe(true)
  })

  it('setDropdownDivider returns correct for switchCompany', () => {
    expect(
      Main.methods.setDropdownDivider.call(
        { isShowSwitchCompany: true, isReturnMainAccountVisible: false },
        { value: 'switchCompany' }
      )
    ).toBe(true)
    expect(
      Main.methods.setDropdownDivider.call(
        { isShowSwitchCompany: false },
        { value: 'switchCompany' }
      )
    ).toBe(false)
  })

  it('onNavigationClick sets drawer and toggles mini', () => {
    const ctx = { drawer: true, mini: false }
    Object.defineProperty(ctx, 'getDrawer', {
      get() {
        return this.drawer
      },
      set(v) {
        this.drawer = v
      }
    })
    Object.defineProperty(ctx, 'getMini', {
      get() {
        return this.mini
      },
      set(v) {
        this.mini = v
      }
    })
    Main.methods.onNavigationClick.call(ctx)
    expect(ctx.drawer).toBe(true)
    expect(ctx.mini).toBe(true)
  })

  it('changeDropdownItem opens password change for changePassword', () => {
    const ctx = { openPasswordChange: false, changeSettings: jest.fn() }
    Main.methods.changeDropdownItem.call(ctx, 'changePassword')
    expect(ctx.openPasswordChange).toBe(true)
  })

  it('changeDropdownItem calls setSwitchDialog for switchCompany', () => {
    const setSwitchDialog = jest.fn()
    const ctx = { $store: { dispatch: jest.fn() }, setSwitchDialog }
    Main.methods.changeDropdownItem.call(ctx, 'switchCompany')
    expect(setSwitchDialog).toHaveBeenCalledWith(true)
  })

  it('setDropdownDivider handles returnToMainAccount and default branch', () => {
    expect(
      Main.methods.setDropdownDivider.call(
        { isReturnMainAccountVisible: true },
        { value: 'returnToMainAccount' }
      )
    ).toBe(true)
    expect(
      Main.methods.setDropdownDivider.call(
        { isReturnMainAccountVisible: false },
        { value: 'returnToMainAccount' }
      )
    ).toBe(false)
    expect(Main.methods.setDropdownDivider.call({}, { value: 'logout' })).toBe(false)
  })

  it('setDropdownVisibility handles returnToMainAccount branch', () => {
    expect(
      Main.methods.setDropdownVisibility.call(
        { isReturnMainAccountVisible: true },
        { value: 'returnToMainAccount' }
      )
    ).toBe(true)
    expect(
      Main.methods.setDropdownVisibility.call(
        { isReturnMainAccountVisible: false },
        { value: 'returnToMainAccount' }
      )
    ).toBe(false)
  })

  it('changeDropdownItem handles logout and changeSettings', () => {
    const logoutUser = jest.fn()
    const changeSettings = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      logoutUser,
      changeSettings,
      $store: { dispatch }
    }

    Main.methods.changeDropdownItem.call(ctx, 'logout')
    expect(logoutUser).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith('login/getWhiteLabelByUrl')

    Main.methods.changeDropdownItem.call(ctx, 'changeSettings')
    expect(changeSettings).toHaveBeenCalledTimes(1)
  })

  it('changeDropdownItem handles returnToMainAccount and refreshes router', () => {
    const go = jest.fn()
    localStorage.setItem('companyResourceId', 'main-id')
    localStorage.setItem('companyName', 'Main Co')

    const ctx = {
      $router: { go }
    }
    Main.methods.changeDropdownItem.call(ctx, 'returnToMainAccount')

    expect(localStorage.getItem('isSelectCompany')).toBe('false')
    expect(localStorage.getItem('companyId')).toBe('main-id')
    expect(localStorage.getItem('selectedCompanyName')).toBe('Main Co')
    expect(go).toHaveBeenCalledWith(0)
  })

  it('callForSystemSummary sets payload based on route', () => {
    const dispatch = jest.fn()
    const normalCtx = {
      $route: { name: 'Dashboard' },
      $store: { dispatch }
    }
    Main.methods.callForSystemSummary.call(normalCtx)
    expect(dispatch).toHaveBeenCalledWith('whitelabel/callForSystemInfoSummary', {
      checkExceedDialog: true
    })

    dispatch.mockClear()
    const targetUsersCtx = {
      $route: { name: 'Target Users' },
      $store: { dispatch }
    }
    Main.methods.callForSystemSummary.call(targetUsersCtx)
    expect(dispatch).toHaveBeenCalledWith('whitelabel/callForSystemInfoSummary', {})
  })

  it('toggle/change helpers mutate dialog flags', () => {
    const initializeCtx = { isShowInitializeCompanyModal: false }
    Main.methods.toggleShowInitializeCompanyModal.call(initializeCtx)
    expect(initializeCtx.isShowInitializeCompanyModal).toBe(true)

    const settingsCtx = { showSettingsModalStatus: false }
    Main.methods.changeSettings.call(settingsCtx)
    expect(settingsCtx.showSettingsModalStatus).toBe(true)

    const passwordCtx = { openPasswordChange: false }
    Main.methods.changePasswordChange.call(passwordCtx)
    expect(passwordCtx.openPasswordChange).toBe(true)
  })

  it('connection handlers update disconnect state', () => {
    const ctx = { isDisconnected: false }
    Main.methods.onIUnderstandClick.call(ctx, true)
    expect(ctx.isDisconnected).toBe(true)

    expect(Main.methods.handleConnectivityChange.call(ctx, 0)).toBe(false)
    expect(ctx.isDisconnected).toBe(false)
    expect(Main.methods.handleConnectivityChange.call(ctx, 1)).toBe(true)
    expect(ctx.isDisconnected).toBe(true)
  })

  it('removeTooltip deactivates account tooltip', () => {
    const ctx = { $refs: { accountTooltip: { isActive: true } } }
    Main.methods.removeTooltip.call(ctx)
    expect(ctx.$refs.accountTooltip.isActive).toBe(false)
  })

  it('campaign manager shortcut methods route to parent status pages', () => {
    const push = jest.fn()
    const ctx = { $router: { push } }

    Main.methods.handlePhishingCampaignManagerClick.call(ctx)
    Main.methods.handleCallbackCampaignManagerClick.call(ctx)
    Main.methods.handleSmishingCampaignManagerClick.call(ctx)
    Main.methods.handleQuishingCampaignManagerClick.call(ctx)

    expect(push).toHaveBeenNthCalledWith(1, '/phishing-simulator/campaign-manager?status=parent')
    expect(push).toHaveBeenNthCalledWith(2, '/callback-simulator/campaign-manager?status=parent')
    expect(push).toHaveBeenNthCalledWith(3, '/smishing-simulator/campaign-manager?status=parent')
    expect(push).toHaveBeenNthCalledWith(4, '/quishing-simulator/campaign-manager?status=parent')
  })

  it('deleteTSVuexData clears both communities and incidents state', () => {
    const dispatch = jest.fn()
    const ctx = { $store: { dispatch } }

    Main.methods.deleteTSVuexData.call(ctx)

    expect(dispatch).toHaveBeenCalledWith('communities/setCommunities', {
      key: 'communities',
      communitiesData: null
    })
    expect(dispatch).toHaveBeenCalledWith('incidents/setIncidents', {
      key: 'incidents',
      incidentsData: null
    })
  })

  it('report name computed properties include active page names and fallback labels', () => {
    const ctx = { $store: { state: { common: { activePageRouterName: 'Campaign A' } } } }
    expect(Main.computed.getCampaignReportName.call(ctx)).toBe('Campaign Report - Campaign A')
    expect(Main.computed.getScormProxyReportName.call(ctx)).toBe('Scorm Proxy Report - Campaign A')
    expect(Main.computed.getVishingReportName.call(ctx)).toBe('Vishing Report - Campaign A')
    expect(Main.computed.getSmishingReportName.call(ctx)).toBe('Smishing Report - Campaign A')
    expect(Main.computed.getQuishingReportName.call(ctx)).toBe('Quishing Report - Campaign A')
    expect(Main.computed.getCallbackReportName.call(ctx)).toBe('Callback Report - Campaign A')

    const emptyCtx = { $store: { state: { common: {} } } }
    expect(Main.computed.getCampaignReportName.call(emptyCtx)).toBe('Campaign Report')
    expect(Main.computed.getScormProxyReportName.call(emptyCtx)).toBe('Scorm Proxy Report')
  })

  it('getTrainingReportName handles type branches and fallback', () => {
    const nonScormCtx = {
      $store: { state: { common: { activePageRouterName: 'T1', activeTrainingType: 'Poster' } } }
    }
    expect(Main.computed.getTrainingReportName.call(nonScormCtx)).toBe('Poster Report - T1')

    const scormCtx = {
      $store: { state: { common: { activePageRouterName: 'T2', activeTrainingType: 'SCORM 1.2' } } }
    }
    expect(Main.computed.getTrainingReportName.call(scormCtx)).toBe('Training Report - T2')

    const invalidTypeCtx = {
      $store: { state: { common: { activePageRouterName: 'T3', activeTrainingType: 5 } } }
    }
    expect(Main.computed.getTrainingReportName.call(invalidTypeCtx)).toBe('Training Report - T3')
  })

  it('computed router-based helpers return expected values', () => {
    const quishingSelected = { routerName: 'Quishing Settings' }
    const quishingDefault = { routerName: 'Dashboard' }
    expect(Main.computed.getQuishingPrependIcon.call(quishingSelected)).toBe('$qr-code-selected')
    expect(Main.computed.getQuishingPrependIcon.call(quishingDefault)).toBe('$qr-code')

    const routerKeyCtx = { $route: { name: 'Community', fullPath: '/threat-sharing?id=1' } }
    expect(Main.computed.getRouterKey.call(routerKeyCtx)).toBe('/threat-sharing?id=1')
    expect(Main.computed.getRouterKey.call({ $route: { name: 'Dashboard', fullPath: '/d' } })).toBe('')
  })

  it('drawer and mini computed getters/setters work with localStorage defaults', () => {
    const originalOuterWidth = window.outerWidth
    Object.defineProperty(window, 'outerWidth', { value: 900, configurable: true })
    const drawerCtx = { drawer: null }
    expect(Main.computed.getDrawer.get.call(drawerCtx)).toBe(true)
    Main.computed.getDrawer.set.call(drawerCtx, false)
    expect(drawerCtx.drawer).toBe(false)

    localStorage.setItem('navigationMiniState', 'true')
    const miniCtx = { mini: null }
    expect(Main.computed.getMini.get.call(miniCtx)).toBe(true)
    Main.computed.getMini.set.call(miniCtx, false)
    expect(miniCtx.mini).toBe(false)
    expect(localStorage.getItem('navigationMiniState')).toBe('false')

    localStorage.removeItem('navigationMiniState')
    expect(Main.computed.getMini.get.call({ mini: null })).toBe(false)
    Object.defineProperty(window, 'outerWidth', { value: originalOuterWidth, configurable: true })
  })

  it('company/account computed helpers evaluate visibility and labels', () => {
    const rootCtx = { $store: { state: { auth: { userRoleName: 'Root' } } } }
    expect(Main.computed.isShowSwitchCompany.call(rootCtx)).toBe(true)
    const otherCtx = { $store: { state: { auth: { userRoleName: 'User' } } } }
    expect(Main.computed.isShowSwitchCompany.call(otherCtx)).toBe(false)

    localStorage.setItem('companyResourceId', 'a')
    localStorage.setItem('selectedCompanyRequestId', 'b')
    expect(
      Main.computed.isReturnMainAccountVisible.call({
        isShowSwitchCompany: true
      })
    ).toBe(true)
    expect(
      Main.computed.isReturnMainAccountVisible.call({
        isShowSwitchCompany: false
      })
    ).toBe(false)

    expect(Main.computed.companyName.call({ brandName: 'Brand X' })).toBe('Brand X')
  })

  it('drawer/style/license/path computed helpers handle branches', () => {
    expect(Main.computed.getDrawerStyle.call({ mini: true })).toBe('left: 5px !important;')
    expect(Main.computed.getDrawerStyle.call({ mini: false })).toBe('left : 244px !important;')

    expect(
      Main.computed.isSelectedCompanyNameDisabled.call({ getSelectedCompanyName: 'Short Name' })
    ).toBe(true)
    expect(
      Main.computed.isSelectedCompanyNameDisabled.call({
        getSelectedCompanyName: 'Very very long company name'
      })
    ).toBe(false)

    expect(Main.computed.isAwarenessEducator.call({ $route: { path: '/awareness-educator/x' } })).toBe(
      true
    )
    expect(Main.computed.isAwarenessEducator.call({ $route: { path: '/dashboard' } })).toBe(false)

    expect(
      Main.computed.getLicenseDialogBody.call({
        companyLicense: { licenseLimit: 10, activeUserCount: 8, totalUserCount: 9 }
      })
    ).toContain('10 target users')
    expect(
      Main.computed.getLicenseDialogBody.call({
        companyLicense: { licenseLimit: 10, totalUserCount: 9 }
      })
    ).toContain('Current target user count is 9')
    expect(Main.computed.getLicenseDialogBody.call({ companyLicense: null })).toBe('')
  })

  it('isTestEnvironment detects localhost and test-ui hosts', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'localhost' },
      configurable: true
    })
    expect(Main.computed.isTestEnvironment.call({})).toBe(true)

    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'test-ui.devkeepnet.com' },
      configurable: true
    })
    expect(Main.computed.isTestEnvironment.call({})).toBe(true)

    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'app.keepnetlabs.com' },
      configurable: true
    })
    expect(Main.computed.isTestEnvironment.call({})).toBe(false)

    Object.defineProperty(globalThis, 'location', { value: originalLocation, configurable: true })
  })

  it('company/menu class computed properties toggle selected vs unselected states', () => {
    expect(
      Main.computed.getCompanyClasses.call({
        routerName: 'Audit'
      })
    ).toEqual({
      'primary--text active-menu-parent': true,
      'un-selected-list-item': false
    })
    expect(
      Main.computed.getCompanyClasses.call({
        routerName: 'Dashboard'
      })
    ).toEqual({
      'primary--text active-menu-parent': false,
      'un-selected-list-item': true
    })

    expect(
      Main.computed.getVishingClasses.call({
        routerName: 'Vishing Report'
      })
    ).toEqual({
      'primary--text active-menu-parent': true,
      'un-selected-list-item': false
    })
    expect(
      Main.computed.getIncidentResponderClasses.call({
        routerName: 'Dashboard'
      })
    ).toEqual({
      'primary--text active-menu-parent': false,
      'un-selected-list-item': true
    })
  })

  it('simulator class computed properties cover both selected and unselected branches', () => {
    expect(
      Main.computed.getCallbackSimulatorClasses.call({
        routerName: 'Callback Report'
      })
    ).toEqual({
      'primary--text active-menu-parent': true,
      'un-selected-list-item': true
    })
    expect(
      Main.computed.getPhishingSimulatorClasses.call({
        routerName: 'Settings'
      })
    ).toEqual({
      'primary--text active-menu-parent': true,
      'un-selected-list-item': true
    })
    expect(
      Main.computed.getSmishingSimulatorClasses.call({
        routerName: 'Smishing Simulator'
      })
    ).toEqual({
      'primary--text active-menu-parent': true,
      'un-selected-list-item': false
    })
    expect(
      Main.computed.getQuishingSimulatorClasses.call({
        routerName: 'Dashboard'
      })
    ).toEqual({
      'primary--text active-menu-parent': false,
      'un-selected-list-item': true
    })
    expect(
      Main.computed.getAwarenessEducatorClasses.call({
        routerName: 'Training Report'
      })
    ).toEqual({
      'primary--text active-menu-parent': true,
      'un-selected-list-item': true
    })
  })

  it('company group/breadcrumb/routerName helpers return expected values', () => {
    localStorage.setItem('companyGroupName', 'Group A')
    expect(
      Main.computed.getCompanyGroupName.call({
        routerName: 'Company Group Details'
      })
    ).toBe('Group A')
    expect(
      Main.computed.getCompanyGroupName.call({
        routerName: 'Dashboard'
      })
    ).toBe('')

    expect(
      Main.computed.getBreadCrumbBaseName.call({
        brandName: 'Brand Name',
        $store: { state: { auth: { selectedCompanyName: 'Company X' } } }
      })
    ).toBe('Brand Name')
    expect(
      Main.computed.getBreadCrumbBaseName.call({
        brandName: '',
        $store: { state: { auth: { selectedCompanyName: 'Company X' } } }
      })
    ).toBe('Company X')

    expect(
      Main.computed.routerName.call({
        $route: { name: 'Some Route' }
      })
    ).toBe('Some Route')
    expect(
      Main.computed.routerName.call({
        $route: {}
      })
    ).toBe('')
  })

  it('logo and user-related computed helpers handle empty user and fallback image branches', () => {
    const noUserCtx = {
      getUser: null
    }
    expect(Main.computed.getLogoImage.call(noUserCtx)).toBe('')
    expect(Main.computed.getMainLogo.call(noUserCtx)).toBe('')
    expect(Main.computed.getMiniLogo.call(noUserCtx)).toBe('')

    const baseCtx = {
      getUser: { id: 'u1' },
      navigatorMenuProps: { mainLogoUrl: '', minimizedMenuLogoUrl: '' },
      $store: {
        state: {
          auth: {
            logoUrl: '',
            user: { firstName: 'John' },
            selectedCompanyName: 'Acme',
            userRoleName: 'Admin'
          },
          dashboard: {
            selectedCompanyObject: { logoUrl: 'https://cdn/logo-selected.png' }
          }
        }
      }
    }

    localStorage.setItem('isSelectCompany', 'true')
    expect(Main.computed.getLogoImage.call(baseCtx)).toBe('https://cdn/logo-selected.png')

    localStorage.setItem('isSelectCompany', 'false')
    expect(Main.computed.getLogoImage.call(baseCtx)).toBeDefined()
    expect(Main.computed.getMainLogo.call(baseCtx)).toBeDefined()
    expect(Main.computed.getMiniLogo.call(baseCtx)).toBeDefined()
    expect(Main.computed.getFirstName.call(baseCtx)).toBe('John')
    expect(Main.computed.getSelectedCompanyName.call(baseCtx)).toBe('Acme')
    expect(Main.computed.getRolename.call(baseCtx)).toBe('Admin')
  })
})
