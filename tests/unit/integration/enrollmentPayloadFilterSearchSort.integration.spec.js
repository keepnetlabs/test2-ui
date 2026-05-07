/**
 * Enrollment tarzı payload: sütun filtresi (helper) + arama normalize + sıralama (enrollment mixin).
 */
import { columnFilterChanged } from '@/utils/helperFunctions'
import { normalizeSearchFilterItems } from '@/utils/searchFilterNormalize'
import { getDefaultAxiosPayload } from '@/utils/functions'
import useEnrollmentTableFilters from '@/hooks/enrollments/useEnrollmentTableFilters'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('enrollment-style payload chain (contract)', () => {
  it('applies column filter, search group, then sort without TotalDuration on wire', () => {
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 20, orderBy: 'enrollmentName' })

    axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
      { FieldName: 'DurationMinutes', Value: '5-15', Operator: 'Include' },
      axiosPayload
    )

    axiosPayload.filter.FilterGroups[1].FilterItems = normalizeSearchFilterItems([
      { FieldName: 'TotalDuration', Operator: 'Contains', Value: '5' },
      { FieldName: 'TrainingName', Operator: 'Contains', Value: 't' }
    ])
    axiosPayload.filter.SearchInputTextValue = 't'

    const sortMethods = useEnrollmentTableFilters.methods
    sortMethods.sortChanged.call(
      { axiosPayload, callForData: jest.fn() },
      { order: 'descending', prop: PROPERTY_STORE.TOTAL_DURATION }
    )

    expect(axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Value: '5-15', Operator: 'Include' }
    ])
    expect(axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '5' },
      { FieldName: 'TrainingName', Operator: 'Contains', Value: 't' }
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
