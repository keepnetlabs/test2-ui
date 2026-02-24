import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable.vue'

describe('CampaignManagerParentTable.vue (extra branch coverage)', () => {
  describe('getMethodDetail', () => {
    it('returns parsed object when valid JSON', () => {
      const ctx = {}
      const methodDetail = JSON.stringify([{ method: 'Click', count: 5 }])
      expect(CampaignManagerParentTable.methods.getMethodDetail.call(ctx, methodDetail)).toEqual([
        { method: 'Click', count: 5 }
      ])
    })
    it('returns {} when methodDetail is null', () => {
      const ctx = {}
      expect(CampaignManagerParentTable.methods.getMethodDetail.call(ctx, null)).toEqual({})
    })
    it('returns {} when JSON parse throws', () => {
      const ctx = {}
      expect(CampaignManagerParentTable.methods.getMethodDetail.call(ctx, 'invalid json')).toEqual({})
    })
  })

  describe('getRecordsButtonSingleLabel', () => {
    it('returns empty string when status is Idle', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Idle',
          frequency: 1
        })
      ).toBe('')
    })
    it('returns empty string when recurring (frequency !== 0)', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Complete',
          frequency: 1
        })
      ).toBe('')
    })
    it('returns View Report when not Idle and not recurring', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call(ctx, {
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
        CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call(ctx, {
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
        CampaignManagerParentTable.methods.getErrorMessage.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Custom'
        })
      ).toBe('Custom')
    })
  })

  describe('isTargetUsersShowGroups', () => {
    it('returns true for Idle status', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'Idle' })
      ).toBe(true)
    })
    it('returns false for other status', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'Complete' })
      ).toBe(false)
    })
  })
})
