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
    it('returns false for other status', () => {
      const ctx = {}
      const row = { status: 'Complete' }
      expect(CampaignManagerFrequencyTable.methods.isTargetUsersShowGroups.call(ctx, row)).toBe(
        false
      )
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
  })
})
