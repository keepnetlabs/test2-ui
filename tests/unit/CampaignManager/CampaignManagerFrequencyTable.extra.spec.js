jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn().mockResolvedValue({}),
  exportCampaignManagerItem: jest.fn().mockResolvedValue({ data: Buffer.from('') }),
  searchCampaignPhishingJob: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  })
}))

import CampaignManagerFrequencyTable from '@/components/CampaignManager/CampaignManagerFrequencyTable.vue'
import { CAMPAIGN_TYPE } from '@/components/CampaignManager/utils'

const { searchCampaignPhishingJob } = require('@/api/phishingsimulator')
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerFrequencyTable.vue (extra branch coverage)', () => {
  describe('getTooltipDisabilityStatus', () => {
    it('returns true when status is not Error', () => {
      const ctx = {}
      expect(
        CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Scheduled',
          jobResultMessage: ''
        })
      ).toBe(true)
    })
    it('returns true when status is Error but no jobResultMessage', () => {
      const ctx = {}
      expect(
        CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Error',
          jobResultMessage: ''
        })
      ).toBe(true)
    })
    it('returns false when status is Error and has jobResultMessage', () => {
      const ctx = {}
      expect(
        CampaignManagerFrequencyTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Failed'
        })
      ).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    it('returns jobResultMessage when status is Error', () => {
      const ctx = {}
      expect(
        CampaignManagerFrequencyTable.methods.getErrorMessage.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Custom error'
        })
      ).toBe('Custom error')
    })
    it('returns empty string when status is not Error', () => {
      const ctx = {}
      expect(
        CampaignManagerFrequencyTable.methods.getErrorMessage.call(ctx, {
          status: 'Scheduled',
          jobResultMessage: 'x'
        })
      ).toBe('')
    })
  })

  describe('isTargetUsersShowGroups', () => {
    it('returns true for IDLE status', () => {
      const ctx = {}
      const row = { status: 'Idle' }
      expect(CampaignManagerFrequencyTable.methods.isTargetUsersShowGroups.call(ctx, row)).toBe(
        true
      )
    })
    it('returns true for SCHEDULED status', () => {
      const ctx = {}
      const row = { status: 'Scheduled' }
      expect(CampaignManagerFrequencyTable.methods.isTargetUsersShowGroups.call(ctx, row)).toBe(
        true
      )
    })
    it('returns true for lowercase scheduled', () => {
      const ctx = {}
      expect(
        CampaignManagerFrequencyTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'scheduled' })
      ).toBe(true)
    })
    it('returns false for other status', () => {
      const ctx = {}
      const row = { status: 'Complete' }
      expect(CampaignManagerFrequencyTable.methods.isTargetUsersShowGroups.call(ctx, row)).toBe(
        false
      )
    })

    it('returns false when status is missing', () => {
      const ctx = {}
      expect(CampaignManagerFrequencyTable.methods.isTargetUsersShowGroups.call(ctx, {})).toBe(
        false
      )
    })
  })

  describe('handleTargetUsersGroupsClick', () => {
    it('emits instanceGroup 0 from row when API sends numeric zero', () => {
      const emit = jest.fn()
      CampaignManagerFrequencyTable.methods.handleTargetUsersGroupsClick.call(
        {
          parentResourceId: 'p1',
          parentCampaignType: CAMPAIGN_TYPE.Phishing,
          item: {},
          $emit: emit
        },
        { instanceGroup: 0, status: 'Idle' }
      )
      expect(emit).toHaveBeenCalledWith('on-target-users-groups-click', {
        resourceId: 'p1',
        campaignType: CAMPAIGN_TYPE.Phishing,
        instanceGroup: 0
      })
    })
  })

  describe('exportCampaignManagerItemList', () => {
    it('converts XLS to Excel and handles multiple formats', () => {
      const { exportCampaignManagerItem } = require('@/api/phishingsimulator')
      const ctx = {
        axiosPayload: { orderBy: 'test', ascending: true, filter: {} },
        item: { frequencyGroup: 'group1' },
        parentResourceId: 'p1'
      }
      
      if (!globalThis.URL.createObjectURL) {
        globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
      }
      const click = jest.fn()
      jest.spyOn(document, 'createElement').mockImplementation(() => ({ click, href: '', download: '' }))

      CampaignManagerFrequencyTable.methods.exportCampaignManagerItemList.call(ctx, {
        exportTypes: ['XLS', 'PDF'],
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: true
      })

      expect(exportCampaignManagerItem).toHaveBeenCalledWith(
        expect.objectContaining({ exportType: 'Excel' }),
        'p1'
      )
      expect(exportCampaignManagerItem).toHaveBeenCalledWith(
        expect.objectContaining({ exportType: 'PDF' }),
        'p1'
      )
    })
  })

  describe('statusItems watcher', () => {
    it('updates column filterable items when val is provided', () => {
      const wrapper = {
        $set: jest.fn(),
        $refs: { refTable: { reRenderFilters: jest.fn() } },
        tableOptions: {
          columns: [{ property: 'status' }]
        }
      }
      const val = [{ text: 'Active', value: 1 }]
      CampaignManagerFrequencyTable.watch.statusItems.handler.call(wrapper, val)
      
      expect(wrapper.$set).toHaveBeenCalledWith(
        wrapper.tableOptions.columns[0],
        'filterableItems',
        [{ text: 'Active', value: 'Active' }]
      )
      expect(wrapper.$refs.refTable.reRenderFilters).toHaveBeenCalled()
    })

    it('does nothing if val is empty', () => {
      const wrapper = { $set: jest.fn() }
      CampaignManagerFrequencyTable.watch.statusItems.handler.call(wrapper, [])
      expect(wrapper.$set).not.toHaveBeenCalled()
    })

    it('does nothing if val is null or undefined', () => {
      const wrapper = { $set: jest.fn() }
      CampaignManagerFrequencyTable.watch.statusItems.handler.call(wrapper, null)
      expect(wrapper.$set).not.toHaveBeenCalled()
      CampaignManagerFrequencyTable.watch.statusItems.handler.call(wrapper, undefined)
      expect(wrapper.$set).not.toHaveBeenCalled()
    })
  })

  describe('handleTargetUsersGroupsClick (parentCampaignType)', () => {
    it('emits null campaignType when parentCampaignType prop is null', () => {
      const emit = jest.fn()
      CampaignManagerFrequencyTable.methods.handleTargetUsersGroupsClick.call(
        {
          parentResourceId: 'parent-res',
          parentCampaignType: null,
          $emit: emit
        },
        { instanceGroup: 'ig-9', status: 'Idle' }
      )
      expect(emit).toHaveBeenCalledWith('on-target-users-groups-click', {
        resourceId: 'parent-res',
        campaignType: null,
        instanceGroup: 'ig-9'
      })
    })

    it('emits undefined campaignType when parentCampaignType prop is undefined', () => {
      const emit = jest.fn()
      CampaignManagerFrequencyTable.methods.handleTargetUsersGroupsClick.call(
        {
          parentResourceId: 'parent-u',
          parentCampaignType: undefined,
          $emit: emit
        },
        { instanceGroup: 'ig-u', status: 'Idle' }
      )
      expect(emit).toHaveBeenCalledWith('on-target-users-groups-click', {
        resourceId: 'parent-u',
        campaignType: undefined,
        instanceGroup: 'ig-u'
      })
    })
  })

  describe('toggleShowDeleteDialog', () => {
    it('clears selectedRow when closing delete dialog', () => {
      const wrapper = {
        isShowDeleteDialog: true,
        selectedRow: { instanceGroup: 'g1' }
      }
      CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(wrapper)
      expect(wrapper.isShowDeleteDialog).toBe(false)
      expect(wrapper.selectedRow).toEqual({})
    })

    it('does not clear selectedRow when opening delete dialog', () => {
      const row = { instanceGroup: 'g-open' }
      const wrapper = {
        isShowDeleteDialog: false,
        selectedRow: row
      }
      CampaignManagerFrequencyTable.methods.toggleShowDeleteDialog.call(wrapper)
      expect(wrapper.isShowDeleteDialog).toBe(true)
      expect(wrapper.selectedRow).toBe(row)
    })
  })

  describe('handleOnAddButtonClick', () => {
    it('emits on-launch with parent resource id', () => {
      const emit = jest.fn()
      CampaignManagerFrequencyTable.methods.handleOnAddButtonClick.call({
        parentResourceId: 'parent-res-42',
        $emit: emit
      })
      expect(emit).toHaveBeenCalledWith('on-launch', { resourceId: 'parent-res-42' })
    })
  })

  describe('callForData API payload', () => {
    it('merges phishingCampaignFrequencyGroup and passes parent resource id to search', async () => {
      jest.clearAllMocks()
      const setLoading = jest.fn()
      const ctx = {
        setLoading,
        axiosPayload: { orderBy: 'CreatedDate', ascending: false, filter: { f: 1 } },
        item: { frequencyGroup: 'freq-group-xyz' },
        parentResourceId: 'parent-resource-99',
        serverSideProps: {},
        tableData: [],
        $nextTick: (fn) => fn(),
        $refs: {}
      }
      CampaignManagerFrequencyTable.methods.callForData.call(ctx)
      await flushPromises()
      expect(searchCampaignPhishingJob).toHaveBeenCalledWith(
        expect.objectContaining({
          phishingCampaignFrequencyGroup: 'freq-group-xyz',
          orderBy: 'CreatedDate',
          filter: { f: 1 }
        }),
        'parent-resource-99'
      )
    })
  })
})
