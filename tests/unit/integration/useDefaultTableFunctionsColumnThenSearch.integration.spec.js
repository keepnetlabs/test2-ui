/**
 * useDefaultTableFunctions: önce gerçek columnFilterChanged (grup 0), sonra handleSearchChange (grup 1).
 */
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { columnFilterChanged } from '@/utils/helperFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('useDefaultTableFunctions after real column filters (contract)', () => {
  it('keeps group 0 filters and normalizes group 1 search items', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 10 })

    axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
      { FieldName: 'Status', Value: '2', Operator: '=' },
      axiosPayload
    )

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
            FilterItems: [{ FieldName: 'TotalDuration', Operator: 'Contains', Value: '10' }]
          }
        ],
        SearchInputTextValue: 'q'
      }
    })

    expect(axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'Status', Value: '2', Operator: '=' }
    ])
    expect(axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '10' }
    ])
    expect(axiosPayload.filter.SearchInputTextValue).toBe('q')
    expect(component.callForData).toHaveBeenCalled()
  })

  it('column TotalDuration filter → handleSearchChange → sortChanged: no TotalDuration on wire', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 10, orderBy: 'trainingName' })

    const component = {
      axiosPayload,
      serverSideProps: { pageNumber: 1, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.columnFilterChanged({
      FieldName: 'TotalDuration',
      Value: '5-10',
      Operator: 'Include'
    })

    mixinMethods.handleSearchChange.call(component, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'TotalDuration', Operator: 'Contains', Value: '7' },
              { FieldName: 'TrainingName', Operator: 'Contains', Value: 'x' }
            ]
          }
        ],
        SearchInputTextValue: 'x'
      }
    })

    component.sortChanged({ order: 'descending', prop: PROPERTY_STORE.TOTAL_DURATION })

    expect(axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Value: '5-10', Operator: 'Include' }
    ])
    expect(axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '7' },
      { FieldName: 'TrainingName', Operator: 'Contains', Value: 'x' }
    ])
    expect(axiosPayload.orderBy).toBe('DurationMinutes')
    expect(axiosPayload.ascending).toBe(false)

    const flat = [
      ...axiosPayload.filter.FilterGroups[0].FilterItems,
      ...axiosPayload.filter.FilterGroups[1].FilterItems
    ]
    expect(flat.some((i) => i.FieldName === 'TotalDuration')).toBe(false)
  })
})
