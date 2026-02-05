import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn((filter, payload) => [
    { fieldName: 'test', value: 'testValue' }
  ]),
  columnFilterCleared: jest.fn((fieldName, payload) => [])
}))

describe('useDefaultTableFunctions Hook', () => {
  let component
  let helperFunctions

  beforeEach(() => {
    jest.clearAllMocks()
    helperFunctions = require('@/utils/helperFunctions')

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

  describe('methods', () => {
    describe('columnFilterChanged()', () => {
      it('should update FilterItems and call callForData', () => {
        const filter = { test: 'filter' }
        component.columnFilterChanged(filter)

        expect(helperFunctions.columnFilterChanged).toHaveBeenCalledWith(
          filter,
          component.axiosPayload
        )
        expect(component.callForData).toHaveBeenCalled()
      })

      it('should set FilterItems from helper function result', () => {
        const newItems = [{ fieldName: 'newField', value: 'newValue' }]
        helperFunctions.columnFilterChanged.mockReturnValue(newItems)

        component.columnFilterChanged({ test: 'filter' })

        expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual(newItems)
      })
    })

    describe('columnFilterCleared()', () => {
      it('should clear FilterItems and call callForData', () => {
        component.axiosPayload.filter.FilterGroups[0].FilterItems = [
          { fieldName: 'test', value: 'value' }
        ]

        component.columnFilterCleared('test')

        expect(helperFunctions.columnFilterCleared).toHaveBeenCalledWith(
          'test',
          component.axiosPayload
        )
        expect(component.callForData).toHaveBeenCalled()
      })

      it('should set FilterItems to empty array', () => {
        helperFunctions.columnFilterCleared.mockReturnValue([])

        component.columnFilterCleared('fieldName')

        expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
      })
    })

    describe('serverSidePageNumberChanged()', () => {
      it('should update pageNumber with provided value', () => {
        component.serverSidePageNumberChanged(3)

        expect(component.axiosPayload.pageNumber).toBe(3)
        expect(component.callForData).toHaveBeenCalled()
      })

      it('should default to pageNumber 1 if no argument provided', () => {
        component.axiosPayload.pageNumber = 5
        component.serverSidePageNumberChanged()

        expect(component.axiosPayload.pageNumber).toBe(1)
        expect(component.callForData).toHaveBeenCalled()
      })

      it('should handle various page numbers', () => {
        component.serverSidePageNumberChanged(10)
        expect(component.axiosPayload.pageNumber).toBe(10)

        component.serverSidePageNumberChanged(1)
        expect(component.axiosPayload.pageNumber).toBe(1)
      })
    })

    describe('serverSideSizeChanged()', () => {
      it('should update pageSize and reset page number', () => {
        component.axiosPayload.pageNumber = 5
        component.serverSideProps.pageNumber = 5

        component.serverSideSizeChanged(10)

        expect(component.axiosPayload.pageSize).toBe(10)
        expect(component.serverSideProps.pageSize).toBe(10)
        expect(component.axiosPayload.pageNumber).toBe(1)
        expect(component.serverSideProps.pageNumber).toBe(1)
        expect(component.callForData).toHaveBeenCalled()
      })

      it('should default to pageSize 5 if no argument provided', () => {
        component.serverSideSizeChanged()

        expect(component.axiosPayload.pageSize).toBe(5)
        expect(component.serverSideProps.pageSize).toBe(5)
      })

      it('should call callForData after updating size', () => {
        component.serverSideSizeChanged(20)

        expect(component.callForData).toHaveBeenCalled()
      })
    })

    describe('resetPageNumber()', () => {
      it('should reset pageNumber to 1 in both axiosPayload and serverSideProps', () => {
        component.axiosPayload.pageNumber = 5
        component.serverSideProps.pageNumber = 5

        component.resetPageNumber()

        expect(component.axiosPayload.pageNumber).toBe(1)
        expect(component.serverSideProps.pageNumber).toBe(1)
      })

      it('should not call callForData', () => {
        component.resetPageNumber()
        expect(component.callForData).not.toHaveBeenCalled()
      })
    })

    describe('sortChanged()', () => {
      it('should update ascending and orderBy', () => {
        component.sortChanged({ order: 'ascending', prop: 'name' })

        expect(component.axiosPayload.ascending).toBe(true)
        expect(component.axiosPayload.orderBy).toBe('name')
        expect(component.callForData).toHaveBeenCalled()
      })

      it('should set ascending to false for descending order', () => {
        component.sortChanged({ order: 'descending', prop: 'date' })

        expect(component.axiosPayload.ascending).toBe(false)
        expect(component.axiosPayload.orderBy).toBe('date')
      })

      it('should handle undefined parameter', () => {
        component.sortChanged()

        expect(component.callForData).toHaveBeenCalled()
      })

      it('should handle empty object parameter', () => {
        component.sortChanged({})

        expect(component.axiosPayload.orderBy).toBeUndefined()
        expect(component.callForData).toHaveBeenCalled()
      })
    })

    describe('handleSearchChange()', () => {
      it('should update search filter items', () => {
        const searchFilter = {
          filter: {
            FilterGroups: [
              { FilterItems: [{ fieldName: 'search', value: 'test' }] }
            ]
          }
        }

        component.handleSearchChange(searchFilter)

        expect(component.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual(
          searchFilter.filter.FilterGroups[0].FilterItems
        )
      })

      it('should update SearchInputTextValue if provided', () => {
        const searchFilter = {
          filter: {
            FilterGroups: [{ FilterItems: [] }],
            SearchInputTextValue: 'search text'
          }
        }

        component.handleSearchChange(searchFilter)

        expect(component.axiosPayload.filter.SearchInputTextValue).toBe('search text')
      })

      it('should not update SearchInputTextValue if not a string', () => {
        component.axiosPayload.filter.SearchInputTextValue = 'existing'
        const searchFilter = {
          filter: {
            FilterGroups: [{ FilterItems: [] }],
            SearchInputTextValue: null
          }
        }

        component.handleSearchChange(searchFilter)

        expect(component.axiosPayload.filter.SearchInputTextValue).toBe('existing')
      })

      it('should reset page number', () => {
        component.axiosPayload.pageNumber = 5
        component.serverSideProps.pageNumber = 5

        component.handleSearchChange({ filter: { FilterGroups: [{ FilterItems: [] }] } })

        expect(component.axiosPayload.pageNumber).toBe(1)
        expect(component.serverSideProps.pageNumber).toBe(1)
      })

      it('should call callForData', () => {
        component.handleSearchChange({ filter: { FilterGroups: [{ FilterItems: [] }] } })

        expect(component.callForData).toHaveBeenCalled()
      })

      it('should handle default empty searchFilter', () => {
        const searchFilter = {
          filter: {
            FilterGroups: [{ FilterItems: [] }]
          }
        }

        expect(() => component.handleSearchChange(searchFilter)).not.toThrow()
      })
    })
  })
})
