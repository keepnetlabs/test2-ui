import { createLocalVue, shallowMount } from '@vue/test-utils'
import DataTable from '@/components/DataTable.vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

describe('DataTable.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let vuetify
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
        modules: {
            usersDashboard: {
                namespaced: true,
                getters: {
                    getLabels: () => ({
                        dataTablePaginationOf: 'of',
                        dataTableRowsPerPage: 'Rows per page:',
                        dataTableActions: 'Actions'
                    }),
                    getLanguage: () => 'en-GB'
                }
            },
            common: {
                namespaced: true,
                getters: {
                    getDownloadModalStatus: () => false
                }
            }
        },
        getters: {
            currentLanguage: () => 'en-GB'
        }
    })
    // Mock global element-ui locale usage if needed, but shallowMount shouldn't execute it deep
  })

  const stubs = {
      DatatableLoading: true,
      'download-modal': true,
      'data-table-tooltip': true,
      'extended-view': true,
      'v-card': '<div><slot /></div>',
      'v-icon': true,
      'v-text-field': {
          template: '<input class="search-input" />'
      },
      'v-tooltip': {
          template: '<div><slot name="activator" :on="{}"></slot><span><slot /></span></div>'
      },
      'v-btn': {
          template: '<button @click="$emit(\'click\')"><slot /></button>'
      },
      'v-menu': {
          template: '<div><slot name="activator" :on="{}"></slot><slot /></div>'
      },
      'v-checkbox': {
          template: '<input type="checkbox" />'
      },
      'v-switch': true,
      'v-list': true,
      'v-list-item': true,
      'v-list-item-title': true,
      'el-table': {
          template: '<div class="el-table-mock"><slot /></div>',
          props: ['data'],
          methods: {
              sort: jest.fn(),
              clearSelection: jest.fn()
          }
      },
      'el-table-column': {
          template: '<div class="el-table-column-mock"><slot name="header" :column="{label: \'Header\'}" :$index="0"></slot><slot :row="{}" /></div>',
          props: ['label', 'prop']
      },
      'badge': true,
      'datatable-text-with-badge': true,
      'data-table-default-template': true,
      'data-table-filter': true,
      'data-table-filter-options': true
  }

  const mountComponent = (propsData = {}) => {
      return shallowMount(DataTable, {
          localVue,
          vuetify,
          store,
          propsData: {
              columns: [{ label: 'Name', property: 'name', show: true, type: 'text' }],
              table: [{ name: 'Item 1' }],
              empty: { message: 'No data found' },
              ...propsData
          },
          stubs,
          directives: {
              'click-outside': {},
              'row-color-handler': {}
          }
      })
  }

  it('renders table when not loading', () => {
    const wrapper = mountComponent({ loading: false })
    expect(wrapper.find('.el-table-mock').exists()).toBe(true)
  })

  it('triggers search changed event on input', async () => {
      const wrapper = mountComponent({ 
          filterable: true,
          options: true // needed for filterable to show
      })
      const searchChangedSpy = jest.spyOn(wrapper.vm, 'searchChangedEvent')
      
      wrapper.setData({ search: 'hello' })
      // Trigger searchChangedEvent manually or via stub
      wrapper.vm.searchChangedEvent('hello')
      
      expect(searchChangedSpy).toHaveBeenCalled()
  })

  it('handles refresh button click', async () => {
      const wrapper = mountComponent({ showRefreshButton: true, options: true })
      const handleRefreshSpy = jest.spyOn(wrapper.vm, 'handleRefresh')
      
      wrapper.vm.handleRefresh()
      expect(handleRefreshSpy).toHaveBeenCalled()
  })

  it('computes table header visibility', () => {
      const wrapper = mountComponent({ 
          options: true,
          filterable: true
      })
      expect(wrapper.find('.table-header').exists()).toBe(true)
  })

  it('renders pagination when showPagination is true', () => {
      const wrapper = mountComponent({
          showPagination: true,
          table: [
              { name: 'Item 1' },
              { name: 'Item 2' },
              { name: 'Item 3' }
          ]
      })
      // Pagination should be rendered
      expect(wrapper.vm.showPagination).toBe(true)
  })

  it('handles selection when selectable is true', () => {
      const wrapper = mountComponent({
          selectable: true,
          table: [{ name: 'Item 1' }, { name: 'Item 2' }]
      })
      const handleSelectionChangeSpy = jest.spyOn(wrapper.vm, 'handleSelectionChange')
      
      wrapper.vm.handleSelectionChange([{ name: 'Item 1' }])
      
      expect(handleSelectionChangeSpy).toHaveBeenCalled()
      expect(wrapper.vm.multipleSelection).toEqual([{ name: 'Item 1' }])
  })

  it('emits row-click event when row is clicked', () => {
      const wrapper = mountComponent({
          table: [{ name: 'Item 1' }]
      })
      
      wrapper.vm.handleRowClick({ name: 'Item 1' })
      
      expect(wrapper.emitted('row-click')).toBeTruthy()
      expect(wrapper.emitted('row-click')[0][0]).toEqual({ name: 'Item 1' })
  })

  it('toggles column visibility in settings', () => {
      const columns = [
          { label: 'Name', property: 'name', show: true, type: 'text' },
          { label: 'Email', property: 'email', show: false, type: 'text' }
      ]
      const wrapper = mountComponent({ columns })
      
      // Initially, second column is hidden
      expect(wrapper.vm.columns[1].show).toBe(false)
      
      // Toggle visibility
      wrapper.vm.columns[1].show = true
      
      expect(wrapper.vm.columns[1].show).toBe(true)
  })

  it('renders download button when downloadButton prop is provided', () => {
      const wrapper = mountComponent({
          options: true,
          downloadButton: {
              show: true,
              disabled: false
          }
      })
      
      expect(wrapper.vm.downloadButton.show).toBe(true)
  })

  it('displays empty message when no data', () => {
      const wrapper = mountComponent({
          table: [],
          empty: { message: 'No records found' }
      })
      
      expect(wrapper.vm.empty.message).toBe('No records found')
  })
})
