import { shallowMount } from '@vue/test-utils'
import CampaignManagerItemTable from '@/components/CampaignManager/CampaignManagerItemTable.vue'
import { SCENARIO_DISTRIBUTION_TEXTS } from '@/components/CampaignManager/utils'

jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn(() => Promise.resolve()),
  exportCampaignManagerItem: jest.fn(() => Promise.resolve({ data: new ArrayBuffer(0) })),
  searchCampaignPhishingJob: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

const { searchCampaignPhishingJob } = require('@/api/phishingsimulator')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerItemTable.vue - Extra Branch Coverage', () => {
  const DataTableStub = {
    name: 'DataTable',
    template: '<div></div>'
  }

  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerItemTable, {
      propsData: {
        item: {
          resourceId: 'campaign-1',
          name: 'Campaign A',
          frequency: 1,
          categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
        },
        statusItems: [],
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCampaignManagerParentCreatePermissions': true,
            'permissions/getCampaignReportsPausePermissions': true,
            'permissions/getCampaignReportsDeletePermissions': true
          }
        }
      },
      stubs: {
        DataTable: DataTableStub,
        Badge: true,
        TheRecordsButton: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true,
        CampaignManagerItemRowActions: true,
        CampaignManagerItemDeleteDialog: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Method: getRecordsButtonSingleLabel', () => {
    it('returns empty string if row status is Idle', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getRecordsButtonSingleLabel({ status: 'Idle' })).toBe('')
    })

    it('returns empty string if item has multiple frequency (isRecurring)', () => {
      const wrapper = createWrapper({
        item: { frequency: 1 }
      })
      expect(wrapper.vm.getRecordsButtonSingleLabel({ status: 'Running' })).toBe('')
    })

    it('returns "View Report" when status is not Idle and item is not recurring', () => {
      const wrapper = createWrapper({
        item: { frequency: 0 }
      })
      expect(wrapper.vm.getRecordsButtonSingleLabel({ status: 'Running' })).toBe('View Report')
    })
    
    it('handles missing item or frequency robustly', async () => {
      const wrapper = createWrapper()
      await wrapper.setProps({ item: null })
      expect(wrapper.vm.getRecordsButtonSingleLabel({ status: 'Error' })).toBe('View Report')
    })
  })

  describe('Method: callForData exception and empty defaults', () => {
    it('handles empty results and mapping defaults properly', async () => {
      searchCampaignPhishingJob.mockResolvedValueOnce({
        data: {
          data: {
            pageNumber: 2
            // no results, no totalNumberOfRecords, no totalNumberOfPages
          }
        }
      })
      
      const wrapper = createWrapper()
      await flushPromises() // resolve created call which consumes the mock above
      
      expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBeUndefined()
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(2)
      expect(wrapper.vm.tableData).toEqual([])
    })
  })

  describe('Method: exportCampaignManagerItemList file extensions', () => {
    it('handles standard lower-casing for non-XLS files', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      
      const clickMock = jest.fn()
      
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        return tagName === 'a' ? { click: clickMock } : document.createElement(tagName)
      })
      jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test2')

      wrapper.vm.exportCampaignManagerItemList({
        exportTypes: ['PDF'],
        pageNumber: 1,
        pageSize: 10
      })
      
      await flushPromises()
      expect(clickMock).toHaveBeenCalled()
    })
  })
})
