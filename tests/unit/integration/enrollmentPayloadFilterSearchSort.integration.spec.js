/**
 * Enrollment tarzı payload: sütun filtresi (helper) + arama normalize + sıralama (enrollment mixin).
 */
import DataTable from '@/components/DataTable.vue'
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

  it('after column filter and search normalize, sortChanged with null prop clears orderBy and keeps no TotalDuration on wire', () => {
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 10, orderBy: 'enrollmentName' })

    axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
      { FieldName: 'DurationMinutes', Value: '1-10', Operator: 'Include' },
      axiosPayload
    )
    axiosPayload.filter.FilterGroups[1].FilterItems = normalizeSearchFilterItems([
      { FieldName: PROPERTY_STORE.TOTAL_DURATION, Operator: '=', Value: '3' }
    ])

    const sortMethods = useEnrollmentTableFilters.methods
    sortMethods.sortChanged.call(
      { axiosPayload, callForData: jest.fn() },
      { order: 'ascending', prop: null }
    )

    expect(axiosPayload.orderBy).toBeNull()
    expect(axiosPayload.ascending).toBe(true)
    expect(axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Value: '1-10', Operator: 'Include' }
    ])
    expect(axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: '=', Value: '3' }
    ])
    const flat = [
      ...axiosPayload.filter.FilterGroups[0].FilterItems,
      ...axiosPayload.filter.FilterGroups[1].FilterItems
    ]
    expect(flat.some((i) => i.FieldName === 'TotalDuration')).toBe(false)
  })

  it('column filter + DataTable search → normalize → sort by non-duration column; no TotalDuration on wire', () => {
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 20, orderBy: 'enrollmentName' })

    axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
      { FieldName: 'DurationMinutes', Value: '2-20', Operator: 'Include' },
      axiosPayload
    )

    const searchItems = DataTable.methods.getSearchFilterItems.call({
      columns: [
        { property: PROPERTY_STORE.TOTAL_DURATION },
        { property: 'enrollmentName' }
      ],
      renderedColumns: [PROPERTY_STORE.TOTAL_DURATION, 'enrollmentName'],
      search: 'findme'
    })

    axiosPayload.filter.FilterGroups[1].FilterItems = normalizeSearchFilterItems(searchItems)
    axiosPayload.filter.SearchInputTextValue = 'findme'

    const sortMethods = useEnrollmentTableFilters.methods
    sortMethods.sortChanged.call(
      { axiosPayload, callForData: jest.fn() },
      { order: 'ascending', prop: 'trainingName' }
    )

    expect(axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Value: '2-20', Operator: 'Include' }
    ])
    expect(axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: 'findme' },
      { FieldName: 'EnrollmentName', Operator: 'Contains', Value: 'findme' }
    ])
    expect(axiosPayload.orderBy).toBe('trainingName')
    expect(axiosPayload.ascending).toBe(true)

    const flat = [
      ...axiosPayload.filter.FilterGroups[0].FilterItems,
      ...axiosPayload.filter.FilterGroups[1].FilterItems
    ]
    expect(flat.some((i) => i.FieldName === 'TotalDuration')).toBe(false)
  })
})
