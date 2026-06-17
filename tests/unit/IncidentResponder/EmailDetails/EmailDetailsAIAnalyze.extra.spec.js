jest.mock('@/utils/functions', () => ({
  getBtnPriorityColor: jest.fn(() => '#1976d2'),
  getBtnStatusColor: jest.fn((v) => `status-${v}`),
  getTimeZoneForMoment: jest.fn(() => 'YYYY/MM/DD HH:mm')
}))

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  create: jest.fn()
}))

jest.mock('@/api/notifiedEmail', () => ({
  getNotifiedEmailAiAnalysis: jest.fn(),
  reAnalyzeNotifiedEmailAiAnalysis: jest.fn()
}))

import EmailDetailsAIAnalyze from '@/components/IncidentResponder/EmailDetails/EmailDetailsAIAnalyze.vue'
import {
  getNotifiedEmailAiAnalysis,
  reAnalyzeNotifiedEmailAiAnalysis
} from '@/api/notifiedEmail'

describe('EmailDetailsAIAnalyze.vue (extra branch coverage)', () => {
  const { computed, methods } = EmailDetailsAIAnalyze

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  it('formattedReportCreatedAt covers no-date and no-moment branches', () => {
    expect(computed.formattedReportCreatedAt.call({ reportCreatedAt: null })).toBe('N/A')
    expect(
      computed.formattedReportCreatedAt.call({
        reportCreatedAt: '2026-02-25T10:00:00Z',
        $moment: null
      })
    ).toBe('2026-02-25T10:00:00Z')
  })

  it('agent determination preview branches by length', () => {
    const shortCtx = {
      agentDeterminationText: 'Short text',
      isAgentDeterminationLong: false
    }
    const longText = 'x'.repeat(320)
    const longCtx = {
      agentDeterminationText: longText,
      isAgentDeterminationLong: true
    }
    expect(computed.agentDeterminationPreview.call(shortCtx)).toBe('Short text')
    expect(computed.agentDeterminationPreview.call(longCtx).endsWith('...')).toBe(true)
  })

  it('observed/notObserved indicators and moreCount computed branches', () => {
    const baseReport = {
      risk_indicators: {
        observed: ['a', 'b', 'c', 'd', 'e'],
        not_observed: ['n1', 'n2', 'n3', 'n4', 'n5']
      }
    }
    expect(
      computed.observedIndicators.call({ report: baseReport, showAllObservedIndicators: false })
    ).toEqual(['a', 'b', 'c', 'd'])
    expect(
      computed.observedIndicators.call({ report: baseReport, showAllObservedIndicators: true })
    ).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect(computed.observedMoreCount.call({ report: baseReport })).toBe(1)
    expect(
      computed.notObservedIndicators.call({
        report: baseReport,
        showAllNotObservedIndicators: false
      })
    ).toEqual(['n1', 'n2', 'n3', 'n4'])
    expect(computed.notObservedMoreCount.call({ report: baseReport })).toBe(1)
  })

  it('actionGroups returns empty array when grouped payload has no items', () => {
    const groups = computed.actionGroups.call({
      report: {
        actions_recommended: {
          p1_immediate: [],
          p2_follow_up: [],
          p3_hardening: []
        }
      }
    })
    expect(groups).toEqual([])
  })

  it('runAnalysis returns early when id is missing', async () => {
    const ctx = {
      id: '',
      isRunningAnalysis: false,
      isLoadingReport: false,
      stopPolling: jest.fn()
    }
    await methods.runAnalysis.call(ctx)
    expect(reAnalyzeNotifiedEmailAiAnalysis).not.toHaveBeenCalled()
  })

  it('fetchReport returns early when id is missing', async () => {
    const ctx = { id: '', isLoadingReport: false, stopPolling: jest.fn() }
    await methods.fetchReport.call(ctx)
    expect(getNotifiedEmailAiAnalysis).not.toHaveBeenCalled()
  })

  it('applyAnalysisData falls back to a default failure reason when none is provided', () => {
    const ctx = {
      readAnalysisField: methods.readAnalysisField,
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps,
      loadUrlEvidenceImages: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn()
    }

    methods.applyAnalysisData.call(ctx, { status: 'Failed' })

    expect(ctx.failureReason).toBe('AI analysis could not be completed.')
  })

  it('applyAnalysisData falls back to createTime then current date for reportCreatedAt', () => {
    const withCreateTime = {
      readAnalysisField: methods.readAnalysisField,
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps,
      loadUrlEvidenceImages: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn()
    }
    methods.applyAnalysisData.call(withCreateTime, {
      status: 'Completed',
      report: { evidence_flow: [] },
      createTime: '2026-06-10 14:02:10'
    })
    expect(withCreateTime.reportCreatedAt).toBe('2026-06-10 14:02:10')

    const withoutDates = {
      readAnalysisField: methods.readAnalysisField,
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps,
      loadUrlEvidenceImages: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn()
    }
    methods.applyAnalysisData.call(withoutDates, {
      status: 'Completed',
      report: { evidence_flow: [] }
    })
    expect(withoutDates.reportCreatedAt).toBeInstanceOf(Date)
  })

  it('pollOnce swallows transient errors and keeps polling', async () => {
    getNotifiedEmailAiAnalysis.mockRejectedValueOnce(new Error('transient'))

    const ctx = {
      id: 'mail-1',
      pollStartedAt: Date.now(),
      stopPolling: jest.fn(),
      applyAnalysisData: jest.fn(),
      isTerminalStatus: methods.isTerminalStatus,
      $emit: jest.fn()
    }

    await methods.pollOnce.call(ctx)

    expect(ctx.stopPolling).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  it('color helpers cover additional branches', () => {
    expect(methods.getVerdictColor('Suspicious content')).toBe('status-warning')
    expect(methods.getVerdictColor('Unknown text')).toBe('status-none')
    expect(methods.getStatusColor('In Progress now')).toBe('status-in progress')
    expect(methods.getStatusColor('Pending review')).toBe('status-pending')
    expect(methods.getStatusColor('Queued')).toBe('status-queued')
    expect(methods.getConfidenceLevelColor('unknown')).toBe('status-pending')
  })

  it('getEvidenceFindingMeta fallback branches by title and default', () => {
    const ctx = { evidenceFindingMetaMap: {} }
    expect(methods.getEvidenceFindingMeta.call(ctx, { title: 'Risk evaluation' }).text).toBe('HIGH')
    expect(methods.getEvidenceFindingMeta.call(ctx, { title: 'Anything else' }).text).toBe('PASS')
  })

  it('default evidence helpers handle missing data and closed state', () => {
    expect(methods.getDefaultOpenEvidenceSteps.call({ report: null })).toEqual([])
    expect(methods.isEvidenceStepOpen.call({ openEvidenceSteps: [3] }, 1)).toBe(false)
  })

  it('confidence and summary fallbacks return defaults', () => {
    expect(computed.confidenceBasis.call({ report: null })).toBe(
      'Based on behavioral and contextual indicators.'
    )
    expect(computed.whyThisMatters.call({ report: null })).toBe('')
    expect(computed.formattedVerdict.call({ report: { executive_summary: { verdict: 'Benign' } } })).toBe(
      'Benign'
    )
  })
})
