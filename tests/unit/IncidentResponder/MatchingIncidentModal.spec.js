jest.mock('@/api/incidentResponder', () => ({
  getMatchingIncidents: jest.fn()
}))
jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'subject', Value: 'changed' }]),
  columnFilterCleared: jest.fn(() => [{ FieldName: 'subject', Value: '' }])
}))

import { getMatchingIncidents } from '@/api/incidentResponder'
import MatchingIncidentModal from '@/components/IncidentResponder/MatchingIncidentModal.vue'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('MatchingIncidentModal.vue', () => {
  const { methods, computed } = MatchingIncidentModal

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('builds subtitle from selected rule by subtitleProp', () => {
    expect(
      computed.getSelectedMatchingIncidentsSubtitle.call({
        selectedMatch: { ruleName: 'Rule A' },
        subtitleProp: 'ruleName'
      })
    ).toBe('Incidents matching Rule: Rule A')
  })

  it('handleSearchChange keeps only searchable columns and refreshes data', () => {
    const resetPageNumber = jest.fn()
    const callForMatchingIncident = jest.fn()
    const ctx = {
      columns: [
        { property: 'subject', filterableType: 'text' },
        { property: 'createDate', filterableType: 'date' },
        { property: 'reportedBy', filterableType: 'text' }
      ],
      payload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      callForMatchingIncident
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'subject', Value: 'abc' },
              { FieldName: 'unknown', Value: 'x' }
            ]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.payload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'subject', Value: 'abc' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForMatchingIncident).toHaveBeenCalledTimes(1)
  })

  it('server-side page and size updates payload values', () => {
    const callForMatchingIncident = jest.fn()
    const resetPageNumber = jest.fn()
    const ctx = {
      payload: { pageNumber: 5, pageSize: 10 },
      serverSideProps: { pageSize: 10 },
      callForMatchingIncident,
      resetPageNumber
    }

    methods.serverSidePageNumberChanged.call(ctx, 2)
    expect(ctx.payload.pageNumber).toBe(2)

    methods.serverSideSizeChanged.call(ctx, 25)
    expect(ctx.payload.pageSize).toBe(25)
    expect(ctx.serverSideProps.pageSize).toBe(25)
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForMatchingIncident).toHaveBeenCalledTimes(2)
  })

  it('sortChanged and resetPageNumber update sorting and paging', () => {
    const callForMatchingIncident = jest.fn()
    const ctx = {
      payload: { ascending: false, orderBy: 'createDate', pageNumber: 5 },
      serverSideProps: { pageNumber: 5 },
      callForMatchingIncident
    }

    methods.sortChanged.call(ctx, { order: 'ascending', prop: 'subject' })
    expect(ctx.payload.ascending).toBe(true)
    expect(ctx.payload.orderBy).toBe('subject')
    expect(callForMatchingIncident).toHaveBeenCalledTimes(1)

    methods.resetPageNumber.call(ctx)
    expect(ctx.payload.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
  })

  it('callForMatchingIncident fills table data and server props', async () => {
    getMatchingIncidents.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ subject: 'A' }],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      payload: { pageNumber: 1 },
      selectedMatch: { resourceId: 'rule-1' },
      isMatchingModalLoading: false,
      serverSideProps: {},
      tableData: []
    }

    methods.callForMatchingIncident.call(ctx)
    await flushPromises()

    expect(getMatchingIncidents).toHaveBeenCalledWith({ pageNumber: 1 }, 'rule-1')
    expect(ctx.tableData).toEqual([{ subject: 'A' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.isMatchingModalLoading).toBe(false)
  })

  it('columnFilterChanged and columnFilterCleared update first filter group', () => {
    const callForMatchingIncident = jest.fn()
    const ctx = {
      payload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }]
        }
      },
      callForMatchingIncident
    }

    methods.columnFilterChanged.call(ctx, { property: 'subject' })
    expect(columnFilterChanged).toHaveBeenCalled()
    expect(ctx.payload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'subject', Value: 'changed' }
    ])

    methods.columnFilterCleared.call(ctx, 'subject')
    expect(columnFilterCleared).toHaveBeenCalled()
    expect(ctx.payload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'subject', Value: '' }
    ])
    expect(callForMatchingIncident).toHaveBeenCalledTimes(2)
  })

  it('closeOverlay emits closeOverlay event', () => {
    const emit = jest.fn()
    methods.closeOverlay.call({ $emit: emit })

    expect(emit).toHaveBeenCalledWith('closeOverlay')
  })

  it('created sets pageSize and calls fetch only when selectedMatch exists', () => {
    const callForMatchingIncident = jest.fn()
    const withSelected = {
      selectedMatch: { resourceId: 'r1' },
      serverSideProps: { pageSize: 10 },
      callForMatchingIncident
    }
    const withoutSelected = {
      selectedMatch: null,
      serverSideProps: { pageSize: 10 },
      callForMatchingIncident
    }

    MatchingIncidentModal.created.call(withSelected)
    MatchingIncidentModal.created.call(withoutSelected)

    expect(withSelected.serverSideProps.pageSize).toBe(5)
    expect(callForMatchingIncident).toHaveBeenCalledTimes(1)
  })
})
