import TrainingReportSummaryAudienceDetails from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryAudienceDetails.vue'

describe('TrainingReportSummaryAudienceDetails.vue (extra)', () => {
  it('getCampaignName and getCriteria use phishingCampaign values when present', () => {
    const ctx = {
      phishingCampaign: {
        name: 'Phish Campaign 1',
        description: 'Test campaign',
        criteria: ['Clicked', 'Reported']
      }
    }
    expect(TrainingReportSummaryAudienceDetails.computed.getCampaignName.call(ctx)).toBe(
      'Phish Campaign 1'
    )
    expect(TrainingReportSummaryAudienceDetails.computed.getCampaignDescription.call(ctx)).toBe(
      'Test campaign'
    )
    expect(TrainingReportSummaryAudienceDetails.computed.getCriteria.call(ctx)).toEqual([
      'Clicked',
      'Reported'
    ])
  })
})
