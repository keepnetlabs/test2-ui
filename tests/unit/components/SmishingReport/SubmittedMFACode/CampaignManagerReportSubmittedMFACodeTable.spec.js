const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSubmittedMFACodeTable from '@/components/SmishingReport/SubmittedMFACode/CampaignManagerReportSubmittedMFACodeTable.vue'

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

describe('SmishingReport SubmittedMFACode CampaignManagerReportSubmittedMFACodeTable.vue', () => {
  const createWrapper = (propsData = {}, provide = {}) => {
    return shallowMount(CampaignManagerReportSubmittedMFACodeTable, {
      propsData: {
        id: 'test-id',
        instanceGroup: 'g1',
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => false,
        ...provide
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingReportSubmittedMFADetailstPermissions': true
          }
        }
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
      wrapper.vm.handleSelectionChange(2)
      expect(wrapper.emitted('on-selection-text-change')).toEqual([[2]])
    })
  })

  describe('handleOnResend', () => {
    it('emits on-resend with Types [8] for single item', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleOnResend({ resourceId: 'r1' })
      expect(wrapper.emitted('on-resend')[0][0]).toMatchObject({
        Types: [8],
        items: ['r1'],
        selectAll: false
      })
    })

    it('emits on-resend with array of items', () => {
      const wrapper = createWrapper()
      const items = [{ resourceId: 'r1' }, { resourceId: 'r2' }]
      wrapper.vm.handleOnResend(items, [], false)
      expect(wrapper.emitted('on-resend')[0][0].items).toEqual(['r1', 'r2'])
    })
  })

  describe('handleOnDetail', () => {
    it('emits on-detail with row', () => {
      const wrapper = createWrapper()
      const row = { resourceId: 'r1' }
      wrapper.vm.handleOnDetail(row)
      expect(wrapper.emitted('on-detail')).toEqual([[row]])
    })
  })
})

