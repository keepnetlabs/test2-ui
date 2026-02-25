import CallbackService from '@/api/callback'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import CampaignManagerReportSummaryHeader from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryHeader.vue'

jest.mock('@/api/callback', () => ({
  resendCampaignToUsersList: jest.fn(() => Promise.resolve()),
  exportCampaignReport: jest.fn(() => Promise.resolve({ status: 200, data: new Uint8Array([1, 2]) }))
}))

describe('CampaignManagerReportSummaryHeader.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('toggleShowResendDialog flips state', () => {
    const ctx = { isShowResendDialog: false }

    CampaignManagerReportSummaryHeader.methods.toggleShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)

    CampaignManagerReportSummaryHeader.methods.toggleShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('handleOnConfirmResend calls api and resets loading + dialog', async () => {
    const ctx = {
      id: 'cmp-1',
      instanceGroup: 3,
      isActionButtonDisabled: false,
      isShowResendDialog: false,
      toggleShowResendDialog: CampaignManagerReportSummaryHeader.methods.toggleShowResendDialog
    }

    CampaignManagerReportSummaryHeader.methods.handleOnConfirmResend.call(ctx, [1, 4])
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(CallbackService.resendCampaignToUsersList).toHaveBeenCalledWith('cmp-1', 3, {
      Types: [1, 4]
    })
    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('handleDownloadReport status 200 creates download link', async () => {
    CallbackService.exportCampaignReport.mockResolvedValueOnce({
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
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test')

    const ctx = {
      id: 'cmp-2',
      instanceGroup: 4,
      isDownloadReportDisabled: false,
      $store: { dispatch: jest.fn() }
    }

    CampaignManagerReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(CallbackService.exportCampaignReport).toHaveBeenCalledWith('cmp-2', 4)
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

    CallbackService.exportCampaignReport.mockResolvedValueOnce({ status: 201, data: {} })
    CampaignManagerReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'Campaign report will be generated',
      ...COMMON_SNACKBAR
    })

    CallbackService.exportCampaignReport.mockResolvedValueOnce({ status: 202, data: {} })
    CampaignManagerReportSummaryHeader.methods.handleDownloadReport.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'Campaign report is being generated',
      ...COMMON_SNACKBAR
    })
  })
})
