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

    it('discards a stale response when state was reset before it resolved', async () => {
      let resolveStale
      getPiiResidencyReport.mockImplementationOnce(
        () => new Promise((resolve) => (resolveStale = resolve))
      )
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      // Simulate the user closing the drawer before the response arrives.
      wrapper.vm.resetState()
      // The stale request now resolves — it must NOT repopulate state.
      resolveStale({ data: { data: SAMPLE_REPORT } })
      await flushPromises()
      expect(wrapper.vm.report).toBeNull()
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.errorMessage).toBe('')
    })

    it('discards a stale failure when state was reset before it rejected', async () => {
      let rejectStale
      getPiiResidencyReport.mockImplementationOnce(
        () => new Promise((_resolve, reject) => (rejectStale = reject))
      )
      const wrapper = createWrapper()
      wrapper.vm.fetchReport()
      wrapper.vm.resetState()
      rejectStale({ response: { data: { message: 'Server error' } } })
      await flushPromises()
      expect(wrapper.vm.errorMessage).toBe('')
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

  describe('headerSubtitle', () => {
    it('joins companyName and expectedRegion with a separator when both exist', () => {
      const wrapper = createWrapper({ companyName: 'Acme' })
      wrapper.vm.report = { expectedRegion: 'canadacentral' }
      expect(wrapper.vm.headerSubtitle).toBe('Acme · canadacentral')
    })

    it('returns companyName when expectedRegion is missing', () => {
      const wrapper = createWrapper({ companyName: 'Acme' })
      wrapper.vm.report = null
      expect(wrapper.vm.headerSubtitle).toBe('Acme')
    })

    it('returns expectedRegion when companyName is missing', () => {
      const wrapper = createWrapper({ companyName: '' })
      wrapper.vm.report = { expectedRegion: 'canadacentral' }
      expect(wrapper.vm.headerSubtitle).toBe('canadacentral')
    })

    it('returns empty string when both companyName and expectedRegion are missing', () => {
      const wrapper = createWrapper({ companyName: '' })
      wrapper.vm.report = {}
      expect(wrapper.vm.headerSubtitle).toBe('')
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

    it('returns "regionless" for REGIONLESS verdict (informational, not failure)', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'REGIONLESS' }
      expect(wrapper.vm.verdictTone).toBe('regionless')
    })

    it('returns "fail" when verdict is missing or unknown', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {}
      expect(wrapper.vm.verdictTone).toBe('fail')
    })

    it('is case-insensitive', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'regionless' }
      expect(wrapper.vm.verdictTone).toBe('regionless')
    })
  })

  describe('verdictAlert', () => {
    it('uses the green/check theme for PASS', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'PASS' }
      expect(wrapper.vm.verdictAlert).toEqual({
        bg: 'bg-green-light',
        color: '#43a047',
        icon: 'mdi-check-circle'
      })
    })

    it('uses the aqua/info theme for REGIONLESS (not an error)', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'REGIONLESS' }
      expect(wrapper.vm.verdictAlert).toEqual({
        bg: 'bg-aqua-light',
        color: '#2196f3',
        icon: 'mdi-information'
      })
    })

    it('uses the red/alert theme for FAIL or unknown verdicts', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'FAIL' }
      expect(wrapper.vm.verdictAlert).toEqual({
        bg: 'bg-red-light',
        color: '#f56c6c',
        icon: 'mdi-alert-circle'
      })
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

  describe('databaseChecks ordering', () => {
    it('puts expected-region first, then central, then other-region, then unknown', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {
        databaseChecks: [
          { databaseName: 'central', role: 'central' },
          { databaseName: 'eu-west', role: 'other-region' },
          { databaseName: 'canadacentral', role: 'expected-region' },
          { databaseName: 'mystery', role: 'unknown-role' }
        ]
      }
      expect(wrapper.vm.databaseChecks.map((db) => db.role)).toEqual([
        'expected-region',
        'central',
        'other-region',
        'unknown-role'
      ])
    })

    it('does not mutate the original report.databaseChecks array', () => {
      const wrapper = createWrapper()
      const original = [
        { databaseName: 'central', role: 'central' },
        { databaseName: 'canadacentral', role: 'expected-region' }
      ]
      wrapper.vm.report = { databaseChecks: original }
      wrapper.vm.databaseChecks
      expect(original.map((db) => db.role)).toEqual(['central', 'expected-region'])
    })
  })

  describe('arrays defaulting to empty', () => {
    it('returns empty arrays when report fields are missing or non-array', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {}
      expect(wrapper.vm.databaseChecks).toEqual([])
      expect(wrapper.vm.violations).toEqual([])
      expect(wrapper.vm.evidenceTrail).toEqual([])
      expect(wrapper.vm.piiFieldsConsidered).toEqual([])
    })

    it('returns null when audit metadata or conclusion is missing', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {}
      expect(wrapper.vm.auditMetadata).toBeNull()
      expect(wrapper.vm.auditConclusion).toBeNull()
    })
  })

  describe('piiFieldsConsidered', () => {
    it('returns the array of PII field names from validationLogic', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {
        validationLogic: {
          piiFieldsConsidered: ['Email', 'FirstName', 'LastName']
        }
      }
      expect(wrapper.vm.piiFieldsConsidered).toEqual(['Email', 'FirstName', 'LastName'])
    })

    it('returns an empty array when piiFieldsConsidered is missing or non-array', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { validationLogic: { piiFieldsConsidered: 'not-an-array' } }
      expect(wrapper.vm.piiFieldsConsidered).toEqual([])
    })
  })

  describe('overallPassCondition', () => {
    it('returns the compound pass condition from validationLogic', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = {
        validationLogic: { overallPassCondition: 'R1 AND R2 AND R3' }
      }
      expect(wrapper.vm.overallPassCondition).toBe('R1 AND R2 AND R3')
    })

    it('returns an empty string when missing', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { validationLogic: {} }
      expect(wrapper.vm.overallPassCondition).toBe('')
    })
  })

  describe('helpers', () => {
    let wrapper
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('humanizeRole maps known roles and passes others through', () => {
      expect(wrapper.vm.humanizeRole('central')).toBe('Central')
      expect(wrapper.vm.humanizeRole('expected-region')).toBe('Selected region')
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

  describe('latestMigration', () => {
    it('returns null when report has no latestMigration', () => {
      const wrapper = createWrapper()
      wrapper.vm.report = { verdict: 'PASS' }
      expect(wrapper.vm.latestMigration).toBeNull()
    })

    it('returns the latestMigration object when present', () => {
      const wrapper = createWrapper()
      const migration = { status: 2, statusName: 'Completed', toRegion: 'canadacentral' }
      wrapper.vm.report = { latestMigration: migration }
      expect(wrapper.vm.latestMigration).toEqual(migration)
    })
  })

  describe('migrationStatusMeta', () => {
    const metaFor = (status, statusName) => {
      const wrapper = createWrapper()
      wrapper.vm.report = { latestMigration: { status, statusName } }
      return wrapper.vm.migrationStatusMeta
    }

    it('maps Queued (0) to the grey/clock theme', () => {
      const meta = metaFor(0, 'Queued')
      expect(meta).toMatchObject({ variant: 'queued', icon: 'mdi-clock-outline', status: 0, label: 'Queued' })
    })

    it('maps InProgress (1) to the blue theme', () => {
      const meta = metaFor(1, 'InProgress')
      expect(meta).toMatchObject({ variant: 'in-progress', icon: 'mdi-progress-clock', status: 1 })
    })

    it('maps Completed (2) to the green/check theme', () => {
      const meta = metaFor(2, 'Completed')
      expect(meta).toMatchObject({ variant: 'completed', icon: 'mdi-check-circle', status: 2 })
    })

    it('maps Failed (3) to the red theme', () => {
      const meta = metaFor(3, 'Failed')
      expect(meta).toMatchObject({ variant: 'failed', icon: 'mdi-close-circle', status: 3 })
    })

    it('falls back to an unknown theme for unrecognized status', () => {
      const meta = metaFor(99, 'Weird')
      expect(meta).toMatchObject({ variant: 'unknown', icon: 'mdi-help-circle-outline' })
      expect(meta.label).toBe('Weird')
    })

    it('uses statusName for the label and defaults to "Unknown" when absent', () => {
      expect(metaFor(2, 'Completed').label).toBe('Completed')
      expect(metaFor(2, undefined).label).toBe('Unknown')
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
