import { shallowMount } from '@vue/test-utils'
import CompanyList from '@/components/Companies/CompanyList.vue'

jest.mock('@/api/company', () => ({
  searchCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 0,
          results: []
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

jest.mock('@/api/common', () => ({
  getLicences: jest.fn(() =>
    Promise.resolve({
      data: { data: { licenses: [], allLicenseModules: [] } }
    })
  )
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => []),
  columnFilterCleared: jest.fn(() => [])
}))

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getVendors: jest.fn(() => Promise.resolve({ data: { data: [] } }))
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
  createRandomCryptStringNumber: jest.fn(() => 'rnd-sov-list'),
  handleIsSafari: jest.fn(() => false),
  setSafariClusterFix: jest.fn(() => 'safari-cell')
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanyList.vue (sovereignty)', () => {
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

  const createWrapper = ({ role = 'Root' } = {}) =>
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
        SovereigntyMigrateModal: true,
        SovereigntyReportDrawer: true,
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
            'auth/isRootOrReseller': role === 'Root' || role === 'Reseller',
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

  describe('isRootOrReseller', () => {
    it('returns true for Root', () => {
      const wrapper = createWrapper({ role: 'Root' })
      expect(wrapper.vm.isRootOrReseller).toBe(true)
    })

    it('returns true for Reseller', () => {
      const wrapper = createWrapper({ role: 'Reseller' })
      expect(wrapper.vm.isRootOrReseller).toBe(true)
    })

    it('returns false for any other role', () => {
      const wrapper = createWrapper({ role: 'CompanyAdmin' })
      expect(wrapper.vm.isRootOrReseller).toBe(false)
    })

    it('handles missing role gracefully', () => {
      const wrapper = shallowMount(CompanyList, {
        stubs: {
          Datatable: DatatableStub,
          DefaultMenuRowAction: true,
          DefaultButtonRowAction: true,
          RowActionsMenu: true,
          AppModal: true,
          AlertBox: true,
          DeleteModal: true,
          CompanyListExtend: true,
          CompanyCreateOrEdit: true,
          AddGroupToModal: true,
          CreateItemModal: true,
          ConfigureNewCompanyModal: true,
          SovereigntyMigrateModal: true,
          SovereigntyReportDrawer: true,
          VIcon: true,
          VBtn: true,
          VTooltip: true
        },
        mocks: {
          $router: { go: jest.fn() },
          $store: {
            getters: {
              'auth/isRootOrReseller': false,
              'permissions/getCompaniesCreatePermissions': true,
              'permissions/getCompaniesEditPermissions': true,
              'permissions/getCompanyGroupsSearchPermissions': true,
              'permissions/getCompaniesSearchPermissions': true,
              'permissions/getCompaniesDeletePermissions': true
            }
          }
        }
      })
      expect(wrapper.vm.isRootOrReseller).toBe(false)
    })
  })

  describe('companyRowRegionCode', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('returns empty string for empty row', () => {
      expect(wrapper.vm.companyRowRegionCode({})).toBe('')
    })

    it('reads nested region.code', () => {
      expect(wrapper.vm.companyRowRegionCode({ region: { code: 'canadacentral' } })).toBe(
        'canadacentral'
      )
    })

    it('reads nested PascalCase Region.Code', () => {
      expect(wrapper.vm.companyRowRegionCode({ Region: { Code: 'eu-west' } })).toBe('eu-west')
    })

    it('reads top-level regionCode', () => {
      expect(wrapper.vm.companyRowRegionCode({ regionCode: 'us-east' })).toBe('us-east')
    })

    it('reads top-level azureRegionCode as last resort', () => {
      expect(wrapper.vm.companyRowRegionCode({ azureRegionCode: 'westus' })).toBe('westus')
    })

    it('prefers nested object over flat fields', () => {
      const row = { region: { code: 'nested' }, regionCode: 'flat' }
      expect(wrapper.vm.companyRowRegionCode(row)).toBe('nested')
    })

    it('trims whitespace from value', () => {
      expect(wrapper.vm.companyRowRegionCode({ regionCode: '  canadacentral  ' })).toBe(
        'canadacentral'
      )
    })

    it('skips empty / whitespace-only values', () => {
      expect(wrapper.vm.companyRowRegionCode({ regionCode: '   ', azureRegionCode: 'fallback' })).toBe(
        'fallback'
      )
    })

    it('reads each nested key variant in priority order (code > Code > regionCode > RegionCode)', () => {
      expect(wrapper.vm.companyRowRegionCode({ region: { Code: 'pascal-nested' } })).toBe(
        'pascal-nested'
      )
      expect(wrapper.vm.companyRowRegionCode({ region: { regionCode: 'snake-nested' } })).toBe(
        'snake-nested'
      )
      expect(wrapper.vm.companyRowRegionCode({ region: { RegionCode: 'pascal-snake-nested' } })).toBe(
        'pascal-snake-nested'
      )
    })

    it('reads each flat key variant when nested is absent', () => {
      expect(wrapper.vm.companyRowRegionCode({ RegionCode: 'flat-pascal' })).toBe('flat-pascal')
      expect(wrapper.vm.companyRowRegionCode({ AzureRegionCode: 'flat-azure-pascal' })).toBe(
        'flat-azure-pascal'
      )
    })
  })

  describe('companyRowRegionPresetLabel', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('returns empty string for empty row', () => {
      expect(wrapper.vm.companyRowRegionPresetLabel({})).toBe('')
    })

    it('reads top-level regionDisplayName first', () => {
      expect(
        wrapper.vm.companyRowRegionPresetLabel({ regionDisplayName: 'Canada Central (Toronto)' })
      ).toBe('Canada Central (Toronto)')
    })

    it('falls back to nested region.displayName', () => {
      expect(
        wrapper.vm.companyRowRegionPresetLabel({ region: { displayName: 'EU West' } })
      ).toBe('EU West')
    })

    it('returns empty string when no display label is present', () => {
      expect(wrapper.vm.companyRowRegionPresetLabel({ regionCode: 'canadacentral' })).toBe('')
    })

    it('reads each flat label variant', () => {
      expect(
        wrapper.vm.companyRowRegionPresetLabel({ RegionDisplayName: 'PascalDisplay' })
      ).toBe('PascalDisplay')
      expect(wrapper.vm.companyRowRegionPresetLabel({ regionName: 'SnakeName' })).toBe('SnakeName')
      expect(wrapper.vm.companyRowRegionPresetLabel({ RegionName: 'PascalName' })).toBe('PascalName')
    })

    it('reads each nested label variant when no flat key is set', () => {
      expect(
        wrapper.vm.companyRowRegionPresetLabel({ region: { DisplayName: 'NestedPascalDisplay' } })
      ).toBe('NestedPascalDisplay')
      expect(wrapper.vm.companyRowRegionPresetLabel({ region: { name: 'nestedName' } })).toBe(
        'nestedName'
      )
      expect(wrapper.vm.companyRowRegionPresetLabel({ region: { Name: 'NestedName' } })).toBe(
        'NestedName'
      )
    })
  })

  describe('companyRowHasDataRegion', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('is true when row has any region code', () => {
      expect(wrapper.vm.companyRowHasDataRegion({ regionCode: 'canadacentral' })).toBe(true)
    })

    it('is false when row has no region code', () => {
      expect(wrapper.vm.companyRowHasDataRegion({})).toBe(false)
    })
  })

  describe('canShowSovereigntyMigrate', () => {
    it('is true for Root viewing a leaf company row', () => {
      const wrapper = createWrapper({ role: 'Root' })
      expect(wrapper.vm.canShowSovereigntyMigrate({ companyResourceId: 'c-1' })).toBe(true)
    })

    it('is true for Reseller viewing a leaf company row', () => {
      const wrapper = createWrapper({ role: 'Reseller' })
      expect(wrapper.vm.canShowSovereigntyMigrate({ companyResourceId: 'c-1' })).toBe(true)
    })

    it('is false for non-Root/non-Reseller user', () => {
      const wrapper = createWrapper({ role: 'CompanyAdmin' })
      expect(wrapper.vm.canShowSovereigntyMigrate({ companyResourceId: 'c-1' })).toBe(false)
    })

    it('is false for cluster parent rows (rows with children)', () => {
      const wrapper = createWrapper({ role: 'Root' })
      const parentRow = { companyResourceId: 'parent', children: [{ companyResourceId: 'child' }] }
      expect(wrapper.vm.canShowSovereigntyMigrate(parentRow)).toBe(false)
    })

    it('is true even when row already has a region (visibility separate from disabled state)', () => {
      const wrapper = createWrapper({ role: 'Root' })
      expect(
        wrapper.vm.canShowSovereigntyMigrate({ companyResourceId: 'c-1', regionCode: 'eu-west' })
      ).toBe(true)
    })
  })

  describe('sovereigntyMigrateTooltip', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = createWrapper({ role: 'Root' })
      await flushPromises()
    })

    it('returns explanatory tooltip when company already has a region', () => {
      const tip = wrapper.vm.sovereigntyMigrateTooltip({ regionCode: 'canadacentral' })
      expect(tip).toContain('already assigned')
      expect(tip).toContain("aren't supported")
    })

    it('returns empty string when company has no region', () => {
      expect(wrapper.vm.sovereigntyMigrateTooltip({})).toBe('')
    })
  })

  describe('open / close / success handlers', () => {
    it('openSovereigntyMigrateModal stores the row and shows the modal', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const row = { companyResourceId: 'c-1', companyName: 'Acme' }
      wrapper.vm.openSovereigntyMigrateModal(row)
      expect(wrapper.vm.showSovereigntyMigrateModal).toBe(true)
      expect(wrapper.vm.sovereigntyMigrateRow).toEqual(row)
    })

    it('openSovereigntyMigrateModal stores a shallow copy of the row', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const row = { companyResourceId: 'c-1' }
      wrapper.vm.openSovereigntyMigrateModal(row)
      expect(wrapper.vm.sovereigntyMigrateRow).not.toBe(row)
      expect(wrapper.vm.sovereigntyMigrateRow).toEqual(row)
    })

    it('closeSovereigntyMigrateModal hides the modal and clears the row', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.openSovereigntyMigrateModal({ companyResourceId: 'c-1' })
      wrapper.vm.closeSovereigntyMigrateModal()
      expect(wrapper.vm.showSovereigntyMigrateModal).toBe(false)
      expect(wrapper.vm.sovereigntyMigrateRow).toEqual({})
    })

    it('onSovereigntyMigrateQueued refreshes table data', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const spy = jest.spyOn(wrapper.vm, 'getTableData').mockImplementation(() => {})
      wrapper.vm.onSovereigntyMigrateQueued()
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('canShowSovereigntyReport', () => {
    it('is true for Root viewing a leaf company row', () => {
      const wrapper = createWrapper({ role: 'Root' })
      expect(wrapper.vm.canShowSovereigntyReport({ companyResourceId: 'c-1' })).toBe(true)
    })

    it('is true for Reseller viewing a leaf company row', () => {
      const wrapper = createWrapper({ role: 'Reseller' })
      expect(wrapper.vm.canShowSovereigntyReport({ companyResourceId: 'c-1' })).toBe(true)
    })

    it('is false for non-Root/non-Reseller user', () => {
      const wrapper = createWrapper({ role: 'CompanyAdmin' })
      expect(wrapper.vm.canShowSovereigntyReport({ companyResourceId: 'c-1' })).toBe(false)
    })

    it('is false for cluster parent rows', () => {
      const wrapper = createWrapper({ role: 'Root' })
      const parentRow = { children: [{ companyResourceId: 'child' }] }
      expect(wrapper.vm.canShowSovereigntyReport(parentRow)).toBe(false)
    })
  })

  describe('sovereignty report drawer handlers', () => {
    it('openSovereigntyReportDrawer stores the row and shows the drawer', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const row = { companyResourceId: 'c-1', companyName: 'Acme' }
      wrapper.vm.openSovereigntyReportDrawer(row)
      expect(wrapper.vm.showSovereigntyReportDrawer).toBe(true)
      expect(wrapper.vm.sovereigntyReportRow).toEqual(row)
    })

    it('openSovereigntyReportDrawer stores a shallow copy of the row', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const row = { companyResourceId: 'c-1' }
      wrapper.vm.openSovereigntyReportDrawer(row)
      expect(wrapper.vm.sovereigntyReportRow).not.toBe(row)
      expect(wrapper.vm.sovereigntyReportRow).toEqual(row)
    })

    it('closeSovereigntyReportDrawer hides the drawer and clears the row', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.openSovereigntyReportDrawer({ companyResourceId: 'c-1' })
      wrapper.vm.closeSovereigntyReportDrawer()
      expect(wrapper.vm.showSovereigntyReportDrawer).toBe(false)
      expect(wrapper.vm.sovereigntyReportRow).toEqual({})
    })
  })
})
