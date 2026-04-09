jest.mock('@/api/incidentResponder', () => ({
  getMatchingIncidents: jest.fn()
}))
jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'subject', Value: 'changed' }]),
  columnFilterCleared: jest.fn(() => [{ FieldName: 'subject', Value: '' }])
}))

import { getMatchingIncidents } from '@/api/incidentResponder'
import MatchingIncidentModal from '@/components/IncidentResponder/MatchingIncidentModal.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('MatchingIncidentModal.vue (extra branch coverage)', () => {
  const { methods, computed } = MatchingIncidentModal

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('subtitle is undefined when there is no selected match', () => {
    expect(
      computed.getSelectedMatchingIncidentsSubtitle.call({
        selectedMatch: null,
        subtitleProp: 'ruleName'
      })
    ).toBeFalsy()
  })

  it('handleSearchChange matches columns case-insensitively', () => {
    const resetPageNumber = jest.fn()
    const callForMatchingIncident = jest.fn()
    const ctx = {
      columns: [
        { property: 'reportedBy', filterableType: 'text' },
        { property: 'subject', filterableType: 'text' }
      ],
      payload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      callForMatchingIncident
    }

    methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'REPORTEDBY', Value: 'alex' }]
          }
        ]
      }
    })

    expect(ctx.payload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'REPORTEDBY', Value: 'alex' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForMatchingIncident).toHaveBeenCalledTimes(1)
  })

  it('server-side handlers use default values when arguments are omitted', () => {
    const callForMatchingIncident = jest.fn()
    const resetPageNumber = jest.fn(function () {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    })
    const ctx = {
      payload: { pageNumber: 9, pageSize: 25 },
      serverSideProps: { pageNumber: 9, pageSize: 25 },
      callForMatchingIncident,
      resetPageNumber
    }

    methods.serverSidePageNumberChanged.call(ctx)
    methods.serverSideSizeChanged.call(ctx)

    expect(ctx.payload.pageNumber).toBe(1)
    expect(ctx.payload.pageSize).toBe(10)
    expect(ctx.serverSideProps.pageSize).toBe(10)
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForMatchingIncident).toHaveBeenCalledTimes(2)
  })

  it('sortChanged keeps ascending false for descending or missing order', () => {
    const callForMatchingIncident = jest.fn()
    const ctx = {
      payload: { ascending: true, orderBy: 'createDate' },
      callForMatchingIncident
    }

    methods.sortChanged.call(ctx, { order: 'descending', prop: 'reportedBy' })
    expect(ctx.payload.ascending).toBe(false)
    expect(ctx.payload.orderBy).toBe('reportedBy')

    methods.sortChanged.call(ctx)
    expect(ctx.payload.ascending).toBe(false)
    expect(ctx.payload.orderBy).toBeUndefined()
    expect(callForMatchingIncident).toHaveBeenCalledTimes(2)
  })

  it('callForMatchingIncident defaults results to an empty array when API omits them', async () => {
    getMatchingIncidents.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      payload: { pageNumber: 1 },
      selectedMatch: { resourceId: 'rule-2' },
      isMatchingModalLoading: false,
      serverSideProps: {},
      tableData: [{ subject: 'stale' }]
    }

    methods.callForMatchingIncident.call(ctx)
    await flushPromises()

    expect(getMatchingIncidents).toHaveBeenCalledWith({ pageNumber: 1 }, 'rule-2')
    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(0)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.isMatchingModalLoading).toBe(false)
  })
})
