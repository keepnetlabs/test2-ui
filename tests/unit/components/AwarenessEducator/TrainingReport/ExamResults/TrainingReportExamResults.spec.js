jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    examTrainingReportResults: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                targetUserResourceId: 'u1',
                examStatusName: 'Passed',
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
    resendTrainingToExamResultList: jest.fn(() => Promise.resolve()),
    exportExamTrainingReportResults: jest.fn(() => Promise.resolve({ data: 'blob-data' }))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOffice' }])
}))

import TrainingReportExamResults from '@/components/AwarenessEducator/TrainingReport/ExamResults/TrainingReportExamResults.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportExamResults.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingReportExamResults.name).toBe('TrainingReportExamResults')
  })

  it('watch customFields appends generated columns', () => {
    const ctx = { tableOptions: { columns: [{ property: 'email' }, { property: 'department' }] } }
    TrainingReportExamResults.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customOffice')
  })

  it('watch customFields does not append when department index is 0', () => {
    const ctx = { tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] } }
    TrainingReportExamResults.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns).toHaveLength(2)
  })

  it('watch customFields inserts generated fields when department column is missing', () => {
    const ctx = { tableOptions: { columns: [{ property: 'email' }, { property: 'firstName' }] } }
    TrainingReportExamResults.watch.customFields.handler.call(ctx, [
      { name: 'Office', fieldDataType: 'string' }
    ])
    expect(ctx.tableOptions.columns[0].property).toBe('customOffice')
  })

  it('watch isScormProxy removes resend action when true', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Resend Training' }, { name: 'Details' }]
      }
    }
    TrainingReportExamResults.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('watch isScormProxy keeps rowActions unchanged when false', () => {
    const original = [{ name: 'Resend Training' }, { name: 'Details' }]
    const ctx = {
      tableOptions: {
        rowActions: [...original]
      }
    }
    TrainingReportExamResults.watch.isScormProxy.handler.call(ctx, false)
    expect(ctx.tableOptions.rowActions).toEqual(original)
  })

  it('watch isScormProxy does nothing when resend action is missing', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Details' }]
      }
    }
    TrainingReportExamResults.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const ctx = { resendItemCount: 0 }
    TrainingReportExamResults.methods.handleSelectionChange.call(ctx, 4)
    expect(ctx.resendItemCount).toBe(4)
  })

  it('handleSearchChange keeps all filters when there are no custom fields', () => {
    const ctx = {
      customFields: [],
      axiosPayload: { filter: { FilterGroups: [{}, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    const searchFilter = {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'email', Value: 'a@b.com' }] }]
      }
    }

    TrainingReportExamResults.methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email', Value: 'a@b.com' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleOnResend prepares payload and toggles dialog', () => {
    const ctx = {
      axiosPayload: { filter: { x: 1 } },
      isShowResendDialog: false
    }
    ctx.toggleIsShowResendDialog = TrainingReportExamResults.methods.toggleIsShowResendDialog
    TrainingReportExamResults.methods.handleOnResend.call(ctx, { targetUserResourceId: 'u1' })
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1'],
      excludedItems: [],
      selectAll: false,
      filter: { x: 1 }
    })
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('callForData maps response and exam status', async () => {
    const ctx = {
      id: 'e1',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportExamResults.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.examTrainingReportResults).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].Office).toBe('TR')
    expect(ctx.tableData[0].examStatus).toBe('Passed')
  })

  it('callForData keeps explicit examStatus when it already exists', async () => {
    AwarenessEducatorService.examTrainingReportResults.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'u2',
              examStatus: 'Failed',
              examStatusName: 'Passed',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'e2',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportExamResults.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData[0].examStatus).toBe('Failed')
  })

  it('resendItem calls API and resets dialog flags', async () => {
    const ctx = {
      id: 'e1',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      callForData: jest.fn(),
      toggleIsShowResendDialog: jest.fn(),
      $refs: { refTable: { resetSelectableParams: jest.fn() } }
    }

    TrainingReportExamResults.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.resendTrainingToExamResultList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'e1'
    )
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.isResendActionButtonDisabled).toBe(false)
  })

  it('handleSearchChange filters out custom field names and triggers refresh', () => {
    const ctx = {
      customFields: [{ name: 'Office' }],
      axiosPayload: { filter: { FilterGroups: [{}, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    TrainingReportExamResults.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'Office', Value: 'TR' },
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

  it('toggleIsShowDetailsModal clears selectedRow when closing', () => {
    const ctx = { isShowDetailsModal: false, selectedRow: { id: 1 } }
    TrainingReportExamResults.methods.toggleIsShowDetailsModal.call(ctx)
    expect(ctx.isShowDetailsModal).toBe(true)
    TrainingReportExamResults.methods.toggleIsShowDetailsModal.call(ctx)
    expect(ctx.isShowDetailsModal).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('handleOnDetail sets selectedRow and opens details modal', () => {
    const row = { targetUserResourceId: 'u3' }
    const ctx = {
      selectedRow: null,
      toggleIsShowDetailsModal: jest.fn()
    }
    TrainingReportExamResults.methods.handleOnDetail.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.toggleIsShowDetailsModal).toHaveBeenCalled()
  })

  it('handleOnResend maps array payload with excluded and selectAll branches', () => {
    const toggle = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'x' } },
      toggleIsShowResendDialog: toggle
    }

    TrainingReportExamResults.methods.handleOnResend.call(
      ctx,
      [{ targetUserResourceId: 'u1' }, { targetUserResourceId: 'u2' }],
      ['u3'],
      true
    )

    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { q: 'x' }
    })
    expect(toggle).toHaveBeenCalled()
  })

  it('toggleIsShowResendDialog only toggles boolean', () => {
    const ctx = { isShowResendDialog: false, selectedRow: { id: 10 } }
    TrainingReportExamResults.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    TrainingReportExamResults.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toEqual({ id: 10 })
  })

  it('exportTrainingReportExamResultsTable maps XLS to Excel and xlsx filename', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      set href(v) {},
      set download(v) {},
      click
    })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:1')

    const ctx = {
      id: 'e1',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportExamResults.methods.exportTrainingReportExamResultsTable.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await Promise.resolve()

    expect(AwarenessEducatorService.exportExamTrainingReportResults).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'e1'
    )
    expect(click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('exportTrainingReportExamResultsTable keeps non-XLS export type', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      set href(v) {},
      set download(v) {},
      click
    })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:2')

    const ctx = {
      id: 'e2',
      axiosPayload: { orderBy: 'email', ascending: false, filter: { a: 1 } }
    }
    TrainingReportExamResults.methods.exportTrainingReportExamResultsTable.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 2,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()

    expect(AwarenessEducatorService.exportExamTrainingReportResults).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' }),
      'e2'
    )
    expect(click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
