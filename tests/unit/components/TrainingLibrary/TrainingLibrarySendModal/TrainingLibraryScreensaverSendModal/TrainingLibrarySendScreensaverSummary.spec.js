import TrainingLibrarySendScreensaverSummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryScreensaverSendModal/TrainingLibrarySendScreensaverSummary.vue'

describe('TrainingLibrarySendScreensaverSummary.vue', () => {
  it('getCardTitle uses screensaver name', () => {
    const title = TrainingLibrarySendScreensaverSummary.computed.getCardTitle.call({
      formData: { trainingData: { name: 'SS 1' } }
    })
    expect(title).toContain('SS 1')
  })

  it('getTotalTargetGroupsAndUsersCount builds summary text', () => {
    const text = TrainingLibrarySendScreensaverSummary.computed.getTotalTargetGroupsAndUsersCount.call({
      formData: { selectedTargetGroups: [{}, {}] },
      getTotalActiveUsers: 5
    })
    expect(text).toContain('5 active user(s)')
    expect(text).toContain('2 group(s)')
  })
})

