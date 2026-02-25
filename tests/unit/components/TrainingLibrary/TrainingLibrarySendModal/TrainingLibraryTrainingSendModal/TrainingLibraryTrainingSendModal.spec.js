jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingTypeCount: jest.fn(),
    createEnrollment: jest.fn(),
    getPhoneNumbers: jest.fn(),
    getTrainingUrlForPreview: jest.fn(),
    downloadTrainingPackage: jest.fn()
  }
}))

import TrainingLibraryTrainingSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryTrainingSendModal/TrainingLibraryTrainingSendModal.vue'

describe('TrainingLibraryTrainingSendModal.vue', () => {
  it('getTitle returns selected training name', () => {
    const title = TrainingLibraryTrainingSendModal.computed.getTitle.call({
      selectedRow: { trainingName: 'Security 101' }
    })
    expect(title).toBe('Send Training - Security 101')
  })

  it('getTimeZoneText returns display name by id', () => {
    const value = TrainingLibraryTrainingSendModal.methods.getTimeZoneText.call(
      {
        getTimezones: { timeZoneList: [{ id: 'tz1', displayName: 'UTC+3' }] }
      },
      'tz1'
    )
    expect(value).toBe('UTC+3')
  })

  it('handleSetPhishingCampaignConditionTypes maps selected flags', () => {
    const result = TrainingLibraryTrainingSendModal.methods.handleSetPhishingCampaignConditionTypes(
      {
        userWhoOpenedEmail: true,
        userWhoSubmittedMFACode: true,
        userWhoReportedAsSuspicious: true
      }
    )
    expect(result).toEqual(['EmailOpened', 'MfaDataSubmitted', 'ReportedAsSuspicious'])
  })
})
