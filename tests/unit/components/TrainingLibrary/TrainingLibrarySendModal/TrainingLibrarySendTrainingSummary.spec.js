jest.mock('awesome-phonenumber', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getRegionCode: () => 'US',
    g: { number: { international: '+1 555-123-4567' } }
  }))
}))

import TrainingLibrarySendTrainingSummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSummary.vue'

describe('TrainingLibrarySendTrainingSummary.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendTrainingSummary.name).toBe('TrainingLibrarySendTrainingSummary')
  })

  it('getSettingItems returns formData settings', () => {
    const ctx = {
      formData: { settings: { Reminder: true } }
    }
    expect(TrainingLibrarySendTrainingSummary.computed.getSettingItems.call(ctx)).toEqual({
      Reminder: true
    })
  })

  it('isReminder returns getSettingItems Reminder', () => {
    const ctx = {
      getSettingItems: { Reminder: true }
    }
    expect(TrainingLibrarySendTrainingSummary.computed.isReminder.call(ctx)).toBe(true)
  })

  it('isProxy returns formData isProxy', () => {
    const ctx = {
      formData: { isProxy: true }
    }
    expect(TrainingLibrarySendTrainingSummary.computed.isProxy.call(ctx)).toBe(true)
  })

  it('getTotalTargetGroupsAndUsersCount returns formatted text', () => {
    const ctx = {
      formData: {
        selectedTargetGroups: [{ id: 1 }, { id: 2 }],
        userCountDetailResponse: {
          data: {
            data: [
              {
                status: 'Active',
                domainAllowList: [{ status: 'Verified', count: 5 }]
              }
            ]
          }
        }
      },
      getTotalActiveUsers: 5
    }
    const result = TrainingLibrarySendTrainingSummary.computed.getTotalTargetGroupsAndUsersCount.call(
      ctx
    )
    expect(result).toContain('5 active user(s)')
    expect(result).toContain('2 group(s)')
  })

  it('getEnrollmentLanguageItems maps languages', () => {
    const ctx = {
      formData: {
        enrollmentData: {
          languages: [
            { languageTypeName: 'English', languageTypeResourceId: 'en' }
          ]
        }
      }
    }
    const result = TrainingLibrarySendTrainingSummary.computed.getEnrollmentLanguageItems.call(ctx)
    expect(result).toEqual([{ text: 'English', value: 'en' }])
  })
})
