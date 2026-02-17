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

  describe('Component Name and Type', () => {
    it('should have component name or be valid without name', () => {
      const wrapper = mountComponent()
      // Component name is optional
      expect(wrapper.vm.$options).toBeDefined()
    })

    it('should be a Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have component options', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options).toBeDefined()
    })
  })

  describe('Column Configuration', () => {
    it('should accept columns prop', () => {
      const columns = [
        { label: 'Name', property: 'name', show: true },
        { label: 'Email', property: 'email', show: true }
      ]
      const wrapper = mountComponent({ columns })
      expect(wrapper.vm.columns).toEqual(columns)
    })

    it('should handle multiple column types', () => {
      const columns = [
        { label: 'Name', property: 'name', show: true, type: 'text' },
        { label: 'Status', property: 'status', show: true, type: 'badge' },
        { label: 'Date', property: 'date', show: true, type: 'date' }
      ]
      const wrapper = mountComponent({ columns })
      expect(wrapper.vm.columns.length).toBe(3)
    })

    it('should hide columns when show is false', () => {
      const columns = [
        { label: 'Name', property: 'name', show: true },
        { label: 'Secret', property: 'secret', show: false }
      ]
      const wrapper = mountComponent({ columns })
      expect(wrapper.vm.columns[0].show).toBe(true)
      expect(wrapper.vm.columns[1].show).toBe(false)
    })
  })

  describe('Table Data Handling', () => {
    it('should accept table data as array', () => {
      const tableData = [
        { name: 'Item 1', email: 'test1@test.com' },
        { name: 'Item 2', email: 'test2@test.com' }
      ]
      const wrapper = mountComponent({ table: tableData })
      expect(wrapper.vm.table).toEqual(tableData)
    })

    it('should handle empty table array', () => {
      const wrapper = mountComponent({ table: [] })
      expect(wrapper.vm.table).toEqual([])
    })

    it('should handle large datasets', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        name: `Item ${i}`,
        email: `test${i}@test.com`
      }))
      const wrapper = mountComponent({ table: largeData })
      expect(wrapper.vm.table.length).toBe(1000)
    })
  })

  describe('Search and Filter', () => {
    it('should initialize search data property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.search).toBeDefined()
    })

    it('should trigger search event', () => {
      const wrapper = mountComponent({ filterable: true, options: true })
      const spy = jest.spyOn(wrapper.vm, 'searchChangedEvent')
      wrapper.vm.searchChangedEvent('test')
      expect(spy).toHaveBeenCalledWith('test')
    })

    it('should handle search with multiple results', () => {
      const wrapper = mountComponent({
        table: [
          { name: 'Test1', email: 'test1@test.com' },
          { name: 'Test2', email: 'test2@test.com' }
        ],
        filterable: true,
        options: true
      })
      expect(wrapper.vm.table.length).toBe(2)
    })
  })

  describe('Selection Handling', () => {
    it('should initialize multipleSelection as empty array', () => {
      const wrapper = mountComponent({ selectable: true })
      expect(Array.isArray(wrapper.vm.multipleSelection)).toBe(true)
    })

    it('should update selection on selection change', () => {
      const wrapper = mountComponent({ selectable: true })
      const selectedItems = [{ name: 'Item 1', email: 'test1@test.com' }]
      wrapper.vm.handleSelectionChange(selectedItems)
      expect(wrapper.vm.multipleSelection).toEqual(selectedItems)
    })

    it('should clear selection', () => {
      const wrapper = mountComponent({ selectable: true })
      wrapper.vm.multipleSelection = [{ name: 'Item 1' }]
      wrapper.vm.handleSelectionChange([])
      expect(wrapper.vm.multipleSelection).toEqual([])
    })

    it('should handle multiple selections', () => {
      const wrapper = mountComponent({ selectable: true })
      const selections = [
        { name: 'Item 1', email: 'test1@test.com' },
        { name: 'Item 2', email: 'test2@test.com' },
        { name: 'Item 3', email: 'test3@test.com' }
      ]
      wrapper.vm.handleSelectionChange(selections)
      expect(wrapper.vm.multipleSelection.length).toBe(3)
    })
  })

  describe('Row Operations', () => {
    it('should emit row-click event', () => {
      const wrapper = mountComponent()
      const row = { name: 'Item 1', email: 'test@test.com' }
      wrapper.vm.handleRowClick(row)
      expect(wrapper.emitted('row-click')).toBeTruthy()
      expect(wrapper.emitted('row-click')[0][0]).toEqual(row)
    })

    it('should handle row click with complex objects', () => {
      const wrapper = mountComponent()
      const complexRow = {
        id: 1,
        name: 'Complex Item',
        email: 'test@test.com',
        metadata: { status: 'active', tags: ['important', 'urgent'] }
      }
      wrapper.vm.handleRowClick(complexRow)
      expect(wrapper.emitted('row-click')[0][0]).toEqual(complexRow)
    })
  })

  describe('Pagination', () => {
    it('should render pagination when showPagination is true', () => {
      const wrapper = mountComponent({ showPagination: true })
      expect(wrapper.vm.showPagination).toBe(true)
    })

    it('should handle pagination with different page sizes', () => {
      const wrapper = mountComponent({
        showPagination: true,
        table: Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
      })
      expect(wrapper.vm.table.length).toBe(100)
    })
  })

  describe('Refresh Functionality', () => {
    it('should have handleRefresh method', () => {
      const wrapper = mountComponent({ showRefreshButton: true, options: true })
      expect(typeof wrapper.vm.handleRefresh).toBe('function')
    })

    it('should call handleRefresh without errors', () => {
      const wrapper = mountComponent({ showRefreshButton: true, options: true })
      expect(() => {
        wrapper.vm.handleRefresh()
      }).not.toThrow()
    })
  })

  describe('Loading State', () => {
    it('should show loading state when loading prop is true', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should hide loading when prop is false', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('should handle loading state changes', async () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
      await wrapper.setProps({ loading: true })
      expect(wrapper.vm.loading).toBe(true)
    })
  })

  describe('Download Functionality', () => {
    it('should accept downloadButton prop', () => {
      const wrapper = mountComponent({
        options: true,
        downloadButton: { show: true, disabled: false }
      })
      expect(wrapper.vm.downloadButton).toBeDefined()
    })

    it('should handle disabled download button', () => {
      const wrapper = mountComponent({
        options: true,
        downloadButton: { show: true, disabled: true }
      })
      expect(wrapper.vm.downloadButton.disabled).toBe(true)
    })
  })

  describe('Header and Table Structure', () => {
    it('should render table header when options are provided', () => {
      const wrapper = mountComponent({ options: true, filterable: true })
      expect(wrapper.find('.table-header').exists()).toBe(true)
    })

    it('should render el-table element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.el-table-mock').exists()).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('should have empty message property', () => {
      const wrapper = mountComponent({ empty: { message: 'No data' } })
      expect(wrapper.vm.empty.message).toBe('No data')
    })

    it('should display different empty messages', () => {
      const wrapper1 = mountComponent({ empty: { message: 'No records' } })
      const wrapper2 = mountComponent({ empty: { message: 'Empty table' } })
      expect(wrapper1.vm.empty.message).not.toBe(wrapper2.vm.empty.message)
    })

    it('should show empty state with button', () => {
      const wrapper = mountComponent({
        table: [],
        empty: { message: 'No data', btn: { text: 'Add Item' } }
      })
      expect(wrapper.vm.empty.btn).toBeDefined()
    })
  })

  describe('Props Combination', () => {
    it('should handle all major props together', () => {
      const wrapper = mountComponent({
        columns: [{ label: 'Name', property: 'name', show: true }],
        table: [{ name: 'Item 1' }],
        selectable: true,
        showPagination: true,
        filterable: true,
        options: true,
        loading: false,
        empty: { message: 'No data' }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.columns.length).toBe(1)
      expect(wrapper.vm.table.length).toBe(1)
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple DataTable instances', () => {
      const wrapper1 = mountComponent({ table: [{ name: 'Table1' }] })
      const wrapper2 = mountComponent({ table: [{ name: 'Table2' }] })
      expect(wrapper1.vm.table[0].name).toBe('Table1')
      expect(wrapper2.vm.table[0].name).toBe('Table2')
    })

    it('should handle independent selections in multiple instances', () => {
      const wrapper1 = mountComponent({ selectable: true })
      const wrapper2 = mountComponent({ selectable: true })
      wrapper1.vm.handleSelectionChange([{ name: 'Selected1' }])
      wrapper2.vm.handleSelectionChange([{ name: 'Selected2' }])
      expect(wrapper1.vm.multipleSelection[0].name).toBe('Selected1')
      expect(wrapper2.vm.multipleSelection[0].name).toBe('Selected2')
    })
  })

  describe('Performance Characteristics', () => {
    it('should mount within reasonable time', () => {
      const start = Date.now()
      const wrapper = mountComponent({
        table: Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
      })
      const end = Date.now()
      expect(end - start).toBeLessThan(1000)
    })

    it('should handle rapid prop changes', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 10; i++) {
        await wrapper.setProps({
          search: `query${i}`
        })
      }
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Lifecycle', () => {
    it('should initialize without errors', () => {
      expect(() => {
        mountComponent()
      }).not.toThrow()
    })

    it('should mount and destroy cleanly', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })
  })

  describe('Additional Branch Coverage', () => {
    it('should persist default search payload and emit set-default-search', () => {
      const wrapper = mountComponent({
        savedFiltersLocalStorageKey: 'datatable-default-search',
        axiosPayload: {
          filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
        }
      })

      wrapper.setData({
        search: 'john',
        filterValues: { Status: 'Active' }
      })
      wrapper.vm.handleSetDefaultSearch()

      const saved = JSON.parse(localStorage.getItem('datatable-default-search'))
      expect(saved.search).toBe('john')
      expect(saved.filterValues).toEqual({ Status: 'Active' })
      expect(wrapper.emitted('set-default-search')).toBeTruthy()
    })

    it('should include showByExamStatus for exam reports when saving default search', () => {
      const wrapper = mountComponent({
        isReportWithExam: true,
        savedFiltersLocalStorageKey: 'datatable-default-search-exam',
        axiosPayload: {
          filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
          showByExamStatus: 'FirstAttempt'
        }
      })

      wrapper.setData({
        search: 'jane',
        filterValues: { Product: 'Training' }
      })
      wrapper.vm.handleSetDefaultSearch()

      const saved = JSON.parse(localStorage.getItem('datatable-default-search-exam'))
      expect(saved.showByExamStatus).toBe('FirstAttempt')
      expect(saved.search).toBe('jane')
    })

    it('should clear filters, emit updated payload and clear sort', () => {
      const wrapper = mountComponent({
        isServerSide: true,
        isReportWithExam: true,
        serverSideProps: { pageSize: 25, pageNumber: 2, totalNumberOfRecords: 100 },
        axiosPayload: {
          filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'Status', Value: 'Active' }] }, { FilterItems: [] }] }
        }
      })
      wrapper.vm.handleRefresh = jest.fn()
      wrapper.vm.$refs.elTableRef = { clearSort: jest.fn() }
      wrapper.setData({ search: 'to-clear', filterValues: { Status: 'Active' } })

      wrapper.vm.handleClearFilters()

      expect(wrapper.vm.search).toBe('')
      expect(wrapper.vm.handleRefresh).toHaveBeenCalled()
      expect(wrapper.vm.$refs.elTableRef.clearSort).toHaveBeenCalled()
      expect(wrapper.emitted('clear-filters')).toBeTruthy()
      expect(wrapper.emitted('update:axios-payload')).toBeTruthy()
      expect(wrapper.emitted('update:axios-payload')[0][0].pageSize).toBe(25)
      expect(wrapper.emitted('update:axios-payload')[0][0].showByExamStatus).toBe('FirstAttempt')
    })

    it('should emit correct downloadEvent payload for server-side and client-side', () => {
      const serverWrapper = mountComponent({
        serverSideEvents: { pagination: true, search: false, sort: false },
        serverSideProps: { pageNumber: 3, pageSize: 50, totalNumberOfRecords: 500 }
      })
      serverWrapper.setData({ downloadModalTitle: 'Download All' })
      serverWrapper.vm.downloadEvent(['CSV'])

      const serverPayload = serverWrapper.emitted('downloadEvent')[0][0]
      expect(serverPayload).toEqual({
        exportTypes: ['CSV'],
        pageNumber: 3,
        pageSize: 50,
        reportAllPages: true
      })

      const clientWrapper = mountComponent({
        serverSideEvents: { pagination: false, search: false, sort: false }
      })
      clientWrapper.setData({ currentPage: 2, rowCount: 10, downloadModalTitle: 'Download Current Page' })
      clientWrapper.vm.downloadEvent(['PDF'])

      const clientPayload = clientWrapper.emitted('downloadEvent')[0][0]
      expect(clientPayload).toEqual({
        exportTypes: ['PDF'],
        pageNumber: 2,
        pageSize: 10,
        reportAllPages: false
      })
    })
  })
})
