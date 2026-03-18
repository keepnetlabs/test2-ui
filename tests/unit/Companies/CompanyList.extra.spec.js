import { shallowMount } from '@vue/test-utils'
import CompanyList from '@/components/Companies/CompanyList.vue'
import { searchCompanies, deleteCompany } from '@/api/company'
import { handleIsSafari, setSafariClusterFix } from '@/utils/functions'

jest.mock('@/api/company', () => ({
  searchCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 1,
          results: [{ companyResourceId: 'c-1', companyName: 'Acme' }]
        }
      }
    })
  ),
  getCompanyByID: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  deleteCompany: jest.fn(() => Promise.resolve({ data: { message: 'ok' } })),
  exportCompanies: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
  bulkDeleteCompanies: jest.fn(() => Promise.resolve())
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getMultiple: jest.fn(() => Promise.resolve([]))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => []),
  columnFilterCleared: jest.fn(() => [])
}))

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getVendors: jest.fn(() =>
      Promise.resolve({
        data: {
          data: [
            { id: 'v-1', name: 'Keepnet' },
            { id: 'v-2', name: 'AwareGO' }
          ]
        }
      })
    )
  }
}))

jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn((props = {}) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
    ...props
  })),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd-company-list'),
  handleIsSafari: jest.fn(() => false),
  setSafariClusterFix: jest.fn(() => 'safari-cell')
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanyList.vue (extra)', () => {
  const DatatableStub = {
    name: 'Datatable',
    template: '<div />',
    methods: {
      reRenderFilters() {},
      unSelectRow() {},
      changeServerSideSelectionCount() {},
      resetSelectableParams() {},
      toggleIsSettingsOpened() {}
    }
  }

  const createWrapper = () =>
    shallowMount(CompanyList, {
      stubs: {
        Datatable: DatatableStub,
        DeleteModal: true,
        CompanyListExtend: true,
        CompanyCreateOrEdit: true,
        AddGroupToModal: true,
        CreateItemModal: true,
        AppModal: true,
        ConfigureNewCompanyModal: true,
        AlertBox: true,
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true,
        VIcon: true,
        VBtn: true,
        VTooltip: true
      },
      mocks: {
        $router: { go: jest.fn() },
        $store: {
          getters: {
            'permissions/getCompaniesCreatePermissions': true,
            'permissions/getCompaniesEditPermissions': true,
            'permissions/getCompanyGroupsSearchPermissions': true,
            'permissions/getCompaniesSearchPermissions': true,
            'permissions/getCompaniesDeletePermissions': true
          }
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created adds safari cell-class handler when safari is detected', async () => {
    handleIsSafari.mockReturnValueOnce(true)
    const wrapper = createWrapper()
    await flushPromises()

    expect(handleIsSafari).toHaveBeenCalled()
    expect(typeof wrapper.vm.bindPropsIsSafari.handleSetCellClass).toBe('function')
    const out = wrapper.vm.bindPropsIsSafari.handleSetCellClass({ row: { companyName: 'Acme' } })
    expect(setSafariClusterFix).toHaveBeenCalledWith(
      { row: { companyName: 'Acme' } },
      'companyName'
    )
    expect(out).toBe('safari-cell')
  })

  it('getTableData enables alertbox when exceeded-limit count exists and filter is not active', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    searchCompanies.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 3,
          results: [{ companyResourceId: 'c-1', companyName: 'A' }]
        }
      }
    })
    wrapper.vm.isTargetUserCountExceedLimit = false
    wrapper.vm.canRenderAlertbox = false

    wrapper.vm.getTableData()
    await flushPromises()

    expect(wrapper.vm.limitExceededCompanyCount).toBe(3)
    expect(wrapper.vm.isExceedingLimitFilterDisabled).toBe(false)
    expect(wrapper.vm.canRenderAlertbox).toBe(true)
  })

  it('getTableData keeps alertbox hidden when exceeded-limit filter is already active', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    searchCompanies.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 5,
          results: [{ companyResourceId: 'c-2', companyName: 'B' }]
        }
      }
    })
    wrapper.vm.isTargetUserCountExceedLimit = true
    wrapper.vm.canRenderAlertbox = false

    wrapper.vm.getTableData()
    await flushPromises()

    expect(wrapper.vm.limitExceededCompanyCount).toBe(5)
    expect(wrapper.vm.canRenderAlertbox).toBe(false)
  })

  it('deleteConfirmedItem does not refresh table when api response has no message', async () => {
    deleteCompany.mockResolvedValueOnce({ data: {} })
    const wrapper = createWrapper()
    await flushPromises()
    const unSelectRow = jest.fn()
    const changeServerSideSelectionCount = jest.fn()
    wrapper.vm.$refs.refDataList = { unSelectRow, changeServerSideSelectionCount }
    wrapper.vm.getTableData = jest.fn()
    wrapper.vm.selectedRow = { companyResourceId: 'c-1' }

    wrapper.vm.deleteConfirmedItem()
    await flushPromises()

    expect(deleteCompany).toHaveBeenCalledWith('c-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(wrapper.vm.getTableData).not.toHaveBeenCalled()
  })

  describe('Training metrics columns', () => {
    it('has enrolledVendorNames, monthlyEnrolled, monthlyConsumption columns', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const properties = wrapper.vm.tableOptions.columns.map((c) => c.property)
      expect(properties).toContain('enrolledVendorNames')
      expect(properties).toContain('monthlyEnrolled')
      expect(properties).toContain('monthlyConsumption')
    })

    it('enrolledVendorNames uses select filter with TrainingVendorId fieldName', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const col = wrapper.vm.tableOptions.columns.find((c) => c.property === 'enrolledVendorNames')
      expect(col.filterableType).toBe('select')
      expect(col.filterableCustomFieldName).toBe('TrainingVendorId')
      expect(col.badgeColor).toBe('#757575')
    })

    it('monthlyEnrolled uses singleSelect filter with TrainingEnrolledMonth fieldName', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const col = wrapper.vm.tableOptions.columns.find((c) => c.property === 'monthlyEnrolled')
      expect(col.filterableType).toBe('singleSelect')
      expect(col.filterableCustomFieldName).toBe('TrainingEnrolledMonth')
    })

    it('monthlyConsumption uses compositeSelect with TrainingConsumptionMonth and TrainingConsumptionStatus', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const col = wrapper.vm.tableOptions.columns.find((c) => c.property === 'monthlyConsumption')
      expect(col.filterableType).toBe('compositeSelect')
      expect(col.filterableCustomFieldName).toBe('TrainingConsumptionMonth')
      expect(col.compositeSecondFieldName).toBe('TrainingConsumptionStatus')
      expect(col.compositeSecondItems).toEqual([
        { text: 'All Status', value: '1,2' },
        { text: 'In Progress', value: '2' },
        { text: 'Completed', value: '1' }
      ])
      expect(col.defaultCompositeSecondValue).toBe('1,2')
    })

    it('training columns have sortable false and hideSort true', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const trainingCols = ['enrolledVendorNames', 'monthlyEnrolled', 'monthlyConsumption']
      trainingCols.forEach((prop) => {
        const col = wrapper.vm.tableOptions.columns.find((c) => c.property === prop)
        expect(col.sortable).toBe(false)
        expect(col.hideSort).toBe(true)
      })
    })
  })

  describe('generateMonthFilterItems', () => {
    it('returns items with YYYY-MM format values', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const items = wrapper.vm.generateMonthFilterItems()
      expect(items.length).toBeGreaterThan(0)
      expect(items[0].value).toMatch(/^\d{4}-\d{2}$/)
    })

    it('marks current month with (Current) suffix', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const items = wrapper.vm.generateMonthFilterItems()
      const currentItem = items[items.length - 1]
      expect(currentItem.text).toContain('(Current)')
    })
  })

  describe('setMonthlyFilterItems', () => {
    it('sets defaultFilterValue on training columns but not monthlyActiveUserCount', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.setMonthlyFilterItems()
      await wrapper.vm.$nextTick()

      const enrolledCol = wrapper.vm.tableOptions.columns.find((c) => c.property === 'monthlyEnrolled')
      const consumptionCol = wrapper.vm.tableOptions.columns.find((c) => c.property === 'monthlyConsumption')
      const monthlyUsersCol = wrapper.vm.tableOptions.columns.find((c) => c.property === 'monthlyActiveUserCount')

      expect(enrolledCol.defaultFilterValue).toBeTruthy()
      expect(consumptionCol.defaultFilterValue).toBeTruthy()
      expect(monthlyUsersCol.defaultFilterValue).toBeTruthy()
    })
  })

  describe('loadTrainingVendorFilterItems', () => {
    it('populates enrolledVendorNames column filterableItems from API', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      const col = wrapper.vm.tableOptions.columns.find((c) => c.property === 'enrolledVendorNames')
      expect(col.filterableItems).toEqual([
        { text: 'Keepnet', value: 'v-1' },
        { text: 'AwareGO', value: 'v-2' }
      ])
    })
  })

  describe('getManipulatedTableData', () => {
    it('splits enrolledVendorNames string into array', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const data = wrapper.vm.getManipulatedTableData([
        { enrolledVendorNames: 'AwareGO , Keepnet , CyberOff' }
      ])
      expect(data[0].enrolledVendorNames).toEqual(['AwareGO', 'Keepnet', 'CyberOff'])
    })

    it('handles empty enrolledVendorNames', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const data = wrapper.vm.getManipulatedTableData([
        { enrolledVendorNames: '' }
      ])
      expect(data[0].enrolledVendorNames).toBe('')
    })
  })

  describe('columnFilterChanged with array filter', () => {
    it('replaces existing items with same FieldNames instead of duplicating', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.payload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'TrainingConsumptionMonth', Operator: '=', Value: '2026-02' },
        { FieldName: 'TrainingConsumptionStatus', Operator: 'Include', Value: '1,2' }
      ]

      wrapper.vm.getTableData = jest.fn()
      wrapper.vm.columnFilterChanged([
        { FieldName: 'TrainingConsumptionMonth', Operator: '=', Value: '2026-03' },
        { FieldName: 'TrainingConsumptionStatus', Operator: 'Include', Value: '1' }
      ])

      const items = wrapper.vm.payload.filter.FilterGroups[0].FilterItems
      const monthItems = items.filter((i) => i.FieldName === 'TrainingConsumptionMonth')
      const statusItems = items.filter((i) => i.FieldName === 'TrainingConsumptionStatus')
      expect(monthItems.length).toBe(1)
      expect(monthItems[0].Value).toBe('2026-03')
      expect(statusItems.length).toBe(1)
      expect(statusItems[0].Value).toBe('1')
    })
  })

  describe('columnFilterCleared for composite', () => {
    it('clears TrainingConsumptionStatus when TrainingConsumptionMonth is cleared', async () => {
      const { columnFilterCleared } = require('@/utils/helperFunctions')
      const wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.getTableData = jest.fn()

      wrapper.vm.columnFilterCleared('TrainingConsumptionMonth')

      expect(columnFilterCleared).toHaveBeenCalledWith('TrainingConsumptionMonth', expect.any(Object))
      expect(columnFilterCleared).toHaveBeenCalledWith('TrainingConsumptionStatus', expect.any(Object))
    })
  })

  describe('normalizeFilterForBackend', () => {
    it('forces = operator for TrainingEnrolledMonth', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const result = wrapper.vm.normalizeFilterForBackend({
        FieldName: 'TrainingEnrolledMonth',
        Value: '2026-03',
        Operator: 'Contains'
      })
      expect(result.Operator).toBe('=')
    })

    it('forces = operator for TrainingConsumptionMonth', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const result = wrapper.vm.normalizeFilterForBackend({
        FieldName: 'TrainingConsumptionMonth',
        Value: '2026-03',
        Operator: 'Contains'
      })
      expect(result.Operator).toBe('=')
    })

    it('handles array filter items', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const result = wrapper.vm.normalizeFilterForBackend([
        { FieldName: 'TrainingConsumptionMonth', Value: '2026-03', Operator: 'Contains' },
        { FieldName: 'TrainingConsumptionStatus', Value: '1', Operator: 'Include' }
      ])
      expect(result[0].Operator).toBe('=')
      expect(result[1].Operator).toBe('Include')
    })
  })
})
