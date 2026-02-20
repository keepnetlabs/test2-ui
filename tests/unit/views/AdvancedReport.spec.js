import AdvancedReport from '@/views/AdvancedReport.vue'
import ReportsService from '@/api/reports'
import * as pbi from 'powerbi-client'

jest.mock('@/api/reports', () => ({
  __esModule: true,
  default: {
    getReportDetail: jest.fn()
  }
}))

jest.mock('powerbi-client', () => ({
  models: {
    TokenType: { Embed: 'Embed' },
    Permissions: { All: 'All' }
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AdvancedReport.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData requests report detail and embeds powerbi config', async () => {
    ReportsService.getReportDetail.mockResolvedValueOnce({
      data: {
        data: {
          embedReport: { embedUrl: 'https://powerbi/embed-url' },
          embedToken: { token: 'embed-token' }
        }
      }
    })

    const on = jest.fn((event, cb) => {
      if (event === 'loaded') cb()
    })
    const embed = jest.fn(() => ({ on }))
    const setLoading = jest.fn()

    const ctx = {
      $route: { params: { id: 'rep-1' } },
      $refs: { reportContainer: { id: 'container' } },
      setLoading,
      report: null
    }

    const originalPowerbi = window.powerbi
    window.powerbi = { embed }

    AdvancedReport.methods.callForData.call(ctx)
    await flushPromises()

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(ReportsService.getReportDetail).toHaveBeenCalledWith('rep-1')
    expect(embed).toHaveBeenCalledWith(
      { id: 'container' },
      expect.objectContaining({
        type: 'report',
        tokenType: pbi.models.TokenType.Embed,
        accessToken: 'embed-token',
        embedUrl: 'https://powerbi/embed-url',
        permissions: pbi.models.Permissions.All
      })
    )
    expect(on).toHaveBeenCalledWith('loaded', expect.any(Function))
    expect(setLoading).toHaveBeenCalledTimes(2)

    window.powerbi = originalPowerbi
  })

  it('mounted hook triggers callForData', () => {
    const ctx = { callForData: jest.fn() }

    AdvancedReport.mounted.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })
})
