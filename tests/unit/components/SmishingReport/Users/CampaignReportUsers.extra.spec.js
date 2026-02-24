import { shallowMount } from '@vue/test-utils'
import CampaignReportUsers from '@/components/SmishingReport/Users/CampaignReportUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  searchTrainingReportUsers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('CampaignReportUsers.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignReportUsers, {
      propsData: { id: 't1', formDetails: {}, ...propsData },
      stubs: {
        CampaignReportUserInteractionsModal: true,
        CampaignManagerReportHeader: true,
        CampaignReportExcludedUsers: true,
        DataTable: true,
        DefaultButtonRowAction: true,
        Badge: true,
        ElTabs: true,
        ElTabPane: true
      },
      mocks: { $store: { getters: {} } }
    })

  it('handleOnResend sets resendPayload and opens dialog', async () => {
    const wrapper = mountComponent()
    const items = [{ resourceId: 'r1' }]
    wrapper.vm.handleOnResend(items, [], false)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.resendPayload).toBeDefined()
    expect(wrapper.vm.resendPayload.items).toEqual(['r1'])
    expect(wrapper.vm.resendPayload.Types).toEqual([0])
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleOnResend with array of items maps resourceIds', async () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnResend([{ resourceId: 'r1' }, { resourceId: 'r2' }], [], false)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.resendPayload.items).toEqual(['r1', 'r2'])
  })

  it('handleOnResend with single item object', async () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnResend({ resourceId: 'r1' }, ['ex1'], true)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.resendPayload.items).toEqual(['r1'])
    expect(wrapper.vm.resendPayload.excludedItems).toEqual(['ex1'])
    expect(wrapper.vm.resendPayload.selectAll).toBe(true)
  })

  it('toggleIsShowResendDialog clears selectedRow when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'r1' }
    wrapper.vm.isShowResendDialog = true
    wrapper.vm.toggleIsShowResendDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
  })
})
