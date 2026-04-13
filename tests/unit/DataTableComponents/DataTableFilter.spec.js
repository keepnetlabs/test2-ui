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
        VTooltip: true,
        VSelect: true,
        VTextField: true,
        VCheckbox: true,
        VBtn: true,
        VIcon: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
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

  it('falls back to column property for fieldName and proxies getTimeZone', () => {
    const wrapper = mountComponent({
      column: { property: 'companyName' }
    })

    expect(wrapper.vm.fieldName).toBe('companyName')
    expect(wrapper.vm.getTimeZone(true)).toBe('yyyy/MM/dd HH:mm')
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

  it('searchInItems returns all converted items when search text is empty', () => {
    const wrapper = mountComponent({
      filterableType: 'select',
      filterableItems: [
        { text: 'Finance', value: 'f' },
        { text: 'Marketing', value: 'm' }
      ]
    })

    wrapper.vm.filterValue = ''

    expect(wrapper.vm.searchInItems).toEqual([
      { text: 'Finance', value: 'f' },
      { text: 'Marketing', value: 'm' }
    ])
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

  it('handleFilter emits payload for negativeNumber filter type', () => {
    const wrapper = mountComponent({ filterableType: 'negativeNumber' })
    wrapper.vm.filteredSelectValueNumber = '>='
    wrapper.vm.filterValue = '-10'

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: '-10',
      FieldName: 'companyName',
      Operator: '>='
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

  it('handleFilter emits payload for dateOnly filter type', () => {
    const wrapper = mountComponent({ filterableType: 'dateOnly' })
    wrapper.vm.filteredSelectValueDate = '='
    wrapper.vm.filteredDateValue = '2026/02/19 00:00'

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: '2026/02/19 00:00',
      FieldName: 'companyName',
      Operator: '='
    })
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

  it('handleDateSelectClick also hides visible dateOnly picker', () => {
    const wrapper = mountComponent({ filterableType: 'dateOnly' })
    const hidePicker = jest.fn()
    wrapper.vm.$refs = {
      refPicker: null,
      refPicker2: null,
      refPickerDateOnly: { pickerVisible: true, hidePicker }
    }

    wrapper.vm.handleDateSelectClick()

    expect(hidePicker).toHaveBeenCalled()
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

  it('handleChangeBetweenDatepicker keeps status false for shorter ranges', () => {
    const wrapper = mountComponent({ filterableType: 'date', defaultDate: true })
    wrapper.vm.$refs = { refMenu: { isActive: false } }

    wrapper.vm.handleChangeBetweenDatepicker(['2026/01/01 00:00', '2026/01/10 00:00'])

    expect(wrapper.vm.status).toBe(false)
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

  it('getTextFilterItems falls back to filterProps and then local textFilterItems', () => {
    const fromProps = mountComponent({
      filterProps: { items: [{ text: 'Contains', value: 'Contains' }] }
    })
    expect(fromProps.vm.getTextFilterItems).toEqual([
      { text: 'Contains', value: 'Contains' }
    ])

    const fromLocal = mountComponent({
      filterProps: null
    })
    fromLocal.vm.textFilterItems = [{ text: 'Equals', value: '=' }]
    expect(fromLocal.vm.getTextFilterItems).toEqual([{ text: 'Equals', value: '=' }])
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

  it('isShowSearchTextField stays false when search is disabled and item count is small', async () => {
    const wrapper = mountComponent({
      filterableType: 'select',
      showSelectSearch: false,
      filterableItems: [
        { text: 'A', value: 'a' },
        { text: 'B', value: 'b' }
      ]
    })
    wrapper.vm.filterValue = ''
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowSearchTextField).toBe(false)
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

    expect(String(wrapper.vm.zIndex)).toContain('252')
    expect(wrapper.emitted('update:isSettingsOpened')).toBeTruthy()
    expect(wrapper.emitted('update:isSettingsOpened')[0]).toEqual([false])
  })

  it('menu watcher uses default zIndex for non-date filters', async () => {
    const wrapper = mountComponent({ filterableType: 'text' })

    wrapper.vm.menu = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.zIndex).toBe(202)
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

  it('beforeDestroy does not clear params when filter is inactive', () => {
    const wrapper = mountComponent()
    const clearSpy = jest.spyOn(wrapper.vm, 'clearDataParams')
    wrapper.vm.isFilterActive = false

    wrapper.destroy()

    expect(clearSpy).not.toHaveBeenCalled()
  })

  it('getMenuContentClass uses base class for non-nested filters', () => {
    const wrapper = mountComponent({ filterableType: 'text' })

    expect(wrapper.vm.getMenuContentClass).toBe('data-table-filter__menu-content')
  })

  it('hidePicker is a no-op when picker is missing or hidden', () => {
    const wrapper = mountComponent()

    expect(() => wrapper.vm.hidePicker(null)).not.toThrow()
    expect(() =>
      wrapper.vm.hidePicker({
        pickerVisible: false,
        hidePicker: jest.fn()
      })
    ).not.toThrow()
  })

  it('clearDataParams resets numeric defaults and nested state', () => {
    const wrapper = mountComponent({
      filterableType: 'nestedSelect',
      value: {
        textValue: '',
        selectValue: '',
        nestedSelections: {
          licenseType: ['license-awareness'],
          products: ['module-1']
        }
      },
      filterableConfig: {
        exclusiveGroups: true,
        groups: [
          {
            key: 'licenseType',
            label: 'License Type',
            fieldName: 'LicenseTypeResourceId',
            items: [{ text: 'Awareness', value: 'license-awareness' }]
          },
          {
            key: 'products',
            label: 'Products',
            fieldName: 'ModuleResourceId',
            items: [{ text: 'Phishing Simulator', value: 'module-1' }]
          }
        ]
      }
    })
    wrapper.vm.menu = true
    wrapper.vm.isFilterActive = true
    wrapper.vm.filteredSelectValueNum = '<='
    wrapper.vm.filteredSelectValueNumber = '>='
    wrapper.vm.activeNestedGroup = 'products'
    wrapper.vm.nestedSearchValues = { licenseType: 'aware', products: 'phish' }
    wrapper.vm.nestedFilterSelections = {
      licenseType: ['license-awareness'],
      products: ['module-1']
    }

    wrapper.vm.clearDataParams()

    expect(wrapper.vm.menu).toBe(false)
    expect(wrapper.vm.isFilterActive).toBe(false)
    expect(wrapper.vm.filteredSelectValueNum).toBe('=')
    expect(wrapper.vm.filteredSelectValueNumber).toBe('=')
    expect(wrapper.vm.activeNestedGroup).toBe('')
    expect(wrapper.vm.nestedFilterSelections).toEqual({
      licenseType: [],
      products: []
    })
    expect(wrapper.vm.nestedSearchValues).toEqual({
      licenseType: '',
      products: ''
    })
  })

  describe('nestedSelect', () => {
    const mountNested = (overrides = {}) =>
      mountComponent({
        filterableType: 'nestedSelect',
        column: { property: 'licenseTypeName' },
        filterableCustomFieldName: 'LicenseTypeResourceId',
        filterableConfig: {
          exclusiveGroups: true,
          groups: [
            {
              key: 'licenseType',
              label: 'License Type',
              fieldName: 'LicenseTypeResourceId',
              operator: 'Include',
              items: [
                { text: 'Awareness', value: 'license-awareness' },
                { text: 'Enterprise', value: 'license-enterprise' }
              ]
            },
            {
              key: 'products',
              label: 'Products',
              fieldName: 'ModuleResourceId',
              operator: 'Include',
              items: [
                { text: 'Phishing Simulator', value: 'module-1' },
                { text: 'Awareness Educator', value: 'module-2' }
              ]
            }
          ]
        },
        value: {
          textValue: '',
          selectValue: '',
          nestedSelections: {}
        },
        ...overrides
      })

    it('uses applied selections for left-panel badge state', () => {
      const wrapper = mountNested({
        value: {
          textValue: '',
          selectValue: '',
          nestedSelections: {
            licenseType: ['license-awareness'],
            products: []
          }
        }
      })

      expect(wrapper.vm.getAppliedNestedGroupSelectionCount('licenseType')).toBe(1)
      expect(wrapper.vm.hasAppliedNestedGroupSelection('licenseType')).toBe(true)
      expect(wrapper.vm.hasAppliedNestedGroupSelection('products')).toBe(false)
    })

    it('normalizes conflicting applied selections to one group in exclusive mode', () => {
      const wrapper = mountNested({
        value: {
          textValue: '',
          selectValue: '',
          nestedSelections: {
            licenseType: ['license-awareness'],
            products: ['module-1']
          }
        }
      })

      expect(wrapper.vm.nestedFilterSelections).toEqual({
        licenseType: ['license-awareness'],
        products: []
      })
    })

    it('clears inactive group selections when exclusive groups are enabled', async () => {
      const wrapper = mountNested({
        value: {
          textValue: '',
          selectValue: '',
          nestedSelections: {
            licenseType: ['license-awareness'],
            products: []
          }
        }
      })

      wrapper.vm.$set(wrapper.vm.nestedFilterSelections, 'products', ['module-1'])
      wrapper.vm.handleNestedSelectionChange('products')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.nestedFilterSelections.licenseType).toEqual([])
      expect(wrapper.vm.nestedFilterSelections.products).toEqual(['module-1'])
    })

    it('handleFilter emits only the active nested group when exclusive', () => {
      const wrapper = mountNested()
      wrapper.vm.activeNestedGroup = 'products'
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: ['module-1', 'module-2']
      }

      wrapper.vm.handleFilter()

      expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
        filters: [
          {
            Value: 'module-1,module-2',
            FieldName: 'ModuleResourceId',
            Operator: 'Include'
          }
        ],
        clearFieldNames: ['LicenseTypeResourceId', 'ModuleResourceId']
      })
      expect(wrapper.emitted('input')[0][0]).toEqual({
        textValue: '',
        selectValue: '',
        fieldName: 'LicenseTypeResourceId',
        nestedSelections: {
          licenseType: [],
          products: ['module-1', 'module-2']
        }
      })
    })

    it('disables filter button when active nested group has no selection in exclusive mode', () => {
      const wrapper = mountNested()
      wrapper.vm.activeNestedGroup = 'licenseType'
      wrapper.vm.nestedFilterSelections = {
        licenseType: [],
        products: ['module-1']
      }

      expect(wrapper.vm.getFilterButtonDisabled).toBe(true)

      wrapper.vm.nestedFilterSelections.licenseType = ['license-awareness']
      expect(wrapper.vm.getFilterButtonDisabled).toBe(false)
    })

    it('handleMenuVisibilityChange initializes and resets nested panel state', () => {
      const wrapper = mountNested()
      wrapper.vm.$refs = {
        refPicker: null,
        refPicker2: null,
        refPickerDateOnly: null,
        refMenu: { isActive: false }
      }
      wrapper.vm.nestedSearchValues = {
        licenseType: 'aware',
        products: 'phish'
      }

      wrapper.vm.handleMenuVisibilityChange(true)
      expect(wrapper.vm.activeNestedGroup).toBe('licenseType')

      wrapper.vm.handleMenuVisibilityChange(false)
      expect(wrapper.vm.activeNestedGroup).toBe('')
      expect(wrapper.vm.nestedSearchValues).toEqual({
        licenseType: '',
        products: ''
      })
    })

    it('handleFilter emits clear event when no nested selections exist', () => {
      const wrapper = mountNested()
      wrapper.vm.activeNestedGroup = 'licenseType'
      wrapper.vm.nestedFilterSelections = {
        licenseType: [],
        products: []
      }

      wrapper.vm.handleFilter()

      expect(wrapper.emitted('handleClearColumnFilter')[0]).toEqual([
        ['LicenseTypeResourceId', 'ModuleResourceId']
      ])
      expect(wrapper.emitted('handleFilterColumn')).toBeFalsy()
    })

    it('clearAllNestedSelections respects isEmit=false', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: []
      }

      wrapper.vm.clearAllNestedSelections(false)

      expect(wrapper.vm.nestedFilterSelections).toEqual({
        licenseType: [],
        products: []
      })
      expect(wrapper.emitted('handleClearColumnFilter')).toBeFalsy()
    })

    it('supports non-exclusive nested groups when configured', () => {
      const wrapper = mountNested({
        filterableConfig: {
          groups: [
            {
              key: 'licenseType',
              label: 'License Type',
              fieldName: 'LicenseTypeResourceId',
              operator: 'Include',
              items: [{ text: 'Awareness', value: 'license-awareness' }]
            },
            {
              key: 'products',
              label: 'Products',
              fieldName: 'ModuleResourceId',
              operator: 'Include',
              items: [{ text: 'Phishing Simulator', value: 'module-1' }]
            }
          ]
        }
      })

      wrapper.vm.nestedFilterSelections = {
        licenseType: [],
        products: ['module-1']
      }

      expect(wrapper.vm.isNestedGroupsExclusive).toBe(false)
      expect(wrapper.vm.getFilterButtonDisabled).toBe(false)
    })

    it('clearNestedGroupSelection keeps remaining nested filters when another group is selected', () => {
      const wrapper = mountNested({
        filterableConfig: {
          groups: [
            {
              key: 'licenseType',
              label: 'License Type',
              fieldName: 'LicenseTypeResourceId',
              operator: 'Include',
              items: [{ text: 'Awareness', value: 'license-awareness' }]
            },
            {
              key: 'products',
              label: 'Products',
              fieldName: 'ModuleResourceId',
              operator: 'Include',
              items: [{ text: 'Phishing Simulator', value: 'module-1' }]
            }
          ]
        },
        value: {
          textValue: '',
          selectValue: '',
          nestedSelections: {
            licenseType: ['license-awareness'],
            products: ['module-1']
          }
        }
      })

      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: ['module-1']
      }

      wrapper.vm.clearNestedGroupSelection('products')

      expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
        filters: [
          {
            Value: 'license-awareness',
            FieldName: 'LicenseTypeResourceId',
            Operator: 'Include'
          }
        ],
        clearFieldNames: ['LicenseTypeResourceId', 'ModuleResourceId']
      })
    })

    it('clearNestedGroupSelection emits clear when last nested filter is removed', () => {
      const wrapper = mountNested({
        value: {
          textValue: '',
          selectValue: '',
          nestedSelections: {
            licenseType: ['license-awareness'],
            products: []
          }
        }
      })

      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: []
      }

      wrapper.vm.clearNestedGroupSelection('licenseType')

      expect(wrapper.emitted('handleClearColumnFilter')[0]).toEqual([
        ['LicenseTypeResourceId', 'ModuleResourceId']
      ])
      expect(wrapper.emitted('handleFilterColumn')).toBeFalsy()
    })

    it('filters nested group items by search text', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedSearchValues = {
        licenseType: 'aware',
        products: ''
      }

      expect(wrapper.vm.getFilteredNestedGroupItems(wrapper.vm.nestedFilterGroups[0])).toEqual([
        { text: 'Awareness', value: 'license-awareness' }
      ])
    })

    it('resolves exclusive nested group key from active or first selected group', () => {
      const wrapper = mountNested()
      wrapper.vm.activeNestedGroup = 'products'

      expect(
        wrapper.vm.getExclusiveNestedGroupKey({
          licenseType: ['license-awareness'],
          products: ['module-1']
        })
      ).toBe('products')

      wrapper.vm.activeNestedGroup = ''
      expect(
        wrapper.vm.getExclusiveNestedGroupKey({
          licenseType: ['license-awareness'],
          products: []
        })
      ).toBe('licenseType')

      expect(
        wrapper.vm.getExclusiveNestedGroupKey({
          licenseType: [],
          products: []
        })
      ).toBe('')
    })

    it('syncNestedFilterConfig clears invalid active group and keeps search text', () => {
      const wrapper = mountNested()
      wrapper.vm.activeNestedGroup = 'missing-group'
      wrapper.vm.nestedSearchValues = {
        licenseType: 'aware',
        products: 'phish'
      }
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: []
      }

      wrapper.vm.syncNestedFilterConfig()

      expect(wrapper.vm.activeNestedGroup).toBe('')
      expect(wrapper.vm.nestedSearchValues).toEqual({
        licenseType: 'aware',
        products: 'phish'
      })
      expect(wrapper.vm.isFilterActive).toBe(true)
    })

    it('getNormalizedNestedGroups converts string items to text/value objects', () => {
      const wrapper = mountNested({
        filterableConfig: {
          exclusiveGroups: true,
          groups: [
            {
              key: 'licenseType',
              label: 'License Type',
              fieldName: 'LicenseTypeResourceId',
              items: ['Awareness']
            }
          ]
        }
      })

      expect(wrapper.vm.getNormalizedNestedGroups()).toEqual([
        {
          key: 'licenseType',
          label: 'License Type',
          fieldName: 'LicenseTypeResourceId',
          items: [{ text: 'Awareness', value: 'Awareness' }]
        }
      ])
    })

    it('clearInactiveNestedSelections is a no-op when not exclusive or key is empty', () => {
      const wrapper = mountNested({
        filterableConfig: {
          groups: [
            {
              key: 'licenseType',
              label: 'License Type',
              fieldName: 'LicenseTypeResourceId',
              items: [{ text: 'Awareness', value: 'license-awareness' }]
            },
            {
              key: 'products',
              label: 'Products',
              fieldName: 'ModuleResourceId',
              items: [{ text: 'Phishing Simulator', value: 'module-1' }]
            }
          ]
        }
      })
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: ['module-1']
      }

      wrapper.vm.clearInactiveNestedSelections('')
      expect(wrapper.vm.nestedFilterSelections).toEqual({
        licenseType: ['license-awareness'],
        products: ['module-1']
      })

      wrapper.vm.clearInactiveNestedSelections('licenseType')
      expect(wrapper.vm.nestedFilterSelections).toEqual({
        licenseType: ['license-awareness'],
        products: ['module-1']
      })
    })

    it('clearFilter delegates nestedSelect clearing to clearAllNestedSelections', () => {
      const wrapper = mountNested()
      const clearSpy = jest.spyOn(wrapper.vm, 'clearAllNestedSelections')

      wrapper.vm.clearFilter(false)

      expect(clearSpy).toHaveBeenCalledWith(false)
    })

    it('returns nested menu metadata for width and max height', () => {
      const wrapper = mountNested()

      expect(wrapper.vm.getMenuContentClass).toContain('data-table-filter__menu-content--nested')
      expect(wrapper.vm.getMenuMaxHeight).toBe(420)
      expect(wrapper.vm.getWidth).toBe('606px')
      expect(wrapper.vm.activeNestedGroupConfig).toBeNull()
    })

    it('setActiveNestedGroup ignores empty keys', () => {
      const wrapper = mountNested()
      wrapper.vm.activeNestedGroup = 'licenseType'

      wrapper.vm.setActiveNestedGroup('')

      expect(wrapper.vm.activeNestedGroup).toBe('licenseType')
    })

    it('buildNestedFilterItems can target a single group key', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: ['module-1']
      }

      expect(wrapper.vm.buildNestedFilterItems('products')).toEqual([
        {
          Value: 'module-1',
          FieldName: 'ModuleResourceId',
          Operator: 'Include'
        }
      ])
    })

    it('getFilteredNestedGroupItems returns all items when search text is empty', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedSearchValues = {
        licenseType: '',
        products: ''
      }

      expect(wrapper.vm.getFilteredNestedGroupItems(wrapper.vm.nestedFilterGroups[1])).toEqual([
        { text: 'Phishing Simulator', value: 'module-1' },
        { text: 'Awareness Educator', value: 'module-2' }
      ])
    })

    it('clearNestedGroupSelection is a no-op for empty group key', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: []
      }

      wrapper.vm.clearNestedGroupSelection('')

      expect(wrapper.emitted('handleFilterColumn')).toBeFalsy()
      expect(wrapper.vm.nestedFilterSelections).toEqual({
        licenseType: ['license-awareness'],
        products: []
      })
    })

    it('handleNestedSelectionChange is a no-op for empty group key', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: []
      }

      wrapper.vm.handleNestedSelectionChange('')

      expect(wrapper.vm.nestedFilterSelections).toEqual({
        licenseType: ['license-awareness'],
        products: []
      })
    })

    it('normalizeExclusiveNestedSelections returns original selections when no group is selected', () => {
      const wrapper = mountNested()
      const selections = {
        licenseType: [],
        products: []
      }

      expect(wrapper.vm.normalizeExclusiveNestedSelections(selections)).toEqual(selections)
    })

    it('getExclusiveNestedGroupKey returns empty string for non-exclusive config', () => {
      const wrapper = mountNested({
        filterableConfig: {
          groups: [
            {
              key: 'licenseType',
              label: 'License Type',
              fieldName: 'LicenseTypeResourceId',
              items: [{ text: 'Awareness', value: 'license-awareness' }]
            }
          ]
        }
      })

      expect(
        wrapper.vm.getExclusiveNestedGroupKey({
          licenseType: ['license-awareness']
        })
      ).toBe('')
    })

    it('activeNestedGroupConfig resolves matching group when active group exists', () => {
      const wrapper = mountNested()
      wrapper.vm.activeNestedGroup = 'products'

      expect(wrapper.vm.activeNestedGroupConfig).toEqual({
        key: 'products',
        label: 'Products',
        fieldName: 'ModuleResourceId',
        operator: 'Include',
        items: [
          { text: 'Phishing Simulator', value: 'module-1' },
          { text: 'Awareness Educator', value: 'module-2' }
        ]
      })
    })

    it('clearAllNestedSelections emits clear when isEmit is true', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: []
      }

      wrapper.vm.clearAllNestedSelections(true)

      expect(wrapper.emitted('handleClearColumnFilter')[0]).toEqual([
        ['LicenseTypeResourceId', 'ModuleResourceId']
      ])
    })

    it('emitNestedValue emits serialized nested selections by default', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: ['module-1']
      }

      wrapper.vm.emitNestedValue()

      expect(wrapper.emitted('input')[0][0]).toEqual({
        textValue: '',
        selectValue: '',
        fieldName: 'LicenseTypeResourceId',
        nestedSelections: {
          licenseType: ['license-awareness'],
          products: ['module-1']
        }
      })
    })

    it('getInitialNestedFilterSelections only keeps configured group keys', () => {
      const wrapper = mountNested({
        value: {
          textValue: '',
          selectValue: '',
          nestedSelections: {
            licenseType: ['license-awareness'],
            extraGroup: ['x']
          }
        }
      })

      expect(wrapper.vm.getInitialNestedFilterSelections()).toEqual({
        licenseType: ['license-awareness'],
        products: []
      })
    })

    it('getSerializableNestedSelections clones current nested arrays', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: ['module-1']
      }

      const output = wrapper.vm.getSerializableNestedSelections()
      output.licenseType.push('mutated')

      expect(output).toEqual({
        licenseType: ['license-awareness', 'mutated'],
        products: ['module-1']
      })
      expect(wrapper.vm.nestedFilterSelections).toEqual({
        licenseType: ['license-awareness'],
        products: ['module-1']
      })
    })

    it('creates empty nested selection and search maps from configured groups', () => {
      const wrapper = mountNested()

      expect(wrapper.vm.getEmptyNestedFilterSelections()).toEqual({
        licenseType: [],
        products: []
      })
      expect(wrapper.vm.getEmptyNestedSearchValues()).toEqual({
        licenseType: '',
        products: ''
      })
    })

    it('getAppliedNestedSelections returns empty object when no applied value exists', () => {
      const wrapper = mountNested({
        value: {
          textValue: '',
          selectValue: ''
        }
      })

      expect(wrapper.vm.getAppliedNestedSelections()).toEqual({})
    })

    it('returns nested field names and draft selection count for a group', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: ['module-1', 'module-2']
      }

      expect(wrapper.vm.getNestedFieldNames()).toEqual([
        'LicenseTypeResourceId',
        'ModuleResourceId'
      ])
      expect(wrapper.vm.getNestedGroupSelectionCount('products')).toBe(2)
      expect(wrapper.vm.hasNestedGroupSelection('products')).toBe(true)
      expect(wrapper.vm.hasNestedGroupSelection('missing')).toBe(false)
    })

    it('buildNestedFilterItems returns empty array when targeted group has no selection', () => {
      const wrapper = mountNested()
      wrapper.vm.nestedFilterSelections = {
        licenseType: ['license-awareness'],
        products: []
      }

      expect(wrapper.vm.buildNestedFilterItems('products')).toEqual([])
    })

    it('menu watcher syncs nested filter config when nested menu opens', async () => {
      const wrapper = mountNested()
      const syncSpy = jest.spyOn(wrapper.vm, 'syncNestedFilterConfig')

      wrapper.vm.menu = true
      await wrapper.vm.$nextTick()

      expect(syncSpy).toHaveBeenCalled()
    })

    it('filterableConfig watcher syncs nested config when groups change', async () => {
      const wrapper = mountNested()
      const syncSpy = jest.spyOn(wrapper.vm, 'syncNestedFilterConfig')

      await wrapper.setProps({
        filterableConfig: {
          exclusiveGroups: true,
          groups: [
            {
              key: 'licenseType',
              label: 'License Type',
              fieldName: 'LicenseTypeResourceId',
              operator: 'Include',
              items: [{ text: 'Awareness', value: 'license-awareness' }]
            }
          ]
        }
      })

      expect(syncSpy).toHaveBeenCalled()
    })
  })

  describe('compositeSelect', () => {
    const mountComposite = (overrides = {}) =>
      mountComponent({
        filterableType: 'compositeSelect',
        column: { property: 'monthlyConsumption' },
        filterableCustomFieldName: 'TrainingConsumptionMonth',
        filterableItems: [
          { text: 'March 2026 (Current)', value: '2026-03' },
          { text: 'February 2026', value: '2026-02' }
        ],
        compositeSecondItems: [
          { text: 'All Status', value: '1,2' },
          { text: 'In Progress', value: '2' },
          { text: 'Completed', value: '1' }
        ],
        compositeSecondFieldName: 'TrainingConsumptionStatus',
        ...overrides
      })

    it('converts filterableItems on created', () => {
      const wrapper = mountComposite()
      expect(wrapper.vm.convertedFilterableItems).toEqual([
        { text: 'March 2026 (Current)', value: '2026-03' },
        { text: 'February 2026', value: '2026-02' }
      ])
    })

    it('initializes filteredSingleValue from defaultFilterValue', () => {
      const wrapper = mountComposite({ defaultFilterValue: '2026-03' })
      expect(wrapper.vm.filteredSingleValue).toBe('2026-03')
    })

    it('initializes compositeSecondValue from defaultCompositeSecondValue', () => {
      const wrapper = mountComposite({ defaultCompositeSecondValue: '1,2' })
      expect(wrapper.vm.compositeSecondValue).toBe('1,2')
    })

    it('handleFilter emits array with month and status items', () => {
      const wrapper = mountComposite()
      wrapper.vm.filteredSingleValue = '2026-03'
      wrapper.vm.compositeSecondValue = '1'

      wrapper.vm.handleFilter()

      const emitted = wrapper.emitted('handleFilterColumn')[0][0]
      expect(Array.isArray(emitted)).toBe(true)
      expect(emitted).toEqual([
        { Value: '2026-03', FieldName: 'TrainingConsumptionMonth', Operator: '=' },
        { Value: '1', FieldName: 'TrainingConsumptionStatus', Operator: 'Include' }
      ])
    })

    it('handleFilter emits only month when compositeSecondValue is null', () => {
      const wrapper = mountComposite()
      wrapper.vm.filteredSingleValue = '2026-03'
      wrapper.vm.compositeSecondValue = null

      wrapper.vm.handleFilter()

      const emitted = wrapper.emitted('handleFilterColumn')[0][0]
      expect(emitted).toEqual([
        { Value: '2026-03', FieldName: 'TrainingConsumptionMonth', Operator: '=' }
      ])
    })

    it('getFilterButtonDisabled returns true when filteredSingleValue is null', () => {
      const wrapper = mountComposite()
      wrapper.vm.filteredSingleValue = null
      expect(wrapper.vm.getFilterButtonDisabled).toBe(true)
    })

    it('getFilterButtonDisabled returns false when filteredSingleValue is set', () => {
      const wrapper = mountComposite()
      wrapper.vm.filteredSingleValue = '2026-03'
      expect(wrapper.vm.getFilterButtonDisabled).toBe(false)
    })

    it('clearFilter resets compositeSecondValue', () => {
      const wrapper = mountComposite()
      wrapper.vm.compositeSecondValue = '1'
      wrapper.vm.filteredSingleValue = '2026-03'

      wrapper.vm.clearFilter()

      expect(wrapper.vm.compositeSecondValue).toBeNull()
      expect(wrapper.vm.filteredSingleValue).toBeNull()
    })
  })

  describe('filterableItems watcher', () => {
    it('updates convertedFilterableItems when filterableItems prop changes', async () => {
      const wrapper = mountComponent({
        filterableType: 'select',
        filterableItems: []
      })
      expect(wrapper.vm.convertedFilterableItems).toEqual([])

      await wrapper.setProps({
        filterableItems: [{ text: 'New', value: 'new' }]
      })

      expect(wrapper.vm.convertedFilterableItems).toEqual([{ text: 'New', value: 'new' }])
    })

    it('ignores filterableItems updates for non-select-like filter types', async () => {
      const wrapper = mountComponent({
        filterableType: 'text',
        filterableItems: []
      })
      wrapper.vm.convertedFilterableItems = [{ text: 'Existing', value: 'existing' }]

      await wrapper.setProps({
        filterableItems: [{ text: 'New', value: 'new' }]
      })

      expect(wrapper.vm.convertedFilterableItems).toEqual([
        { text: 'Existing', value: 'existing' }
      ])
    })

    it('converts string items when filterableItems prop changes for select-like filters', async () => {
      const wrapper = mountComponent({
        filterableType: 'singleSelect',
        filterableItems: []
      })

      await wrapper.setProps({
        filterableItems: ['March 2026']
      })

      expect(wrapper.vm.convertedFilterableItems).toEqual([
        { text: 'March 2026', value: 'March 2026' }
      ])
    })
  })

  describe('defaultFilterValue', () => {
    it('initializes filteredSingleValue from defaultFilterValue when no saved value', () => {
      const wrapper = mountComponent({
        filterableType: 'singleSelect',
        defaultFilterValue: '2026-03',
        value: { textValue: '', selectValue: '' }
      })
      expect(wrapper.vm.filteredSingleValue).toBe('2026-03')
    })

    it('saved selectValue takes precedence over defaultFilterValue', () => {
      const wrapper = mountComponent({
        filterableType: 'singleSelect',
        defaultFilterValue: '2026-03',
        value: { textValue: '', selectValue: '2026-02' }
      })
      expect(wrapper.vm.filteredSingleValue).toBe('2026-02')
    })
  })
})
