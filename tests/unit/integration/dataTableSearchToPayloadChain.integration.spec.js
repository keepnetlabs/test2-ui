/**
 * Üst arama (DataTable generic emit) + normalize + tipik payload birleştirme zinciri.
 * Bileşen mount yok; prod'da FilterGroups[1] atayan mixin ile aynı sıra.
 */
import DataTable from '@/components/DataTable.vue'
import { normalizeSearchFilterItems } from '@/utils/searchFilterNormalize'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('DataTable search → normalize → enrollment-style payload (integration)', () => {
  it('merges normalized search items into FilterGroups[1] without TotalDuration on wire', () => {
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 25 })

    const searchItems = DataTable.methods.getSearchFilterItems.call({
      columns: [
        { property: PROPERTY_STORE.TOTAL_DURATION },
        { property: 'trainingName' }
      ],
      renderedColumns: [PROPERTY_STORE.TOTAL_DURATION, 'trainingName'],
      search: 'phish'
    })

    expect(searchItems.some((i) => i.FieldName === 'TotalDuration')).toBe(true)

    axiosPayload.filter.FilterGroups[1].FilterItems = normalizeSearchFilterItems(searchItems)

    expect(axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: 'phish' },
      { FieldName: 'TrainingName', Operator: 'Contains', Value: 'phish' }
    ])
    expect(axiosPayload.filter.FilterGroups[1].FilterItems.every((i) => i.FieldName !== 'TotalDuration')).toBe(true)
  })

  it('normalizeSearchFilterItems maps fieldName-only duration items for the same wire contract', () => {
    const axiosPayload = getDefaultAxiosPayload({ pageSize: 10 })

    axiosPayload.filter.FilterGroups[1].FilterItems = normalizeSearchFilterItems([
      { fieldName: PROPERTY_STORE.TOTAL_DURATION, Operator: 'Contains', Value: 'phish' },
      { FieldName: 'TrainingName', Operator: 'Contains', Value: 'phish' }
    ])

    expect(axiosPayload.filter.FilterGroups[1].FilterItems[0].FieldName).toBe('DurationMinutes')
    expect(axiosPayload.filter.FilterGroups[1].FilterItems[1].FieldName).toBe('TrainingName')
    expect(
      axiosPayload.filter.FilterGroups[1].FilterItems.every((i) => i.FieldName !== 'TotalDuration')
    ).toBe(true)
  })
})
