jest.mock('@/api/phishingsimulator')
jest.mock('@/api/targetUsers')
jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
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

import CommonSimulatorFastLaunch from '@/components/Common/Simulator/CommonSimulatorFastLaunch.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { createCampaignManager } from '@/api/phishingsimulator'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import QuishingService from '@/api/quishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommonSimulatorFastLaunch.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('isQuishingTypeIndividualPrintOut returns false when not quishing', () => {
      expect(
        CommonSimulatorFastLaunch.computed.isQuishingTypeIndividualPrintOut.call({
          type: SCENARIO_TYPES.PHISHING
        })
      ).toBe(false)
    })

    it('isQuishingTypeIndividualPrintOut returns false when quishingType does not match', () => {
      expect(
        CommonSimulatorFastLaunch.computed.isQuishingTypeIndividualPrintOut.call({
          type: SCENARIO_TYPES.QUISHING,
          selectedScenario: { quishingType: 'Email' }
        })
      ).toBe(false)
    })

    it('isMFAScenarioSelected returns false when method is not MFA', () => {
      expect(
        CommonSimulatorFastLaunch.computed.isMFAScenarioSelected.call({
          selectedScenario: { method: 'Click-Only' }
        })
      ).toBe(false)
    })

    it('isMFAScenarioSelected returns false when selectedScenario is undefined', () => {
      expect(
        CommonSimulatorFastLaunch.computed.isMFAScenarioSelected.call({
          selectedScenario: undefined
        })
      ).toBeFalsy()
    })

    it('getFormDataForCampaignSummary uses templateType from emailTemplateParams', () => {
      const ctx = {
        step: 2,
        selectedScenario: { resourceId: 'sc-1', name: 'X' },
        emailTemplateParams: { type: 'Individual Printout' },
        emailTemplate: '<p>x</p>',
        directEmailSettingResourceId: 'de-1',
        smtpSettingResourceId: 'smtp-1',
        $refs: {
          refFastLaunch: {
            formData: {},
            selectedTargetGroups: [{ name: 'G', userCount: 1, resourceId: 'tg-1' }],
            $refs: {
              refCampaignManagerCampaignInfo: { formData: { name: 'Campaign' } }
            }
          }
        }
      }
      const result = CommonSimulatorFastLaunch.computed.getFormDataForCampaignSummary.call(ctx)
      expect(result.templateType).toBe('Individual Printout')
    })
  })

  describe('methods', () => {
    it('handleSubmit step 1 marks target groups invalid when no mapped groups exist', async () => {
      const ctx = {
        step: 1,
        $refs: {
          refFastLaunch: {
            selectedTargetGroups: [],
            selectedTargetGroupsMapped: [],
            $refs: {
              refCampaignManagerCampaignInfo: {
                formData: {},
                $refs: { refForm: { validate: jest.fn(() => true) } }
              },
              refCampaignManagerTargetAudience: {
                isTargetGroupsValid: true
              }
            }
          }
        }
      }

      await CommonSimulatorFastLaunch.methods.handleSubmit.call(ctx)
      expect(ctx.$refs.refFastLaunch.$refs.refCampaignManagerTargetAudience.isTargetGroupsValid).toBe(false)
    })

    it('handleSubmit step 1 sets user-count error when total user count is zero', async () => {
      const changeStep = jest.fn()
      const setActionButtonDisability = jest.fn()
      const ctx = {
        step: 1,
        changeStep,
        setActionButtonDisability,
        $refs: {
          refFastLaunch: {
            selectedTargetGroups: [{ resourceId: 'tg-1' }],
            selectedTargetGroupsMapped: [{ extraDatas: { userCount: 0 } }],
            formData: {},
            $refs: {
              refCampaignManagerCampaignInfo: {
                formData: {},
                $refs: { refForm: { validate: jest.fn(() => true) } }
              },
              refCampaignManagerTargetAudience: {
                selectedTargetGroups: [{ resourceId: 'tg-1' }],
                isShowTargetGroupUsersError: false,
                isTargetGroupsValid: true
              }
            }
          }
        }
      }

      await CommonSimulatorFastLaunch.methods.handleSubmit.call(ctx)
      expect(changeStep).not.toHaveBeenCalled()
      expect(setActionButtonDisability).not.toHaveBeenCalled()
      expect(ctx.$refs.refFastLaunch.$refs.refCampaignManagerTargetAudience.isShowTargetGroupUsersError).toBe(true)
      expect(ctx.$refs.refFastLaunch.$refs.refCampaignManagerTargetAudience.isTargetGroupsValid).toBe(false)
    })

    it('handleSubmit step 1 fetches target count and advances step when valid', async () => {
      getTargetGroupCountDetail.mockResolvedValueOnce({ data: { userCount: 3 } })
      const changeStep = jest.fn()
      const setActionButtonDisability = jest.fn()
      const ctx = {
        step: 1,
        changeStep,
        setActionButtonDisability,
        $refs: {
          refFastLaunch: {
            selectedTargetGroups: [{ resourceId: 'tg-1' }],
            selectedTargetGroupsMapped: [{ extraDatas: { userCount: 3 } }],
            formData: {},
            $refs: {
              refCampaignManagerCampaignInfo: {
                formData: {},
                $refs: { refForm: { validate: jest.fn(() => true) } }
              },
              refCampaignManagerTargetAudience: {
                selectedTargetGroups: [{ resourceId: 'tg-1' }],
                isShowTargetGroupUsersError: false,
                isTargetGroupsValid: false
              }
            }
          }
        }
      }

      await CommonSimulatorFastLaunch.methods.handleSubmit.call(ctx)
      expect(getTargetGroupCountDetail).toHaveBeenCalledWith(['tg-1'])
      expect(setActionButtonDisability).toHaveBeenNthCalledWith(1, true)
      expect(setActionButtonDisability).toHaveBeenNthCalledWith(2, false)
      expect(changeStep).toHaveBeenCalled()
    })

    it('handleSubmit step 2 creates phishing campaign and routes to campaign manager', async () => {
      createCampaignManager.mockResolvedValueOnce({})
      const push = jest.fn()
      const setActionButtonDisability = jest.fn()
      const ctx = {
        step: 2,
        type: SCENARIO_TYPES.PHISHING,
        selectedScenario: { resourceId: 'sc-1' },
        emailDeliverySettingType: EMAIL_DELIVERY_TYPES.SMTP,
        smtpSettingResourceId: 'smtp-1',
        directEmailSettingResourceId: '',
        isSubmitted: false,
        setActionButtonDisability,
        $router: { push },
        $refs: {
          refFastLaunch: {
            formData: {
              excludeFromReports: false,
              sendRandomlyUsers: false,
              sendRandomlyUsersCount: 0,
              sendRandomlyUsersCalculateTypeId: 1
            },
            selectedTargetGroups: [{ resourceId: 'tg-1' }],
            $refs: {
              refCampaignManagerCampaignInfo: {
                formData: { name: 'C1' },
                $refs: { refForm: { validate: jest.fn(() => true) } }
              },
              refCampaignManagerTargetAudience: {
                selectedTargetGroups: [{ resourceId: 'tg-1' }],
                isShowTargetGroupUsersError: false,
                isTargetGroupsValid: true
              }
            }
          }
        }
      }

      CommonSimulatorFastLaunch.methods.handleSubmit.call(ctx)
      await flushPromises()
      await flushPromises()

      expect(createCampaignManager).toHaveBeenCalled()
      expect(push).toHaveBeenCalledWith({ name: 'Campaign Manager' })
      expect(ctx.isSubmitted).toBe(true)
    })

    it('handleSubmit step 2 creates quishing campaign and routes accordingly', async () => {
      QuishingService.createCampaignManager.mockResolvedValueOnce({})
      const push = jest.fn()
      const setActionButtonDisability = jest.fn()
      const ctx = {
        step: 2,
        type: SCENARIO_TYPES.QUISHING,
        selectedScenario: { resourceId: 'q-1' },
        emailDeliverySettingType: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL,
        smtpSettingResourceId: '',
        directEmailSettingResourceId: 'de-1',
        isSubmitted: false,
        setActionButtonDisability,
        $router: { push },
        $refs: {
          refFastLaunch: {
            formData: {
              excludeFromReports: false,
              sendRandomlyUsers: false,
              sendRandomlyUsersCount: 0,
              sendRandomlyUsersCalculateTypeId: 1
            },
            selectedTargetGroups: [{ resourceId: 'tg-1' }],
            $refs: {
              refCampaignManagerCampaignInfo: {
                formData: { name: 'Q1' },
                $refs: { refForm: { validate: jest.fn(() => true) } }
              },
              refCampaignManagerTargetAudience: {
                selectedTargetGroups: [{ resourceId: 'tg-1' }],
                isShowTargetGroupUsersError: false,
                isTargetGroupsValid: true
              }
            }
          }
        }
      }

      CommonSimulatorFastLaunch.methods.handleSubmit.call(ctx)
      await flushPromises()
      await flushPromises()

      expect(QuishingService.createCampaignManager).toHaveBeenCalled()
      expect(push).toHaveBeenCalledWith({ name: 'Quishing Campaign Manager' })
      expect(ctx.isSubmitted).toBe(true)
    })
  })
})
