/**
 * Prod öncesi: süre alias'larından sonra FilterItems.FieldName ve orderBy tel kısıtları.
 */
import { columnFilterChanged } from '@/utils/helperFunctions'
import { normalizeSearchFilterItems } from '@/utils/searchFilterNormalize'
import { getDefaultAxiosPayload } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import useEnrollmentTableFilters from '@/hooks/enrollments/useEnrollmentTableFilters'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

function flatFilterItems(payload) {
  return (payload.filter.FilterGroups || []).flatMap((g) => g.FilterItems || [])
}

describe('pre-release: duration wire invariants (contract)', () => {
  it('FilterItems never keep TotalDuration / totalDuration as FieldName after column + search normalize', () => {
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 15 })

    axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
      { FieldName: 'TotalDuration', Value: '1-5', Operator: 'Include' },
      axiosPayload
    )

    axiosPayload.filter.FilterGroups[1].FilterItems = normalizeSearchFilterItems([
      { FieldName: 'TotalDuration', Operator: 'Contains', Value: '1' },
      { fieldName: PROPERTY_STORE.TOTAL_DURATION, Operator: 'Contains', Value: '2' },
      { FieldName: 'TrainingName', Operator: 'Contains', Value: 't' }
    ])

    const names = flatFilterItems(axiosPayload).map((i) => i.FieldName)
    expect(names).not.toContain('TotalDuration')
    expect(names).not.toContain(PROPERTY_STORE.TOTAL_DURATION)
    expect(names.filter((n) => n === 'DurationMinutes').length).toBeGreaterThanOrEqual(2)
  })

  it('default and enrollment sort mixins map duration props to DurationMinutes orderBy', () => {
    const mixin = useDefaultTableFunctions.methods
    const p1 = getDefaultAxiosPayload()
    mixin.sortChanged.call(
      {
        axiosPayload: p1,
        callForData: jest.fn(),
        resetPageNumber: mixin.resetPageNumber,
        serverSideProps: { pageNumber: 1, pageSize: 10 }
      },
      { order: 'ascending', prop: 'TotalDuration' }
    )
    expect(p1.orderBy).toBe('DurationMinutes')

    const p2 = getDefaultAxiosPayload()
    useEnrollmentTableFilters.methods.sortChanged.call(
      { axiosPayload: p2, callForData: jest.fn() },
      { order: 'descending', prop: PROPERTY_STORE.TOTAL_DURATION }
    )
    expect(p2.orderBy).toBe('DurationMinutes')
    expect(p2.ascending).toBe(false)
  })
})
