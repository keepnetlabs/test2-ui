jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignPhishingJob: jest.fn().mockResolvedValue({ data: { data: {} } }),
  exportCampaignManagerItem: jest.fn().mockResolvedValue({ data: new Blob() })
}))

import CampaignManagerItemTable from '@/components/SmishingCampaignManager/CampaignManagerItemTable.vue'

describe('CampaignManagerItemTable.vue (extra branch coverage)', () => {
  describe('getRecordsButtonSingleLabel', () => {
    it('returns empty string when status is Idle', () => {
      const ctx = { item: { frequency: 0 } }
      expect(
        CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Idle',
          frequency: 0
        })
      ).toBe('')
    })
    it('returns empty string when item is recurring', () => {
      const ctx = { item: { frequency: 1 } }
      expect(
        CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Complete',
          frequency: 0
        })
      ).toBe('')
    })
    it('returns View Report when not Idle and not recurring', () => {
      const ctx = { item: { frequency: 0 } }
      expect(
        CampaignManagerItemTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Complete',
          frequency: 0
        })
      ).toBe('View Report')
    })
  })

  describe('getTooltipDisabilityStatus', () => {
    it('returns false when status is Error and has jobResultMessage', () => {
      const ctx = {}
      expect(
        CampaignManagerItemTable.methods.getTooltipDisabilityStatus.call(ctx, {
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
        CampaignManagerItemTable.methods.getErrorMessage.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Custom'
        })
      ).toBe('Custom')
    })
  })
})
