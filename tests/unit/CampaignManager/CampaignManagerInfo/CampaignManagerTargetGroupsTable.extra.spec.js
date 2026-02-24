jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn().mockResolvedValue({
    data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 1, pageNumber: 1 } }
  }),
  searchAllTargetGroups: jest.fn().mockResolvedValue({
    data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 1, pageNumber: 1 } }
  })
}))

jest.mock('@/api/callback', () => ({
  getTargetGroupsForCurrentCompany: jest.fn().mockResolvedValue({
    data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 1, pageNumber: 1 } }
  })
}))

import CampaignManagerTargetGroupsTable from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroupsTable.vue'

describe('CampaignManagerTargetGroupsTable.vue (extra branch coverage)', () => {
  describe('getGroupNameTooltipMessage', () => {
    it('returns empty string when row has no name', () => {
      expect(
        CampaignManagerTargetGroupsTable.methods.getGroupNameTooltipMessage.call({}, {})
      ).toBe('')
    })

    it('returns Repeat Offenders tooltip', () => {
      const result = CampaignManagerTargetGroupsTable.methods.getGroupNameTooltipMessage.call(
        {},
        { name: 'Repeat Offenders' }
      )
      expect(result).toContain('Repeat Offenders')
      expect(result).toContain('automatically added')
    })

    it('returns New Hires tooltip', () => {
      const result = CampaignManagerTargetGroupsTable.methods.getGroupNameTooltipMessage.call(
        {},
        { name: 'New Hires' }
      )
      expect(result).toContain('New hires')
      expect(result).toContain('90 days')
    })

    it('returns empty string for other group names', () => {
      expect(
        CampaignManagerTargetGroupsTable.methods.getGroupNameTooltipMessage.call(
          {},
          { name: 'Custom Group' }
        )
      ).toBe('')
    })
  })

  describe('isTooltipRenderable', () => {
    it('returns true for Repeat Offenders', () => {
      expect(
        CampaignManagerTargetGroupsTable.methods.isTooltipRenderable.call(
          {},
          { name: 'Repeat Offenders' }
        )
      ).toBe(true)
    })

    it('returns true for New Hires', () => {
      expect(
        CampaignManagerTargetGroupsTable.methods.isTooltipRenderable.call({}, { name: 'New Hires' })
      ).toBe(true)
    })

    it('returns falsy when row has no name', () => {
      const result = CampaignManagerTargetGroupsTable.methods.isTooltipRenderable.call({}, {})
      expect(result).toBeFalsy()
    })

    it('returns false for other names', () => {
      expect(
        CampaignManagerTargetGroupsTable.methods.isTooltipRenderable.call(
          {},
          { name: 'Other Group' }
        )
      ).toBe(false)
    })
  })

  describe('addRowClassName', () => {
    it('returns highlighted class when row matches highlightedRow', () => {
      const ctx = {
        highlightedRow: { resourceId: 'r1' }
      }
      expect(
        CampaignManagerTargetGroupsTable.methods.addRowClassName.call(ctx, {
          row: { resourceId: 'r1' }
        })
      ).toContain('campaign-manager-highlighted-row')
    })

    it('returns empty string when row does not match', () => {
      const ctx = {
        highlightedRow: { resourceId: 'r1' }
      }
      expect(
        CampaignManagerTargetGroupsTable.methods.addRowClassName.call(ctx, {
          row: { resourceId: 'r2' }
        })
      ).toBe('')
    })
  })
})
