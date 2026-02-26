import IncidentResponder from '@/views/IncidentResponder.vue'

describe('IncidentResponder.vue (extra)', () => {
  const { computed, methods, watch } = IncidentResponder

  it('hash filter computed flags detect MD5/SHA512 in payloads', () => {
    expect(
      computed.isParentTableHashFilterActive.call({
        requestBodyReportedEmails: {
          filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'MD5' }] }] }
        }
      })
    ).toBe(true)

    expect(
      computed.isClusteredTableHashFilterActive.call({
        clusteredTableAxios: {
          filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'subject' }] }] }
        }
      })
    ).toBe(false)
  })

  it('reported email title/description branch by clustered table status', () => {
    const clusteredCtx = {
      isShowingClusteredTable: true,
      clusteredRow: { subject: 'Suspicious Mail' },
      selectedCluster: 'Subject',
      getClusteredField: () => 'subject'
    }
    expect(computed.getReportedEmailTitle.call(clusteredCtx)).toBe('Suspicious Mail')
    expect(computed.getReportedEmailDescription.call(clusteredCtx)).toBe(
      'Reported emails clustered by Subject'
    )

    const normalCtx = { isShowingClusteredTable: false }
    expect(computed.getReportedEmailTitle.call(normalCtx)).toBe('Reported Emails')
    expect(computed.getReportedEmailDescription.call(normalCtx)).toBe(
      'Summary of emails reported for analysis'
    )
  })

  it('title/icon and template name cover edit and multiple branches', () => {
    expect(computed.getTitle.call({ selectedPlaybookId: 'p1' })).toBe('Edit Rule')
    expect(computed.getIconName.call({ selectedPlaybookId: 'p1' })).toBe('mdi-pencil')

    expect(
      computed.getEmailTemplateName.call({
        isMultipleSelectedTemplateResourceId: true
      })
    ).toBe('(Multiple Values)')
  })

  it('watchers update addButton text and row action state', () => {
    const parentCtx = {
      emails: { addButton: { label: '', tooltip: '' } }
    }
    watch.isParentTableHashFilterActive.call(parentCtx, true)
    expect(parentCtx.emails.addButton.label).toContain('CLEAR FILTER')
    watch.isParentTableHashFilterActive.call(parentCtx, false)
    expect(parentCtx.emails.addButton.label).toContain('FILTER BY')

    const clusteredCtx = {
      clusteredTable: { addButton: { label: '', tooltip: '' } }
    }
    watch.isClusteredTableHashFilterActive.call(clusteredCtx, true)
    expect(clusteredCtx.clusteredTable.addButton.tooltip).toContain('CLEAR FILTER')
    watch.isClusteredTableHashFilterActive.call(clusteredCtx, false)
    expect(clusteredCtx.clusteredTable.addButton.tooltip).toContain('FILTER BY')

    const permissionCtx = {
      emails: { rowActions: [{}, {}, {}, {}, { disabled: true }] }
    }
    watch.getIncidentResponderNotifiedEmailReAnalyze.handler.call(permissionCtx, true)
    expect(permissionCtx.emails.rowActions[4].disabled).toBe(false)
  })

  it('clearFilterByHashProps clears clustered hash filter and refreshes clustered table', () => {
    const ctx = {
      hashfilterProps: { hash: 'abc' },
      defaultHashfilterProps: { hash: '' },
      isShowingClusteredTable: true,
      clusteredTableAxios: {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'MD5' }, { FieldName: 'subject' }] }]
        }
      },
      requestBodyReportedEmails: {
        filter: { FilterGroups: [{ FilterItems: [] }] }
      },
      callForClusteredTable: jest.fn(),
      callForSearchNotifiedMail: jest.fn()
    }

    methods.clearFilterByHashProps.call(ctx)

    expect(ctx.hashfilterProps).toEqual({ hash: '' })
    expect(ctx.clusteredTableAxios.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'subject' }
    ])
    expect(ctx.callForClusteredTable).toHaveBeenCalledTimes(1)
    expect(ctx.callForSearchNotifiedMail).not.toHaveBeenCalled()
  })

  it('confirmFilterByHash updates non-clustered payload and closes modal', () => {
    const closeFilterByHashModal = jest.fn()
    const ctx = {
      clusteredRow: null,
      hashfilterProps: { filterBy: 'SHA512', hash: 'xyz' },
      requestBodyReportedEmails: {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'MD5', Value: 'old', Operator: '!=' }] }]
        }
      },
      clusteredTableAxios: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      callForSearchNotifiedMail: jest.fn(),
      callForClusteredTable: jest.fn(),
      closeFilterByHashModal
    }

    methods.confirmFilterByHash.call(ctx)

    expect(ctx.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems[0]).toEqual({
      FieldName: 'SHA512',
      Value: 'xyz',
      Operator: '='
    })
    expect(ctx.callForSearchNotifiedMail).toHaveBeenCalledTimes(1)
    expect(closeFilterByHashModal).toHaveBeenCalledTimes(1)
  })

  it('handleOnExtendedViewStatusChange resets arrays only when status=false', () => {
    const ctx = {
      extendedViewValue: [1],
      waitingItemForApiItems: [2]
    }
    methods.handleOnExtendedViewStatusChange.call(ctx, false)
    expect(ctx.extendedViewValue).toEqual([])
    expect(ctx.waitingItemForApiItems).toEqual([])

    ctx.extendedViewValue = [3]
    ctx.waitingItemForApiItems = [4]
    methods.handleOnExtendedViewStatusChange.call(ctx, true)
    expect(ctx.extendedViewValue).toEqual([3])
    expect(ctx.waitingItemForApiItems).toEqual([4])
  })

  it('handleConfirmSelectedEmailTemplate sets id, clears multiple flag and toggles modal', () => {
    const toggleEmailTemplateModal = jest.fn()
    const ctx = {
      selectedTemplateResourceId: '',
      isMultipleSelectedTemplateResourceId: true,
      toggleEmailTemplateModal
    }

    methods.handleConfirmSelectedEmailTemplate.call(ctx, 'tpl-1')

    expect(ctx.selectedTemplateResourceId).toBe('tpl-1')
    expect(ctx.isMultipleSelectedTemplateResourceId).toBe(false)
    expect(toggleEmailTemplateModal).toHaveBeenCalledTimes(1)
  })

  it('clearFilterByHashProps clears parent hash filter and refreshes parent table', () => {
    const ctx = {
      hashfilterProps: { hash: 'abc' },
      defaultHashfilterProps: { hash: '' },
      isShowingClusteredTable: false,
      requestBodyReportedEmails: {
        filter: {
          FilterGroups: [{ FilterItems: [{ FieldName: 'SHA512' }, { FieldName: 'subject' }] }]
        }
      },
      clusteredTableAxios: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      callForSearchNotifiedMail: jest.fn(),
      callForClusteredTable: jest.fn()
    }

    methods.clearFilterByHashProps.call(ctx)

    expect(ctx.requestBodyReportedEmails.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'subject' }
    ])
    expect(ctx.callForSearchNotifiedMail).toHaveBeenCalledTimes(1)
    expect(ctx.callForClusteredTable).not.toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks on unsaved new investigation and allows details route', () => {
    const next = jest.fn()
    const handleClose = jest.fn()
    const ctx = {
      isWantToAddNewInvestigation: true,
      $refs: { refNewInvestigation: { handleClose } }
    }

    IncidentResponder.beforeRouteLeave.call(ctx, { name: 'Investigations' }, {}, next)
    expect(handleClose).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    IncidentResponder.beforeRouteLeave.call(ctx, { name: 'Investigation Details' }, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteEnter redirects with isLoadState only from Analysis Details', () => {
    const next = jest.fn()

    IncidentResponder.beforeRouteEnter(
      { name: 'Incident Responder', params: {} },
      { name: 'Analysis Details' },
      next
    )
    expect(next).toHaveBeenCalledWith({
      name: 'Incident Responder',
      params: { isLoadState: true }
    })

    next.mockClear()
    IncidentResponder.beforeRouteEnter(
      { name: 'Incident Responder', params: { isLoadState: true } },
      { name: 'Analysis Details' },
      next
    )
    expect(next).toHaveBeenCalledWith()
  })
})
