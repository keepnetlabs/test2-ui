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
})
