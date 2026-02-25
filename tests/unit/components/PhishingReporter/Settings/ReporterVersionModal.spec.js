import ReporterVersionModal from '@/components/PhishingReporter/Settings/ReporterVersionModal.vue'

describe('ReporterVersionModal.vue', () => {
  it('getTitle returns Phishing Reporter Version when not diagnostic', () => {
    const ctx = {
      selectedVersionRow: { version: '1.0', applicationType: 'PhishingReporter' },
      isDiagnostic: false
    }
    expect(ReporterVersionModal.computed.getTitle.call(ctx)).toContain('Phishing Reporter Version')
    expect(ReporterVersionModal.computed.getTitle.call(ctx)).toContain('1.0')
  })

  it('isDiagnostic returns true when applicationType is DiagnosticTool', () => {
    const ctx = { selectedVersionRow: { applicationType: 'DiagnosticTool' } }
    expect(ReporterVersionModal.computed.isDiagnostic.call(ctx)).toBe(true)
  })

  it('isDiagnostic returns false when applicationType is not DiagnosticTool', () => {
    const ctx = { selectedVersionRow: { applicationType: 'PhishingReporter' } }
    expect(ReporterVersionModal.computed.isDiagnostic.call(ctx)).toBe(false)
  })
})
