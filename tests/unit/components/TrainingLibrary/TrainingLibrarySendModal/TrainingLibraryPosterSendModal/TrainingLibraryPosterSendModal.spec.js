jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  getTraining: jest.fn()
}))

import TrainingLibraryPosterSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryPosterSendModal/TrainingLibraryPosterSendModal.vue'

describe('TrainingLibraryPosterSendModal.vue', () => {
  it('maps phishing campaign condition types', () => {
    const result =
      TrainingLibraryPosterSendModal.methods.handleSetPhishingCampaignConditionTypes.call({}, {
        userWhoDownloadedAttachment: true,
        userWhoSubmittedData: true
      })
    expect(result).toEqual(['DataSubmitted', 'AttachmentDownloaded'])
  })

  it('showSuccessSnackbarAndRouteToEnrollments dispatches and routes', () => {
    const dispatch = jest.fn()
    const handleClose = jest.fn()
    const routeToEnrollments = jest.fn()
    TrainingLibraryPosterSendModal.methods.showSuccessSnackbarAndRouteToEnrollments.call(
      { $store: { dispatch }, handleClose, routeToEnrollments },
      { data: { message: 'ok' } }
    )
    expect(dispatch).toHaveBeenCalled()
    expect(handleClose).toHaveBeenCalled()
    expect(routeToEnrollments).toHaveBeenCalled()
  })
})

