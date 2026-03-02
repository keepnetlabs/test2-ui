import ReporterVersionModal from '@/components/PhishingReporter/Settings/ReporterVersionModal.vue'

describe('ReporterVersionModal.vue (extra coverage)', () => {
  describe('getTitle', () => {
    it('returns Diagnostic Tool Version when applicationType is DiagnosticTool', () => {
      const ctx = {
        selectedVersionRow: { version: '2.0', applicationType: 'DiagnosticTool' },
        isDiagnostic: true
      }
      expect(ReporterVersionModal.computed.getTitle.call(ctx)).toContain('Diagnostic Tool Version')
      expect(ReporterVersionModal.computed.getTitle.call(ctx)).toContain('2.0')
    })

    it('returns Phishing Reporter Version when applicationType is PhishingReporter', () => {
      const ctx = {
        selectedVersionRow: { version: '1.5', applicationType: 'PhishingReporter' },
        isDiagnostic: false
      }
      expect(ReporterVersionModal.computed.getTitle.call(ctx)).toContain('Phishing Reporter Version')
      expect(ReporterVersionModal.computed.getTitle.call(ctx)).toContain('1.5')
    })
  })

  describe('isDiagnostic', () => {
    it('returns true for DiagnosticTool', () => {
      const ctx = { selectedVersionRow: { applicationType: 'DiagnosticTool' } }
      expect(ReporterVersionModal.computed.isDiagnostic.call(ctx)).toBe(true)
    })

    it('returns false for other types', () => {
      const ctx = { selectedVersionRow: { applicationType: 'PhishingReporter' } }
      expect(ReporterVersionModal.computed.isDiagnostic.call(ctx)).toBe(false)
    })

  })

  describe('created', () => {
    it('maps formData from argument with DialogBoxSettings', () => {
      const ctx = {
        selectedVersionRow: {
          argument: JSON.stringify({
            AddInName: 'Test',
            CompanyId: 'company-1',
            DialogBoxSettings: [
              { LanguageName: 'en-GB', MsgBoxTitle: 'Title' }
            ]
            })
        },
        formData: null
      }
      ReporterVersionModal.created.call(ctx)
      expect(ctx.formData).toBeDefined()
      expect(ctx.formData.addInName).toBe('Test')
      expect(ctx.formData.companyKey).toBe('company-1')
      expect(ctx.formData.dialogBoxSettings).toHaveLength(1)
      expect(ctx.formData.dialogBoxSettings[0].languageName).toBe('en-GB')
      expect(ctx.formData.dialogBoxSettings[0].msgBoxTitle).toBe('Title')
    })

    it('maps isDefaultProxy to isEnableProxy', () => {
      const ctx = {
        selectedVersionRow: {
          argument: JSON.stringify({ IsDefaultProxy: true })
        },
        formData: null
      }
      ReporterVersionModal.created.call(ctx)
      expect(ctx.formData.isEnableProxy).toBe(true)
    })

    it('maps EmailFormatErrorMessage to badFormatEmailMessage', () => {
      const ctx = {
        selectedVersionRow: {
          argument: JSON.stringify({ EmailFormatErrorMessage: 'Invalid format' })
        },
        formData: null
      }
      ReporterVersionModal.created.call(ctx)
      expect(ctx.formData.badFormatEmailMessage).toBe('Invalid format')
    })
  })
})
