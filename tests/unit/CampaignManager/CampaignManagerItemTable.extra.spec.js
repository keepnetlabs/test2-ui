import { shallowMount } from '@vue/test-utils'
import CampaignManagerItemTable from '@/components/CampaignManager/CampaignManagerItemTable.vue'
import { CAMPAIGN_TYPE, COLUMNS, SCENARIO_DISTRIBUTION_TEXTS } from '@/components/CampaignManager/utils'

jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn(() => Promise.resolve()),
  exportCampaignManagerItem: jest.fn(() => Promise.resolve({ data: new ArrayBuffer(0) })),
  searchCampaignPhishingJob: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

const { exportCampaignManagerItem, searchCampaignPhishingJob } = require('@/api/phishingsimulator')

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

    it('maps XLS to Excel and sets Campaign-Manager-Run.xlsx download name', async () => {
      jest.clearAllMocks()
      const wrapper = createWrapper()
      await flushPromises()
      const link = { click: jest.fn(), href: '', download: '' }
      jest.spyOn(document, 'createElement').mockImplementation(() => link)
      jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:run')

      wrapper.vm.exportCampaignManagerItemList({
        exportTypes: ['XLS'],
        pageNumber: 1,
        pageSize: 10
      })
      await flushPromises()

      expect(exportCampaignManagerItem).toHaveBeenCalledWith(
        expect.objectContaining({ exportType: 'Excel' }),
        'campaign-1'
      )
      expect(link.download).toBe('Campaign-Manager-Run.xlsx')
    })
  })

  describe('Target groups (on-target-users-groups-click)', () => {
    it('emits payload when handleTargetUsersGroupsClick is invoked from UI', () => {
      const wrapper = createWrapper({
        item: {
          resourceId: 'camp-extra',
          name: 'N',
          frequency: 1,
          campaignType: 4,
          categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
        }
      })
      wrapper.vm.handleTargetUsersGroupsClick({
        instanceGroup: 'ig-extra',
        status: 'Scheduled'
      })
      expect(wrapper.emitted('on-target-users-groups-click')).toHaveLength(1)
      expect(wrapper.emitted('on-target-users-groups-click')[0][0]).toEqual({
        resourceId: 'camp-extra',
        campaignType: 4,
        instanceGroup: 'ig-extra'
      })
    })

    it('tableColumnsWithTooltips keeps CREATE_TIME_ITEM_TABLE as text column', () => {
      const wrapper = createWrapper()
      const createdCol = wrapper.vm.tableColumnsWithTooltips.find(
        (c) => c.property === COLUMNS.CREATE_TIME_ITEM_TABLE.property
      )
      expect(createdCol.type).toBe('text')
      expect(createdCol.property).toBe('createdDate')
    })

    it('includes undefined instanceGroup when row omits it', () => {
      const wrapper = createWrapper({
        item: {
          resourceId: 'camp-ig',
          name: 'N',
          frequency: 0,
          campaignType: CAMPAIGN_TYPE.Phishing,
          categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
        }
      })
      wrapper.vm.handleTargetUsersGroupsClick({ status: 'Scheduled' })
      expect(wrapper.emitted('on-target-users-groups-click')[0][0]).toEqual({
        resourceId: 'camp-ig',
        campaignType: CAMPAIGN_TYPE.Phishing,
        instanceGroup: undefined
      })
    })
  })

  describe('item prop watcher (add button)', () => {
    it('disables add when distribution is not manual and frequency is non-zero', async () => {
      const wrapper = createWrapper({
        item: {
          resourceId: 'c1',
          name: 'N',
          frequency: 2,
          categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[1]
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tableOptions.addButton.disabled).toBe(true)
      expect(String(wrapper.vm.tableOptions.addButton.tooltip)).toContain('frequency')
    })

    it('keeps add enabled for manual distribution even with recurring frequency', async () => {
      const wrapper = createWrapper({
        item: {
          resourceId: 'c2',
          name: 'N',
          frequency: 3,
          categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tableOptions.addButton.disabled).toBe(false)
      expect(wrapper.vm.tableOptions.addButton.tooltip).toBe('Add a Campaign')
    })

    it('item watcher returns early when item becomes null', async () => {
      const wrapper = createWrapper()
      await wrapper.setProps({ item: null })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tableOptions.addButton).toBeDefined()
    })
  })

  describe('handleOnAddButtonClick', () => {
    it('emits on-launch with item resourceId', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleOnAddButtonClick()
      expect(wrapper.emitted('on-launch')).toEqual([[{ resourceId: 'campaign-1' }]])
    })
  })

  describe('toggleShowDeleteDialog', () => {
    it('clears selectedRow when closing delete dialog', () => {
      const wrapper = createWrapper()
      wrapper.setData({ isShowDeleteDialog: true, selectedRow: { instanceGroup: 'x' } })
      wrapper.vm.toggleShowDeleteDialog()
      expect(wrapper.vm.isShowDeleteDialog).toBe(false)
      expect(wrapper.vm.selectedRow).toEqual({})
    })

    it('does not clear selectedRow when opening delete dialog', () => {
      const wrapper = createWrapper()
      const row = { instanceGroup: 'g-open' }
      wrapper.setData({ isShowDeleteDialog: false, selectedRow: row })
      wrapper.vm.toggleShowDeleteDialog()
      expect(wrapper.vm.isShowDeleteDialog).toBe(true)
      expect(wrapper.vm.selectedRow).toEqual(row)
    })
  })

  describe('handlePreview', () => {
    it('emits on-preview with the row payload', () => {
      const wrapper = createWrapper()
      const row = { instanceGroup: 'ig-p', status: 'Scheduled' }
      wrapper.vm.handlePreview(row)
      expect(wrapper.emitted('on-preview')).toEqual([[row]])
    })
  })

  describe('getErrorMessage', () => {
    it('returns jobResultMessage when status is Error', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getErrorMessage({ status: 'Error', jobResultMessage: 'SMTP failure' })
      ).toBe('SMTP failure')
    })

    it('returns empty string when Error but message missing', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getErrorMessage({ status: 'Error' })).toBe('')
    })

    it('returns empty string when status is not Error', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getErrorMessage({ status: 'Running', jobResultMessage: 'ignored' })
      ).toBe('')
    })
  })

  describe('getTooltipDisabilityStatus', () => {
    it('disables tooltip only for Error rows that include a message', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getTooltipDisabilityStatus({
          status: 'Error',
          jobResultMessage: 'Details'
        })
      ).toBe(false)
      expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Idle' })).toBe(true)
      expect(
        wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: '' })
      ).toBe(true)
    })
  })
})
