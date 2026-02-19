import { shallowMount } from '@vue/test-utils'
import DataTableFilter from '@/components/DataTableComponents/DataTableFilter.vue'
import { createRandomCryptStringNumber } from '@/utils/functions'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '123'),
  getTimeZoneForMoment: jest.fn(() => 'YYYY/MM/DD HH:mm'),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm')
}))

describe('DataTableFilter.vue', () => {
  const mountComponent = (propsData = {}, options = {}) =>
    shallowMount(DataTableFilter, {
      propsData: {
        column: { property: 'companyName' },
        filterProps: { items: [{ text: 'Contains', value: 'Contains' }] },
        filterableType: 'text',
        filterableItems: [],
        value: { textValue: '', selectValue: '' },
        ...propsData
      },
      stubs: {
        InputDate: true,
        AppDialog: true,
        VMenu: true,
        VSelect: true,
        VTextField: true,
        VCheckbox: true,
        VBtn: true,
        VIcon: true
      },
      mocks: {
        $store: {
          state: {
            auth: {
              user: {
                userCompany: {
                  timeZone: 'UTC'
                }
              }
            }
          }
        }
      },
      ...options
    })

  it('converts select/singleSelect filterableItems on created', () => {
    const wrapper = mountComponent({
      filterableType: 'singleSelect',
      filterableItems: ['A', { text: 'B', value: 'b' }]
    })

    expect(wrapper.vm.convertedFilterableItems).toEqual([
      { text: 'A', value: 'A' },
      { text: 'B', value: 'b' }
    ])
  })

  it('emits input on created when defaultDate is provided', () => {
    const wrapper = mountComponent({
      filterableType: 'date',
      defaultDate: true
    })

    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('computes fieldName from custom name when provided', () => {
    const wrapper = mountComponent({
      column: { property: 'name' },
      filterableCustomFieldName: 'MonthlyActiveUser'
    })

    expect(wrapper.vm.fieldName).toBe('MonthlyActiveUser')
  })

  it('filters selectable items with searchInItems', async () => {
    const wrapper = mountComponent({
      filterableType: 'select',
      filterableItems: [
        { text: 'Finance', value: 'f' },
        { text: 'Marketing', value: 'm' }
      ]
    })
    wrapper.vm.filterValue = 'fin'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.searchInItems).toEqual([{ text: 'Finance', value: 'f' }])
  })

  it('calculates getFilterButtonDisabled for select/singleSelect/numeric/date', async () => {
    const selectWrapper = mountComponent({ filterableType: 'select' })
    selectWrapper.vm.filterChecked = []
    expect(selectWrapper.vm.getFilterButtonDisabled).toBe(true)
    selectWrapper.vm.filterChecked = ['x']
    expect(selectWrapper.vm.getFilterButtonDisabled).toBe(false)

    const singleWrapper = mountComponent({ filterableType: 'singleSelect' })
    singleWrapper.vm.filteredSingleValue = null
    expect(singleWrapper.vm.getFilterButtonDisabled).toBe(true)
    singleWrapper.vm.filteredSingleValue = '2026-02'
    expect(singleWrapper.vm.getFilterButtonDisabled).toBe(false)

    const numericWrapper = mountComponent({ filterableType: 'numeric' })
    numericWrapper.vm.filterValue = ''
    expect(numericWrapper.vm.getFilterButtonDisabled).toBe(true)
    numericWrapper.vm.filterValue = '1'
    expect(numericWrapper.vm.getFilterButtonDisabled).toBe(false)

    const dateWrapper = mountComponent({ filterableType: 'date' })
    dateWrapper.vm.filteredSelectValueDate = 'between'
    dateWrapper.vm.filteredDateRangeValue = []
    expect(dateWrapper.vm.getFilterButtonDisabled).toBe(true)
  })

  it('handleFilter emits expected payload for singleSelect', () => {
    const wrapper = mountComponent({
      filterableType: 'singleSelect',
      column: { property: 'monthlyActiveUserCount' },
      filterableCustomFieldName: 'MonthlyActiveUser'
    })
    wrapper.vm.filteredSingleValue = '2026-02'

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: '2026-02',
      FieldName: 'MonthlyActiveUser',
      Operator: '='
    })
    expect(wrapper.emitted('input')[0][0]).toEqual({
      textValue: '2026-02',
      selectValue: '2026-02',
      fieldName: 'MonthlyActiveUser'
    })
  })

  it('handleFilter emits payload for numeric filter type', () => {
    const wrapper = mountComponent({ filterableType: 'numeric' })
    wrapper.vm.filteredSelectValueNum = '>='
    wrapper.vm.filterValue = '15'

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: '15',
      FieldName: 'companyName',
      Operator: '>='
    })
    expect(wrapper.emitted('input')[0][0]).toEqual({
      textValue: '15',
      selectValue: '>=',
      fieldName: 'companyName'
    })
  })

  it('handleFilter emits payload for number filter type', () => {
    const wrapper = mountComponent({ filterableType: 'number' })
    wrapper.vm.filteredSelectValueNumber = '<='
    wrapper.vm.filterValue = '100'

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: '100',
      FieldName: 'companyName',
      Operator: '<='
    })
  })

  it('handleFilter emits payload for non-between date filter', () => {
    const wrapper = mountComponent({ filterableType: 'date' })
    wrapper.vm.filteredSelectValueDate = '<='
    wrapper.vm.filteredDateValue = '2026/02/19 00:00'

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: '2026/02/19 00:00',
      FieldName: 'companyName',
      Operator: '<='
    })
  })

  it('handleFilter emits range payload for text between filter', () => {
    const wrapper = mountComponent({ filterableType: 'text' })
    wrapper.vm.filteredSelectValue = 'between'
    wrapper.vm.filterValueBetween = ['10', '20']

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual([
      { Value: '10', FieldName: 'companyName', Operator: '>=' },
      { value: '20', FieldName: 'companyName', Operator: '<=' }
    ])
    expect(wrapper.emitted('input')[0][0]).toEqual({
      textValue: ['10', '20'],
      selectValue: 'between',
      fieldName: 'companyName'
    })
  })

  it('handleFilter emits include payload for select filter', () => {
    const wrapper = mountComponent({
      filterableType: 'select',
      filterableItems: [{ text: 'A', value: 'a' }, { text: 'B', value: 'b' }]
    })
    wrapper.vm.filterChecked = ['a', 'b']
    wrapper.vm.filterValue = 'ab'

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: 'a,b',
      FieldName: 'companyName',
      Operator: 'Include'
    })
    expect(wrapper.emitted('input')[0][0]).toEqual({
      textValue: 'ab',
      selectValue: 'a,b',
      fieldName: 'companyName'
    })
  })

  it('handleFilter emits date range payload for between date filter', () => {
    const wrapper = mountComponent({ filterableType: 'date' })
    wrapper.vm.filteredSelectValueDate = 'between'
    wrapper.vm.filteredDateRangeValue = ['2026/01/01 00:00', '2026/01/05 00:00']

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual([
      { Value: '2026/01/01 00:00', FieldName: 'companyName', Operator: '>=' },
      { value: '2026/01/05 00:00', FieldName: 'companyName', Operator: '<=' }
    ])
  })

  it('clearFilter resets state and emits clear/input', () => {
    const wrapper = mountComponent({ filterableType: 'number' })
    wrapper.vm.menu = true
    wrapper.vm.isFilterActive = true
    wrapper.vm.filterValue = '99'

    wrapper.vm.clearFilter()

    expect(wrapper.vm.menu).toBe(false)
    expect(wrapper.vm.isFilterActive).toBe(false)
    expect(wrapper.vm.filterValue).toBe('')
    expect(wrapper.emitted('handleClearColumnFilter')).toBeTruthy()
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('clearFilter with isEmit=false does not emit input', () => {
    const wrapper = mountComponent()

    wrapper.vm.clearFilter(false)

    expect(wrapper.emitted('input')).toBeFalsy()
    expect(wrapper.emitted('handleClearColumnFilter')).toBeTruthy()
  })

  it('handleMenuVisibilityChange keeps menu open when picker is visible', () => {
    const wrapper = mountComponent({ filterableType: 'date' })
    wrapper.vm.$refs = {
      refPicker: { pickerVisible: true },
      refPicker2: null,
      refPickerDateOnly: null,
      refMenu: { isActive: false }
    }

    wrapper.vm.handleMenuVisibilityChange(false)

    expect(wrapper.vm.isCloseOnClick).toBe(false)
    expect(wrapper.vm.menu).toBe(true)
    expect(wrapper.vm.$refs.refMenu.isActive).toBe(true)
  })

  it('handleMenuVisibilityChange applies val when no picker is visible', () => {
    const wrapper = mountComponent({ filterableType: 'date' })
    wrapper.vm.$refs = {
      refPicker: { pickerVisible: false },
      refPicker2: { pickerVisible: false },
      refPickerDateOnly: { pickerVisible: false },
      refMenu: { isActive: false }
    }

    wrapper.vm.handleMenuVisibilityChange(false)

    expect(wrapper.vm.isCloseOnClick).toBe(true)
    expect(wrapper.vm.menu).toBe(false)
  })

  it('handleDateSelectClick hides visible pickers', () => {
    const wrapper = mountComponent({ filterableType: 'date' })
    const hide1 = jest.fn()
    const hide2 = jest.fn()
    wrapper.vm.$refs = {
      refPicker: { pickerVisible: true, hidePicker: hide1 },
      refPicker2: { pickerVisible: false, hidePicker: hide2 },
      refPickerDateOnly: null
    }

    wrapper.vm.handleDateSelectClick()

    expect(hide1).toHaveBeenCalled()
    expect(hide2).not.toHaveBeenCalled()
  })

  it('handlePickerChange keeps menu active', () => {
    const wrapper = mountComponent()
    wrapper.vm.$refs = { refMenu: { isActive: false } }

    wrapper.vm.handlePickerChange()

    expect(wrapper.vm.isCloseOnClick).toBe(true)
    expect(wrapper.vm.menu).toBe(true)
    expect(wrapper.vm.$refs.refMenu.isActive).toBe(true)
  })

  it('handleChangeBetweenDatepicker resets range when value is empty', () => {
    const wrapper = mountComponent({ filterableType: 'date', defaultDate: true })
    wrapper.vm.$refs = { refMenu: { isActive: false } }

    wrapper.vm.handleChangeBetweenDatepicker(null)

    expect(wrapper.vm.filteredDateRangeValue.length).toBe(2)
  })

  it('handleChangeBetweenDatepicker sets status for >14 days when defaultDate is true', () => {
    const wrapper = mountComponent({ filterableType: 'date', defaultDate: true })
    wrapper.vm.$refs = { refMenu: { isActive: false } }

    wrapper.vm.handleChangeBetweenDatepicker(['2026/01/01 00:00', '2026/02/01 00:00'])

    expect(wrapper.vm.status).toBe(true)
    expect(wrapper.vm.filteredDateRangeValue.length).toBe(2)
  })

  it('closeDialog sets status=false', () => {
    const wrapper = mountComponent()
    wrapper.vm.status = true

    wrapper.vm.closeDialog()

    expect(wrapper.vm.status).toBe(false)
  })

  it('getTextFilterItems prioritizes filterOptionProps over filterProps', () => {
    const wrapper = mountComponent({
      filterOptionProps: [{ text: 'Equal', value: '=' }],
      filterProps: { items: [{ text: 'Contains', value: 'Contains' }] }
    })

    expect(wrapper.vm.getTextFilterItems).toEqual([{ text: 'Equal', value: '=' }])
  })

  it('getWidth returns 450px for between date and 260px otherwise', () => {
    const wrapper = mountComponent({ filterableType: 'date' })
    wrapper.vm.filteredSelectValueDate = 'between'
    expect(wrapper.vm.getWidth).toBe('450px')

    wrapper.vm.filteredSelectValueDate = '<='
    expect(wrapper.vm.getWidth).toBe('260px')
  })

  it('isShowSearchTextField depends on showSelectSearch and search item count', async () => {
    const wrapper = mountComponent({
      filterableType: 'select',
      showSelectSearch: true,
      filterableItems: [
        { text: 'A', value: 'a' },
        { text: 'B', value: 'b' },
        { text: 'C', value: 'c' },
        { text: 'D', value: 'd' },
        { text: 'E', value: 'e' }
      ]
    })
    wrapper.vm.filterValue = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowSearchTextField).toBe(true)

    wrapper.vm.filterValue = 'ab'
    await wrapper.vm.$nextTick()
    expect(!!wrapper.vm.isShowSearchTextField).toBe(true)
  })

  it('checkTextFilterButtonIsDisabled follows between and single value branches', () => {
    const wrapper = mountComponent({ filterableType: 'text' })

    wrapper.vm.filterValueBetween = ['1', '2']
    wrapper.vm.filterValue = ''
    expect(wrapper.vm.checkTextFilterButtonIsDisabled).toBe(false)

    wrapper.vm.filterValueBetween = []
    wrapper.vm.filterValue = ''
    expect(wrapper.vm.checkTextFilterButtonIsDisabled).toBe(true)
  })

  it('menu watcher updates zIndex and emits update:isSettingsOpened when menu opens', async () => {
    const wrapper = mountComponent({ filterableType: 'date' })

    wrapper.vm.menu = true
    await wrapper.vm.$nextTick()

    expect(String(wrapper.vm.zIndex)).toContain('202')
    expect(wrapper.emitted('update:isSettingsOpened')).toBeTruthy()
    expect(wrapper.emitted('update:isSettingsOpened')[0]).toEqual([false])
  })

  it('getFilterButtonDisabled watcher calls key generator', async () => {
    const wrapper = mountComponent({ filterableType: 'numeric' })
    const callCount = createRandomCryptStringNumber.mock.calls.length

    wrapper.vm.filterValue = ''
    await wrapper.vm.$nextTick()
    wrapper.vm.filterValue = '1'
    await wrapper.vm.$nextTick()

    expect(createRandomCryptStringNumber.mock.calls.length).toBeGreaterThan(callCount)
  })

  it('beforeDestroy clears params when filter is active', () => {
    const wrapper = mountComponent()
    const clearSpy = jest.spyOn(wrapper.vm, 'clearDataParams')
    wrapper.vm.isFilterActive = true

    wrapper.destroy()

    expect(clearSpy).toHaveBeenCalled()
  })
})
