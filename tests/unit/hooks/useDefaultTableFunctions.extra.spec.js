import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn((filter, payload) => []),
  columnFilterCleared: jest.fn((fieldName, payload) => [])
}))

describe('useDefaultTableFunctions (extra branch coverage)', () => {
  let component

  beforeEach(() => {
    jest.clearAllMocks()
    component = {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 5,
        ascending: true,
        orderBy: 'id',
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            { FilterItems: [] }
          ],
          SearchInputTextValue: ''
        }
      },
      serverSideProps: {
        pageNumber: 1,
        pageSize: 5
      },
      callForData: jest.fn(),
      resetPageNumber: useDefaultTableFunctions.methods.resetPageNumber,
      ...useDefaultTableFunctions.methods
    }
  })

  it('handleSearchChange does not update SearchInputTextValue when type is not string', () => {
    component.axiosPayload.filter.SearchInputTextValue = 'existing'
    const searchFilter = {
      filter: {
        FilterGroups: [{ FilterItems: [] }],
        SearchInputTextValue: 123
      }
    }

    component.handleSearchChange(searchFilter)

    expect(component.axiosPayload.filter.SearchInputTextValue).toBe('existing')
  })

  it('handleSearchChange updates SearchInputTextValue when string provided', () => {
    const searchFilter = {
      filter: {
        FilterGroups: [{ FilterItems: [] }],
        SearchInputTextValue: 'query text'
      }
    }

    component.handleSearchChange(searchFilter)

    expect(component.axiosPayload.filter.SearchInputTextValue).toBe('query text')
  })

  it('sortChanged sets ascending to false when order is not ascending', () => {
    component.sortChanged({ order: 'descending', prop: 'date' })

    expect(component.axiosPayload.ascending).toBe(false)
    expect(component.axiosPayload.orderBy).toBe('date')
  })

  it('sortChanged sets ascending to true when order is ascending', () => {
    component.sortChanged({ order: 'ascending', prop: 'name' })

    expect(component.axiosPayload.ascending).toBe(true)
    expect(component.axiosPayload.orderBy).toBe('name')
  })

  it('sortChanged handles undefined order as non-ascending', () => {
    component.sortChanged({ order: undefined, prop: 'id' })

    expect(component.axiosPayload.ascending).toBe(false)
  })

  it('serverSideSizeChanged defaults to 5 when no argument', () => {
    component.serverSideSizeChanged()

    expect(component.axiosPayload.pageSize).toBe(5)
    expect(component.serverSideProps.pageSize).toBe(5)
  })

  it('serverSidePageNumberChanged defaults to 1 when no argument', () => {
    component.axiosPayload.pageNumber = 99
    component.serverSidePageNumberChanged()

    expect(component.axiosPayload.pageNumber).toBe(1)
  })

  it('handleSearchChange does not update SearchInputTextValue when SearchInputTextValue is undefined', () => {
    component.axiosPayload.filter.SearchInputTextValue = 'keep'
    const searchFilter = {
      filter: {
        FilterGroups: [{ FilterItems: [] }]
      }
    }

    component.handleSearchChange(searchFilter)

    expect(component.axiosPayload.filter.SearchInputTextValue).toBe('keep')
  })

  it('columnFilterChanged delegates to helper and updates FilterItems', () => {
    const helperFunctions = require('@/utils/helperFunctions')
    helperFunctions.columnFilterChanged.mockReturnValue([
      { FieldName: 'Status', Value: 'Running' }
    ])

    component.columnFilterChanged({ Status: 'Running' })

    expect(helperFunctions.columnFilterChanged).toHaveBeenCalledWith(
      { Status: 'Running' },
      component.axiosPayload
    )
    expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'Status', Value: 'Running' }
    ])
    expect(component.callForData).toHaveBeenCalled()
  })

  it('columnFilterCleared delegates to helper and updates FilterItems', () => {
    const helperFunctions = require('@/utils/helperFunctions')
    helperFunctions.columnFilterCleared.mockReturnValue([])

    component.columnFilterCleared('Status')

    expect(helperFunctions.columnFilterCleared).toHaveBeenCalledWith(
      'Status',
      component.axiosPayload
    )
    expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(component.callForData).toHaveBeenCalled()
  })

  it('handleSearchChange spreads FilterItems from search filter group', () => {
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'search', Value: 'query' }
            ]
          }
        ],
        SearchInputTextValue: 'query text'
      }
    }

    component.handleSearchChange(searchFilter)

    expect(component.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'search', Value: 'query' }
    ])
    expect(component.axiosPayload.filter.SearchInputTextValue).toBe('query text')
  })

  it('sortChanged handles order exactly ascending', () => {
    component.sortChanged({ order: 'ascending', prop: 'createdDate' })

    expect(component.axiosPayload.ascending).toBe(true)
    expect(component.axiosPayload.orderBy).toBe('createdDate')
  })

  it('sortChanged handles any non-ascending order as descending', () => {
    component.sortChanged({ order: 'custom', prop: 'name' })

    expect(component.axiosPayload.ascending).toBe(false)
    expect(component.axiosPayload.orderBy).toBe('name')
  })
})
