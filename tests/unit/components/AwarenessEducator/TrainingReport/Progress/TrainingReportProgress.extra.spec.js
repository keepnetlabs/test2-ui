import TrainingReportProgress from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgress.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingReportProgress.vue (extra)', () => {
  it('computed title/body include poster branch', () => {
    const ctx = {
      isSurvey: false,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
    }

    expect(TrainingReportProgress.computed.getResendDialogTitle.call(ctx)).toBe(labels.ResendPoster)
    expect(TrainingReportProgress.computed.getBodyTrainingType.call(ctx)).toBe(
      labels.Poster.toLowerCase()
    )
  })

  it('watch customFields no-ops when department index is 0', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    TrainingReportProgress.watch.customFields.handler.call(ctx, [
      { name: 'x', fieldDataType: 'string' }
    ])

    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('watch isScormProxy does not mutate row actions when value is false', () => {
    const rowActions = [{ name: 'Resend Training' }, { name: 'Details' }]
    const ctx = {
      isSurvey: false,
      tableOptions: { rowActions: [...rowActions] }
    }

    TrainingReportProgress.watch.isScormProxy.handler.call(ctx, false)

    expect(ctx.tableOptions.rowActions).toEqual(rowActions)
  })

  it('handleSearchChange filters out custom-field search items and refreshes data', () => {
    const callForData = jest.fn()
    const resetPageNumber = jest.fn()
    const ctx = {
      customFields: [{ name: 'Office' }],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      callForData,
      resetPageNumber
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'firstName', Value: 'a' },
              { FieldName: 'Office', Value: 'TR' }
            ]
          }
        ]
      }
    }

    TrainingReportProgress.methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'firstName', Value: 'a' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleOnResend maps array payload and selectAll branch', () => {
    const toggleIsShowResendDialog = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'x' } },
      toggleIsShowResendDialog
    }

    TrainingReportProgress.methods.handleOnResend.call(
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
    expect(toggleIsShowResendDialog).toHaveBeenCalledTimes(1)
  })

  it('watch customFields inserts generated fields when department column is missing', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'email' }, { property: 'firstName' }] }
    }

    TrainingReportProgress.watch.customFields.handler.call(ctx, [
      { name: 'Office', fieldDataType: 'string' }
    ])

    expect(ctx.tableOptions.columns[0].property).toBe('Office')
  })

  it('handleSelectionChange sets resend item count', () => {
    const ctx = { resendItemCount: 0 }
    TrainingReportProgress.methods.handleSelectionChange.call(ctx, 9)
    expect(ctx.resendItemCount).toBe(9)
  })

  it('callForData keeps explicit examStatus if provided', async () => {
    const progressSpy = jest
      .spyOn(AwarenessEducatorService, 'progressTrainingReportEmails')
      .mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              targetUserResourceId: 'u9',
              examStatus: 'Completed',
              examStatusName: 'In Progress',
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
      id: 'p9',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    TrainingReportProgress.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData[0].examStatus).toBe('Completed')
    progressSpy.mockRestore()
  })

  it('exportTrainingProgressEmailTable keeps non-XLS export type and survey filename prefix', async () => {
    const exportSpy = jest
      .spyOn(AwarenessEducatorService, 'exportProgressTrainingReportEmails')
      .mockResolvedValueOnce({ data: 'blob-data' })
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      set href(v) {},
      set download(v) {
        this._download = v
      },
      get download() {
        return this._download
      },
      click
    })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:2')
    const ctx = {
      id: 'p2',
      isSurvey: true,
      axiosPayload: { orderBy: 'email', ascending: false, filter: { q: 'a' } }
    }

    TrainingReportProgress.methods.exportTrainingProgressEmailTable.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 2,
      pageSize: 25,
      reportAllPages: false
    })
    await Promise.resolve()

    expect(exportSpy).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' }),
      'p2'
    )
    expect(click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
    exportSpy.mockRestore()
  })
})
