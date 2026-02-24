import { shallowMount } from '@vue/test-utils'
import VishingReportUsers from '@/components/VishingReport/VishingReportUsers.vue'

jest.mock('@/api/vishing', () => ({
  getVishingReportUsers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ firstName: 'User', status: 'Answered' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportVishingUsers: jest.fn(() => Promise.resolve({ data: {} }))
}))

import * as vishingApi from '@/api/vishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

if (!globalThis.URL) globalThis.URL = {}
if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock')

describe('VishingReportUsers.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportUsers, {
      propsData: { id: 'v1', ...propsData },
      stubs: {
        DataTable: true,
        CampaignManagerReportHeader: true,
        Badge: true,
        VishingReportUserInteractionsModal: true,
        DefaultButtonRowAction: true,
        VTooltip: true,
        VBtn: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingReportUsers')
  })

  it('handleInteractions sets selectedRow and opens modal', () => {
    const wrapper = mountComponent()
    const row = { id: 1, firstName: 'Test' }
    wrapper.vm.handleInteractions(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })

  it('toggleIsShowInteractionsModal clears selectedRow when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 1 }
    wrapper.vm.isShowInteractionsModal = true
    wrapper.vm.toggleIsShowInteractionsModal()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowInteractionsModal).toBe(false)
  })

  it('toggleIsShowInteractionsModal does not clear when opening', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 1 }
    wrapper.vm.isShowInteractionsModal = false
    wrapper.vm.toggleIsShowInteractionsModal()
    expect(wrapper.vm.selectedRow).toEqual({ id: 1 })
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })

  it('getErrorMessage returns errorMessage for CallingError status', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getErrorMessage({ status: 'CallingError', errorMessage: 'Failed' })).toBe(
      'Failed'
    )
  })

  it('getErrorMessage returns empty for other statuses', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getErrorMessage({ status: 'Answered' })).toBe('')
  })

  it('callForData fetches users on mount', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    expect(vishingApi.getVishingReportUsers).toHaveBeenCalledWith(
      expect.any(Object),
      'v1'
    )
  })
})
