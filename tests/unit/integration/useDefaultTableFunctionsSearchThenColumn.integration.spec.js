/**
 * useDefaultTableFunctions: önce handleSearchChange (grup 1), sonra gerçek columnFilterChanged (grup 0).
 */
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'

describe('useDefaultTableFunctions search then column filter (contract)', () => {
  it('preserves normalized search group when column filter is applied after', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 10 })

    const component = {
      axiosPayload,
      serverSideProps: { pageNumber: 1, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    mixinMethods.handleSearchChange.call(component, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'TotalDuration', Operator: 'Contains', Value: '5' }]
          }
        ],
        SearchInputTextValue: 'x'
      }
    })

    component.columnFilterChanged({ FieldName: 'Status', Value: '1', Operator: '=' })

    expect(axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '5' }
    ])
    expect(axiosPayload.filter.SearchInputTextValue).toBe('x')
    expect(axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'Status', Value: '1', Operator: '=' }
    ])
  })
})
