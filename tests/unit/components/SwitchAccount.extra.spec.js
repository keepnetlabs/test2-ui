import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import SwitchAccount from '@/components/SwitchAccount.vue'

jest.mock('@/api/company', () => ({
  getMyCompanies: jest.fn().mockResolvedValue({ data: { data: [] } })
}))
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuetify)

describe('SwitchAccount.vue (extra branch coverage)', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        auth: {
          user: { firstName: 'John' },
          companyName: 'Acme',
          userRoleName: 'Admin',
          selectedCompanyName: 'Acme',
          logoUrl: null
        },
        dashboard: {
          selectedCompany: {},
          selectedCompanyObject: { logoUrl: null }
        }
      }
    })
  })

  const createWrapper = () =>
    shallowMount(SwitchAccount, {
      localVue,
      vuetify: new Vuetify(),
      store,
      stubs: {
        SwitchAccountTreeView: true,
        AlertBox: true,
        VSwitch: true,
        VTextField: true
      }
    })

  describe('computed getters', () => {
    it('getLogoImage returns no-logo when no logoUrl', () => {
      localStorage.setItem('isSelectCompany', 'false')
      const wrapper = createWrapper()
      expect(wrapper.vm.getLogoImage).toBeDefined()
      expect(typeof wrapper.vm.getLogoImage).toBe('string')
    })
    it('getLogoImage returns dashboard logo when isSelectCompany true', () => {
      localStorage.setItem('isSelectCompany', 'true')
      store.state.dashboard.selectedCompanyObject = { logoUrl: 'https://logo.png' }
      const wrapper = createWrapper()
      expect(wrapper.vm.getLogoImage).toBe('https://logo.png')
    })
    it('getConfirmButtonStyle returns opacity when no selectedAccount', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedAccount: '' })
      const style = wrapper.vm.getConfirmButtonStyle
      expect(style.opacity).toBe('0.5')
    })
    it('isRenderPrivacyCard returns false when no selectedAccount', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedAccount: null })
      expect(wrapper.vm.isRenderPrivacyCard).toBe(false)
    })
    it('isRenderLicenseExpiredCard returns true when selected account has expired license', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ selectedAccount: { licenceExpired: true } })
      expect(wrapper.vm.isRenderLicenseExpiredCard).toBe(true)
    })
    it('getSelectedCompanyName returns empty string when companyName is missing', () => {
      store.state.auth.companyName = ''
      const wrapper = createWrapper()
      expect(wrapper.vm.getSelectedCompanyName).toBe('')
    })
    it('getFirstName returns empty string when user is missing', () => {
      store.state.auth.user = null
      const wrapper = createWrapper()
      expect(wrapper.vm.getFirstName).toBe('')
    })
    it('getRoleName returns empty string when role is missing', () => {
      store.state.auth.userRoleName = ''
      const wrapper = createWrapper()
      expect(wrapper.vm.getRoleName).toBe('')
    })
    it('getConfirmButtonStyle returns empty object when selected account is allowed', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        selectedAccount: { privacyDurationId: 1, licenceExpired: false }
      })
      expect(wrapper.vm.getConfirmButtonStyle).toEqual({})
    })
  })

  describe('sort method', () => {
    it('filters items when value provided', () => {
      const wrapper = createWrapper()
      const items = [{ name: 'Acme' }, { name: 'Beta' }, { name: 'Acme Corp' }]
      const result = wrapper.vm.sort(items, 'acme')
      expect(result).toHaveLength(2)
    })
    it('returns all items when value empty', () => {
      const wrapper = createWrapper()
      const items = [{ name: 'A' }, { name: 'B' }]
      const result = wrapper.vm.sort(items, '')
      expect(result).toEqual(items)
    })
  })

  describe('onClickSelectedAccount', () => {
    it('does nothing when id or label missing', () => {
      const wrapper = createWrapper()
      const setDialogBar = jest.fn()
      wrapper.vm.setDialogBar = setDialogBar
      wrapper.vm.onClickSelectedAccount({ id: undefined, label: 'x' })
      expect(setDialogBar).not.toHaveBeenCalled()
    })
  })

  describe('handleSearchInputFocus', () => {
    it('returns early when no selectedAccount', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedAccount: '' })
      expect(() => wrapper.vm.handleSearchInputFocus()).not.toThrow()
    })
    it('opens menu when selectedAccount exists', async () => {
      const wrapper = createWrapper()
      const changeMenuStatus = jest.fn()
      wrapper.vm.changeMenuStatus = changeMenuStatus
      await wrapper.setData({ selectedAccount: { id: '1' } })
      wrapper.vm.handleSearchInputFocus()
      expect(changeMenuStatus).toHaveBeenCalledWith('visible')
    })
  })

  describe('watchers and menu methods', () => {
    it('watch isShowAllCompany=true calls handleSearchCompanyFocus', () => {
      const wrapper = createWrapper()
      const focusSpy = jest.fn()
      wrapper.vm.handleSearchCompanyFocus = focusSpy
      wrapper.vm.$options.watch.isShowAllCompany.call(wrapper.vm, true)
      expect(focusSpy).toHaveBeenCalled()
    })

    it('watch isShowAllCompany=false and short search calls handleSearchCompanyFocusOut', async () => {
      const wrapper = createWrapper()
      const focusOutSpy = jest.fn()
      wrapper.vm.handleSearchCompanyFocusOut = focusOutSpy
      await wrapper.setData({ searchedCompanyText: 'ab' })
      wrapper.vm.$options.watch.isShowAllCompany.call(wrapper.vm, false)
      expect(focusOutSpy).toHaveBeenCalled()
    })

    it('watch isShowAllCompany=false and long search does not call focusOut', async () => {
      const wrapper = createWrapper()
      const focusOutSpy = jest.fn()
      wrapper.vm.handleSearchCompanyFocusOut = focusOutSpy
      await wrapper.setData({ searchedCompanyText: 'abcd' })
      wrapper.vm.$options.watch.isShowAllCompany.call(wrapper.vm, false)
      expect(focusOutSpy).not.toHaveBeenCalled()
    })

    it('handleSearchCompanyFocus updates icon and menu state', () => {
      const wrapper = createWrapper()
      const changeMenuStatus = jest.fn()
      wrapper.vm.changeMenuStatus = changeMenuStatus
      wrapper.vm.handleSearchCompanyFocus()
      expect(wrapper.vm.searchCompanyIcon).toBe('mdi-menu-up')
      expect(wrapper.vm.isMenuOpen).toBe(true)
      expect(changeMenuStatus).toHaveBeenCalledWith('visible')
    })

    it('handleSearchCompanyFocusOut blurs input when ref exists', () => {
      const wrapper = createWrapper()
      const blur = jest.fn()
      const querySelector = jest.fn(() => ({ blur }))
      wrapper.vm.$refs = {
        refSearchTextField: { $el: { querySelector } }
      }
      wrapper.vm.handleSearchCompanyFocusOut()
      expect(wrapper.vm.searchCompanyIcon).toBe('mdi-menu-down')
      expect(wrapper.vm.isMenuOpen).toBe(false)
      expect(wrapper.vm.isOpenAllMenuItems).toBe(false)
      expect(blur).toHaveBeenCalled()
    })

    it('changeMenuStatus updates menu visibility when menu exists', () => {
      const wrapper = createWrapper()
      const menu = { style: { visibility: 'hidden' } }
      const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(menu)
      wrapper.vm.changeMenuStatus('visible')
      expect(menu.style.visibility).toBe('visible')
      querySpy.mockRestore()
    })
  })

  describe('selection and search branches', () => {
    it('handleOnSelectedAccount disables switch when privacy denied and not expired', () => {
      const wrapper = createWrapper()
      wrapper.vm.searchItems = jest.fn()
      wrapper.vm.changeMenuStatus = jest.fn()
      const { PRIVACY_DURATIONS } = require('@/components/Company Settings/AccountPrivacy/utils')
      const denyAccount = {
        label: 'Denied Co',
        privacyDurationId: PRIVACY_DURATIONS.DENY,
        licenceExpired: false
      }
      wrapper.vm.handleOnSelectedAccount(denyAccount)
      expect(wrapper.vm.isSwitchAccountDisabled).toBe(true)
      expect(wrapper.vm.searchCompanyIcon).toBe('mdi-menu-down')
    })

    it('handleOnSelectedAccount keeps switch enabled when privacy denied but license expired', () => {
      const wrapper = createWrapper()
      wrapper.vm.searchItems = jest.fn()
      wrapper.vm.changeMenuStatus = jest.fn()
      const expiredAccount = {
        label: 'Expired Co',
        privacyDurationId: 100,
        licenceExpired: true
      }
      wrapper.vm.handleOnSelectedAccount(expiredAccount)
      expect(wrapper.vm.isSwitchAccountDisabled).toBe(false)
    })

    it('handleSearchText hides menu when text length <3 and showAll=false', async () => {
      const wrapper = createWrapper()
      const changeMenuStatus = jest.fn()
      wrapper.vm.changeMenuStatus = changeMenuStatus
      wrapper.vm.searchItems = jest.fn()
      await wrapper.setData({ searchedCompanyText: 'ab', isShowAllCompany: false })
      wrapper.vm.handleSearchText()
      expect(changeMenuStatus).toHaveBeenCalled()
      expect(wrapper.vm.searchItems).toHaveBeenCalledWith(true)
    })

    it('searchItems shows menu when changeMenuStatus=true and search length >=3', async () => {
      const wrapper = createWrapper()
      wrapper.vm.debounce = (fn) => fn()
      const changeMenuStatus = jest.fn()
      wrapper.vm.changeMenuStatus = changeMenuStatus
      await wrapper.setData({
        searchedCompanyText: 'comp',
        defaultOrderedItems: [{ resourceId: '1', name: 'Company', children: [] }]
      })
      wrapper.vm.searchItems(true)
      expect(changeMenuStatus).toHaveBeenCalledWith('visible')
      expect(wrapper.vm.isOpenAllMenuItems).toBe(true)
    })
  })
})
