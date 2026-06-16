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
import { getBtnPriorityColor, getBtnStatusColor } from '@/utils/functions'

describe('EmailDetailsAIAnalyze.vue', () => {
  const { computed, methods, watch } = EmailDetailsAIAnalyze
  let consoleErrorSpy

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore()
    }
  })

  it('confidenceLevel resolves from evidence strength, confidence level and confidence value', () => {
    expect(
      computed.confidenceLevel.call({
        report: { executive_summary: { evidence_strength: 'High' } }
      })
    ).toBe('High')
    expect(
      computed.confidenceLevel.call({
        report: { executive_summary: { confidence_level: 'Moderate' } }
      })
    ).toBe('Moderate')
    expect(
      computed.confidenceLevel.call({
        report: { executive_summary: { confidence: 0.85 } }
      })
    ).toBe('Strong')
    expect(
      computed.confidenceLevel.call({
        report: { executive_summary: { confidence: 0.55 } }
      })
    ).toBe('Moderate')
    expect(
      computed.confidenceLevel.call({
        report: { executive_summary: { confidence: 0.2 } }
      })
    ).toBe('Limited')
  })

  it('formats verdict and computes action groups', () => {
    expect(
      computed.formattedVerdict.call({
        report: { executive_summary: { verdict: 'Confirmed Phishing Attack' } }
      })
    ).toBe('High-Risk Phishing')

    const legacyGroups = computed.actionGroups.call({
      report: { actions_recommended: ['Action 1', 'Action 2'] }
    })
    expect(legacyGroups[0].key).toBe('legacy')
    expect(legacyGroups[0].items).toHaveLength(2)

    const grouped = computed.actionGroups.call({
      report: {
        actions_recommended: {
          p1_immediate: ['Block sender'],
          p2_follow_up: [],
          p3_hardening: ['Enable SPF checks']
        }
      }
    })
    expect(grouped.map((g) => g.key)).toEqual(['p1', 'p3'])
  })

  it('analysisFailed reflects the analysis status', () => {
    expect(computed.analysisFailed.call({ analysisStatus: 'Failed' })).toBe(true)
    expect(computed.analysisFailed.call({ analysisStatus: 'failed' })).toBe(true)
    expect(computed.analysisFailed.call({ analysisStatus: 'Completed' })).toBe(false)
    expect(computed.analysisFailed.call({ analysisStatus: '' })).toBe(false)
  })

  it('returns evidence meta from map, unknown labels and fallback titles', () => {
    const ctx = {
      evidenceFindingMetaMap: {
        PASS: { text: 'PASS', tone: 'pass', icon: 'mdi-check-circle' }
      }
    }

    expect(methods.getEvidenceFindingMeta.call(ctx, { finding_label: 'pass' })).toEqual({
      text: 'PASS',
      tone: 'pass',
      icon: 'mdi-check-circle'
    })
    expect(methods.getEvidenceFindingMeta.call(ctx, { finding_label: 'Custom Label' })).toEqual({
      text: 'Custom Label',
      tone: 'flag',
      icon: 'mdi-information'
    })
    expect(methods.getEvidenceFindingMeta.call(ctx, { title: 'Final verdict' }).text).toBe(
      'Phishing'
    )
  })

  it('toggles evidence step and section states', () => {
    const ctx = {
      openEvidenceSteps: [1],
      isMetadataExpanded: true,
      isAgentDeterminationExpanded: false,
      showAllObservedIndicators: false,
      showAllNotObservedIndicators: false,
      isEvidenceStepOpen: methods.isEvidenceStepOpen
    }

    methods.toggleEvidenceStep.call(ctx, 1)
    expect(ctx.openEvidenceSteps).toEqual([])
    methods.toggleEvidenceStep.call(ctx, 2)
    expect(ctx.openEvidenceSteps).toEqual([2])

    methods.toggleMetadata.call(ctx)
    methods.toggleAgentDetermination.call(ctx)
    methods.toggleObservedIndicators.call(ctx)
    methods.toggleNotObservedIndicators.call(ctx)

    expect(ctx.isMetadataExpanded).toBe(false)
    expect(ctx.isAgentDeterminationExpanded).toBe(true)
    expect(ctx.showAllObservedIndicators).toBe(true)
    expect(ctx.showAllNotObservedIndicators).toBe(true)
  })

  it('readAnalysisField reads camelCase first then PascalCase fallback', () => {
    expect(methods.readAnalysisField(null, 'status')).toBeUndefined()
    expect(methods.readAnalysisField({ status: 'Running' }, 'status')).toBe('Running')
    expect(methods.readAnalysisField({ Status: 'Running' }, 'status')).toBe('Running')
    expect(
      methods.readAnalysisField({ failureReason: 'boom' }, 'failureReason')
    ).toBe('boom')
  })

  it('applyAnalysisData populates report on Completed status', () => {
    const ctx = {
      readAnalysisField: methods.readAnalysisField,
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps,
      loadUrlEvidenceImages: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn()
    }

    const status = methods.applyAnalysisData.call(ctx, {
      status: 'Completed',
      report: { evidence_flow: [{ step: 2 }] },
      finishedDate: '2026-06-10 14:02:48'
    })

    expect(status).toBe('completed')
    expect(ctx.analysisStatus).toBe('Completed')
    expect(ctx.report).toEqual({ evidence_flow: [{ step: 2 }] })
    expect(ctx.openEvidenceSteps).toEqual([2])
    expect(ctx.reportCreatedAt).toBe('2026-06-10 14:02:48')
    expect(ctx.failureReason).toBe('')
    expect(ctx.loadUrlEvidenceImages).toHaveBeenCalled()
  })

  it('applyAnalysisData stores failure reason on Failed status (PascalCase envelope)', () => {
    const ctx = {
      readAnalysisField: methods.readAnalysisField,
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps,
      loadUrlEvidenceImages: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn()
    }

    const status = methods.applyAnalysisData.call(ctx, {
      Status: 'Failed',
      FailureReason: 'Agent response did not contain a report.'
    })

    expect(status).toBe('failed')
    expect(ctx.report).toBe(null)
    expect(ctx.failureReason).toBe('Agent response did not contain a report.')
    expect(ctx.revokeUrlEvidenceImageUrls).toHaveBeenCalled()
  })

  it('applyAnalysisData defaults to NotAnalyzed on empty data and leaves report untouched', () => {
    const ctx = {
      report: null,
      readAnalysisField: methods.readAnalysisField,
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps,
      loadUrlEvidenceImages: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn()
    }

    expect(methods.applyAnalysisData.call(ctx, {})).toBe('notanalyzed')
    expect(ctx.analysisStatus).toBe('NotAnalyzed')
    expect(ctx.loadUrlEvidenceImages).not.toHaveBeenCalled()
  })

  it('isTerminalStatus only treats completed/failed as terminal', () => {
    expect(methods.isTerminalStatus('completed')).toBe(true)
    expect(methods.isTerminalStatus('Failed')).toBe(true)
    expect(methods.isTerminalStatus('pending')).toBe(false)
    expect(methods.isTerminalStatus('running')).toBe(false)
    expect(methods.isTerminalStatus('')).toBe(false)
  })

  it('shouldPoll only treats pending/running as pollable', () => {
    expect(methods.shouldPoll('pending')).toBe(true)
    expect(methods.shouldPoll('Running')).toBe(true)
    expect(methods.shouldPoll('completed')).toBe(false)
    expect(methods.shouldPoll('failed')).toBe(false)
    expect(methods.shouldPoll('notanalyzed')).toBe(false)
    expect(methods.shouldPoll('')).toBe(false)
  })

  it('fetchReport reads latest analysis and does not poll when completed', async () => {
    getNotifiedEmailAiAnalysis.mockResolvedValueOnce({
      data: { data: { status: 'Completed' } }
    })

    const emit = jest.fn()
    const ctx = {
      id: 'mail-1',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(() => 'completed'),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(),
      $emit: emit
    }

    await methods.fetchReport.call(ctx)

    expect(ctx.stopPolling).toHaveBeenCalled()
    expect(getNotifiedEmailAiAnalysis).toHaveBeenCalledWith('mail-1')
    expect(ctx.applyAnalysisData).toHaveBeenCalledWith({ status: 'Completed' })
    expect(ctx.startPolling).not.toHaveBeenCalled()
    expect(ctx.isLoadingReport).toBe(false)
    expect(emit).toHaveBeenCalledWith('update:loading', false)
  })

  it('fetchReport starts polling and keeps the loader on while running', async () => {
    getNotifiedEmailAiAnalysis.mockResolvedValueOnce({
      data: { data: { status: 'Running' } }
    })

    const emit = jest.fn()
    const ctx = {
      id: 'mail-1',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(() => 'running'),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(function () {
        this.pollTimer = 123
      }),
      $emit: emit
    }

    await methods.fetchReport.call(ctx)

    expect(ctx.startPolling).toHaveBeenCalled()
    // finally guard must not reset loading while a poll timer is active
    expect(ctx.isLoadingReport).toBe(true)
  })

  it('fetchReport surfaces an error and skips polling when the response is empty (swallowed 503/cancel)', async () => {
    getNotifiedEmailAiAnalysis.mockResolvedValueOnce({})

    const ctx = {
      id: 'mail-1',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(),
      $emit: jest.fn()
    }

    await methods.fetchReport.call(ctx)

    expect(ctx.applyAnalysisData).not.toHaveBeenCalled()
    expect(ctx.startPolling).not.toHaveBeenCalled()
    expect(ctx.loadError).toBe('Unable to load AI analysis report at this time.')
    expect(ctx.isLoadingReport).toBe(false)
  })

  it('fetchReport handles failure path', async () => {
    getNotifiedEmailAiAnalysis.mockRejectedValueOnce(new Error('failed'))

    const ctx = {
      id: 'mail-2',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(),
      report: { old: true },
      $emit: jest.fn()
    }

    await methods.fetchReport.call(ctx)

    expect(ctx.loadError).toBe('Unable to load AI analysis report at this time.')
    expect(ctx.report).toBe(null)
    expect(ctx.isLoadingReport).toBe(false)
  })

  it('fetchReport returns early when id is missing', async () => {
    const ctx = { id: '', stopPolling: jest.fn() }
    await methods.fetchReport.call(ctx)
    expect(getNotifiedEmailAiAnalysis).not.toHaveBeenCalled()
  })

  it('runAnalysis triggers re-analyze and polls for non-terminal status', async () => {
    reAnalyzeNotifiedEmailAiAnalysis.mockResolvedValueOnce({
      data: { data: { status: 'Pending' } }
    })

    const emit = jest.fn()
    const ctx = {
      id: 'mail-9',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(() => 'pending'),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(function () {
        this.pollTimer = 5
      }),
      $emit: emit
    }

    await methods.runAnalysis.call(ctx)

    expect(reAnalyzeNotifiedEmailAiAnalysis).toHaveBeenCalledWith('mail-9')
    expect(ctx.startPolling).toHaveBeenCalled()
    expect(ctx.isRunningAnalysis).toBe(false)
  })

  it('runAnalysis does not poll when re-analyze immediately returns a terminal status', async () => {
    reAnalyzeNotifiedEmailAiAnalysis.mockResolvedValueOnce({
      data: { data: { status: 'Completed' } }
    })

    const ctx = {
      id: 'mail-9',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(() => 'completed'),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(),
      $emit: jest.fn()
    }

    await methods.runAnalysis.call(ctx)

    expect(ctx.startPolling).not.toHaveBeenCalled()
    expect(ctx.isLoadingReport).toBe(false)
  })

  it('runAnalysis surfaces an error and skips polling when re-analyze response is empty', async () => {
    reAnalyzeNotifiedEmailAiAnalysis.mockResolvedValueOnce({})

    const ctx = {
      id: 'mail-9',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(),
      $emit: jest.fn()
    }

    await methods.runAnalysis.call(ctx)

    expect(ctx.applyAnalysisData).not.toHaveBeenCalled()
    expect(ctx.startPolling).not.toHaveBeenCalled()
    expect(ctx.loadError).toBe('Unable to run AI analysis at this time.')
    expect(ctx.isRunningAnalysis).toBe(false)
    expect(ctx.isLoadingReport).toBe(false)
  })

  it('runAnalysis handles failure path and resets loading flags', async () => {
    reAnalyzeNotifiedEmailAiAnalysis.mockRejectedValueOnce(new Error('fail'))

    const emit = jest.fn()
    const ctx = {
      id: 'mail-9',
      pollTimer: null,
      stopPolling: jest.fn(),
      revokeUrlEvidenceImageUrls: jest.fn(),
      applyAnalysisData: jest.fn(),
      shouldPoll: methods.shouldPoll,
      startPolling: jest.fn(),
      report: { old: true },
      $emit: emit
    }

    await methods.runAnalysis.call(ctx)

    expect(ctx.loadError).toBe('Unable to run AI analysis at this time.')
    expect(ctx.report).toBe(null)
    expect(ctx.isRunningAnalysis).toBe(false)
    expect(ctx.isLoadingReport).toBe(false)
  })

  it('pollOnce stops polling and clears loader on a terminal status', async () => {
    getNotifiedEmailAiAnalysis.mockResolvedValueOnce({
      data: { data: { status: 'Completed' } }
    })

    const emit = jest.fn()
    const ctx = {
      id: 'mail-1',
      pollStartedAt: Date.now(),
      isPollInFlight: false,
      stopPolling: jest.fn(),
      applyAnalysisData: jest.fn(() => 'completed'),
      isTerminalStatus: methods.isTerminalStatus,
      $emit: emit
    }

    await methods.pollOnce.call(ctx)

    expect(ctx.stopPolling).toHaveBeenCalled()
    expect(ctx.isLoadingReport).toBe(false)
    expect(ctx.isPollInFlight).toBe(false)
    expect(emit).toHaveBeenCalledWith('update:loading', false)
  })

  it('pollOnce keeps polling while the status is non-terminal', async () => {
    getNotifiedEmailAiAnalysis.mockResolvedValueOnce({
      data: { data: { status: 'Running' } }
    })

    const ctx = {
      id: 'mail-1',
      pollStartedAt: Date.now(),
      isPollInFlight: false,
      stopPolling: jest.fn(),
      applyAnalysisData: jest.fn(() => 'running'),
      isTerminalStatus: methods.isTerminalStatus,
      $emit: jest.fn()
    }

    await methods.pollOnce.call(ctx)

    expect(ctx.stopPolling).not.toHaveBeenCalled()
    expect(ctx.isPollInFlight).toBe(false)
  })

  it('pollOnce ignores an empty response and keeps polling', async () => {
    getNotifiedEmailAiAnalysis.mockResolvedValueOnce({})

    const ctx = {
      id: 'mail-1',
      pollStartedAt: Date.now(),
      isPollInFlight: false,
      stopPolling: jest.fn(),
      applyAnalysisData: jest.fn(),
      isTerminalStatus: methods.isTerminalStatus,
      $emit: jest.fn()
    }

    await methods.pollOnce.call(ctx)

    expect(ctx.applyAnalysisData).not.toHaveBeenCalled()
    expect(ctx.stopPolling).not.toHaveBeenCalled()
    expect(ctx.isPollInFlight).toBe(false)
  })

  it('pollOnce skips overlapping calls while a request is already in flight', async () => {
    const ctx = {
      id: 'mail-1',
      pollStartedAt: Date.now(),
      isPollInFlight: true,
      stopPolling: jest.fn(),
      applyAnalysisData: jest.fn(),
      isTerminalStatus: methods.isTerminalStatus,
      $emit: jest.fn()
    }

    await methods.pollOnce.call(ctx)

    expect(getNotifiedEmailAiAnalysis).not.toHaveBeenCalled()
    expect(ctx.applyAnalysisData).not.toHaveBeenCalled()
  })

  it('pollOnce times out and surfaces a message when no report arrived', async () => {
    const emit = jest.fn()
    const ctx = {
      id: 'mail-1',
      pollStartedAt: 0,
      isPollInFlight: false,
      report: null,
      stopPolling: jest.fn(),
      applyAnalysisData: jest.fn(),
      isTerminalStatus: methods.isTerminalStatus,
      $emit: emit
    }

    await methods.pollOnce.call(ctx)

    expect(getNotifiedEmailAiAnalysis).not.toHaveBeenCalled()
    expect(ctx.stopPolling).toHaveBeenCalled()
    expect(ctx.isLoadingReport).toBe(false)
    expect(ctx.loadError).toContain('taking longer than expected')
  })

  it('pollOnce stops immediately when id is missing', async () => {
    const ctx = { id: '', stopPolling: jest.fn() }
    await methods.pollOnce.call(ctx)
    expect(ctx.stopPolling).toHaveBeenCalled()
    expect(getNotifiedEmailAiAnalysis).not.toHaveBeenCalled()
  })

  it('startPolling schedules pollOnce and stopPolling clears the timer', () => {
    jest.useFakeTimers()
    try {
      const pollOnce = jest.fn()
      const ctx = {
        pollTimer: null,
        isPollInFlight: true,
        stopPolling: methods.stopPolling,
        pollOnce,
        $emit: jest.fn()
      }

      methods.startPolling.call(ctx)
      expect(ctx.pollTimer).not.toBeNull()
      expect(ctx.isPollInFlight).toBe(false)
      expect(ctx.isLoadingReport).toBe(true)

      jest.advanceTimersByTime(4000)
      expect(pollOnce).toHaveBeenCalledTimes(1)

      methods.stopPolling.call(ctx)
      expect(ctx.pollTimer).toBeNull()

      jest.advanceTimersByTime(8000)
      expect(pollOnce).toHaveBeenCalledTimes(1)
    } finally {
      jest.useRealTimers()
    }
  })

  it('color helper methods use status/priority helpers', () => {
    expect(methods.getConfidenceLevelColor('high')).toBe('status-complete')
    expect(methods.getConfidenceLevelColor('moderate')).toBe('status-warning')
    expect(methods.getConfidenceLevelColor('low')).toBe('status-pending')
    expect(methods.getRiskColor('Critical')).toBe('#1976d2')
    expect(methods.getVerdictColor('No Threat Detected')).toBe('status-nonmalicious')
    expect(methods.getStatusColor('Analysis Complete')).toBe('status-complete')
    expect(getBtnPriorityColor).toHaveBeenCalled()
    expect(getBtnStatusColor).toHaveBeenCalled()
  })

  it('id watcher triggers fetchReport only when value changes and truthy', () => {
    const fetchReport = jest.fn()
    const ctx = { fetchReport }

    watch.id.call(ctx, 'new-id', 'old-id')
    watch.id.call(ctx, '', 'old-id')
    watch.id.call(ctx, 'same-id', 'same-id')

    expect(fetchReport).toHaveBeenCalledTimes(1)
  })
})
