import CallbackService from '@/api/callback'
import CampaignManagerReportSummaryEmail from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryEmail.vue'

jest.mock('@/api/callback', () => ({
  getEmailTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

jest.mock('@/utils/functions', () => ({
  getDifficultyBadgeColor: jest.fn(() => '#123456')
}))

describe('CampaignManagerReportSummaryEmail.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('isFormData returns false for empty form and true for filled form', () => {
    expect(CampaignManagerReportSummaryEmail.computed.isFormData.call({ formData: {} })).toBe(0)
    expect(
      CampaignManagerReportSummaryEmail.computed.isFormData.call({ formData: { resourceId: 'x' } })
    ).toBe(1)
  })

  it('callForTemplate maps API fields and difficulty/method labels', async () => {
    CallbackService.getEmailTemplate.mockResolvedValueOnce({
      data: {
        data: {
          template: '<p>x</p>',
          difficultyResourceId: 'd1',
          categoryResourceId: 'm1',
          fromName: 'Sender',
          fromAddress: 's@x.com',
          name: 'TempName'
        }
      }
    })

    const ctx = {
      formData: { resourceId: 'tpl-1', callbackNumber: '+90' },
      difficulties: [{ value: 'd1', text: 'Hard' }],
      methods: [{ value: 'm1', text: 'Voice' }],
      setLoading: jest.fn(),
      emailTemplate: null,
      difficulty: '',
      method: '',
      fromName: '',
      fromAddress: '',
      name: '',
      callbackNumber: ''
    }

    await CampaignManagerReportSummaryEmail.methods.callForTemplate.call(ctx, true)

    expect(CallbackService.getEmailTemplate).toHaveBeenCalledWith('tpl-1')
    expect(ctx.emailTemplate).toBe('<p>x</p>')
    expect(ctx.difficulty).toBe('Hard')
    expect(ctx.method).toBe('Voice')
    expect(ctx.callbackNumber).toBe('+90')
  })

  it('getBadgeText returns same text and getBadgeColor delegates util', () => {
    expect(CampaignManagerReportSummaryEmail.methods.getBadgeText('Medium')).toBe('Medium')
    expect(CampaignManagerReportSummaryEmail.methods.getBadgeColor('Medium')).toBe('#123456')
  })
})
