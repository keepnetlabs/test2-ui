import CampaignManagerReportSummaryCampaignInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCampaignInfo.vue'

describe('CampaignManagerReportSummaryCampaignInfo.vue (extra branch coverage)', () => {
  describe('computed isTooltip', () => {
    it('returns false when sendOnlyActiveUsers is false', () => {
      const ctx = {
        helperData: { sendOnlyActiveUsers: false, sendRandomlyUsers: true }
      }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.isTooltip.call(ctx)).toBe(false)
    })

    it('returns false when sendRandomlyUsers is false', () => {
      const ctx = {
        helperData: { sendOnlyActiveUsers: true, sendRandomlyUsers: false }
      }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.isTooltip.call(ctx)).toBe(false)
    })

    it('returns false when helperData is empty', () => {
      const ctx = { helperData: {} }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.isTooltip.call(ctx)).toBe(false)
    })
  })

  describe('computed getTooltipText', () => {
    it('returns false when isTooltip is false', () => {
      const ctx = {
        isTooltip: false,
        helperData: { randomlyUsersCount: 10, totalTargetUserCount: 100 }
      }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.getTooltipText.call(ctx)).toBe(false)
    })
  })

  describe('computed getBodyValue', () => {
    it('omits "of X" when isTooltip is false', () => {
      const ctx = {
        items: { 'Target Users': 50 },
        isTooltip: false,
        helperData: { totalTargetUserCount: 100 }
      }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.getBodyValue.call(ctx)).toBe(
        '50 users '
      )
    })
  })

  describe('computed getTargetGroups', () => {
    it('returns empty array when helperData is null', () => {
      const ctx = { helperData: null }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.getTargetGroups.call(ctx)).toEqual(
        []
      )
    })

    it('returns empty array when targetGroups is missing', () => {
      const ctx = { helperData: {} }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.getTargetGroups.call(ctx)).toEqual(
        []
      )
    })
  })

  describe('computed getSmartGroupingName', () => {
    it('returns empty string when smartGroupInfo is missing', () => {
      const ctx = { helperData: {} }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.getSmartGroupingName.call(ctx)).toBe(
        ''
      )
    })

    it('returns empty string when smartGroupInfo.name is missing', () => {
      const ctx = { helperData: { smartGroupInfo: {} } }
      expect(CampaignManagerReportSummaryCampaignInfo.computed.getSmartGroupingName.call(ctx)).toBe(
        ''
      )
    })
  })

  describe('handleRedirectToSmartGroup', () => {
    it('does not navigate when smartGroupInfo is null', () => {
      const push = jest.fn()
      const ctx = {
        helperData: { smartGroupInfo: null },
        $router: { push }
      }
      CampaignManagerReportSummaryCampaignInfo.methods.handleRedirectToSmartGroup.call(ctx)
      expect(push).not.toHaveBeenCalled()
    })

    it('does not navigate when resourceId is empty', () => {
      const push = jest.fn()
      const ctx = {
        helperData: { smartGroupInfo: { name: 'Group', resourceId: '' } },
        $router: { push }
      }
      CampaignManagerReportSummaryCampaignInfo.methods.handleRedirectToSmartGroup.call(ctx)
      expect(push).not.toHaveBeenCalled()
    })
  })
})
