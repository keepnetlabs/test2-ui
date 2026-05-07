import DataTable from '@/components/DataTable.vue'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { normalizeSearchFilterItems } from '@/utils/helperFunctions'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

/**
 * DataTable üst arama generic kalır (PascalCase). Enrollment / tablo tarafında
 * useDefaultTableFunctions.handleSearchChange + normalizeSearchFilterItems API alanını düzeltir.
 */
describe('DataTable search payload ↔ DurationMinutes API contract', () => {
  it('getSearchFilterItems emits TotalDuration for totalDuration column; normalizer maps to DurationMinutes', () => {
    const ctx = {
      columns: [{ property: PROPERTY_STORE.TOTAL_DURATION }],
      renderedColumns: [PROPERTY_STORE.TOTAL_DURATION],
      search: '9'
    }
    const emitted = DataTable.methods.getSearchFilterItems.call(ctx)
    expect(emitted).toEqual([{ FieldName: 'TotalDuration', Operator: 'Contains', Value: '9' }])
    expect(normalizeSearchFilterItems(emitted)).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '9' }
    ])
  })

  it('useDefaultTableFunctions.handleSearchChange normalizes TotalDuration in FilterItems (mixin consumer path)', () => {
    const mixinMethods = useDefaultTableFunctions.methods
    const component = {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 5,
        ascending: true,
        orderBy: 'id',
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [{ placeholder: true }] }],
          SearchInputTextValue: ''
        }
      },
      serverSideProps: { pageNumber: 1, pageSize: 5 },
      callForData: jest.fn(),
      resetPageNumber: mixinMethods.resetPageNumber,
      ...mixinMethods
    }

    component.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'TotalDuration', Operator: 'Contains', Value: '15' },
              { FieldName: 'TrainingName', Operator: 'Contains', Value: 'abc' }
            ]
          }
        ],
        SearchInputTextValue: 'abc'
      }
    })

    expect(component.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '15' },
      { FieldName: 'TrainingName', Operator: 'Contains', Value: 'abc' }
    ])
    expect(component.callForData).toHaveBeenCalled()
  })

  it('naive parent copy would keep TotalDuration; documents why normalizeSearchFilterItems is required', () => {
    const emitted = DataTable.methods.getSearchFilterItems.call({
      columns: [{ property: PROPERTY_STORE.TOTAL_DURATION }],
      renderedColumns: [PROPERTY_STORE.TOTAL_DURATION],
      search: 'x'
    })
    const naiveGroup1 = { FilterItems: [...emitted] }
    expect(naiveGroup1.FilterItems[0].FieldName).toBe('TotalDuration')

    const safeGroup1 = { FilterItems: normalizeSearchFilterItems([...emitted]) }
    expect(safeGroup1.FilterItems[0].FieldName).toBe('DurationMinutes')
  })
})
