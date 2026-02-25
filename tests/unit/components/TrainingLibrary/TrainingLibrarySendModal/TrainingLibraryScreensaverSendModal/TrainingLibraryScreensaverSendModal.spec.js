jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  getTraining: jest.fn()
}))

import TrainingLibraryScreensaverSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryScreensaverSendModal/TrainingLibraryScreensaverSendModal.vue'

describe('TrainingLibraryScreensaverSendModal.vue', () => {
  it('maps phishing campaign condition types', () => {
    const result =
      TrainingLibraryScreensaverSendModal.methods.handleSetPhishingCampaignConditionTypes.call(
        {},
        { userWhoOpenedEmail: true, userWhoClickedEmail: true }
      )
    expect(result).toEqual(['EmailOpened', 'PhishingLinkClicked'])
  })

  it('showSuccessSnackbarAndRouteToEnrollments dispatches and routes', () => {
    const dispatch = jest.fn()
    const handleClose = jest.fn()
    const routeToEnrollments = jest.fn()
    TrainingLibraryScreensaverSendModal.methods.showSuccessSnackbarAndRouteToEnrollments.call(
      { $store: { dispatch }, handleClose, routeToEnrollments },
      { data: { message: 'ok' } }
    )
    expect(dispatch).toHaveBeenCalled()
    expect(handleClose).toHaveBeenCalled()
    expect(routeToEnrollments).toHaveBeenCalled()
  })
})

