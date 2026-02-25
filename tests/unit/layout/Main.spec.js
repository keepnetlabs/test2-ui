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
})
