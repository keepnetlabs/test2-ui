/**
 * Training library tablo başlığı filtresi → Vuex action sözleşmesi (store mock).
 */
import tableFilterMixin from '@/components/TrainingLibrary/mixins/tableFilterMixin'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('tableFilterMixin + duration filter (contract)', () => {
  const { methods } = tableFilterMixin

  it('columnFilterChanged finds duration filter by DurationMinutes and calls setFilterToPayload', () => {
    const durationFilter = {
      key: PROPERTY_STORE.TOTAL_DURATION,
      filterType: 'search',
      activeValue: [],
      operator: 'Include',
      activeOperator: 'Include',
      isFilterActive: false
    }
    const setFilterToPayload = jest.fn()
    const ctx = {
      filters: [durationFilter],
      getFilterKey: methods.getFilterKey,
      setFilterToPayload,
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }

    methods.columnFilterChanged.call(ctx, {
      FieldName: 'DurationMinutes',
      Value: '15-30,30-60',
      Operator: 'Include'
    })

    expect(durationFilter.isFilterActive).toBe(true)
    expect(durationFilter.activeValue).toEqual(['15-30', '30-60'])
    expect(setFilterToPayload).toHaveBeenCalledWith(durationFilter)
  })

  it('columnFilterChanged matches TotalDuration field name to duration filter key', () => {
    const durationFilter = {
      key: PROPERTY_STORE.TOTAL_DURATION,
      filterType: 'search',
      activeValue: [],
      isFilterActive: false
    }
    const setFilterToPayload = jest.fn()
    const ctx = {
      filters: [durationFilter],
      getFilterKey: methods.getFilterKey,
      setFilterToPayload,
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }

    methods.columnFilterChanged.call(ctx, {
      FieldName: 'TotalDuration',
      Value: '5-15',
      Operator: 'Include'
    })

    expect(setFilterToPayload).toHaveBeenCalledWith(durationFilter)
  })

  it('columnFilterCleared with TotalDuration dispatches removeFilterFromPayload', () => {
    const durationFilter = {
      key: PROPERTY_STORE.TOTAL_DURATION,
      filterType: 'search',
      value: ['5-15'],
      activeValue: ['5-15'],
      operator: 'Include',
      activeOperator: 'Include',
      isFilterActive: true
    }
    const removeFilterFromPayload = jest.fn()
    const ctx = {
      filters: [durationFilter],
      getFilterKey: methods.getFilterKey,
      removeFilterFromPayload,
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }

    methods.columnFilterCleared.call(ctx, 'TotalDuration')

    expect(durationFilter.isFilterActive).toBe(false)
    expect(removeFilterFromPayload).toHaveBeenCalledWith(durationFilter)
  })

  it('columnFilterCleared with totalDuration (PROPERTY_STORE) clears duration filter', () => {
    const durationFilter = {
      key: PROPERTY_STORE.TOTAL_DURATION,
      filterType: 'search',
      value: ['5-15'],
      activeValue: ['5-15'],
      operator: 'Include',
      activeOperator: 'Include',
      isFilterActive: true
    }
    const removeFilterFromPayload = jest.fn()
    const ctx = {
      filters: [durationFilter],
      getFilterKey: methods.getFilterKey,
      removeFilterFromPayload,
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }

    methods.columnFilterCleared.call(ctx, PROPERTY_STORE.TOTAL_DURATION)

    expect(durationFilter.isFilterActive).toBe(false)
    expect(removeFilterFromPayload).toHaveBeenCalledWith(durationFilter)
  })

  it('columnFilterChanged matches totalDuration FieldName from PROPERTY_STORE', () => {
    const durationFilter = {
      key: PROPERTY_STORE.TOTAL_DURATION,
      filterType: 'search',
      activeValue: [],
      isFilterActive: false
    }
    const setFilterToPayload = jest.fn()
    const ctx = {
      filters: [durationFilter],
      getFilterKey: methods.getFilterKey,
      setFilterToPayload,
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }

    methods.columnFilterChanged.call(ctx, {
      FieldName: PROPERTY_STORE.TOTAL_DURATION,
      Value: '1-5',
      Operator: 'Include'
    })

    expect(setFilterToPayload).toHaveBeenCalledWith(durationFilter)
  })
})
