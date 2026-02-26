const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CallbackSettings from '@/components/CallbackSettings/Settings.vue'
import CallbackService from '@/api/callback'

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

  describe('data and mutation flows', () => {
    it('callForNumberUsage handles null counts and disables add when no selectable numbers', async () => {
      CallbackService.getUsedCallbackNumbers.mockResolvedValueOnce({
        data: { data: { companyCount: null, usedCount: null } }
      })
      const ctx = {
        isLoading: false,
        selectablePhoneNumberCount: 0,
        licenseNumberLimit: 0,
        tableOptions: { addButton: {}, iEmpty: {} },
        callForData: jest.fn()
      }

      CallbackSettings.methods.callForNumberUsage.call(ctx)
      await Promise.resolve()
      await Promise.resolve()

      expect(ctx.licenseNumberLimit).toBe(0)
      expect(ctx.selectablePhoneNumberCount).toBe(0)
      expect(ctx.tableOptions.addButton.disabled).toBe(true)
      expect(ctx.tableOptions.iEmpty.disabled).toBe(true)
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('callForNumberUsage catch branch disables add and empty buttons', async () => {
      CallbackService.getUsedCallbackNumbers.mockRejectedValueOnce(new Error('fail'))
      const ctx = {
        isLoading: false,
        tableOptions: { addButton: {}, iEmpty: {} },
        callForData: jest.fn()
      }

      CallbackSettings.methods.callForNumberUsage.call(ctx)
      await Promise.resolve()
      await Promise.resolve()

      expect(ctx.tableOptions.addButton.disabled).toBe(true)
      expect(ctx.tableOptions.iEmpty.disabled).toBe(true)
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('callForData maps booleans to In Use/Not In Use labels', async () => {
      CallbackService.searchCallbackSettings.mockResolvedValueOnce({
        data: {
          data: {
            totalNumberOfRecords: 2,
            totalNumberOfPages: 1,
            pageNumber: 1,
            results: [{ isUsing: true }, { isUsing: false }]
          }
        }
      })
      const ctx = {
        isLoading: false,
        axiosPayload: {},
        serverSideProps: {},
        tableData: []
      }
      CallbackSettings.methods.callForData.call(ctx)
      await Promise.resolve()
      await Promise.resolve()

      expect(ctx.tableData).toEqual([{ isUsing: 'In Use' }, { isUsing: 'Not In Use' }])
    })

    it('callForData catch sets empty table data', async () => {
      CallbackService.searchCallbackSettings.mockRejectedValueOnce(new Error('fail'))
      const ctx = {
        isLoading: false,
        axiosPayload: {},
        serverSideProps: {},
        tableData: [{ id: 'old' }]
      }
      CallbackSettings.methods.callForData.call(ctx)
      await Promise.resolve()
      await Promise.resolve()

      expect(ctx.tableData).toEqual([])
    })

    it('confirm handlers call API, close modal and reset mutating state', async () => {
      const wrapper = createWrapper()
      wrapper.vm.callForData = jest.fn()

      wrapper.vm.selectedRow = { providerNumberId: 'p1' }
      wrapper.vm.isShowDeselectNumberModal = true
      wrapper.vm.handleConfirmDeselectPhoneNumber()
      await Promise.resolve()
      await Promise.resolve()
      expect(CallbackService.deselectPhoneNumber).toHaveBeenCalledWith('p1')
      expect(wrapper.vm.isShowDeselectNumberModal).toBe(false)
      expect(wrapper.vm.selectedRow).toBeNull()
      expect(wrapper.vm.isMutating).toBe(false)

      wrapper.vm.selectedRow = { providerNumberId: 'p2' }
      wrapper.vm.isShowExchangePhoneNumberModal = true
      wrapper.vm.handleConfirmExchangePhoneNumber('new-1')
      await Promise.resolve()
      await Promise.resolve()
      expect(CallbackService.exchangeCallbackNumbers).toHaveBeenCalledWith('p2', 'new-1')
      expect(wrapper.vm.isShowExchangePhoneNumberModal).toBe(false)
      expect(wrapper.vm.selectedRow).toBeNull()
      expect(wrapper.vm.isMutating).toBe(false)

      wrapper.vm.isShowSelectPhoneNumbersModal = true
      wrapper.vm.handleConfirmSelectPhoneNumbers(['n1'])
      await Promise.resolve()
      await Promise.resolve()
      expect(CallbackService.mapCallbackNumbers).toHaveBeenCalledWith(['n1'])
      expect(wrapper.vm.isShowSelectPhoneNumbersModal).toBe(false)
      expect(wrapper.vm.isMutating).toBe(false)
    })
  })
})

