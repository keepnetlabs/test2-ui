/**
 * useDefaultTableFunctions.columnFilterChanged + gerçek helperFunctions — TotalDuration kablolama.
 */
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'

describe('useDefaultTableFunctions column filter duration (integration)', () => {
  it('writes DurationMinutes to group 0 when filter FieldName is TotalDuration', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 10 })

    const component = {
      axiosPayload,
      serverSideProps: { pageNumber: 1, pageSize: 10 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.columnFilterChanged({
      FieldName: 'TotalDuration',
      Value: '10-20',
      Operator: 'Include'
    })

    expect(component.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Value: '10-20', Operator: 'Include' }
    ])
    expect(component.callForData).toHaveBeenCalled()
  })
})
