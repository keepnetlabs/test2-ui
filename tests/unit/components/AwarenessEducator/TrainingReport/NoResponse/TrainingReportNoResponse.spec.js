import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingReportNoResponse from '@/components/AwarenessEducator/TrainingReport/NoResponse/TrainingReportNoResponse.vue'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

jest.mock('@/api/awarenessEducator', () => ({
  resendTrainingNoResponseList: jest.fn(() => Promise.resolve()),
  noResponseTrainingReportEmails: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  exportNoResponseReportResults: jest.fn(() => Promise.resolve({ data: {} }))
}))

describe('TrainingReportNoResponse.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getEmptyTableTextMessage returns survey/poster/default variants', () => {
    expect(
      TrainingReportNoResponse.methods.getEmptyTableTextMessage.call({
        isSurvey: true,
        trainingSummary: {}
      })
    ).toBe(labels.EmptyTrainingReportNoResponseSurvey)

    expect(
      TrainingReportNoResponse.methods.getEmptyTableTextMessage.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
    ).toBe(labels.EmptyTrainingNoResponsePoster)

    expect(
      TrainingReportNoResponse.methods.getEmptyTableTextMessage.call({
        isSurvey: false,
        trainingSummary: {}
      })
    ).toBe(labels.EmptyTrainingReportNoResponse)

    expect(
      TrainingReportNoResponse.methods.getEmptyTableTextMessage.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toBe(labels.EmptyTrainingReportInfographic)
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const ctx = { resendItemCount: 0 }
    TrainingReportNoResponse.methods.handleSelectionChange.call(ctx, 7)
    expect(ctx.resendItemCount).toBe(7)
  })

  it('handleOnResend builds payload and toggles dialog', () => {
    const ctx = {
      axiosPayload: { filter: { a: 1 } },
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }

    TrainingReportNoResponse.methods.handleOnResend.call(
      ctx,
      [{ targetUserResourceId: 'u1' }, { targetUserResourceId: 'u2' }],
      ['u9'],
      true
    )

    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1', 'u2'],
      excludedItems: ['u9'],
      selectAll: true,
      filter: { a: 1 }
    })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('handleOnResend maps single item and default excluded/selectAll', () => {
    const ctx = {
      axiosPayload: { filter: { q: 'x' } },
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }

    TrainingReportNoResponse.methods.handleOnResend.call(ctx, { targetUserResourceId: 'single-1' })

    expect(ctx.resendPayload).toEqual({
      selectedItems: ['single-1'],
      excludedItems: [],
      selectAll: false,
      filter: { q: 'x' }
    })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('handleSearchChange excludes custom fields and refreshes data', () => {
    const ctx = {
      customFields: [{ name: 'departmentCode' }],
      axiosPayload: {
        filter: { FilterGroups: [{}, { FilterItems: [] }] }
      },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }

    TrainingReportNoResponse.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'departmentCode', Value: 'x' },
              { FieldName: 'email', Value: 'a@b.com' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email', Value: 'a@b.com' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData maps response and updates server-side props', async () => {
    AwarenessEducatorService.noResponseTrainingReportEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              email: 'a@b.com',
              customFieldValues: [{ name: 'Team', value: 'Blue' }]
            }
          ],
          totalNumberOfRecords: 5,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      axiosPayload: {},
      id: 'report-1',
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    await TrainingReportNoResponse.methods.callForData.call(ctx)

    expect(AwarenessEducatorService.noResponseTrainingReportEmails).toHaveBeenCalledWith(
      {},
      'report-1'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(5)
    expect(ctx.tableData[0]).toEqual(expect.objectContaining({ Team: 'Blue', email: 'a@b.com' }))
  })

  it('callForData handles rows without customFieldValues', async () => {
    AwarenessEducatorService.noResponseTrainingReportEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ email: 'no-custom@x.com' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      axiosPayload: {},
      id: 'report-2',
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    await TrainingReportNoResponse.methods.callForData.call(ctx)

    expect(ctx.tableData[0].email).toBe('no-custom@x.com')
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
  })

  it('computed header/resend/body branches include infographic and default', () => {
    expect(
      TrainingReportNoResponse.computed.getHeaderSubtitle.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toContain('infographic')
    expect(
      TrainingReportNoResponse.computed.getResendDialogTitle.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toBe(labels.ResendInfographic)
    expect(
      TrainingReportNoResponse.computed.getBodyTrainingType.call({
        isSurvey: false,
        trainingSummary: {}
      })
    ).toBe(labels.Training.toLowerCase())
  })

  it('watch isScormProxy removes resend row action when true', () => {
    const ctx = {
      tableOptions: { rowActions: [{ name: 'Resend Training' }, { name: 'Details' }] }
    }
    TrainingReportNoResponse.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('watch isScormProxy keeps row actions as-is when false', () => {
    const original = [{ name: 'Resend Training' }, { name: 'Details' }]
    const ctx = {
      tableOptions: { rowActions: [...original] }
    }
    TrainingReportNoResponse.watch.isScormProxy.handler.call(ctx, false)
    expect(ctx.tableOptions.rowActions).toEqual(original)
  })

  it('watch isScormProxy does nothing when resend action is not present', () => {
    const ctx = {
      tableOptions: { rowActions: [{ name: 'Details' }] }
    }
    TrainingReportNoResponse.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('toggleIsShowResendDialog clears selected row when closing', () => {
    const ctx = { isShowResendDialog: false, selectedRow: { id: 1 } }
    TrainingReportNoResponse.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    TrainingReportNoResponse.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('exportTrainingReportNoResponseTable maps XLS extension and calls click', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      set href(v) {},
      set download(v) {},
      click
    })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:1')
    const ctx = {
      id: 'r1',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }

    TrainingReportNoResponse.methods.exportTrainingReportNoResponseTable.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()

    expect(AwarenessEducatorService.exportNoResponseReportResults).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'r1'
    )
    expect(click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('exportTrainingReportNoResponseTable keeps non-XLS export type', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      set href(v) {},
      set download(v) {},
      click
    })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:2')
    const ctx = {
      id: 'r2',
      axiosPayload: { orderBy: 'email', ascending: false, filter: { a: 1 } }
    }

    TrainingReportNoResponse.methods.exportTrainingReportNoResponseTable.call(ctx, {
      exportTypes: ['PDF'],
      pageNumber: 2,
      pageSize: 25,
      reportAllPages: true
    })
    await Promise.resolve()

    expect(AwarenessEducatorService.exportNoResponseReportResults).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'PDF' }),
      'r2'
    )
    expect(click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
