jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getQuishingPdfPreviewContent: jest.fn(() => Promise.resolve({ data: new Uint8Array([1, 2]) }))
  }
}))

import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog.vue'
import QuishingService from '@/api/quishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommonSimulatorEmailTemplatePreviewDialog.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created does not call callForData when status is false', () => {
    const ctx = { status: false, callForData: jest.fn() }
    CommonSimulatorEmailTemplatePreviewDialog.created.call(ctx)
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('created calls callForData when status is true', () => {
    const ctx = { status: true, callForData: jest.fn() }
    CommonSimulatorEmailTemplatePreviewDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData maps attachment as null when phishingFileName is missing', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })
    const ctx = {
      type: 'Phishing',
      selectedRow: { resourceId: 'et-1' },
      isPreviewLoading: false,
      emailTemplateParams: {},
      apiFunc: jest.fn(() =>
        Promise.resolve({
          data: {
            data: {
              fromName: 'A',
              fromAddress: 'a@test.com',
              ccAddresses: [],
              name: 'T1',
              difficultyResourceId: 1,
              subject: 'S',
              template: '<p>x</p>'
            }
          }
        })
      )
    }

    CommonSimulatorEmailTemplatePreviewDialog.methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.emailTemplateParams.attachment).toBeNull()
    expect(ctx.isPreviewLoading).toBe(false)
    setTimeoutSpy.mockRestore()
  })

  it('handlePreviewIndividualPrintout toggles disabled state and opens preview window', async () => {
    if (!URL.createObjectURL) {
      URL.createObjectURL = jest.fn(() => 'blob:test')
    }
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:test')
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => ({
      onload: null,
      document: { title: '' }
    }))

    const ctx = {
      selectedRow: { resourceId: 'q-1' },
      isIndividualPrintoutButtonDisabled: false
    }

    CommonSimulatorEmailTemplatePreviewDialog.methods.handlePreviewIndividualPrintout.call(ctx)
    expect(ctx.isIndividualPrintoutButtonDisabled).toBe(true)

    await flushPromises()
    await flushPromises()

    expect(QuishingService.getQuishingPdfPreviewContent).toHaveBeenCalledWith('q-1')
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(openSpy).toHaveBeenCalledWith('blob:test')
    expect(ctx.isIndividualPrintoutButtonDisabled).toBe(false)

    createObjectURLSpy.mockRestore()
    setTimeoutSpy.mockRestore()
    openSpy.mockRestore()
  })
})
