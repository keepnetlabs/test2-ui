const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportNoResponseTable from '@/components/SmishingReport/NoResponse/CampaignManagerReportNoResponseTable.vue'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobType: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  }),
  exportCampaignJobType: jest.fn().mockResolvedValue(mockBlob)
}))

describe('SmishingReport NoResponse CampaignManagerReportNoResponseTable.vue', () => {
  const createWrapper = (propsData = {}, provide = {}) => {
    return shallowMount(CampaignManagerReportNoResponseTable, {
      propsData: {
        id: 'test-id',
        instanceGroup: 'g1',
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => false,
        ...provide
      },
      stubs: {
        DataTable: true,
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('handleSelectionChange', () => {
    it('emits on-selection-text-change', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleSelectionChange(4)
      expect(wrapper.emitted('on-selection-text-change')).toEqual([[4]])
    })
  })

  describe('handleOnResend', () => {
    it('emits on-resend with payload for single item', () => {
      const wrapper = createWrapper()
      const item = { resourceId: 'r1' }
      wrapper.vm.handleOnResend(item)
      expect(wrapper.emitted('on-resend')).toHaveLength(1)
      expect(wrapper.emitted('on-resend')[0][0]).toMatchObject({
        Types: [4],
        items: ['r1'],
        selectAll: false
      })
    })

    it('emits on-resend with payload for array of items', () => {
      const wrapper = createWrapper()
      const items = [{ resourceId: 'r1' }, { resourceId: 'r2' }]
      wrapper.vm.handleOnResend(items, ['ex1'], true)
      expect(wrapper.emitted('on-resend')[0][0].items).toEqual(['r1', 'r2'])
      expect(wrapper.emitted('on-resend')[0][0].excludedItems).toEqual(['ex1'])
      expect(wrapper.emitted('on-resend')[0][0].selectAll).toBe(true)
    })
  })
})

