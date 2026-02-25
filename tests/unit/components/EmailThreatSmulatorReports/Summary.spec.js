jest.mock('@/api/emailThreatSimlator', () => ({
  __esModule: true,
  getQuickScanById: jest.fn(() =>
    Promise.resolve({
      data: { data: { status: 'Completed', createTime: '2026-01-01', email: 'a@b.com' } }
    })
  ),
  getQuickScanReportCountById: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalAttackSendCount: 10,
          secureEndpointsCount: 7,
          secureEndpointsPercent: 70,
          insecureEndpointsCount: 2,
          insecureEndpointsPercent: 20,
          unckechedEndpointsCount: 1,
          unckechedEndpointsPercent: 10,
          score: 70
        }
      }
    })
  ),
  getQuickScanReportStatsById: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          quickScanByAttackTypes: [{ categoryName: 'Phishing', count: 5, quickScanResultStats: [] }],
          quickScanByEmailStatus: [{ resultName: 'Secure', quickScanCategory: [] }]
        }
      }
    })
  )
}))

import Summary from '@/components/EmailThreatSmulatorReports/Summary.vue'
import {
  getQuickScanById,
  getQuickScanReportCountById,
  getQuickScanReportStatsById
} from '@/api/emailThreatSimlator'

describe('Summary.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(Summary.name).toBe('Summary')
  })

  it('getReportData loads summary, score and stats data', async () => {
    const ctx = {
      scoresLoading: true,
      scoreData: [],
      scanData: {},
      statsData: [],
      score: 0,
      selectedAttackType: {},
      selectedEmailStatus: {}
    }
    Summary.methods.getReportData.call(ctx, 'scan-1')
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    expect(getQuickScanById).toHaveBeenCalledWith('scan-1')
    expect(getQuickScanReportCountById).toHaveBeenCalledWith('scan-1')
    expect(getQuickScanReportStatsById).toHaveBeenCalledWith('scan-1')
    expect(ctx.scanData.status).toBe('Completed')
    expect(ctx.score).toBe(70)
    expect(ctx.scoreData).toHaveLength(4)
    expect(ctx.scoresLoading).toBe(false)
    expect(ctx.selectedAttackType.categoryName).toBe('Phishing')
  })

  it('getReportData handles error and redirects', async () => {
    getQuickScanById.mockRejectedValueOnce({
      response: { data: { message: 'failed' } }
    })
    const ctx = {
      $store: { dispatch: jest.fn() },
      $router: { push: jest.fn() }
    }
    Summary.methods.getReportData.call(ctx, 'scan-2')
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'failed', icon: 'mdi-alert-circle' })
    )
    expect(ctx.$router.push).toHaveBeenCalledWith({ path: '/email-threat-simulator' })
  })
})
