jest.mock('@/api/company', () => ({
  createEmailTemplate: jest.fn(() => Promise.resolve()),
  getEmailTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getMergedTags: jest.fn(() => Promise.resolve({ data: { data: { mergeTags: [] } } })),
  getTemplateTypes: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  updateEmailTemplate: jest.fn(() => Promise.resolve()),
  getNotificationTemplatesDeliverySettings: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] } } })
  ),
  generateNotificationTemplateTranslation: jest.fn(() =>
    Promise.resolve({ data: { data: { isSuccess: true } } })
  ),
  getNotificationTemplateTranslation: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/api/smtpSettings', () => ({
  searchSmtpSettings: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [{ name: 'SMTP A', resourceId: 'smtp-1' }] } } })
  )
}))

jest.mock('@/api/phishingsimulator', () => ({
  getDefaultEmailDeliverySetting: jest.fn(() =>
    Promise.resolve({ data: { data: { type: 1, resourceId: 'smtp-default' } } })
  )
}))

jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd-nt'),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  getDefaultAxiosPayload: jest.fn((props = {}) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
    ...props
  }))
}))

jest.mock('@/utils/helperFunctions', () => ({
  getAvailableForValueFromList: jest.fn((v) => v)
}))

jest.mock('@/components/Company Settings/utils', () => ({
  scrollToEmailTemplateContent: jest.fn(),
  TEAMS_NOTIFICATION_TEMPLATE_NAMES: [
    'Teams Enrollment Notification',
    'Teams Survey Enrollment Notification',
    'Teams Phishing Enrollment Notification',
    'Teams Poster Enrollment Notification',
    'Teams Infographic Enrollment Notification',
    'Teams Learning Path Enrollment Notification'
  ],
  isTeamsNotificationTemplateName: jest.fn((templateName = '') =>
    [
      'Teams Enrollment Notification',
      'Teams Survey Enrollment Notification',
      'Teams Phishing Enrollment Notification',
      'Teams Poster Enrollment Notification',
      'Teams Infographic Enrollment Notification',
      'Teams Learning Path Enrollment Notification'
    ].includes(templateName)
  ),
  MERGED_TEXTS_MAP: {
    COMPANYNAME: '{COMPANYNAME}'
  }
}))

import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate.vue'
import { createEmailTemplate } from '@/api/company'
import { getDefaultEmailDeliverySetting } from '@/api/phishingsimulator'
import { searchSmtpSettings } from '@/api/smtpSettings'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('NewNotificationTemplate.vue', () => {
  const { computed, methods, watch, created } = NewNotificationTemplate

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('computes company name from selectedCompanyName/companyName fallbacks', () => {
    localStorage.setItem('selectedCompanyName', 'Selected Co')
    expect(computed.getCompanyName.call({})).toBe('Selected Co')

    localStorage.removeItem('selectedCompanyName')
    localStorage.setItem('companyName', 'Default Co')
    expect(computed.getCompanyName.call({})).toBe('Default Co')
  })

  it('computed delivery/template booleans behave correctly', () => {
    expect(
      computed.canRenderAlertBox.call({
        emailDelivery: { name: "First Use Company's DEC config then Fallback to default SMTP" }
      })
    ).toBe(true)

    expect(
      computed.isTeamsNotificationTemplateSelected.call({
        selectedTemplateCategoryName: 'Teams Survey Enrollment Notification'
      })
    ).toBe(true)

    expect(
      computed.getEmailDeliveryProps.call({
        emailDeliveryProps: {
          hint: '*Required',
          persistentHint: true,
          rules: [jest.fn()]
        },
        isTeamsNotificationTemplateSelected: true
      }).rules
    ).toEqual([])

    expect(
      computed.shouldRenderEmailDeliveryField.call({
        isTeamsNotificationTemplateSelected: true
      })
    ).toBe(false)

    expect(
      computed.shouldRenderEmailDeliveryField.call({
        isTeamsNotificationTemplateSelected: false
      })
    ).toBe(true)

    expect(
      computed.filteredCategoryItems.call({
        selectedTemplateTypeGroup: 'microsoft-teams',
        categoryItems: [
          { text: 'Training Enrollment', value: 'email-1' },
          { text: 'Teams Survey Enrollment Notification', value: 'teams-1' }
        ],
        getTemplateTypeGroupValue: methods.getTemplateTypeGroupValue
      })
    ).toEqual([{ text: 'Teams Survey Enrollment Notification', value: 'teams-1' }])

    expect(
      computed.getIsGenerateWithAIDisabled.call({
        formValues: { emailTemplateCategoryResourceId: '' },
        isGenerateWithAIDisabled: false
      })
    ).toBe(true)

    expect(
      computed.getIsTemplateTypeDisabled.call({
        selectedItem: null,
        editItemsDisabled: false,
        categoryItems: [{ value: 'c1' }],
        isGenerateWithAIDisabled: false,
        isEmailGenerating: false
      })
    ).toBe(false)
  })

  it('isNotificationEnrollmentCategory detects enrollment/scheduled report names', () => {
    expect(methods.isNotificationEnrollmentCategory('Training Enrollment')).toBe(true)
    expect(methods.isNotificationEnrollmentCategory('Scheduled Report Mail')).toBe(true)
    expect(methods.isNotificationEnrollmentCategory('Welcome')).toBe(false)
  })

  it('handleChangeEmailDelivery maps smtp and direct-email ids correctly', () => {
    const ctx = {
      formValues: {
        smtpSettingResourceId: '',
        directEmailSettingResourceId: '',
        emailDeliverySettingType: null
      }
    }

    methods.handleChangeEmailDelivery.call(ctx, {
      type: EMAIL_DELIVERY_TYPES.SMTP,
      resourceId: 'smtp-1'
    })
    expect(ctx.formValues.smtpSettingResourceId).toBe('smtp-1')
    expect(ctx.formValues.directEmailSettingResourceId).toBe(null)
    expect(ctx.formValues.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.SMTP)

    methods.handleChangeEmailDelivery.call(ctx, {
      type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL,
      resourceId: 'dec-1'
    })
    expect(ctx.formValues.directEmailSettingResourceId).toBe('dec-1')
    expect(ctx.formValues.smtpSettingResourceId).toBe(null)
    expect(ctx.formValues.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.DIRECT_EMAIL)
  })

  it('handleTemplateTypeGroupChange clears mismatched selected template type', () => {
    const ctx = {
      selectedTemplateTypeGroup: '',
      categoryItems: [
        { text: 'Training Enrollment', value: 'email-1' },
        { text: 'Teams Survey Enrollment Notification', value: 'teams-1' }
      ],
      formValues: {
        emailTemplateCategoryResourceId: 'email-1'
      },
      getTemplateTypeGroupValue: methods.getTemplateTypeGroupValue
    }

    methods.handleTemplateTypeGroupChange.call(ctx, 'microsoft-teams')

    expect(ctx.selectedTemplateTypeGroup).toBe('microsoft-teams')
    expect(ctx.formValues.emailTemplateCategoryResourceId).toBe('')
  })

  it('syncSelectedTemplateTypeGroup keeps manual group selection when template type is cleared', () => {
    const ctx = {
      selectedTemplateTypeGroup: 'microsoft-teams',
      categoryItems: [],
      getTemplateTypeGroupValue: methods.getTemplateTypeGroupValue
    }

    methods.syncSelectedTemplateTypeGroup.call(ctx, '')

    expect(ctx.selectedTemplateTypeGroup).toBe('microsoft-teams')
  })

  it('template type watcher resets dependent state when selection is cleared', () => {
    const ctx = {
      selectedTemplateTypeGroup: 'microsoft-teams',
      formValues: {
        emailTemplateCategoryResourceId: '',
        template: 'Old template'
      },
      initialFormValues: {
        template: 'Old template'
      },
      activeBlockManagerComponents: {
        COMPANYNAME: '{COMPANYNAME}'
      },
      isSelectedNotificationEnrollment: true,
      languagesPayload: [
        {
          template: 'Lang template',
          isTranslated: true
        }
      ],
      selectedLanguagePayloadItemBeforeSave: {
        template: 'Lang template'
      },
      syncSelectedTemplateTypeGroup: methods.syncSelectedTemplateTypeGroup,
      resetTemplateTypeDependentState: methods.resetTemplateTypeDependentState,
      handleCategoryChange: jest.fn()
    }

    watch['formValues.emailTemplateCategoryResourceId'].call(ctx, '')

    expect(ctx.selectedTemplateTypeGroup).toBe('microsoft-teams')
    expect(ctx.formValues.template).toBe('')
    expect(ctx.initialFormValues.template).toBe('')
    expect(ctx.activeBlockManagerComponents).toEqual({})
    expect(ctx.isSelectedNotificationEnrollment).toBe(false)
    expect(ctx.languagesPayload[0].template).toBe('')
    expect(ctx.languagesPayload[0].isTranslated).toBe(false)
    expect(ctx.selectedLanguagePayloadItemBeforeSave.template).toBe('')
    expect(ctx.handleCategoryChange).not.toHaveBeenCalled()
  })

  it('handleCategoryChange auto-localizes when single selected language is not company language', () => {
    const handleGenerateWithAI = jest.fn()
    const nextTick = jest.fn((cb) => cb())
    const ctx = {
      categoryItems: [
        {
          text: 'Training Enrollment',
          value: 'email-1',
          template: '<div>Email template</div>'
        }
      ],
      formValues: {
        ccAddresses: [],
        template: ''
      },
      initialFormValues: {
        template: ''
      },
      activeLanguage: 'tr',
      companyLanguageTypeResourceId: 'en',
      languageItems: [
        { value: 'en', text: 'English' },
        { value: 'tr', text: 'Turkish' }
      ],
      selectedLanguages: [{ value: 'tr', text: 'Turkish' }],
      languagesPayload: [
        {
          languageTypeResourceId: 'tr',
          template: '',
          isTranslated: true
        }
      ],
      selectedLanguagePayloadItemBeforeSave: {
        template: ''
      },
      selectedItem: null,
      isSelectedNotificationEnrollment: false,
      isNotificationEnrollmentCategory: methods.isNotificationEnrollmentCategory,
      blockManagerComponents: {},
      callForMergedTags: jest.fn(),
      setActiveBlockManagerComponents: jest.fn(),
      $nextTick: nextTick,
      handleGenerateWithAI,
      isDefault: false,
      isGenerateWithAIDisabled: false,
      isEmailGenerating: false
    }

    methods.handleCategoryChange.call(ctx, 'email-1')

    expect(nextTick).toHaveBeenCalled()
    expect(handleGenerateWithAI).toHaveBeenCalled()
    expect(ctx.isDefault).toBe(true)
    expect(ctx.languagesPayload[0].template).toBe('<div>Email template</div>')
    expect(ctx.languagesPayload[0].isTranslated).toBe(false)
  })

  it('clears email delivery and sender fields when teams template is selected', () => {
    const ctx = {
      emailDelivery: { resourceId: 'dec-1' },
      formValues: {
        smtpSettingResourceId: 'smtp-1',
        directEmailSettingResourceId: 'dec-1',
        emailDeliverySettingType: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL,
        fromName: 'Keepnet',
        fromAddress: 'from@example.com',
        ccAddresses: ['cc@example.com']
      },
      languagesPayload: [
        {
          fromName: 'Keepnet',
          fromAddress: 'from@example.com',
          ccAddresses: ['cc@example.com']
        }
      ],
      selectedLanguagePayloadItemBeforeSave: {
        fromName: 'Keepnet',
        fromAddress: 'from@example.com',
        ccAddresses: ['cc@example.com']
      },
      clearEmailDeliverySelection: methods.clearEmailDeliverySelection,
      clearTeamsNotificationSenderFields: methods.clearTeamsNotificationSenderFields
    }

    watch.isTeamsNotificationTemplateSelected.call(ctx, true)

    expect(ctx.emailDelivery).toBe(null)
    expect(ctx.formValues.smtpSettingResourceId).toBe('')
    expect(ctx.formValues.directEmailSettingResourceId).toBe('')
    expect(ctx.formValues.emailDeliverySettingType).toBe('')
    expect(ctx.formValues.fromName).toBe('')
    expect(ctx.formValues.fromAddress).toBe('')
    expect(ctx.formValues.ccAddresses).toEqual([])
    expect(ctx.languagesPayload[0].fromName).toBe('')
    expect(ctx.languagesPayload[0].fromAddress).toBe('')
    expect(ctx.languagesPayload[0].ccAddresses).toEqual([])
  })

  it('callForDefaultEmailDeliverySetting skips edit mode and sets default ids in create mode', async () => {
    const ctx = {
      selectedItem: null,
      defaultDECSettingResourceId: null,
      defaultSMTPSettingResourceId: null
    }
    methods.callForDefaultEmailDeliverySetting.call(ctx)
    await flushPromises()
    expect(getDefaultEmailDeliverySetting).toHaveBeenCalled()
    expect(ctx.defaultSMTPSettingResourceId).toBe('smtp-default')

    const editCtx = { selectedItem: { id: 'x' } }
    methods.callForDefaultEmailDeliverySetting.call(editCtx)
    expect(getDefaultEmailDeliverySetting).toHaveBeenCalledTimes(1)
  })

  it('callForSMTPSettings maps smtp options', async () => {
    const ctx = {
      smtpAxiosPayload: {},
      smtpItems: []
    }
    methods.callForSMTPSettings.call(ctx)
    await flushPromises()
    expect(searchSmtpSettings).toHaveBeenCalled()
    expect(ctx.smtpItems).toEqual([{ text: 'SMTP A', value: 'smtp-1' }])
  })

  it('selectedLanguages watcher manages active language transitions', () => {
    const ctx = {
      activeLanguage: 'lang-2',
      selectedLanguagePayloadItemBeforeSave: null,
      getSelectedLanguagePayload: { languageTypeResourceId: 'lang-1', subject: 's' }
    }

    watch.selectedLanguages.call(ctx, [])
    expect(ctx.activeLanguage).toBe('')

    ctx.activeLanguage = 'lang-2'
    watch.selectedLanguages.call(ctx, [{ value: 'lang-1' }, { value: 'lang-3' }])
    expect(ctx.activeLanguage).toBe('lang-1')
    expect(ctx.selectedLanguagePayloadItemBeforeSave).toEqual({
      languageTypeResourceId: 'lang-1',
      subject: 's'
    })
  })

  it('setEmptyLanguagesPayload fills missing fields from preferred language payload', () => {
    const ctx = {
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          fromName: 'From EN',
          fromAddress: 'from@en.com',
          subject: 'Subject EN',
          template: 'Template EN',
          ccAddresses: ['a@en.com']
        }
      ],
      companyLanguageTypeResourceId: 'en',
      getPreferredLanguagePayload: methods.getPreferredLanguagePayload
    }
    const output = methods.setEmptyLanguagesPayload.call(ctx, [
      {
        languageTypeResourceId: 'tr',
        fromName: '',
        fromAddress: '',
        subject: '',
        template: '',
        ccAddresses: []
      }
    ])

    expect(output[0]).toEqual(
      expect.objectContaining({
        fromName: 'From EN',
        fromAddress: 'from@en.com',
        subject: 'Subject EN',
        template: 'Template EN',
        ccAddresses: ['a@en.com']
      })
    )
  })

  it('setEmptyLanguagesPayload keeps subject and template but clears sender fields for teams templates', () => {
    const ctx = {
      isTeamsNotificationTemplateSelected: true,
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          fromName: 'From EN',
          fromAddress: 'from@en.com',
          subject: 'Subject EN',
          template: 'Template EN',
          ccAddresses: ['a@en.com']
        }
      ],
      companyLanguageTypeResourceId: 'en',
      getPreferredLanguagePayload: methods.getPreferredLanguagePayload
    }
    const output = methods.setEmptyLanguagesPayload.call(ctx, [
      {
        languageTypeResourceId: 'tr',
        fromName: 'Old From',
        fromAddress: 'old@tr.com',
        subject: '',
        template: '',
        ccAddresses: ['old@cc.com']
      }
    ])

    expect(output[0]).toEqual(
      expect.objectContaining({
        fromName: '',
        fromAddress: '',
        subject: 'Subject EN',
        template: 'Template EN',
        ccAddresses: []
      })
    )
  })

  it('showLocalizationSuccessMessage handles relocalize/single/multiple cases', () => {
    const dispatch = jest.fn()
    const baseCtx = {
      isDefault: false,
      isRelocalizeOperation: true,
      relocalizeLanguageName: 'Turkish',
      selectedLanguages: [{ value: 'tr', text: 'Turkish' }],
      groupedLanguageItems: [],
      $store: { dispatch },
      getLanguageNameById: methods.getLanguageNameById
    }

    methods.showLocalizationSuccessMessage.call(baseCtx, [{ languageResourceId: 'tr' }])
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'The Turkish localization has been updated.' })
    )

    methods.showLocalizationSuccessMessage.call(
      { ...baseCtx, isRelocalizeOperation: false, relocalizeLanguageName: '' },
      [{ languageResourceId: 'tr' }]
    )
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'The Turkish language was successfully localized.' })
    )

    methods.showLocalizationSuccessMessage.call(
      { ...baseCtx, isRelocalizeOperation: false, relocalizeLanguageName: '' },
      [{ languageResourceId: 'tr' }, { languageResourceId: 'en' }]
    )
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: '2 languages were successfully localized.' })
    )
  })

  it('created sets preferred language id for new non-duplicate template', () => {
    const ctx = {
      selectedItem: null,
      isDuplicate: false,
      formValues: { languageTypeResourceId: '' },
      getUser: { companyLanguageTypeResourceId: 'lang-company' },
      callForCategories: jest.fn(),
      callForNotificationTemplate: jest.fn(),
      callForEmailDeliveries: jest.fn(),
      callForSMTPSettings: jest.fn(),
      callForDefaultEmailDeliverySetting: jest.fn()
    }

    created.call(ctx)
    expect(ctx.formValues.languageTypeResourceId).toBe('lang-company')
    expect(ctx.callForCategories).toHaveBeenCalled()
    expect(ctx.callForNotificationTemplate).toHaveBeenCalled()
  })

  it('submit sends teams payload with subject but empty sender and delivery fields', async () => {
    const ctx = {
      $refs: {
        refForm: {
          validate: jest.fn(() => true)
        },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true,
          getAvailableForValues: jest.fn((values) => values)
        }
      },
      saveDisable: false,
      selectedItem: null,
      isDuplicate: false,
      isTeamsNotificationTemplateSelected: true,
      formValues: {
        availableForRequests: [],
        tags: ['tag-1'],
        name: 'Teams template',
        emailTemplateCategoryResourceId: 'teams-category',
        emailDeliverySettingType: EMAIL_DELIVERY_TYPES.SMTP,
        smtpSettingResourceId: 'smtp-1',
        directEmailSettingResourceId: 'dec-1',
        fromAddress: '',
        fromName: '',
        subject: '',
        template: '',
        ccAddresses: [],
        canRemoveLanguages: true,
        languageTypeResourceId: 'en'
      },
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          languageTypeName: 'English',
          fromAddress: 'from@example.com',
          fromName: 'Keepnet',
          subject: 'Subject',
          template: '<div>Body</div>',
          ccAddresses: ['cc@example.com']
        }
      ],
      setEmptyLanguagesPayload: methods.setEmptyLanguagesPayload,
      getPreferredLanguagePayload: methods.getPreferredLanguagePayload,
      companyLanguageTypeResourceId: 'en',
      editedLanguages: [],
      $emit: jest.fn(),
      $nextTick: jest.fn()
    }

    methods.submit.call(ctx)
    await flushPromises()

    const calledPayload = createEmailTemplate.mock.calls[0][0]

    expect(calledPayload).not.toHaveProperty('emailDeliverySettingType')
    expect(calledPayload).not.toHaveProperty('smtpSettingResourceId')
    expect(calledPayload).not.toHaveProperty('directEmailSettingResourceId')
    expect(calledPayload).not.toHaveProperty('fromName')
    expect(calledPayload).not.toHaveProperty('fromAddress')
    expect(calledPayload).not.toHaveProperty('ccAddresses')

    expect(calledPayload).toEqual(
      expect.objectContaining({
        subject: 'Subject',
        languages: expect.arrayContaining([
          expect.objectContaining({
            fromName: '',
            fromAddress: '',
            subject: 'Subject',
            ccAddresses: []
          })
        ])
      })
    )
  })
})
