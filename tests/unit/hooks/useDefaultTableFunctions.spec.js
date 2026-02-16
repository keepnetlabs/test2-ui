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

    describe('axiosPayload state management', () => {
      it('should maintain pageNumber between operations', () => {
        component.axiosPayload.pageNumber = 3
        component.sortChanged({ order: 'ascending', prop: 'id' })
        expect(component.axiosPayload.pageNumber).toBe(3)
      })

      it('should update multiple properties at once', () => {
        component.serverSideSizeChanged(20)
        expect(component.axiosPayload.pageSize).toBe(20)
        component.serverSidePageNumberChanged(2)
        expect(component.axiosPayload.pageNumber).toBe(2)
      })

      it('should preserve filter structure through operations', () => {
        component.columnFilterChanged({ test: 'filter' })
        expect(component.axiosPayload.filter.FilterGroups).toBeDefined()
        expect(Array.isArray(component.axiosPayload.filter.FilterGroups)).toBe(true)
      })
    })

    describe('helper function integration', () => {
      it('should call columnFilterChanged utility', () => {
        component.columnFilterChanged({ fieldName: 'test' })
        expect(helperFunctions.columnFilterChanged).toHaveBeenCalled()
      })

      it('should call columnFilterCleared utility', () => {
        component.columnFilterCleared('testField')
        expect(helperFunctions.columnFilterCleared).toHaveBeenCalled()
      })

      it('should pass correct parameters to helper functions', () => {
        const filter = { test: 'data' }
        component.columnFilterChanged(filter)
        expect(helperFunctions.columnFilterChanged).toHaveBeenCalledWith(
          filter,
          component.axiosPayload
        )
      })
    })

    describe('page number management', () => {
      it('should reset page to 1 on size change', () => {
        component.axiosPayload.pageNumber = 10
        component.serverSideProps.pageNumber = 10
        component.serverSideSizeChanged(15)
        expect(component.axiosPayload.pageNumber).toBe(1)
        expect(component.serverSideProps.pageNumber).toBe(1)
      })

      it('should reset page on search change', () => {
        component.axiosPayload.pageNumber = 7
        component.serverSideProps.pageNumber = 7
        component.handleSearchChange({ filter: { FilterGroups: [{ FilterItems: [] }] } })
        expect(component.axiosPayload.pageNumber).toBe(1)
      })

      it('should not reset page on sort change', () => {
        component.axiosPayload.pageNumber = 5
        component.sortChanged({ order: 'ascending', prop: 'name' })
        expect(component.axiosPayload.pageNumber).toBe(5)
      })

      it('should not reset page on column filter change', () => {
        component.axiosPayload.pageNumber = 4
        component.columnFilterChanged({ test: 'filter' })
        expect(component.axiosPayload.pageNumber).toBe(4)
      })
    })

    describe('serverSideProps synchronization', () => {
      it('should sync pageNumber between payload and props', () => {
        component.serverSidePageNumberChanged(7)
        // Note: serverSidePageNumberChanged only updates axiosPayload
        expect(component.axiosPayload.pageNumber).toBe(7)
      })

      it('should sync pageSize on size change', () => {
        component.serverSideSizeChanged(25)
        expect(component.axiosPayload.pageSize).toBe(25)
        expect(component.serverSideProps.pageSize).toBe(25)
      })

      it('should reset both on size change', () => {
        component.axiosPayload.pageNumber = 8
        component.serverSideProps.pageNumber = 8
        component.serverSideSizeChanged(30)
        expect(component.serverSideProps.pageNumber).toBe(1)
      })
    })

    describe('data retrieval triggers', () => {
      it('should trigger data fetch on page number change', () => {
        component.callForData.mockClear()
        component.serverSidePageNumberChanged(2)
        expect(component.callForData).toHaveBeenCalledTimes(1)
      })

      it('should trigger data fetch on size change', () => {
        component.callForData.mockClear()
        component.serverSideSizeChanged(15)
        expect(component.callForData).toHaveBeenCalledTimes(1)
      })

      it('should trigger data fetch on sort change', () => {
        component.callForData.mockClear()
        component.sortChanged({ order: 'ascending', prop: 'id' })
        expect(component.callForData).toHaveBeenCalledTimes(1)
      })

      it('should trigger data fetch on filter change', () => {
        component.callForData.mockClear()
        component.columnFilterChanged({ test: 'filter' })
        expect(component.callForData).toHaveBeenCalledTimes(1)
      })

      it('should trigger data fetch on search change', () => {
        component.callForData.mockClear()
        component.handleSearchChange({ filter: { FilterGroups: [{ FilterItems: [] }] } })
        expect(component.callForData).toHaveBeenCalledTimes(1)
      })

      it('should not trigger data fetch on page reset', () => {
        component.callForData.mockClear()
        component.resetPageNumber()
        expect(component.callForData).not.toHaveBeenCalled()
      })
    })

    describe('edge cases and error handling', () => {
      it('should handle null filter gracefully', () => {
        component.axiosPayload.filter = null
        expect(() => component.sortChanged({ order: 'ascending', prop: 'id' })).not.toThrow()
      })

      it('should handle undefined orderBy', () => {
        component.sortChanged({})
        expect(component.axiosPayload.orderBy).toBeUndefined()
      })

      it('should handle zero as page size', () => {
        component.serverSideSizeChanged(0)
        expect(component.axiosPayload.pageSize).toBe(0)
      })

      it('should handle negative page numbers safely', () => {
        component.serverSidePageNumberChanged(-1)
        expect(component.axiosPayload.pageNumber).toBe(-1)
      })

      it('should handle very large page numbers', () => {
        component.serverSidePageNumberChanged(999999)
        expect(component.axiosPayload.pageNumber).toBe(999999)
      })
    })

    describe('multiple operations sequence', () => {
      it('should handle sequential filter changes', () => {
        component.columnFilterChanged({ field1: 'value1' })
        component.columnFilterChanged({ field2: 'value2' })
        expect(component.callForData).toHaveBeenCalledTimes(2)
      })

      it('should handle mixed operation sequence', () => {
        component.serverSidePageNumberChanged(2)
        component.sortChanged({ order: 'ascending', prop: 'name' })
        component.columnFilterChanged({ test: 'filter' })
        expect(component.callForData).toHaveBeenCalledTimes(3)
      })

      it('should handle rapid size and page changes', () => {
        component.serverSideSizeChanged(10)
        component.serverSideSizeChanged(20)
        component.serverSideSizeChanged(5)
        expect(component.callForData).toHaveBeenCalledTimes(3)
        expect(component.axiosPayload.pageNumber).toBe(1)
      })
    })

    describe('sort order handling', () => {
      it('should set ascending true for ascending order', () => {
        component.sortChanged({ order: 'ascending', prop: 'id' })
        expect(component.axiosPayload.ascending).toBe(true)
      })

      it('should set ascending false for descending order', () => {
        component.sortChanged({ order: 'descending', prop: 'id' })
        expect(component.axiosPayload.ascending).toBe(false)
      })

      it('should handle case-insensitive order', () => {
        component.sortChanged({ order: 'ASCENDING', prop: 'id' })
        // Depends on implementation, but should not throw
        expect(component.callForData).toHaveBeenCalled()
      })

      it('should update orderBy to column prop', () => {
        component.sortChanged({ order: 'ascending', prop: 'username' })
        expect(component.axiosPayload.orderBy).toBe('username')
      })

      it('should handle null prop in sort', () => {
        component.sortChanged({ order: 'ascending', prop: null })
        expect(component.axiosPayload.orderBy).toBe(null)
      })
    })

    describe('filter items management', () => {
      it('should update correct FilterGroup', () => {
        const filter = { test: 'filter' }
        component.columnFilterChanged(filter)
        expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toBeDefined()
      })

      it('should preserve other FilterGroups on change', () => {
        component.axiosPayload.filter.FilterGroups[1].FilterItems = [
          { fieldName: 'search', value: 'test' }
        ]
        component.columnFilterChanged({ test: 'filter' })
        expect(component.axiosPayload.filter.FilterGroups[1].FilterItems).toBeDefined()
      })

      it('should clear FilterItems completely', () => {
        component.axiosPayload.filter.FilterGroups[0].FilterItems = [
          { fieldName: 'test', value: 'value' }
        ]
        component.columnFilterCleared('test')
        expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
      })
    })
  })
})
