jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    downloadTrainingPackage: jest.fn(() =>
      Promise.resolve({ data: new Blob(['x'], { type: 'application/zip' }) })
    )
  }
}))

jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  getTraining: jest.fn()
}))

import TrainingLibraryLearningPathSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryLearningPathSendModal/TrainingLibraryLearningPathSendModal.vue'

describe('TrainingLibraryLearningPathSendModal.vue', () => {
  it('maps phishing campaign condition types', () => {
    const result =
      TrainingLibraryLearningPathSendModal.methods.handleSetPhishingCampaignConditionTypes.call(
        {},
        { userWhoClickedEmail: true, userWhoReportedAsSuspicious: true }
      )
    expect(result).toEqual(['PhishingLinkClicked', 'ReportedAsSuspicious'])
  })

  it('showSuccessSnackbarAndRouteToEnrollments dispatches and routes', () => {
    const dispatch = jest.fn()
    const handleClose = jest.fn()
    const routeToEnrollments = jest.fn()
    TrainingLibraryLearningPathSendModal.methods.showSuccessSnackbarAndRouteToEnrollments.call(
      { $store: { dispatch }, handleClose, routeToEnrollments },
      { data: { message: 'ok' } }
    )
    expect(dispatch).toHaveBeenCalled()
    expect(handleClose).toHaveBeenCalled()
    expect(routeToEnrollments).toHaveBeenCalled()
  })
})

