import { shallowMount } from '@vue/test-utils'
import CommonCampaignManagerPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewDialog.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { openHtmlInNewWindow } from '@/utils/functions'

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => 'rnd-1'),
    openHtmlInNewWindow: jest.fn()
  }
})

const createWrapper = (props = {}, data = {}) =>
  shallowMount(CommonCampaignManagerPreviewDialog, {
    propsData: {
      status: false,
      selectedRow: { resourceId: 'row-1', name: 'Scenario' },
      ...props
    },
    methods: {
      callForLanguages: jest.fn(),
      callForData: jest.fn(),
      closeDrawer: jest.fn()
    },
    stubs: {
      VNavigationDrawer: true,
      VListItem: true,
      VListItemContent: true,
      VListItemTitle: true,
      VIcon: true,
      VTooltip: true,
      VBtn: true,
      ElTabs: true,
      ElTabPane: true,
      InputLanguagePreview: true,
      AttachmentsPreview: true,
      KEmailPreview: true,
      TabsWithMfaSettingsMultipleLanguages: true,
      TrainingLibraryPreview: true,
      EmailTemplatePreviewSkeleton: true
    },
    data() {
      return {
        ...data
      }
    }
  })

describe('CommonCampaignManagerPreviewDialog.vue', () => {
  it('has correct title and type flags for phishing', () => {
    const wrapper = createWrapper({ type: PREVIEW_DIALOG_TYPES.PHISHING })
    expect(wrapper.vm.$options.name).toBe('CommonCampaignManagerPreviewDialog')
    expect(wrapper.vm.getTitle).toBe('Phishing Campaign Preview')
    expect(wrapper.vm.isPhishing).toBe(true)
    expect(wrapper.vm.isQuishing).toBe(false)
  })

  it('has correct title and printout flag for quishing individual template', () => {
    const wrapper = createWrapper({
      type: PREVIEW_DIALOG_TYPES.QUISHING,
      selectedRow: { templateType: 'INDIVIDUAL' }
    })

    expect(wrapper.vm.getTitle).toBe('Quishing Campaign Preview')
    expect(wrapper.vm.isQuishing).toBe(true)
    expect(wrapper.vm.isQuishingTypeIndividualPrintOut).toBe(true)
  })

  it('builds template language label and printout button style', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      selectedTemplateLanguages: [{}, {}],
      isIndividualPrintoutButtonDisabled: true
    })

    expect(wrapper.vm.templateLanguageLabel).toBe('Template Languages (2)')
    expect(wrapper.vm.getIndividualPrintoutStyle).toEqual({
      textTransform: 'capitalize',
      cursor: 'default',
      opacity: 0.5
    })
  })

  it('updates template fields when preview language changes', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      emailTemplate: 'old',
      emailTemplateParams: {
        ccAddresses: [],
        fromName: 'Old',
        fromAddress: 'old@example.com',
        subject: 'Old Subject'
      },
      phishingEmailTemplates: [
        {
          languageTypeResourceId: 'en',
          ccAddresses: ['cc@example.com'],
          fromName: 'New Name',
          fromAddress: 'new@example.com',
          subject: 'New Subject',
          template: '<p>New</p>'
        }
      ]
    })

    wrapper.vm.handleEmailTemplatePreviewLanguageChange('en')

    expect(wrapper.vm.languagePreview).toBe('en')
    expect(wrapper.vm.emailTemplate).toBe('<p>New</p>')
    expect(wrapper.vm.emailTemplateParams.fromName).toBe('New Name')
    expect(wrapper.vm.emailTemplateParams.subject).toBe('New Subject')
  })

  it('emits on-edit-campaign and opens html in new window', async () => {
    const selectedRow = { resourceId: 'row-8', name: 'Campaign 8' }
    const wrapper = createWrapper({ selectedRow })
    await wrapper.setData({ emailTemplate: '<h1>Preview</h1>' })

    wrapper.vm.handleEditCampaign()
    wrapper.vm.handleExternalLink()

    expect(wrapper.emitted('on-edit-campaign')).toEqual([[selectedRow]])
    expect(openHtmlInNewWindow).toHaveBeenCalledWith('<h1>Preview</h1>')
  })

  it('updates loading state and delegates overlay close to drawer close', () => {
    const closeDrawer = jest.fn()
    const wrapper = shallowMount(CommonCampaignManagerPreviewDialog, {
      propsData: {
        status: false,
        selectedRow: { resourceId: 'row-1', name: 'Scenario' }
      },
      methods: {
        callForLanguages: jest.fn(),
        callForData: jest.fn(),
        closeDrawer
      },
      stubs: {
        VNavigationDrawer: true,
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VIcon: true,
        VTooltip: true,
        VBtn: true,
        ElTabs: true,
        ElTabPane: true,
        InputLanguagePreview: true,
        AttachmentsPreview: true,
        KEmailPreview: true,
        TabsWithMfaSettingsMultipleLanguages: true,
        TrainingLibraryPreview: true,
        EmailTemplatePreviewSkeleton: true
      }
    })

    wrapper.vm.setLoading(true)
    expect(wrapper.vm.isLoading).toBe(true)
    wrapper.vm.setLoading()
    expect(wrapper.vm.isLoading).toBe(false)

    wrapper.vm.handleOverlayClick()
    expect(closeDrawer).toHaveBeenCalled()
  })

  it('changes active scenario by tab index', () => {
    const setActiveScenario = jest.fn()
    const wrapper = shallowMount(CommonCampaignManagerPreviewDialog, {
      propsData: {
        status: false,
        selectedRow: { resourceId: 'row-1', name: 'Scenario' }
      },
      methods: {
        callForLanguages: jest.fn(),
        callForData: jest.fn(),
        setActiveScenario
      },
      stubs: {
        VNavigationDrawer: true,
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VIcon: true,
        VTooltip: true,
        VBtn: true,
        ElTabs: true,
        ElTabPane: true,
        InputLanguagePreview: true,
        AttachmentsPreview: true,
        KEmailPreview: true,
        TabsWithMfaSettingsMultipleLanguages: true,
        TrainingLibraryPreview: true,
        EmailTemplatePreviewSkeleton: true
      },
      data() {
        return {
          phishingScenarios: [{ name: 'A' }, { name: 'B' }]
        }
      }
    })

    wrapper.vm.callForScenarioDetail({ index: 1 })
    expect(setActiveScenario).toHaveBeenCalledWith({ name: 'B' })
  })

  it('computes language hint and first tab label by type', async () => {
    const phishingWrapper = createWrapper({ type: PREVIEW_DIALOG_TYPES.PHISHING })
    await phishingWrapper.setData({ selectedTemplateLanguages: [{}] })
    expect(phishingWrapper.vm.getEmailTemplatePreviewLanguageHint).toBe(
      'This template is available in 1 language.'
    )
    expect(phishingWrapper.vm.getFirstSubTabLabel).toBe('Email Template')

    const quishingWrapper = createWrapper({ type: PREVIEW_DIALOG_TYPES.QUISHING })
    await quishingWrapper.setData({ selectedTemplateLanguages: [{}, {}] })
    expect(quishingWrapper.vm.getEmailTemplatePreviewLanguageHint).toBe(
      'This template is available in 2 languages.'
    )
    expect(quishingWrapper.vm.getFirstSubTabLabel).toBe('Quishing Template')
  })

  it('computes subtitle and landing page key by tab state', async () => {
    const wrapper = createWrapper({ selectedRow: { name: 'My Campaign' } })
    expect(wrapper.vm.getSubtitle).toBe('My Campaign')

    await wrapper.setData({ tab: 'email' })
    expect(wrapper.vm.getLandingPageKey).toBe('')

    await wrapper.setData({ tab: 'landing-page' })
    expect(wrapper.vm.getLandingPageKey).toBe('key-rnd-1')
  })

  it('keeps template data unchanged when selected language template is missing', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      emailTemplate: '<p>Old</p>',
      emailTemplateParams: {
        fromName: 'Old Name',
        fromAddress: 'old@example.com',
        subject: 'Old Subject',
        ccAddresses: []
      },
      phishingEmailTemplates: [
        {
          languageTypeResourceId: 'en',
          template: '<p>EN</p>',
          fromName: 'EN Name',
          fromAddress: 'en@example.com',
          subject: 'EN Subject',
          ccAddresses: ['en@example.com']
        }
      ]
    })

    wrapper.vm.handleEmailTemplatePreviewLanguageChange('fr')
    expect(wrapper.vm.languagePreview).toBe('fr')
    expect(wrapper.vm.emailTemplate).toBe('<p>Old</p>')
    expect(wrapper.vm.emailTemplateParams.fromName).toBe('Old Name')
  })

  it('returns static navigation drawer class and training fallbacks', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getNavigationDrawerClass).toEqual({
      'k-navigation-drawer k-navigation-drawer--campaign-manager-preview': true
    })

    expect(wrapper.vm.getTrainingName).toBe('')
    expect(wrapper.vm.getTrainingId).toBe('')

    await wrapper.setData({
      trainingParams: {
        name: 'Security Training',
        trainingId: 'tr-1'
      }
    })
    expect(wrapper.vm.getTrainingName).toBe('Security Training')
    expect(wrapper.vm.getTrainingId).toBe('tr-1')
  })

  it('maps training languages from trainingContents', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      languages: [
        { id: 1, name: 'English', isoFriendlyName: 'EN' },
        { id: 2, name: 'Turkish', isoFriendlyName: 'TR' }
      ],
      trainingParams: {}
    })

    wrapper.vm.callForTrainingLanguages([{ languageId: 1 }, { languageId: 2 }])

    expect(wrapper.vm.selectedLanguages).toEqual([
      { text: 'EN', value: 1 },
      { text: 'TR', value: 2 }
    ])
    expect(wrapper.vm.trainingParams.languages).toBe('EN, TR')
  })
})
