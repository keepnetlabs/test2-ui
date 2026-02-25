jest.mock('@/api/smishing', () => ({
  searchCampaignJobTypeDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } } })
  )
}))

import CampaignManagerReportSubmittedMFACodeItemDetailDialog from '@/components/SmishingReport/SubmittedMFACode/CampaignManagerReportSubmittedMFACodeItemDetailDialog.vue'

describe('CampaignManagerReportSubmittedMFACodeItemDetailDialog.vue', () => {
  it('getTitle returns title with mfaSubmittedCount', () => {
    const ctx = { item: { mfaSubmittedCount: 3 } }
    expect(CampaignManagerReportSubmittedMFACodeItemDetailDialog.computed.getTitle.call(ctx)).toBe(
      'Submitted MFA Code 3 Time(s)'
    )
  })

  it('getSubtitle returns firstName and lastName', () => {
    const ctx = { item: { firstName: 'John', lastName: 'Doe' } }
    expect(CampaignManagerReportSubmittedMFACodeItemDetailDialog.computed.getSubtitle.call(ctx)).toBe(
      'John Doe'
    )
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    CampaignManagerReportSubmittedMFACodeItemDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
