import { shallowMount } from '@vue/test-utils'
import CampaignReportUserInteractionsModal from '@/components/SmishingReport/Users/CampaignReportUserInteractionsModal.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobTypeDetails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ interaction: 'Clicked', eventTime: '2024-01-01' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('CampaignReportUserInteractionsModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignReportUserInteractionsModal, {
      propsData: {
        status: true,
        item: { resourceId: 'r1', firstName: 'John', lastName: 'Doe' },
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getSubtitle returns full name from item', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toBe('John Doe')
  })

  it('getSubtitle handles missing item fields', () => {
    const wrapper = mountComponent({ item: {} })
    expect(wrapper.vm.getSubtitle).toBe(' ')
  })

  it('callForData fetches interactions and updates table', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    expect(SmishingService.searchCampaignJobTypeDetails).toHaveBeenCalledWith(
      'search-sms-all',
      expect.any(Object),
      'r1'
    )
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0].interaction).toBe('Clicked')
  })

  it('handleClose emits on-close', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
