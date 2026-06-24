import IncidentResponder from '@/views/IncidentResponder.vue'

describe('IncidentResponder.vue', () => {
  it('exports component options', () => {
    expect(IncidentResponder).toBeDefined()
    expect(IncidentResponder.computed).toBeDefined()
    expect(IncidentResponder.methods).toBeDefined()
  })

  it('computed title/icon and email template name', () => {
    expect(IncidentResponder.computed.getTitle.call({ selectedPlaybookId: null })).toBe('Create New Rule')
    expect(IncidentResponder.computed.getIconName.call({ selectedPlaybookId: null })).toBe('mdi-plus')

    const ctx = {
      isMultipleSelectedTemplateResourceId: false,
      selectedTemplateResourceId: 't1',
      emailTemplates: [{ resourceId: 't1', name: 'Template', isDefault: true }]
    }
    expect(IncidentResponder.computed.getEmailTemplateName.call(ctx)).toContain('Template')
  })

  it('handleFilterByHash opens modal or clears filters by state', () => {
    const clearFilterByHashProps = jest.fn()
    const ctx1 = {
      isParentTableHashFilterActive: false,
      isClusteredTableHashFilterActive: false,
      isFilterByHashModalVisible: false,
      clearFilterByHashProps
    }
    IncidentResponder.methods.handleFilterByHash.call(ctx1)
    expect(ctx1.isFilterByHashModalVisible).toBe(true)
    expect(clearFilterByHashProps).not.toHaveBeenCalled()

    const ctx2 = {
      isParentTableHashFilterActive: true,
      isClusteredTableHashFilterActive: false,
      isFilterByHashModalVisible: false,
      clearFilterByHashProps
    }
    IncidentResponder.methods.handleFilterByHash.call(ctx2)
    expect(clearFilterByHashProps).toHaveBeenCalled()
  })

  it('closeFilterByHashModal and toggleEmailTemplateModal change state', () => {
    const ctx = { isFilterByHashModalVisible: true, isShowEmailTemplateModal: false }
    IncidentResponder.methods.closeFilterByHashModal.call(ctx)
    expect(ctx.isFilterByHashModalVisible).toBe(false)
    IncidentResponder.methods.toggleEmailTemplateModal.call(ctx)
    expect(ctx.isShowEmailTemplateModal).toBe(true)
  })

  describe('AI Analysis column', () => {
    const { methods, computed } = IncidentResponder

    it('getRowAiVerdict reads verdict with aiVerdict fallback', () => {
      expect(methods.getRowAiVerdict({ verdict: 'Phishing' })).toBe('Phishing')
      expect(methods.getRowAiVerdict({ aiVerdict: 'Benign' })).toBe('Benign')
      expect(methods.getRowAiVerdict({})).toBe('')
      expect(methods.getRowAiVerdict(null)).toBe('')
    })

    it('getRowAiRiskLevel reads riskLevel with aiRiskLevel fallback', () => {
      expect(methods.getRowAiRiskLevel({ riskLevel: 'High' })).toBe('High')
      expect(methods.getRowAiRiskLevel({ aiRiskLevel: 'Low' })).toBe('Low')
      expect(methods.getRowAiRiskLevel({})).toBe('')
    })

    it('rowHasAiAnalysis is true only for non-empty verdict/risk level', () => {
      const ctx = {
        getRowAiVerdict: methods.getRowAiVerdict,
        getRowAiRiskLevel: methods.getRowAiRiskLevel
      }
      expect(methods.rowHasAiAnalysis.call(ctx, { verdict: 'Phishing' })).toBe(true)
      expect(methods.rowHasAiAnalysis.call(ctx, { riskLevel: 'High' })).toBe(true)
      expect(methods.rowHasAiAnalysis.call(ctx, { aiVerdict: 'Benign' })).toBe(true)
      // Backend sends empty strings (not null) for non-AI tenants -> must NOT
      // count as AI data, otherwise the AI columns show with empty cells.
      expect(methods.rowHasAiAnalysis.call(ctx, { verdict: '', riskLevel: '' })).toBe(false)
      expect(methods.rowHasAiAnalysis.call(ctx, {})).toBe(false)
      expect(methods.rowHasAiAnalysis.call(ctx, null)).toBe(false)
    })

    it('getAiVerdictColor maps verdict text to a semantic status color', () => {
      expect(methods.getAiVerdictColor('Benign')).toBeTruthy()
      expect(methods.getAiVerdictColor('No Threat Detected - Marketing Email')).toBeTruthy()
      expect(methods.getAiVerdictColor('Phishing')).toBeTruthy()
      expect(methods.getAiVerdictColor('Suspicious content')).toBeTruthy()
      // unknown verdict still resolves to a (none) color rather than throwing
      expect(() => methods.getAiVerdictColor('')).not.toThrow()
    })

    const aiColumns = () => [
      { property: 'result' },
      { property: 'aiAnalysis', isAiAnalysisColumn: true },
      { property: 'status' }
    ]

    it('reportedEmailColumns drops the AI columns when no license/case and no AI data', () => {
      const hidden = computed.reportedEmailColumns.call({
        showAIAnalyze: false,
        hasAgenticAIPermission: false,
        aiAnalysisAvailable: false,
        emails: { columns: aiColumns() }
      })
      expect(hidden.some((c) => c.isAiAnalysisColumn)).toBe(false)
    })

    it('reportedEmailColumns shows the AI columns when showAIAnalyze is true', () => {
      const shown = computed.reportedEmailColumns.call({
        showAIAnalyze: true,
        hasAgenticAIPermission: true,
        aiAnalysisAvailable: false,
        emails: { columns: aiColumns() }
      })
      expect(shown.some((c) => c.isAiAnalysisColumn)).toBe(true)
    })

    it('reportedEmailColumns shows the AI columns when permitted and backend returns AI data', () => {
      const shown = computed.reportedEmailColumns.call({
        showAIAnalyze: false,
        hasAgenticAIPermission: true,
        aiAnalysisAvailable: true,
        emails: { columns: aiColumns() }
      })
      expect(shown.some((c) => c.isAiAnalysisColumn)).toBe(true)
    })

    it('reportedEmailColumns hides the AI columns without permission even if backend returns AI data', () => {
      // Hard gate: stale AI data must never override a permission denial.
      const hidden = computed.reportedEmailColumns.call({
        showAIAnalyze: false,
        hasAgenticAIPermission: false,
        aiAnalysisAvailable: true,
        emails: { columns: aiColumns() }
      })
      expect(hidden.some((c) => c.isAiAnalysisColumn)).toBe(false)
    })
  })
})
