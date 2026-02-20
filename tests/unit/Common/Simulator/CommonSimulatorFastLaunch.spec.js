jest.mock('@/api/phishingsimulator', () => ({
  createCampaignManager: jest.fn(),
  getCampaignManagerFormDetails: jest.fn(),
  getDefaultCompanySmtpSetting: jest.fn(),
  getDefaultEmailDeliverySetting: jest.fn(),
  getEmailDeliveries: jest.fn(),
  getPhishingScenarioLandingPageAndEmailTemplate: jest.fn()
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() => Promise.resolve([]))
  }
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getDefaultCompanySmtpSetting: jest.fn(),
    getCampaignManagerFormDetails: jest.fn(),
    getQuishingScenarioLandingPageAndEmailTemplate: jest.fn(),
    createCampaignManager: jest.fn()
  }
}))

const mockIsDifferent = jest.fn()
jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    isDifferent: (...args) => mockIsDifferent(...args)
  }
})

import CommonSimulatorFastLaunch from '@/components/Common/Simulator/CommonSimulatorFastLaunch.vue'
import {
  getCampaignManagerFormDetails,
  getDefaultCompanySmtpSetting,
  getDefaultEmailDeliverySetting,
  getEmailDeliveries
} from '@/api/phishingsimulator'
import QuishingService from '@/api/quishing'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommonSimulatorFastLaunch.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsDifferent.mockReset()
    mockIsDifferent.mockReturnValue(false)
  })

  it('computes quishing/individual printout and MFA flags', () => {
    const notQuishingCtx = {
      type: SCENARIO_TYPES.PHISHING
    }
    expect(CommonSimulatorFastLaunch.computed.isQuishing.call(notQuishingCtx)).toBe(false)
    expect(CommonSimulatorFastLaunch.computed.isQuishingTypeIndividualPrintOut.call(notQuishingCtx)).toBe(
      false
    )

    const quishingCtx = {
      type: SCENARIO_TYPES.QUISHING,
      isQuishing: true,
      selectedScenario: {
        quishingType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      }
    }
    expect(CommonSimulatorFastLaunch.computed.isQuishing.call(quishingCtx)).toBe(true)
    expect(CommonSimulatorFastLaunch.computed.isQuishingTypeIndividualPrintOut.call(quishingCtx)).toBe(
      true
    )

    expect(
      CommonSimulatorFastLaunch.computed.isMFAScenarioSelected.call({
        selectedScenario: { method: 'MFA' }
      })
    ).toBe(true)
  })

  it('computes title and returns empty summary form data before step 2', () => {
    expect(
      CommonSimulatorFastLaunch.computed.getTitle.call({
        selectedScenario: { name: 'Scenario X' }
      })
    ).toBe('Fast Launch - Scenario X')

    expect(
      CommonSimulatorFastLaunch.computed.getFormDataForCampaignSummary.call({
        step: 1
      })
    ).toEqual({})
  })

  it('builds campaign summary form data with direct email delivery when available', () => {
    const ctx = {
      step: 2,
      selectedScenario: { resourceId: 'sc-1', name: 'Scenario X' },
      emailTemplate: '<p>x</p>',
      emailTemplateParams: { type: 'Email' },
      landingPageTemplate: [{ content: '<html />' }],
      landingPageParams: { name: 'LP' },
      userCountDetailResponse: { data: { userCount: 10 } },
      directEmailSettingResourceId: 'de-1',
      smtpSettingResourceId: 'smtp-1',
      $refs: {
        refFastLaunch: {
          formData: { excludeFromReports: false },
          selectedTargetGroups: [
            { name: 'Group A', userCount: 3, resourceId: 'tg-1' },
            { name: 'Group B', userCount: 7, resourceId: 'tg-2' }
          ],
          $refs: {
            refCampaignManagerCampaignInfo: {
              formData: { name: 'Campaign A' }
            }
          }
        }
      }
    }

    const result = CommonSimulatorFastLaunch.computed.getFormDataForCampaignSummary.call(ctx)
    expect(result.selectedSchedule).toBe('Now')
    expect(result.selectedPhishingScenarios).toEqual([{ resourceId: 'sc-1', name: 'Scenario X' }])
    expect(result.selectedEmailDelivery).toEqual({
      resourceId: 'de-1',
      name: 'Default',
      type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
    })
    expect(result.targetGroupResourceIds).toEqual(['tg-1', 'tg-2'])
    expect(result.selectedTargetGroups).toEqual([
      { name: 'Group A', userCount: 3 },
      { name: 'Group B', userCount: 7 }
    ])
  })

  it('builds campaign summary form data with smtp delivery when direct email is not set', () => {
    const ctx = {
      step: 2,
      selectedScenario: { resourceId: 'sc-1', name: 'Scenario X' },
      emailTemplateParams: {},
      directEmailSettingResourceId: '',
      smtpSettingResourceId: 'smtp-1',
      $refs: {
        refFastLaunch: {
          formData: {},
          selectedTargetGroups: [],
          $refs: {
            refCampaignManagerCampaignInfo: {
              formData: {}
            }
          }
        }
      }
    }

    const result = CommonSimulatorFastLaunch.computed.getFormDataForCampaignSummary.call(ctx)
    expect(result.selectedEmailDelivery).toEqual({
      resourceId: 'smtp-1',
      name: 'Default',
      type: EMAIL_DELIVERY_TYPES.SMTP
    })
  })

  it('callForDefaultEmailDeliverySetting sets direct email when API returns direct type', async () => {
    getDefaultEmailDeliverySetting.mockResolvedValue({
      data: {
        data: {
          type: 2,
          resourceId: 'de-42'
        }
      }
    })

    const ctx = {}
    CommonSimulatorFastLaunch.methods.callForDefaultEmailDeliverySetting.call(ctx)
    await flushPromises()

    expect(ctx.directEmailSettingResourceId).toBe('de-42')
    expect(ctx.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.DIRECT_EMAIL)
    expect(getEmailDeliveries).not.toHaveBeenCalled()
  })

  it('callForDefaultEmailDeliverySetting falls back to smtp delivery list for smtp type', async () => {
    getDefaultEmailDeliverySetting.mockResolvedValue({
      data: {
        data: {
          type: 1
        }
      }
    })
    getEmailDeliveries.mockResolvedValue({
      data: {
        data: {
          results: [
            { type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL, resourceId: 'de-1' },
            { type: EMAIL_DELIVERY_TYPES.SMTP, resourceId: 'smtp-77' }
          ]
        }
      }
    })

    const ctx = {}
    CommonSimulatorFastLaunch.methods.callForDefaultEmailDeliverySetting.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.smtpSettingResourceId).toBe('smtp-77')
    expect(ctx.emailDeliverySettingType).toBe(EMAIL_DELIVERY_TYPES.SMTP)
  })

  it('callForDefaultSmtpSetting uses phishing API for phishing type', async () => {
    getDefaultCompanySmtpSetting.mockResolvedValue({
      data: {
        data: {
          resourceId: 'smtp-ph-1'
        }
      }
    })

    const ctx = {
      type: SCENARIO_TYPES.PHISHING
    }
    CommonSimulatorFastLaunch.methods.callForDefaultSmtpSetting.call(ctx)
    await flushPromises()

    expect(getDefaultCompanySmtpSetting).toHaveBeenCalled()
    expect(ctx.smtpSettingResourceId).toBe('smtp-ph-1')
  })

  it('callForDefaultSmtpSetting uses quishing API for non-phishing type', async () => {
    QuishingService.getDefaultCompanySmtpSetting.mockResolvedValue({
      data: {
        data: {
          resourceId: 'smtp-q-1'
        }
      }
    })

    const ctx = {
      type: SCENARIO_TYPES.QUISHING
    }
    CommonSimulatorFastLaunch.methods.callForDefaultSmtpSetting.call(ctx)
    await flushPromises()

    expect(QuishingService.getDefaultCompanySmtpSetting).toHaveBeenCalled()
    expect(ctx.smtpSettingResourceId).toBe('smtp-q-1')
  })

  it('callForFormDetails sets formDetails using phishing and quishing APIs', async () => {
    getCampaignManagerFormDetails.mockResolvedValue({
      data: {
        data: { a: 1 }
      }
    })
    QuishingService.getCampaignManagerFormDetails.mockResolvedValue({
      data: {
        data: { b: 2 }
      }
    })

    const phishingCtx = {
      type: SCENARIO_TYPES.PHISHING,
      formDetails: {}
    }
    CommonSimulatorFastLaunch.methods.callForFormDetails.call(phishingCtx)
    await flushPromises()
    expect(phishingCtx.formDetails).toEqual({ a: 1 })

    const quishingCtx = {
      type: SCENARIO_TYPES.QUISHING,
      formDetails: {}
    }
    CommonSimulatorFastLaunch.methods.callForFormDetails.call(quishingCtx)
    await flushPromises()
    expect(quishingCtx.formDetails).toEqual({ b: 2 })
  })

  it('changeStep and setActionButtonDisability update local state', () => {
    const ctx = { step: 1, isActionButtonDisabled: false }
    CommonSimulatorFastLaunch.methods.changeStep.call(ctx)
    expect(ctx.step).toBe(2)
    CommonSimulatorFastLaunch.methods.changeStep.call(ctx, -1)
    expect(ctx.step).toBe(1)

    CommonSimulatorFastLaunch.methods.setActionButtonDisability.call(ctx, true)
    expect(ctx.isActionButtonDisabled).toBe(true)
    CommonSimulatorFastLaunch.methods.setActionButtonDisability.call(ctx, false)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('closeOverlay emits on-close immediately when form is not changed', () => {
    mockIsDifferent.mockReturnValue(false)
    const emit = jest.fn()
    const ctx = {
      $refs: {
        refFastLaunch: {
          initialFormValues: { name: 'A' },
          getCurrentFormValues: () => ({ name: 'A' })
        }
      },
      $emit: emit,
      $store: { dispatch: jest.fn() }
    }

    CommonSimulatorFastLaunch.methods.closeOverlay.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-close')
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
  })

  it('closeOverlay opens leaving dialog when form is changed', () => {
    mockIsDifferent.mockReturnValue(true)
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      $refs: {
        refFastLaunch: {
          initialFormValues: { name: 'A' },
          getCurrentFormValues: () => ({ name: 'B' })
        }
      },
      $emit: emit,
      $store: { dispatch }
    }

    CommonSimulatorFastLaunch.methods.closeOverlay.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({
        show: true,
        callback: expect.any(Function)
      })
    )
    const payload = dispatch.mock.calls[0][1]
    payload.callback()
    expect(emit).toHaveBeenCalledWith('on-close')
  })
})
