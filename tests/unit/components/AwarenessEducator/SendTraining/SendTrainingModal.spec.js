jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    downloadTrainingPackage: jest.fn(() =>
      Promise.resolve({ data: 'mock-file' })
    )
  }
}))

import SendTrainingModal from '@/components/AwarenessEducator/SendTraining/SendTrainingModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('SendTrainingModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleSetPhishingCampaignConditionTypes maps selected flags', () => {
    const result = SendTrainingModal.methods.handleSetPhishingCampaignConditionTypes.call({}, {
      userWhoOpenedEmail: true,
      userWhoClickedEmail: false,
      userWhoSubmittedData: true,
      userWhoSubmittedMFACode: true,
      userWhoDownloadedAttachment: false,
      userWhoReportedAsSuspicious: true
    })
    expect(result).toEqual([
      'EmailOpened',
      'DataSubmitted',
      'MfaDataSubmitted',
      'ReportedAsSuspicious'
    ])
  })

  it('showSuccessSnackbarAndRouteToEnrollments dispatches success snackbar and routes', () => {
    const dispatch = jest.fn()
    const routeToEnrollments = jest.fn()
    SendTrainingModal.methods.showSuccessSnackbarAndRouteToEnrollments.call(
      {
        $store: { dispatch },
        routeToEnrollments
      },
      { data: { message: 'ok' } }
    )
    expect(dispatch).toHaveBeenCalled()
    expect(routeToEnrollments).toHaveBeenCalled()
  })

  it('handleDownloadPackage downloads for selected languages and routes', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click,
      set href(v) {},
      set download(v) {}
    })
    const originalCreateObjectURL = globalThis.URL?.createObjectURL
    if (!globalThis.URL) globalThis.URL = {}
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:file')
    const ctx = {
      isActionButtonDisabled: false,
      routeToEnrollments: jest.fn(),
      $refs: {
        refSendTrainingSettings: {
          formData: {
            languageIds: ['en', 'All'],
            name: 'Enrollment-1'
          },
          $refs: {
            refInputContentLanguage: {
              contentLanguageItems: [{ value: 'en', text: 'English' }]
            }
          }
        }
      }
    }

    SendTrainingModal.methods.handleDownloadPackage.call(ctx, { trainingId: 'training-1' })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.downloadTrainingPackage).toHaveBeenCalledWith({
      trainingId: 'training-1',
      languageId: 'en',
      name: 'Enrollment-1'
    })
    expect(click).toHaveBeenCalled()
    expect(ctx.routeToEnrollments).toHaveBeenCalled()
    expect(ctx.isActionButtonDisabled).toBe(false)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
