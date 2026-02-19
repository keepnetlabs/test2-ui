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
  MERGED_TEXTS_MAP: {
    COMPANYNAME: '{COMPANYNAME}'
  }
}))

import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate.vue'
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
})
