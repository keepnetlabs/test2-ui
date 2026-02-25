import QuishingService from '@/api/quishing'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import CampaignManagerReportSummaryHeader from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryHeader.vue'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    resendQuishingCampaignToUsers: jest.fn(() => Promise.resolve()),
    exportQuishingCampaignJob: jest.fn(() =>
      Promise.resolve({ status: 200, data: new Uint8Array([1, 2]) })
    )
  }
}))

describe('CampaignManagerReportSummaryHeader.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportSummaryHeader.name).toBe('CampaignManagerReportSummaryHeader')
  })

  it('toggleShowResendDialog and toggleShowTrainingReportsDialog flip state', () => {
    const ctx = { isShowResendDialog: false, isShowTrainingReportsDialog: false }
    CampaignManagerReportSummaryHeader.methods.toggleShowResendDialog.call(ctx)
    CampaignManagerReportSummaryHeader.methods.toggleShowTrainingReportsDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    expect(ctx.isShowTrainingReportsDialog).toBe(true)
  })

  it('handleOnConfirmResend calls api and resets action state', async () => {
    const ctx = {
      id: 'cmp-1',
      instanceGroup: 3,
      isActionButtonDisabled: false,
      isShowResendDialog: false,
      toggleShowResendDialog: CampaignManagerReportSummaryHeader.methods.toggleShowResendDialog
    }

    CampaignManagerReportSummaryHeader.methods.handleOnConfirmResend.call(ctx, [1, 4])
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(QuishingService.resendQuishingCampaignToUsers).toHaveBeenCalledWith(
      { Types: [1, 4] },
      'cmp-1',
      3
    )
    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('handleDownloadReport status 200 creates download link', async () => {
    QuishingService.exportQuishingCampaignJob.mockResolvedValueOnce({
      status: 200,
      data: new Uint8Array([1, 2])
    })

    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test')

    const ctx = {
      id: 'cmp-2',
      instanceGroup: 4,
      isDownloadReportDisabled: false,
      $store: { dispatch: jest.fn() }
    }

    CampaignManagerReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(QuishingService.exportQuishingCampaignJob).toHaveBeenCalledWith('cmp-2', 4)
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(ctx.isDownloadReportDisabled).toBe(false)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('handleDownloadReport status 201/202 dispatches snackbar messages', async () => {
    const dispatch = jest.fn()
    const ctx = {
      id: 'cmp-3',
      instanceGroup: 5,
      isDownloadReportDisabled: false,
      $store: { dispatch }
    }

    QuishingService.exportQuishingCampaignJob.mockResolvedValueOnce({ status: 201, data: {} })
    CampaignManagerReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'Campaign report will be generated',
      ...COMMON_SNACKBAR
    })

    QuishingService.exportQuishingCampaignJob.mockResolvedValueOnce({ status: 202, data: {} })
    CampaignManagerReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'Campaign report is being generated',
      ...COMMON_SNACKBAR
    })
  })
})
