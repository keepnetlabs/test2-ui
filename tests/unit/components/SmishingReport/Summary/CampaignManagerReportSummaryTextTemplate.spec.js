jest.mock('@/api/smishing', () => ({
  getTextMessageTemplate: jest.fn(() => Promise.resolve({ data: { data: { template: 'test' } } }))
}))

import CampaignManagerReportSummaryTextTemplate from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryTextTemplate.vue'

describe('CampaignManagerReportSummaryTextTemplate.vue', () => {
  it('isFormData returns falsy when formData empty', () => {
    const ctx = { formData: {} }
    expect(CampaignManagerReportSummaryTextTemplate.computed.isFormData.call(ctx)).toBeFalsy()
  })

  it('isFormData returns truthy when formData has keys', () => {
    const ctx = { formData: { name: 'Test' } }
    expect(CampaignManagerReportSummaryTextTemplate.computed.isFormData.call(ctx)).toBeTruthy()
  })

  it('getBadgeText returns text', () => {
    expect(
      CampaignManagerReportSummaryTextTemplate.methods.getBadgeText.call({}, 'Easy')
    ).toBe('Easy')
  })
})
