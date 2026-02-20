import EmailTemplateListPreview from '@/components/workshop/EmailTemplateListPreview.vue'

describe('workshop/EmailTemplateListPreview.vue', () => {
  it('handleCreateEmailTemplateClick emits create event', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    EmailTemplateListPreview.methods.handleCreateEmailTemplateClick.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-create-email-template')
  })

  it('rename attachment modal open/close handlers update state and attachment name', () => {
    const ctx = {
      isRenameAttachmentModalVisible: false,
      attachmentName: 'old-name'
    }

    EmailTemplateListPreview.methods.handleShowRenameAttachmentModal.call(ctx)
    expect(ctx.isRenameAttachmentModalVisible).toBe(true)

    EmailTemplateListPreview.methods.handleCloseRenameAttachmentModal.call(ctx)
    expect(ctx.isRenameAttachmentModalVisible).toBe(false)
    expect(ctx.attachmentName).toBe('')
  })

  it('getItemDescription returns non-breaking space for invalid values', () => {
    expect(EmailTemplateListPreview.methods.getItemDescription()).toBe('\xa0')
    expect(EmailTemplateListPreview.methods.getItemDescription({ description: 'null' })).toBe('\xa0')
    expect(EmailTemplateListPreview.methods.getItemDescription({ description: 'undefined' })).toBe(
      '\xa0'
    )
    expect(EmailTemplateListPreview.methods.getItemDescription({ description: 'Real text' })).toBe(
      'Real text'
    )
  })

  it('setItemToFirstIndex moves item to first position when found', () => {
    const ctx = {
      listData: [
        { resourceId: 'r-1' },
        { resourceId: 'r-2' },
        { resourceId: 'r-3' }
      ]
    }

    EmailTemplateListPreview.methods.setItemToFirstIndex.call(ctx, 'r-2')
    expect(ctx.listData.map((item) => item.resourceId)).toEqual(['r-2', 'r-1', 'r-3'])
  })

  it('setItemToFirstIndex does nothing when resourceId is not found', () => {
    const initial = [{ resourceId: 'r-1' }, { resourceId: 'r-2' }]
    const ctx = { listData: [...initial] }

    EmailTemplateListPreview.methods.setItemToFirstIndex.call(ctx, 'r-9')
    expect(ctx.listData).toEqual(initial)
  })

  it('checkAndAddResourceIdToPayload sets loading and appends resource filter for initial fetch', () => {
    const emit = jest.fn()
    const bodyData = { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } }
    const ctx = {
      loadingTemplates: false,
      emailTemplateResourceId: 'tmpl-1',
      $emit: emit
    }

    EmailTemplateListPreview.methods.checkAndAddResourceIdToPayload.call(ctx, true, bodyData)

    expect(ctx.loadingTemplates).toBe(true)
    expect(emit).toHaveBeenCalledWith('loading', true)
    expect(bodyData.filter.FilterGroups[1].FilterItems).toEqual([
      {
        FieldName: 'ResourceId',
        Operator: 'Include',
        value: 'tmpl-1'
      }
    ])
  })

  it('getDataAfterValidScroll loads next page only when there are more pages and no search', () => {
    const ctx = {
      bodyData: { pageNumber: 1 },
      totalNumberOfPages: 3,
      search: '',
      loadingTemplates: false,
      getTemplates: jest.fn()
    }

    EmailTemplateListPreview.methods.getDataAfterValidScroll.call(ctx)
    expect(ctx.bodyData.pageNumber).toBe(2)
    expect(ctx.loadingTemplates).toBe(true)
    expect(ctx.getTemplates).toHaveBeenCalled()

    const blockedCtx = {
      bodyData: { pageNumber: 3 },
      totalNumberOfPages: 3,
      search: 'query',
      loadingTemplates: false,
      getTemplates: jest.fn()
    }
    EmailTemplateListPreview.methods.getDataAfterValidScroll.call(blockedCtx)
    expect(blockedCtx.bodyData.pageNumber).toBe(3)
    expect(blockedCtx.getTemplates).not.toHaveBeenCalled()
  })

  it('handleInputLanguageChange maps language value based on phishing mode', () => {
    const phishingCtx = {
      isPhishing: true,
      bodyData: { filter: { FilterGroups: [{ FilterItems: [{}, {}, { value: '' }] }] } },
      getTemplatesForSearch: jest.fn()
    }
    EmailTemplateListPreview.methods.handleInputLanguageChange.call(phishingCtx, ['tr', 'en'])
    expect(phishingCtx.bodyData.filter.FilterGroups[0].FilterItems[2].value).toBe('tr,en')
    expect(phishingCtx.getTemplatesForSearch).toHaveBeenCalled()

    const nonPhishingCtx = {
      isPhishing: false,
      bodyData: { filter: { FilterGroups: [{ FilterItems: [{}, {}, { value: '' }] }] } },
      getTemplatesForSearch: jest.fn()
    }
    EmailTemplateListPreview.methods.handleInputLanguageChange.call(nonPhishingCtx, 'tr')
    expect(nonPhishingCtx.bodyData.filter.FilterGroups[0].FilterItems[2].value).toBe('tr')
  })

  it('handleEmailTemplatePreviewLanguageChange updates preview fields and edit form in edit mode', () => {
    const ctx = {
      phishingEmailTemplates: [
        {
          languageType: 'tr',
          template: '<p>TR</p>',
          fromName: 'TR Name',
          subject: 'TR Subject',
          fromAddress: 'tr@acme.com',
          ccAddresses: ['trcc@acme.com']
        }
      ],
      isEditMode: true,
      editData: {},
      handleSaveOldEditLanguage: jest.fn(),
      templateHTML: '',
      templateFromName: '',
      templateSubject: '',
      templateFromEmail: '',
      templateCCAddresses: []
    }

    EmailTemplateListPreview.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'tr', 'en')

    expect(ctx.templateHTML).toBe('<p>TR</p>')
    expect(ctx.templateFromName).toBe('TR Name')
    expect(ctx.templateSubject).toBe('TR Subject')
    expect(ctx.templateFromEmail).toBe('tr@acme.com')
    expect(ctx.editData.languageIndex).toBe(0)
    expect(ctx.handleSaveOldEditLanguage).toHaveBeenCalledWith('en')
  })

  it('handleEmailTemplatePreviewLanguageChange is no-op when language template is missing', () => {
    const ctx = {
      phishingEmailTemplates: [{ languageType: 'tr', template: '<p>TR</p>' }],
      isEditMode: false,
      templateHTML: 'before',
      templateFromName: 'before-name',
      templateSubject: 'before-subject',
      templateFromEmail: 'before-mail',
      templateCCAddresses: ['before']
    }

    EmailTemplateListPreview.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'en')

    expect(ctx.templateHTML).toBe('before')
    expect(ctx.templateFromName).toBe('before-name')
    expect(ctx.templateSubject).toBe('before-subject')
    expect(ctx.templateFromEmail).toBe('before-mail')
    expect(ctx.templateCCAddresses).toEqual(['before'])
  })

  it('handleSaveOldEditLanguage updates emailTemplateData for primary language', () => {
    const ctx = {
      phishingEmailTemplates: [{ languageType: 'tr' }],
      editData: {
        fromAddress: 'new@acme.com',
        fromName: 'New Name',
        subject: 'New Subject',
        template: '<p>New</p>',
        ccAddresses: ['cc@acme.com']
      },
      emailTemplateData: {
        fromAddress: 'old@acme.com',
        fromName: 'Old Name',
        subject: 'Old Subject',
        template: '<p>Old</p>',
        ccAddresses: []
      }
    }

    EmailTemplateListPreview.methods.handleSaveOldEditLanguage.call(ctx, 'tr')

    expect(ctx.emailTemplateData).toEqual({
      fromAddress: 'new@acme.com',
      fromName: 'New Name',
      subject: 'New Subject',
      template: '<p>New</p>',
      ccAddresses: ['cc@acme.com']
    })
  })

  it('handleSaveOldEditLanguage updates non-primary language template in-place', () => {
    const ctx = {
      phishingEmailTemplates: [{ languageType: 'tr' }, { languageType: 'en' }],
      editData: {
        fromAddress: 'en@acme.com',
        fromName: 'EN Name',
        subject: 'EN Subject',
        template: '<p>EN</p>',
        ccAddresses: ['encc@acme.com']
      },
      emailTemplateData: {
        fromAddress: 'main@acme.com',
        fromName: 'Main',
        subject: 'Main Subject',
        template: '<p>Main</p>',
        ccAddresses: []
      }
    }

    EmailTemplateListPreview.methods.handleSaveOldEditLanguage.call(ctx, 'en')

    expect(ctx.phishingEmailTemplates[1]).toEqual({
      languageType: 'en',
      fromAddress: 'en@acme.com',
      fromName: 'EN Name',
      subject: 'EN Subject',
      template: '<p>EN</p>',
      ccAddresses: ['encc@acme.com']
    })
    expect(ctx.emailTemplateData.fromAddress).toBe('main@acme.com')
  })

  it('handleDeleteAttachment clears attachment and resets added-new flag', () => {
    const ctx = {
      editData: { phishingFile: [{ fileName: 'x.doc' }] },
      isAddedNewPhishingFile: true
    }

    EmailTemplateListPreview.methods.handleDeleteAttachment.call(ctx)

    expect(ctx.editData.phishingFile).toBe(null)
    expect(ctx.isAddedNewPhishingFile).toBe(false)
  })

  it('handleTemplateEdit toggles grapes modal and emits template-edit', () => {
    const emit = jest.fn()
    const ctx = {
      showGrapesModal: false,
      $emit: emit
    }

    EmailTemplateListPreview.methods.handleTemplateEdit.call(ctx, true)

    expect(ctx.showGrapesModal).toBe(true)
    expect(emit).toHaveBeenCalledWith('template-edit', true)
  })
})
