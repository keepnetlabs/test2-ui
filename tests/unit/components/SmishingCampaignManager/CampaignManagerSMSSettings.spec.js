jest.mock('@/api/smishing', () => ({
  getPhoneNumbers: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getDistributionDelayTimeItems: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

import CampaignManagerSMSSettings from '@/components/SmishingCampaignManager/CampaignManagerSMSSettings.vue'

describe('CampaignManagerSMSSettings.vue', () => {
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
})
