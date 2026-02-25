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
                customFieldValues: [{ name: 'Office', value: 'TR' }]
              }
            ],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    ),
    exportCampaignTabUsers: jest.fn(() => Promise.resolve({ data: new Blob(['x']) }))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customA' }])
}))

import CallbackReportCalledBackTable from '@/components/CallbackReport/CalledBack/CallbackReportCalledBackTable.vue'
import CallbackService from '@/api/callback'

describe('CallbackReportCalledBackTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CallbackReportCalledBackTable.name).toBe('CallbackReportCalledBackTable')
  })

  it('customFields watcher inserts generated custom field columns', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'firstName' }, { property: 'department' }, { property: 'email' }]
      }
    }
    CallbackReportCalledBackTable.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customA')
  })

  it('callForData fetches rows and maps custom field values', async () => {
    const ctx = {
      id: 'id1',
      instanceGroup: 'g1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    CallbackReportCalledBackTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].Office).toBe('TR')
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('handleOnResend emits payload for single and multiple rows', () => {
    const $emit = jest.fn()
    const ctx = { axiosPayload: { filter: { q: 'x' } }, $emit }

    CallbackReportCalledBackTable.methods.handleOnResend.call(ctx, { resourceId: 'r1' })
    CallbackReportCalledBackTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'r1' }, { resourceId: 'r2' }],
      ['ex1'],
      true
    )

    expect($emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['r1'], excludedItems: [], selectAll: false })
    )
    expect($emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['r1', 'r2'], excludedItems: ['ex1'], selectAll: true })
    )
  })

  it('exportCampaignManagerReportOpenedTable triggers export and download link', async () => {
    const createdLink = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(createdLink)
    const previousCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const ctx = {
      id: 'id1',
      instanceGroup: 'g1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }

    CallbackReportCalledBackTable.methods.exportCampaignManagerReportOpenedTable.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.exportCampaignTabUsers).toHaveBeenCalled()
    expect(createdLink.download).toBe('Callback-Report-Called-Back.csv')
    expect(createdLink.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = previousCreateObjectURL
  })
})
