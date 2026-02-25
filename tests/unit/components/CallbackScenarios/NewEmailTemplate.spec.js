import NewEmailTemplate from '@/components/CallbackScenarios/NewEmailTemplate.vue'

describe('NewEmailTemplate.vue', () => {
  it('has correct component name', () => {
    expect(NewEmailTemplate.name).toBe('CallbackNewEmailTemplate')
  })

  it('getTitle returns expected text for new, edit and duplicate modes', () => {
    expect(NewEmailTemplate.computed.getTitle.call({ isEdit: false, isDuplicate: false })).toBe(
      'New Email Template'
    )
    expect(NewEmailTemplate.computed.getTitle.call({ isEdit: true, isDuplicate: false })).toBe(
      'Edit Email Template'
    )
    expect(NewEmailTemplate.computed.getTitle.call({ isEdit: true, isDuplicate: true })).toBe(
      'Duplicate Email Template'
    )
  })

  it('isAttachmentBasedTemplate uses categoryResourceId', () => {
    expect(
      NewEmailTemplate.computed.isAttachmentBasedTemplate.call({
        formValues: { categoryResourceId: '7dLrW2kdBTDs' }
      })
    ).toBe(true)
    expect(
      NewEmailTemplate.computed.isAttachmentBasedTemplate.call({
        formValues: { categoryResourceId: 'other' }
      })
    ).toBe(false)
  })

  it('isRenderMakeAvailableFor is inverse of editItemsDisabled', () => {
    expect(NewEmailTemplate.computed.isRenderMakeAvailableFor.call({ editItemsDisabled: false })).toBe(
      true
    )
    expect(NewEmailTemplate.computed.isRenderMakeAvailableFor.call({ editItemsDisabled: true })).toBe(
      false
    )
  })

  it('setFooterButtonIds updates ids only in duplicate mode', () => {
    const nonDup = { isDuplicate: false, footerButtonsIds: { saveButton: 'x' } }
    NewEmailTemplate.methods.setFooterButtonIds.call(nonDup)
    expect(nonDup.footerButtonsIds.saveButton).toBe('x')

    const dup = { isDuplicate: true, footerButtonsIds: {} }
    NewEmailTemplate.methods.setFooterButtonIds.call(dup)
    expect(dup.footerButtonsIds.saveButton).toBe('btn-duplicate-save--email-templates-modal')
  })

  it('handles simple UI state methods', () => {
    const click = jest.fn()
    const ctx = {
      isWarningModalVisible: true,
      step: 2,
      formValues: { attachmentFiles: ['a'] },
      isAddedNewPhishingFile: true,
      $refs: { refInputFileUpload: { click } }
    }

    NewEmailTemplate.methods.handleCloseWarningModal.call(ctx)
    expect(ctx.isWarningModalVisible).toBe(false)

    NewEmailTemplate.methods.backStep.call(ctx)
    expect(ctx.step).toBe(1)

    NewEmailTemplate.methods.handleDeleteAttachment.call(ctx)
    expect(ctx.formValues.attachmentFiles).toEqual([])
    expect(ctx.isAddedNewPhishingFile).toBe(false)

    NewEmailTemplate.methods.handleUploadEmailButtonClick.call(ctx)
    expect(click).toHaveBeenCalled()
  })

  it('setActiveBlockManagerComponents reorders and maps active tags', () => {
    const ctx = {
      activeBlockManagerComponents: {},
      getTagsComponent: jest.fn((item) => `Label:${item}`)
    }
    const tags = ['{X}', '{PHISHING_CODE}', '{PHISHING_CALLBACK_PHONE}']

    NewEmailTemplate.methods.setActiveBlockManagerComponents.call(ctx, tags)

    expect(Object.keys(ctx.activeBlockManagerComponents)).toEqual([
      '{PHISHING_CALLBACK_PHONE}',
      '{PHISHING_CODE}'
    ])
    expect(ctx.activeBlockManagerComponents['{PHISHING_CODE}']).toBe('Label:{PHISHING_CODE}')
    expect(ctx.getTagsComponent).toHaveBeenCalled()
  })
})
