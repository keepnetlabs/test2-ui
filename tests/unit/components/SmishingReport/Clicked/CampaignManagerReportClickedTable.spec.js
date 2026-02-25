const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportClickedTable from '@/components/SmishingReport/Clicked/CampaignManagerReportClickedTable.vue'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobType: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1,
        totalSandBoxActivityCount: 0
      }
    }
  }),
  exportCampaignJobType: jest.fn().mockResolvedValue(mockBlob)
}))

describe('SmishingReport Clicked CampaignManagerReportClickedTable.vue', () => {
  const createWrapper = (propsData = {}, provide = {}) => {
    return shallowMount(CampaignManagerReportClickedTable, {
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
            'permissions/getSmishingReportClickedDetailstPermissions': true
          }
        }
      },
      stubs: {
        DataTable: true,
        CampaignManagerReportActivityColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true,
        CampaignManagerReportBotActivityAlertBox: true
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
      wrapper.vm.handleSelectionChange(3)
      expect(wrapper.emitted('on-selection-text-change')).toEqual([[3]])
    })
  })

  describe('handleOnResend', () => {
    it('emits on-resend with payload for single item', () => {
      const wrapper = createWrapper()
      const item = { resourceId: 'r1' }
      wrapper.vm.handleOnResend(item)
      expect(wrapper.emitted('on-resend')).toHaveLength(1)
      expect(wrapper.emitted('on-resend')[0][0]).toMatchObject({
        Types: [2],
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

  describe('handleOnDetail', () => {
    it('emits on-detail with row', () => {
      const wrapper = createWrapper()
      const row = { resourceId: 'r1', firstName: 'John' }
      wrapper.vm.handleOnDetail(row)
      expect(wrapper.emitted('on-detail')).toEqual([[row]])
    })
  })

  describe('handleActivity', () => {
    it('toggles isShowSandbox', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isShowSandbox).toBe(false)
      wrapper.vm.handleActivity()
      expect(wrapper.vm.isShowSandbox).toBe(true)
      wrapper.vm.handleActivity()
      expect(wrapper.vm.isShowSandbox).toBe(false)
    })
  })
})

