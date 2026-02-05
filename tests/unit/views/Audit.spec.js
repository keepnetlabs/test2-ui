import { shallowMount } from '@vue/test-utils'

jest.mock('@/api/dashboard', () => ({
  getAuditLogs: jest.fn().mockResolvedValue({
    data: {
      data: {
        totalRowCount: 0,
        results: []
      }
    }
  }),
  exportAuditLog: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => []),
  columnFilterCleared: jest.fn(() => [])
}))

jest.mock('@/helper-classes/server-side-table-props', () => ({
  __esModule: true,
  default: jest.fn()
}))

// Import after mocks
import Audit from '@/views/Audit.vue'
import DataTable from '@/components/DataTable'
import KContainer from '@/components/KContainer/KContainer'

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn((filter) => []),
  columnFilterCleared: jest.fn(() => [])
}))

jest.mock('@/helper-classes/server-side-table-props')

describe('Audit.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Audit, {
      mocks: {
        $store: {
          state: {},
          getters: {}
        }
      },
      stubs: {
        DataTable: true,
        KContainer: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('Component Setup', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('Audit')
    })

    it('should have DataTable component registered', () => {
      const components = wrapper.vm.$options.components
      expect(components.DataTable).toBeDefined()
    })

    it('should have KContainer component registered', () => {
      const components = wrapper.vm.$options.components
      expect(components.KContainer).toBeDefined()
    })
  })

  describe('Data Properties', () => {
    it('should have loading property', () => {
      expect(typeof wrapper.vm.loading).toBe('boolean')
    })

    it('should initialize tableData as array', () => {
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true)
    })

    it('should have labels defined', () => {
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('should have tableOptions defined with proper structure', () => {
      expect(wrapper.vm.tableOptions).toBeDefined()
      expect(wrapper.vm.tableOptions.columns).toBeDefined()
      expect(Array.isArray(wrapper.vm.tableOptions.columns)).toBe(true)
    })

    it('should have serverSideProps defined', () => {
      expect(wrapper.vm.serverSideProps).toBeDefined()
    })

    it('should have bodyData defined', () => {
      expect(wrapper.vm.bodyData).toBeDefined()
    })
  })

  describe('Methods', () => {
    it('should have getDatatableList method', () => {
      expect(typeof wrapper.vm.getDatatableList).toBe('function')
    })

    it('should have exportAuditLog method', () => {
      expect(typeof wrapper.vm.exportAuditLog).toBe('function')
    })

    it('should have columnFilterChanged method', () => {
      expect(typeof wrapper.vm.columnFilterChanged).toBe('function')
    })

    it('should have columnFilterCleared method', () => {
      expect(typeof wrapper.vm.columnFilterCleared).toBe('function')
    })

    it('should have serverSidePageNumberChanged method', () => {
      expect(typeof wrapper.vm.serverSidePageNumberChanged).toBe('function')
    })

    it('should have serverSideSizeChanged method', () => {
      expect(typeof wrapper.vm.serverSideSizeChanged).toBe('function')
    })

    it('should have handleSearchChange method', () => {
      expect(typeof wrapper.vm.handleSearchChange).toBe('function')
    })

    it('should have sortChanged method', () => {
      expect(typeof wrapper.vm.sortChanged).toBe('function')
    })
  })

  describe('Computed Properties', () => {
    it('should have downloadOptions computed property', () => {
      expect(wrapper.vm.downloadOptions).toBeDefined()
    })
  })
})
