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
  })
})
