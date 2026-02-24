import { shallowMount } from '@vue/test-utils'
import CampaignReportUsers from '@/components/SmishingReport/Users/CampaignReportUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  searchTrainingReportUsers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ resourceId: 'u1', firstName: 'John', status: 'Clicked' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('CampaignReportUsers.vue', () => {
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

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('callForData fetches users and updates table', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    expect(AwarenessEducatorService.searchTrainingReportUsers).toHaveBeenCalledWith(
      expect.any(Object),
      't1'
    )
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0].resourceId).toBe('u1')
  })

  it('handleInteractions sets selectedRow and opens modal', () => {
    const wrapper = mountComponent()
    const row = { resourceId: 'r1', firstName: 'John' }
    wrapper.vm.handleInteractions(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })

  it('handleResend sets selectedRow and opens resend dialog', () => {
    const wrapper = mountComponent()
    const row = { resourceId: 'r1' }
    wrapper.vm.handleResend(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('toggleIsShowInteractionsModal toggles and clears selectedRow when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'r1' }
    wrapper.vm.isShowInteractionsModal = true
    wrapper.vm.toggleIsShowInteractionsModal()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowInteractionsModal).toBe(false)
  })

  it('toggleIsShowResendDialog toggles and clears selectedRow when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'r1' }
    wrapper.vm.isShowResendDialog = true
    wrapper.vm.toggleIsShowResendDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowResendDialog).toBe(false)
  })
})
