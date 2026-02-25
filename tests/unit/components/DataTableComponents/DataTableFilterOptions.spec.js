import DataTableFilterOptions from '@/components/DataTableComponents/DataTableFilterOptions.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

describe('DataTableFilterOptions.vue', () => {
  it('emits set-default-search for first option', () => {
    const $emit = jest.fn()
    DataTableFilterOptions.methods.handleListItemClick.call({ $emit }, COMMON_CONSTANTS.FILTER_OPTIONS[0])
    expect($emit).toHaveBeenCalledWith('set-default-search')
  })

  it('emits restore-default-search for second option', () => {
    const $emit = jest.fn()
    DataTableFilterOptions.methods.handleListItemClick.call({ $emit }, COMMON_CONSTANTS.FILTER_OPTIONS[1])
    expect($emit).toHaveBeenCalledWith('restore-default-search')
  })

  it('emits clear-filters for third option', () => {
    const $emit = jest.fn()
    DataTableFilterOptions.methods.handleListItemClick.call({ $emit }, COMMON_CONSTANTS.FILTER_OPTIONS[2])
    expect($emit).toHaveBeenCalledWith('clear-filters')
  })
})
