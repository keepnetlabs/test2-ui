jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getSmishingPhoneNumbers: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    calculateSendingInfo: jest.fn(() =>
      Promise.resolve({ data: { data: { totalSendSecond: 10, batchEverySendSecond: 5 } } })
    )
  }
}))

import CampaignManagerSMSSettings from '@/components/SmishingCampaignManager/CampaignManagerSMSSettings.vue'
import { DISTRIBUTION_START_TYPES } from '@/components/SmishingCampaignManager/utils'

describe('CampaignManagerSMSSettings.vue', () => {
  it('selectedPhishingScenarios prop defaults to an empty array', () => {
    const def = CampaignManagerSMSSettings.props.selectedPhishingScenarios.default
    expect(def()).toEqual([])
  })

  it('getDistributionText returns single user message when count is 1', () => {
    const ctx = { totalTargetUserCount: 1 }
    expect(CampaignManagerSMSSettings.computed.getDistributionText.call(ctx)).toContain('single user')
  })

  it('handlePhoneNumberChange filters and maps phone numbers', () => {
    const ctx = {
      phoneNumberItems: [
        { resourceId: 'p1', phoneNumber: '123' },
        { resourceId: 'p2', phoneNumber: '456' }
      ],
      formData: { phoneNumbers: [], smsProviderNumberResourceIds: [] }
    }
    CampaignManagerSMSSettings.methods.handlePhoneNumberChange.call(ctx, ['p1'])
    expect(ctx.formData.phoneNumbers).toEqual(['123'])
    expect(ctx.formData.smsProviderNumberResourceIds).toEqual(['p1'])
  })

  it('validateForm returns false when refForm.validate is false', () => {
    const ctx = {
      $refs: {
        refForm: { validate: () => false, $el: { querySelector: () => null } },
        inputSchedule: { validateInput: () => true }
      },
      inputDistributionFormData: { distributionStartTypeId: DISTRIBUTION_START_TYPES.NOW },
      $nextTick: (fn) => fn()
    }
    expect(CampaignManagerSMSSettings.methods.validateForm.call(ctx)).toBe(false)
  })

  it('validateForm returns true when refs validate and distribution is not scheduled window', () => {
    const ctx = {
      $refs: {
        refForm: { validate: () => true, $el: { querySelector: () => null } },
        inputSchedule: { validateInput: () => true }
      },
      inputDistributionFormData: { distributionStartTypeId: DISTRIBUTION_START_TYPES.NOW },
      $nextTick: (fn) => fn()
    }
    expect(CampaignManagerSMSSettings.methods.validateForm.call(ctx)).toBe(true)
  })

  it('validateForm returns false for scheduled distribution without window fields', () => {
    const ctx = {
      $refs: {
        refForm: { validate: () => true, $el: { querySelector: () => null } },
        inputSchedule: { validateInput: () => true }
      },
      inputDistributionFormData: {
        distributionStartTypeId: DISTRIBUTION_START_TYPES.SCHEDULED,
        distributionStartTime: '',
        distributionEndTime: '',
        distributionDays: 0
      },
      $nextTick: (fn) => fn()
    }
    expect(CampaignManagerSMSSettings.methods.validateForm.call(ctx)).toBeFalsy()
  })

  it('callForCalculateSendingInfo does not debounce when there are no target groups', () => {
    const ctx = {
      targetGroupResourceIds: [],
      totalTargetUserCount: 10,
      inputDistributionFormData: { distributionDelayEvery: 20 },
      debounce: jest.fn()
    }
    CampaignManagerSMSSettings.methods.callForCalculateSendingInfo.call(ctx)
    expect(ctx.debounce).not.toHaveBeenCalled()
  })

  it('callForCalculateSendingInfo does not debounce when totalTargetUserCount is 1', () => {
    const ctx = {
      targetGroupResourceIds: ['g1'],
      totalTargetUserCount: 1,
      inputDistributionFormData: { distributionDelayEvery: 20 },
      debounce: jest.fn()
    }
    CampaignManagerSMSSettings.methods.callForCalculateSendingInfo.call(ctx)
    expect(ctx.debounce).not.toHaveBeenCalled()
  })
})
