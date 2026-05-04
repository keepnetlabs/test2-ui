import CampaignManagerSummary from '@/components/CallbackCampaignManager/CampaignManagerSummary.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import CallbackService from '@/api/callback'

jest.mock('@/api/awarenessEducator', () => ({
  getTraining: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          id: 'tr-1',
          title: 'Training'
        }
      }
    })
  )
}))

jest.mock('@/api/callback', () => ({
  getCallbackScenarioPreview: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerSummary.vue (extra)', () => {
  it('covers empty and fallback computed branches', () => {
    expect(
      CampaignManagerSummary.computed.getTotalRandomlySelectedUserCount.call({
        formData: {},
        getTotalActiveUsers: 0
      })
    ).toBe('')

    expect(
      CampaignManagerSummary.computed.getTotalTargetGroupsAndUsersCount.call({
        formData: {},
        getTotalActiveUsers: 0,
        getTotalActiveUsersWithPhoneNumber: 0
      })
    ).toBe('')

    expect(
      CampaignManagerSummary.computed.getSettingsItems.call({
        formData: { selectedSchedule: '', sendingLimit: '', selectedEmailDelivery: null }
      })
    ).toEqual({
      Starting: '',
      'Sending Limit': '',
      'Email Delivery': ''
    })

    expect(
      CampaignManagerSummary.computed.getScheduledDialogItems.call({
        formData: {}
      })
    ).toEqual([])
  })

  it('covers canRenderAlertbox false branch for vishing and zero count', () => {
    expect(
      CampaignManagerSummary.computed.canRenderAlertbox.call({
        getUsersFromUnverifiedDomainsCount: 2,
        isVishing: true
      })
    ).toBe(false)

    expect(
      CampaignManagerSummary.computed.canRenderAlertbox.call({
        getUsersFromUnverifiedDomainsCount: 0,
        isVishing: false
      })
    ).toBe(false)
  })

  it('watch formData handler sets empty selected id and still calls detail method', () => {
    const ctx = {
      selectedScenarioResourceId: 'old-id',
      callForScenarioDetail: jest.fn()
    }

    CampaignManagerSummary.watch.formData.handler.call(ctx, {})

    expect(ctx.selectedScenarioResourceId).toBeUndefined()
    expect(ctx.callForScenarioDetail).toHaveBeenCalledWith({ name: undefined, index: 0 })
  })

  it('callForTrainingDetail keeps selected language list empty when no ids match', async () => {
    const ctx = {
      selectedTraining: { trainingLanguageIds: [999] },
      trainingLanguages: [{ id: 1, name: 'English', code: 'en' }],
      selectedTrainingLanguages: [],
      trainingParams: null
    }

    CampaignManagerSummary.methods.callForTrainingDetail.call(ctx, 'tr-1')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(AwarenessEducatorService.getTraining).toHaveBeenCalledWith('tr-1')
    expect(ctx.selectedTrainingLanguages).toEqual([])
    expect(ctx.trainingParams.languages).toBe('')
  })

  it('emailTemplatePreviewHTML returns template html or null', () => {
    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewHTML.call({
        emailTemplateParams: { template: '<html />' }
      })
    ).toBe('<html />')
    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewHTML.call({ emailTemplateParams: {} })
    ).toBeNull()
    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewHTML.call({ emailTemplateParams: null })
    ).toBeNull()
  })

  it('emailTemplatePreviewParams shapes attachment only when phishingFileName exists', () => {
    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewParams.call({
        emailTemplateParams: {
          name: 'Tpl',
          fromName: 'Sender',
          fromAddress: 'sender@x.com',
          subject: 'Subject',
          phishingFileName: 'invoice.pdf'
        }
      })
    ).toEqual({
      name: 'Tpl',
      fromName: 'Sender',
      fromAddress: 'sender@x.com',
      subject: 'Subject',
      attachment: { name: 'invoice.pdf' }
    })

    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewParams.call({
        emailTemplateParams: { name: 'Tpl', phishingFileName: null }
      }).attachment
    ).toBeNull()

    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewParams.call({ emailTemplateParams: null })
        .attachment
    ).toBeNull()
  })

  it('emailTemplatePreviewSelectedRow spreads emailTemplateParams with safe fallback', () => {
    const params = { resourceId: 'et-1', name: 'Tpl' }
    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewSelectedRow.call({
        emailTemplateParams: params
      })
    ).toEqual(params)
    expect(
      CampaignManagerSummary.computed.emailTemplatePreviewSelectedRow.call({
        emailTemplateParams: null
      })
    ).toEqual({})
  })

  it('isAttachmentBasedScenario reflects landingPageParams.method', () => {
    expect(
      CampaignManagerSummary.computed.isAttachmentBasedScenario.call({
        landingPageParams: { method: 'Attachment' }
      })
    ).toBe(true)
    expect(
      CampaignManagerSummary.computed.isAttachmentBasedScenario.call({
        landingPageParams: { method: 'Click-Only' }
      })
    ).toBe(false)
    expect(
      CampaignManagerSummary.computed.isAttachmentBasedScenario.call({
        landingPageParams: null
      })
    ).toBe(false)
    expect(
      CampaignManagerSummary.computed.isAttachmentBasedScenario.call({
        landingPageParams: undefined
      })
    ).toBe(false)
  })

  it('callForScenarioDetail falls back to empty strings when ids do not match lookups', async () => {
    CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
      data: {
        data: {
          difficultyTypeId: 999,
          emailTemplate: {
            categoryResourceId: 'unknown-method',
            difficultyResourceId: 'unknown-difficulty',
            languageTypeResourceId: 'unknown-lang'
          },
          callbackTemplate: {
            vishingLanguageResourceId: 'unknown-vlang',
            steps: [{ k: 'a' }, { k: 'b' }, { k: 'c' }]
          }
        }
      }
    })

    const ctx = {
      formData: { trainings: {} },
      trainingParams: null,
      languageOptions: [{ value: 'lang-tr', text: 'TR' }],
      languages: [{ resourceId: 'v-lang-1', language: 'English', name: 'Amy' }],
      isScenarioDetailLoading: false,
      emailTemplateParams: {},
      callbackTemplate: null
    }

    CampaignManagerSummary.methods.callForScenarioDetail.call(ctx, { name: 'res-x' })
    await flushPromises()

    expect(ctx.emailTemplateParams.method).toBe('')
    expect(ctx.emailTemplateParams.difficulty).toBe('')
    expect(ctx.emailTemplateParams.languageShortCode).toBeUndefined()
    expect(ctx.callbackTemplate.template.language).toBe('')
    expect(ctx.callbackTemplate.template.voice).toBe('')
    expect(ctx.callbackTemplate.template.difficulty).toBe('')
    expect(ctx.isScenarioDetailLoading).toBe(false)
  })
})
