import AdvancedReport from '@/views/AdvancedReport.vue'
import ReportsService from '@/api/reports'

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

describe('AdvancedReport.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData works with missing route params and response payload defaults', async () => {
    ReportsService.getReportDetail.mockResolvedValueOnce({})
    const on = jest.fn()
    const embed = jest.fn(() => ({ on }))
    const setLoading = jest.fn()
    const originalPowerbi = globalThis.powerbi
    globalThis.powerbi = { embed }

    const ctx = {
      $route: {},
      $refs: { reportContainer: { id: 'c1' } },
      setLoading,
      report: null
    }

    AdvancedReport.methods.callForData.call(ctx)
    await flushPromises()

    expect(ReportsService.getReportDetail).toHaveBeenCalledWith(undefined)
    expect(embed).toHaveBeenCalledWith(
      { id: 'c1' },
      expect.objectContaining({
        accessToken: undefined,
        embedUrl: undefined
      })
    )
    expect(on).toHaveBeenCalledWith('loaded', expect.any(Function))

    globalThis.powerbi = originalPowerbi
  })
})
