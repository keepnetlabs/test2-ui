import SelectEmailTemplateModal from '@/components/IncidentResponder/SelectEmailTemplateModal.vue'

describe('SelectEmailTemplateModal.vue', () => {
  const { data, methods } = SelectEmailTemplateModal

  it('initializes previewModel from selectedTemplate prop', () => {
    const ctx = {
      selectedTemplate: 'template-1'
    }
    const result = data.call(ctx)

    expect(result.previewModel).toBe('template-1')
    expect(result.axiosPayload.filter.FilterGroups[0].FilterItems[0]).toEqual({
      Value: 'WMnpwDBjAFN9',
      FieldName: 'TypeResourceId',
      Operator: 'Include'
    })
  })

  it('handleChangeStatus emits on-close', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    methods.handleChangeStatus.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('handleConfirm emits selected preview model', () => {
    const emit = jest.fn()
    const ctx = {
      previewModel: 'template-42',
      $emit: emit
    }

    methods.handleConfirm.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-confirm', 'template-42')
  })
})
