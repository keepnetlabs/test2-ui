/**
 * useDefaultTableFunctions, arama normalize için helperFunctions mock'una bağlı olmamalı
 * (birçok spec sadece columnFilterChanged / columnFilterCleared mock'lar).
 */
jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => []),
  columnFilterCleared: jest.fn(() => [])
}))

import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

describe('useDefaultTableFunctions + searchFilterNormalize (helperFunctions partially mocked)', () => {
  it('handleSearchChange still maps TotalDuration when helperFunctions has no normalizeSearchFilterItems', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const component = {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        ascending: true,
        orderBy: 'id',
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }],
          SearchInputTextValue: ''
        }
      },
      serverSideProps: { pageNumber: 1, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'TotalDuration', Operator: 'Contains', Value: '20' }]
          }
        ],
        SearchInputTextValue: 'q'
      }
    })

    expect(component.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '20' }
    ])
  })
})
