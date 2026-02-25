jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCampaignTabUsers: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                resourceId: 'u1',
                customFieldValues: [{ name: 'Region', value: 'EU' }]
              }
            ],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    ),
    exportCampaignTabUsers: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customB' }])
}))

import CallbackReportEnteredDigitsTable from '@/components/CallbackReport/EnteredDigits/CallbackReportEnteredDigitsTable.vue'
import CallbackService from '@/api/callback'

describe('CallbackReportEnteredDigitsTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CallbackReportEnteredDigitsTable.name).toBe('CallbackReportEnteredDigitsTable')
  })

  it('customFields watcher inserts generated custom field columns', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'firstName' }, { property: 'department' }, { property: 'email' }]
      }
    }
    CallbackReportEnteredDigitsTable.watch.customFields.handler.call(ctx, [{ name: 'Region' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customB')
  })

  it('callForData fetches rows and maps custom field values', async () => {
    const ctx = {
      id: 'id2',
      instanceGroup: 'g2',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    CallbackReportEnteredDigitsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].Region).toBe('EU')
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('handleOnResend emits payload', () => {
    const $emit = jest.fn()
    const ctx = { axiosPayload: { filter: { q: 'x' } }, $emit }

    CallbackReportEnteredDigitsTable.methods.handleOnResend.call(ctx, { resourceId: 'r1' })
    expect($emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['r1'], excludedItems: [], selectAll: false })
    )
  })

  it('exportCampaignManagerReportOpenedTable sets entered-digits filename', async () => {
    const createdLink = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(createdLink)
    const previousCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const ctx = {
      id: 'id2',
      instanceGroup: 'g2',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }

    CallbackReportEnteredDigitsTable.methods.exportCampaignManagerReportOpenedTable.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: true
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(createdLink.download).toBe('Callback-Report-Entered-Digits.xlsx')
    expect(createdLink.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = previousCreateObjectURL
  })
})
