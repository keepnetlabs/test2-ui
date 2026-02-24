import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog.vue'

describe('CampaignManagerReportSubmittedMfaCodeDetailDialog.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getTitle returns 0 when item has no submittedCount', () => {
      expect(
        CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getTitle.call({
          item: null
        })
      ).toBe('Submitted MFA Code 0 Time(s)')
    })

    it('getSubtitle returns empty when item has no firstName/lastName', () => {
      expect(
        CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getSubtitle.call({
          item: {}
        })
      ).toBe(' ')
    })

    it('getSubtitle returns only firstName when lastName missing', () => {
      expect(
        CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getSubtitle.call({
          item: { firstName: 'John' }
        })
      ).toBe('John ')
    })

    it('getSubtitle returns only lastName when firstName missing', () => {
      expect(
        CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getSubtitle.call({
          item: { lastName: 'Doe' }
        })
      ).toBe(' Doe')
    })
  })
})
