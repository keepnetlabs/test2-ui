import { shallowMount } from '@vue/test-utils'
import SovereigntyReportDrawer from '@/components/Companies/SovereigntyReportDrawer.vue'
import { getPiiResidencyReport } from '@/api/company'

jest.mock('@/api/company', () => ({
  getPiiResidencyReport: jest.fn()
}))

const SAMPLE_REPORT = {
  companyResourceId: 'D90mpNWdGSZx',
  expectedRegion: 'canadacentral',
  verdict: 'PASS',
  conclusion: 'All good.',
  databaseChecks: [
    {
      databaseName: 'central',
      role: 'central',
      region: 'central',
      totalRowCount: 0,
      piiPopulatedRowCount: 0,
      piiEmptyRowCount: 0,
      status: 'checked'
    }
  ],
  violations: [],
  evidenceTrail: [
    { step: 1, action: 'A', ruleEvaluated: 'R1', ruleOutcome: 'PASS' },
    { step: 2, action: 'B', ruleEvaluated: 'R2', ruleOutcome: 'PASS' }
  ],
  validationLogic: {
    rules: [
      { ruleId: 'R1', description: 'Rule 1', passCondition: 'cond1' },
      { ruleId: 'R2', description: 'Rule 2', passCondition: 'cond2' },
      { ruleId: 'R3', description: 'Rule 3', passCondition: 'cond3' }
    ]
  },
  auditMetadata: { reportId: 'r-1', generatedBy: 'gurkan', environment: 'TEST' },
  auditConclusion: { verdict: 'PASS', statement: 'Signed off.', signedBy: 'gurkan' }
}

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SovereigntyReportDrawer.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SovereigntyReportDrawer, {
      propsData: {
        status: false,
        companyResourceId: 'company-1',
        companyName: 'Acme',
        ...propsData
      },
      stubs: {
        AlertBox: true,
        VNavigationDrawer: true,
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VListItemSubtitle: true,
        VIcon: true,
        VSkeletonLoader: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getPiiResidencyReport.mockResolvedValue({ data: { data: SAMPLE_REPORT } })
  })

  describe('fetchReport', () => {
    it('skips when companyResourceId is empty', async () => {
      const wrapper = createWrapper({ companyResourceId: '' })
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(getPiiResidencyReport).not.toHaveBeenCalled()
    })

    it('calls API with companyResourceId and loading: false', async () => {
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(getPiiResidencyReport).toHaveBeenCalledWith('company-1', { loading: false })
    })

    it('stores response.data.data on success', async () => {
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(wrapper.vm.report).toEqual(SAMPLE_REPORT)
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.errorMessage).toBe('')
    })

    it('handles missing response data defensively', async () => {
      getPiiResidencyReport.mockResolvedValueOnce({})
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(wrapper.vm.report).toBeNull()
    })

    it('sets loading to true while pending and false after settle', async () => {
      let resolveCall
      getPiiResidencyReport.mockImplementationOnce(
        () => new Promise((resolve) => (resolveCall = resolve))
      )
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      expect(wrapper.vm.loading).toBe(true)
      resolveCall({ data: { data: SAMPLE_REPORT } })
      await flushPromises()
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('error handling', () => {
    it('uses validationMessages[0] when present', async () => {
      getPiiResidencyReport.mockRejectedValueOnce({
        response: { data: { validationMessages: ['Custom validation msg'] } }
      })
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(wrapper.vm.errorMessage).toBe('Custom validation msg')
    })

    it('falls back to response.data.message', async () => {
      getPiiResidencyReport.mockRejectedValueOnce({
        response: { data: { message: 'Server error' } }
      })
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(wrapper.vm.errorMessage).toBe('Server error')
    })

    it('falls back to a generic message when nothing is provided', async () => {
      getPiiResidencyReport.mockRejectedValueOnce({})
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(wrapper.vm.errorMessage).toBe('Failed to load report.')
    })

    it('clears loading after a failed request', async () => {
      getPiiResidencyReport.mockRejectedValueOnce(new Error('boom'))
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      await flushPromises()
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('verdictTone', () => {
    it('returns "pass" for PASS verdict', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'PASS' }
      expect(wrapper.vm.verdictTone).toBe('pass')
    })

    it('returns "fail" for FAIL verdict', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'FAIL' }
      expect(wrapper.vm.verdictTone).toBe('fail')
    })

    it('returns "fail" when verdict is missing or unknown', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {}
      expect(wrapper.vm.verdictTone).toBe('fail')
    })

    it('is case-insensitive', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'pass' }
      expect(wrapper.vm.verdictTone).toBe('pass')
    })
  })

  describe('ruleOutcomes & validationRules', () => {
    it('maps rule ids from evidenceTrail to outcomes', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = SAMPLE_REPORT
      expect(wrapper.vm.ruleOutcomes).toEqual({ R1: 'PASS', R2: 'PASS' })
    })

    it('annotates validation rules with their outcomes', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = SAMPLE_REPORT
      expect(wrapper.vm.validationRules).toEqual([
        { ruleId: 'R1', description: 'Rule 1', passCondition: 'cond1', outcome: 'PASS' },
        { ruleId: 'R2', description: 'Rule 2', passCondition: 'cond2', outcome: 'PASS' },
        { ruleId: 'R3', description: 'Rule 3', passCondition: 'cond3', outcome: undefined }
      ])
    })

    it('returns empty list when validationLogic.rules is missing', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'PASS' }
      expect(wrapper.vm.validationRules).toEqual([])
    })
  })

  describe('arrays defaulting to empty', () => {
    it('returns empty arrays when report fields are missing or non-array', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {}
      expect(wrapper.vm.databaseChecks).toEqual([])
      expect(wrapper.vm.violations).toEqual([])
      expect(wrapper.vm.evidenceTrail).toEqual([])
    })

    it('returns null when audit metadata or conclusion is missing', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {}
      expect(wrapper.vm.auditMetadata).toBeNull()
      expect(wrapper.vm.auditConclusion).toBeNull()
    })
  })

  describe('helpers', () => {
    let wrapper
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('humanizeRole maps known roles and passes others through', () => {
      expect(wrapper.vm.humanizeRole('central')).toBe('Central')
      expect(wrapper.vm.humanizeRole('expected-region')).toBe('Expected region')
      expect(wrapper.vm.humanizeRole('other-region')).toBe('Other region')
      expect(wrapper.vm.humanizeRole('something-else')).toBe('something-else')
      expect(wrapper.vm.humanizeRole('')).toBe('')
    })

    it('roleVariant returns expected/central/other variants', () => {
      expect(wrapper.vm.roleVariant('expected-region')).toBe('expected')
      expect(wrapper.vm.roleVariant('central')).toBe('central')
      expect(wrapper.vm.roleVariant('other-region')).toBe('other')
      expect(wrapper.vm.roleVariant(undefined)).toBe('other')
    })

    it('formatNumber locales finite numbers and falls back for others', () => {
      expect(wrapper.vm.formatNumber(1234567)).toBe('1,234,567')
      expect(wrapper.vm.formatNumber(0)).toBe('0')
      expect(wrapper.vm.formatNumber('42')).toBe('42')
      expect(wrapper.vm.formatNumber(NaN)).toBe('-')
      expect(wrapper.vm.formatNumber(undefined)).toBe('-')
    })

    it('formatJson returns pretty-printed JSON for objects', () => {
      expect(wrapper.vm.formatJson({ a: 1 })).toContain('"a": 1')
    })

    it('formatJson safely stringifies non-serializable values', () => {
      const circular = {}
      circular.self = circular
      expect(typeof wrapper.vm.formatJson(circular)).toBe('string')
    })
  })

  describe('resetState', () => {
    it('clears all state fields', () => {
      const wrapper = createWrapper()
      wrapper.vm.loading = true
      wrapper.vm.report = SAMPLE_REPORT
      wrapper.vm.errorMessage = 'oops'
      wrapper.vm.resetState()
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.report).toBeNull()
      expect(wrapper.vm.errorMessage).toBe('')
    })
  })
})
