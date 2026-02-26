jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    previewSmishingScenario: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            textTemplate: {},
            landingPageTemplate: {}
          }
        }
      })
    )
  }
}))

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTraining: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } }))
  }
}))

import CampaignManagerSummary from '@/components/SmishingCampaignManager/CampaignManagerSummary.vue'

describe('CampaignManagerSummary.vue', () => {
  const baseFormData = {
    name: 'Campaign',
    selectedSchedule: 'Now',
    duration: 7,
    senderPhoneNumber: ['+10000000'],
    useTargetUserTimeZone: false,
    frequency: 'Once',
    selectedPhishingScenarios: [],
    targetGroupResourceIds: ['g1'],
    sendRandomlyUsersCalculateTypeId: '1',
    sendRandomlyUsersCount: 20,
    userCountDetailResponse: {
      data: {
        data: [
          {
            status: 'Active',
            domainAllowList: [{ status: 'Verified', count: 10 }],
            hasPhoneNumber: [
              { status: 'Yes', count: 8 },
              { status: 'No', count: 2 }
            ],
            timeZone: [{ status: 'No', count: 1 }]
          }
        ]
      }
    }
  }

  it('getHeaderStyle returns 2 columns when no other settings', () => {
    const style = CampaignManagerSummary.computed.getHeaderStyle.call({ getOtherSettingsItems: {} })
    expect(style).toEqual({ gridTemplateColumns: '1fr 1fr' })
  })

  it('getHeaderStyle returns 3 columns when other settings exist', () => {
    const style = CampaignManagerSummary.computed.getHeaderStyle.call({
      getOtherSettingsItems: { isExcludeFromReports: 'x' }
    })
    expect(style).toEqual({ gridTemplateColumns: '1fr 1fr 1fr' })
  })

  it('getSettingsItems returns single sender number format', () => {
    const items = CampaignManagerSummary.computed.getSettingsItems.call({ formData: baseFormData })
    expect(items).toEqual(
      expect.objectContaining({
        Starting: 'Now',
        Duration: 7,
        Frequency: 'Once',
        'Sender Phone Number': '+10000000'
      })
    )
  })

  it('getSettingsItems returns multiple sender numbers and timezone label', () => {
    const formData = {
      ...baseFormData,
      selectedSchedule: 'Immediately',
      useTargetUserTimeZone: true,
      senderPhoneNumber: ['+1', '+2']
    }
    const items = CampaignManagerSummary.computed.getSettingsItems.call({ formData })
    expect(items.Starting).toContain('Target users')
    expect(items['Sender Phone Numbers']).toEqual(['+1', '+2'])
  })

  it('getMethodDetail counts scenario methods', () => {
    const ctx = {
      phishingScenarios: [
        { method: 'Click-Only' },
        { method: 'Data Submission' },
        { method: 'Data Submission' }
      ]
    }
    expect(CampaignManagerSummary.computed.getMethodDetail.call(ctx)).toEqual(
      expect.arrayContaining([
        { method: 'Click-Only', count: 1 },
        { method: 'Data Submission', count: 2 }
      ])
    )
  })

  it('getTotalRandomlySelectedUserCount builds percentage text', () => {
    const ctx = {
      formData: baseFormData,
      getTotalActiveUsers: 10
    }
    const text = CampaignManagerSummary.computed.getTotalRandomlySelectedUserCount.call(ctx)
    expect(text).toContain('Randomly selected %20')
  })

  it('toggleScheduleDialog and sender modal methods toggle booleans', () => {
    const ctx = { isShowScheduleDialog: false, isSenderPhoneNumbersModalVisible: false }
    CampaignManagerSummary.methods.toggleScheduleDialog.call(ctx)
    expect(ctx.isShowScheduleDialog).toBe(true)
    CampaignManagerSummary.methods.handleSenderPhoneNumbersClick.call(ctx)
    expect(ctx.isSenderPhoneNumbersModalVisible).toBe(true)
    CampaignManagerSummary.methods.handleCloseSenderPhoneNumbersModal.call(ctx)
    expect(ctx.isSenderPhoneNumbersModalVisible).toBe(false)
  })

  it('callForScenarioDetail returns early when no resource id', () => {
    const ctx = { formData: {}, trainingParams: null, isScenarioDetailLoading: false }
    CampaignManagerSummary.methods.callForScenarioDetail.call(ctx, {})
    expect(ctx.isScenarioDetailLoading).toBe(false)
    expect(ctx.trainingParams).toBe(null)
  })
})
