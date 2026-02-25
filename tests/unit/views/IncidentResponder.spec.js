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
})
