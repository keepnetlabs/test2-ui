jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getTextMessageTemplate: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            template: 'Hello user',
            difficultyResourceId: 'd1',
            categoryResourceId: 'm1'
          }
        }
      })
    )
  }
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  getDifficultyBadgeColor: jest.fn(() => '#000')
}))

import CampaignManagerReportSummaryTextTemplate from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryTextTemplate.vue'
import SmishingService from '@/api/smishing'
import { getDifficultyBadgeColor } from '@/utils/functions'

describe('CampaignManagerReportSummaryTextTemplate.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CampaignManagerReportSummaryTextTemplate.name).toBe('CampaignManagerReportSummaryTextTemplate')
  })

  it('isFormData returns key length', () => {
    expect(
      CampaignManagerReportSummaryTextTemplate.computed.isFormData.call({ formData: {} })
    ).toBe(0)
    expect(
      CampaignManagerReportSummaryTextTemplate.computed.isFormData.call({
        formData: { resourceId: 'x' }
      })
    ).toBe(1)
  })

  it('callForTemplate sets template, difficulty and method and toggles loader', async () => {
    const ctx = {
      formData: { resourceId: 'tpl1' },
      difficulties: [{ value: 'd1', text: 'Easy' }],
      methods: [{ value: 'm1', text: 'SMS' }],
      textTemplate: null,
      difficulty: '',
      method: '',
      setLoading: jest.fn()
    }

    CampaignManagerReportSummaryTextTemplate.methods.callForTemplate.call(ctx, true)
    await Promise.resolve()
    await Promise.resolve()

    expect(SmishingService.getTextMessageTemplate).toHaveBeenCalledWith('tpl1')
    expect(ctx.textTemplate).toBe('Hello user')
    expect(ctx.difficulty).toBe('Easy')
    expect(ctx.method).toBe('SMS')
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('getBadgeColor and getBadgeText return expected values', () => {
    expect(
      CampaignManagerReportSummaryTextTemplate.methods.getBadgeColor.call({}, 'Hard')
    ).toBe('#000')
    expect(getDifficultyBadgeColor).toHaveBeenCalledWith('Hard')
    expect(CampaignManagerReportSummaryTextTemplate.methods.getBadgeText.call({}, 'X')).toBe('X')
  })
})
