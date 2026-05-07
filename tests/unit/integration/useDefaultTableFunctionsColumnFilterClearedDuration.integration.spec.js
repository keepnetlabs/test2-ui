/**
 * useDefaultTableFunctions.columnFilterCleared + gerçek helper — süre satırını TotalDuration ile temizleme.
 */
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { columnFilterChanged } from '@/utils/helperFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'

describe('useDefaultTableFunctions column filter clear duration (integration)', () => {
  it('removes DurationMinutes row when clearing with TotalDuration field name', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 10 })

    axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
      { FieldName: 'Status', Value: '1', Operator: '=' },
      axiosPayload
    )
    axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
      { FieldName: 'TotalDuration', Value: '5-10', Operator: 'Include' },
      axiosPayload
    )

    const component = {
      axiosPayload,
      serverSideProps: { pageNumber: 1, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.columnFilterCleared('TotalDuration')

    expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'Status', Value: '1', Operator: '=' }
    ])
    expect(component.callForData).toHaveBeenCalled()
  })
})
