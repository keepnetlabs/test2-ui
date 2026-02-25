const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CallbackSettings from '@/components/CallbackSettings/Settings.vue'

jest.mock('@/api/callback', () => ({
  getUsedCallbackNumbers: jest.fn().mockResolvedValue({
    data: { data: { companyCount: 10, usedCount: 0 } }
  }),
  searchCallbackSettings: jest.fn().mockResolvedValue({
    data: { data: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1, results: [] } }
  }),
  mapCallbackNumbers: jest.fn().mockResolvedValue({}),
  deselectPhoneNumber: jest.fn().mockResolvedValue({}),
  exchangeCallbackNumbers: jest.fn().mockResolvedValue({}),
  exportCallbackSettings: jest.fn().mockResolvedValue({ data: mockBlob })
}))

describe('CallbackSettings.vue', () => {
  let store

  const createWrapper = (getters = {}) => {
    store = new Vuex.Store({
      modules: {
        permissions: {
          namespaced: true,
          getters: {
            getCallbackSettingsSearchPermissions: () =>
              getters.getCallbackSettingsSearchPermissions ?? true,
            getCallbackSettingsExchangePermissions: () =>
              getters.getCallbackSettingsExchangePermissions ?? true,
            getCallbackSettingsMapNumbersPermissions: () =>
              getters.getCallbackSettingsMapNumbersPermissions ?? true,
            getCallbackSettingsExportPermissions: () =>
              getters.getCallbackSettingsExportPermissions ?? true
          }
        }
      }
    })
    return shallowMount(CallbackSettings, { store })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has name CallbackSettings', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('CallbackSettings')
  })

  describe('getStatusBadgeProps', () => {
    it('returns Not In Use props when status is Not In Use', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getStatusBadgeProps('Not In Use')).toEqual({
        color: '#757575',
        text: 'Not In Use'
      })
    })

    it('returns In Use props when status is In Use', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getStatusBadgeProps('In Use')).toEqual({
        color: '#1173C1',
        text: 'In Use'
      })
    })

    it('returns undefined for other status values', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getStatusBadgeProps('Unknown')).toBeUndefined()
    })
  })

  describe('getAlertBoxText computed', () => {
    it('uses plural when licenseNumberLimit > 1', () => {
      const wrapper = createWrapper()
      wrapper.vm.licenseNumberLimit = 5
      expect(wrapper.vm.getAlertBoxText).toContain('numbers')
    })

    it('uses singular when licenseNumberLimit is 1', () => {
      const wrapper = createWrapper()
      wrapper.vm.licenseNumberLimit = 1
      expect(wrapper.vm.getAlertBoxText).toContain('number')
      expect(wrapper.vm.getAlertBoxText).not.toContain('numbers')
    })
  })

  describe('handleExchange', () => {
    it('sets selectedRow and showExchangePhoneNumberModal', () => {
      const wrapper = createWrapper()
      const row = { providerNumberId: '1' }
      wrapper.vm.handleExchange(row)
      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowExchangePhoneNumberModal).toBe(true)
    })
  })

  describe('handleDeselectNumber', () => {
    it('sets selectedRow and showDeselectNumberModal', () => {
      const wrapper = createWrapper()
      const row = { providerNumberId: '1' }
      wrapper.vm.handleDeselectNumber(row)
      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDeselectNumberModal).toBe(true)
    })
  })

  describe('handleSelectPhoneNumbers', () => {
    it('sets isShowSelectPhoneNumbersModal to true', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleSelectPhoneNumbers()
      expect(wrapper.vm.isShowSelectPhoneNumbersModal).toBe(true)
    })
  })
})

