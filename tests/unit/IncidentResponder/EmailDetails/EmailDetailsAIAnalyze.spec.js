jest.mock('@/utils/functions', () => ({
  getBtnPriorityColor: jest.fn(() => '#1976d2'),
  getBtnStatusColor: jest.fn((v) => `status-${v}`),
  getTimeZoneForMoment: jest.fn(() => 'YYYY/MM/DD HH:mm')
}))

jest.mock('axios', () => ({
  post: jest.fn()
}))

jest.mock('@/services/authentication', () => ({
  getToken: jest.fn(() => 'token-1')
}))

import EmailDetailsAIAnalyze from '@/components/IncidentResponder/EmailDetails/EmailDetailsAIAnalyze.vue'
import axios from 'axios'
import { getBtnPriorityColor, getBtnStatusColor } from '@/utils/functions'

describe('EmailDetailsAIAnalyze.vue', () => {
  const { computed, methods, watch } = EmailDetailsAIAnalyze

  beforeEach(() => {
    jest.clearAllMocks()
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

  it('fetchReport sets report and default open evidence step on success', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        report: {
          evidence_flow: [{ step: 3 }]
        }
      }
    })

    const emit = jest.fn()
    const ctx = {
      id: 'mail-1',
      isLoadingReport: false,
      loadError: 'old',
      reportCreatedAt: null,
      isMetadataExpanded: false,
      isAgentDeterminationExpanded: true,
      openEvidenceSteps: [99],
      report: null,
      $emit: emit,
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps
    }

    await methods.fetchReport.call(ctx)

    expect(ctx.report).toEqual({ evidence_flow: [{ step: 3 }] })
    expect(ctx.openEvidenceSteps).toEqual([3])
    expect(ctx.loadError).toBe('')
    expect(ctx.isLoadingReport).toBe(false)
    expect(emit).toHaveBeenCalledWith('update:loading', true)
    expect(emit).toHaveBeenCalledWith('update:loading', false)
  })

  it('fetchReport handles failure path', async () => {
    axios.post.mockRejectedValueOnce(new Error('failed'))

    const ctx = {
      id: 'mail-2',
      isLoadingReport: false,
      loadError: '',
      report: { old: true },
      reportCreatedAt: null,
      isMetadataExpanded: true,
      isAgentDeterminationExpanded: false,
      openEvidenceSteps: [],
      $emit: jest.fn(),
      getDefaultOpenEvidenceSteps: methods.getDefaultOpenEvidenceSteps
    }

    await methods.fetchReport.call(ctx)

    expect(ctx.loadError).toBe('Unable to load AI analysis report at this time.')
    expect(ctx.report).toBe(null)
    expect(ctx.isLoadingReport).toBe(false)
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
