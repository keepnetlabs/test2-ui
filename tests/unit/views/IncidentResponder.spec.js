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

    it('getAiVerdictColor maps verdict text to a semantic status color', () => {
      expect(methods.getAiVerdictColor('Benign')).toBeTruthy()
      expect(methods.getAiVerdictColor('No Threat Detected - Marketing Email')).toBeTruthy()
      expect(methods.getAiVerdictColor('Phishing')).toBeTruthy()
      expect(methods.getAiVerdictColor('Suspicious content')).toBeTruthy()
      // unknown verdict still resolves to a (none) color rather than throwing
      expect(() => methods.getAiVerdictColor('')).not.toThrow()
    })

    it('reportedEmailColumns drops the AI column until AI data is available', () => {
      const columns = [
        { property: 'result' },
        { property: 'aiAnalysis', isAiAnalysisColumn: true },
        { property: 'status' }
      ]

      const hidden = computed.reportedEmailColumns.call({
        aiAnalysisAvailable: false,
        emails: { columns }
      })
      expect(hidden.some((c) => c.isAiAnalysisColumn)).toBe(false)

      const shown = computed.reportedEmailColumns.call({
        aiAnalysisAvailable: true,
        emails: { columns }
      })
      expect(shown.some((c) => c.isAiAnalysisColumn)).toBe(true)
    })
  })
})
