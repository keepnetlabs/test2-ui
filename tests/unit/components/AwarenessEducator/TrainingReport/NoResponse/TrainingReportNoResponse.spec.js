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
})
