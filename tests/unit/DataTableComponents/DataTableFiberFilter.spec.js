import { shallowMount } from '@vue/test-utils'
import DataTableFiber from '@/components/DataTableComponents/DataTableFiber'
import DataTableFilter from '@/components/DataTableComponents/DataTableFilter'

describe('DataTableFiber.vue', () => {
  it('renders online/offline icon branches and fallback text', () => {
    const onlineWrapper = shallowMount(DataTableFiber, {
      propsData: {
        scope: { row: { addInStatusName: 'Online', name: 'Mailbox' } },
        col: { property: 'name', emptyText: '-' }
      }
    })
    const offlineWrapper = shallowMount(DataTableFiber, {
      propsData: {
        scope: { row: { addInStatusName: 'Offline' } },
        col: { property: 'name', emptyText: '-' }
      }
    })

    expect(onlineWrapper.find('img[src*="online"]').exists()).toBe(true)
    expect(onlineWrapper.text()).toContain('Mailbox')
    expect(offlineWrapper.find('img[src*="offline"]').exists()).toBe(true)
    expect(offlineWrapper.text()).toContain('-')
  })
})

describe('DataTableFilter.vue', () => {
  const mountFilter = (propsData = {}) =>
    shallowMount(DataTableFilter, {
      propsData: {
        column: { property: 'name' },
        filterableType: 'text',
        filterProps: { items: ['Contains', '='] },
        value: { textValue: '', selectValue: '' },
        ...propsData
      },
      mocks: {
        $store: {
          state: { auth: { user: { userCompany: { timeZone: 'UTC' } } } }
        }
      },
      stubs: {
        InputDate: true,
        AppDialog: true,
        'v-menu': true,
        'v-icon': true,
        'v-select': true,
        'v-text-field': true,
        'v-checkbox': true,
        'v-btn': true
      }
    })

  it('emits text filter payload and input event', () => {
    const wrapper = mountFilter()
    wrapper.setData({
      filterValue: 'alice',
      filteredSelectValue: 'Contains'
    })

    wrapper.vm.handleFilter()

    expect(wrapper.emitted('handleFilterColumn')).toBeTruthy()
    expect(wrapper.emitted('handleFilterColumn')[0][0]).toEqual({
      Value: 'alice',
      FieldName: 'name',
      Operator: 'Contains'
    })
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('clearFilter resets values and emits clear event', () => {
    const wrapper = mountFilter({
      filterableType: 'select',
      filterableItems: ['A', 'B'],
      value: { textValue: 'A', selectValue: 'A' }
    })
    wrapper.setData({
      filterValue: 'A',
      filterChecked: ['A'],
      isFilterActive: true,
      menu: true
    })

    wrapper.vm.clearFilter()

    expect(wrapper.vm.menu).toBe(false)
    expect(wrapper.vm.isFilterActive).toBe(false)
    expect(wrapper.vm.filterChecked).toEqual([])
    expect(wrapper.emitted('handleClearColumnFilter')).toBeTruthy()
  })

  it('handleMenuVisibilityChange keeps menu open while picker is visible', () => {
    const wrapper = mountFilter({ filterableType: 'date' })
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

  it('shows search input for select filters based on item count and search text', () => {
    const wrapper = mountFilter({
      filterableType: 'select',
      showSelectSearch: true,
      filterableItems: ['One', 'Two', 'Three', 'Four', 'Five']
    })

    expect(wrapper.vm.isShowSearchTextField).toBe(true)
    wrapper.setData({ filterValue: 'tw' })
    expect(wrapper.vm.searchInItems.length).toBe(1)
  })
})
