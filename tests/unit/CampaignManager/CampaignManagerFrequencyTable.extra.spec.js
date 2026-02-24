jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn().mockResolvedValue({}),
  exportCampaignManagerItem: jest.fn().mockResolvedValue({ data: new Blob() }),
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
})
