import { shallowMount } from '@vue/test-utils'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit.vue'
import { getRegions } from '@/api/regions'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getAvailableCallbackNumbers: jest.fn(() => Promise.resolve({ data: { data: [] } }))
  }
}))

jest.mock('@/api/company', () => ({
  createCompany: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'c-1' } } })),
  updateCompany: jest.fn(() => Promise.resolve()),
  expiryDateLimited: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  searchCompanies: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  searchCompanyGroupsWithParents: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [], totalNumberOfPages: 1 } } })
  )
}))

jest.mock('@/api/common', () => ({
  getLicences: jest.fn(() =>
    Promise.resolve({ data: { data: { licenses: [], allLicenseModules: [] } } })
  ),
  getCountryTimezones: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/api/regions', () => ({
  getRegions: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            resourceId: 'r-1',
            code: 'canadacentral',
            displayName: 'Canada Central (Toronto)',
            sortOrder: 10
          }
        ]
      }
    })
  )
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getMultiple: jest.fn(() => Promise.resolve([]))
  }
}))

jest.mock('@/utils/functions', () => ({
  getSelectSearchPayload: jest.fn((payload) => payload),
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  getDefaultAxiosPayload: jest.fn((props = {}) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [{}] }, { FilterItems: [] }] },
    ...props
  }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanyCreateOrEdit.vue (data residency)', () => {
  const TestComponent = {
    ...CompanyCreateOrEdit,
    mounted() {},
    directives: {
      'infinite-scroll': { bind() {} },
      'select-search-handler': { bind() {} }
    }
  }

  const createWrapper = ({ role = 'Root', ...propsData } = {}) =>
    shallowMount(TestComponent, {
      propsData: {
        edit: false,
        selectedRow: {},
        selectedExtend: {},
        ...propsData
      },
      stubs: {
        ConfigureNewCompanyDialog: true,
        CallbackNumberWarningModal: true,
        ConfigureCompanyStepHeader: true,
        InputEntityName: true,
        InputDescription: true,
        KSelect: true,
        InputTimezone: true,
        InputAddress: true,
        InputUrl: true,
        KFileUpload: true,
        InputTag: true,
        InputDate: true,
        StepperFooter: true,
        FormGroup: true,
        AlertBox: true,
        VCard: true,
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VIcon: true,
        VCol: true,
        VStepper: true,
        VStepperHeader: true,
        VStepperStep: true,
        VDivider: true,
        VStepperItems: true,
        VStepperContent: true,
        VForm: true,
        VSwitch: true,
        VTextField: true,
        VSelect: true,
        VCheckbox: true,
        VBtn: true
      },
      mocks: {
        $store: {
          getters: {
            'common/getTimezones': { timeZoneList: [] },
            'auth/isRootOrReseller': role === 'Root' || role === 'Reseller'
          },
          dispatch: jest.fn()
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('isRootOrReseller', () => {
    it('is true for Root', () => {
      const wrapper = createWrapper({ role: 'Root' })
      expect(wrapper.vm.isRootOrReseller).toBe(true)
    })

    it('is true for Reseller', () => {
      const wrapper = createWrapper({ role: 'Reseller' })
      expect(wrapper.vm.isRootOrReseller).toBe(true)
    })

    it('is false for any other role', () => {
      const wrapper = createWrapper({ role: 'CompanyAdmin' })
      expect(wrapper.vm.isRootOrReseller).toBe(false)
    })
  })

  describe('fetchSovereigntyRegions', () => {
    it('fetches regions for Root user', async () => {
      const wrapper = createWrapper({ role: 'Root' })
      wrapper.vm.fetchSovereigntyRegions()
      await flushPromises()
      expect(getRegions).toHaveBeenCalledWith({ loading: false })
      expect(wrapper.vm.sovereigntyRegionsList).toHaveLength(1)
    })

    it('fetches regions for Reseller user', async () => {
      const wrapper = createWrapper({ role: 'Reseller' })
      wrapper.vm.fetchSovereigntyRegions()
      await flushPromises()
      expect(getRegions).toHaveBeenCalledWith({ loading: false })
    })

    it('skips fetch entirely for non-Root/non-Reseller user', async () => {
      const wrapper = createWrapper({ role: 'CompanyAdmin' })
      wrapper.vm.fetchSovereigntyRegions()
      await flushPromises()
      expect(getRegions).not.toHaveBeenCalled()
    })

    it('treats fetch failure as empty list', async () => {
      getRegions.mockRejectedValueOnce(new Error('boom'))
      const wrapper = createWrapper({ role: 'Root' })
      wrapper.vm.fetchSovereigntyRegions()
      await flushPromises()
      expect(wrapper.vm.sovereigntyRegionsList).toEqual([])
    })

    it('handles non-array data shape defensively', async () => {
      getRegions.mockResolvedValueOnce({ data: { data: null } })
      const wrapper = createWrapper({ role: 'Root' })
      wrapper.vm.fetchSovereigntyRegions()
      await flushPromises()
      expect(wrapper.vm.sovereigntyRegionsList).toEqual([])
    })
  })

  describe('dataResidencyRegionItems', () => {
    it('always starts with the "Central (no region)" option', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.dataResidencyRegionItems[0]).toEqual({
        displayName: 'Central (no region)',
        value: ''
      })
    })

    it('appends API regions in the order they were fetched', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        sovereigntyRegionsList: [
          { code: 'canadacentral', displayName: 'Canada Central (Toronto)' },
          { code: 'eu-west', displayName: 'EU West' }
        ]
      })
      expect(wrapper.vm.dataResidencyRegionItems).toEqual([
        { displayName: 'Central (no region)', value: '' },
        { displayName: 'Canada Central (Toronto)', value: 'canadacentral' },
        { displayName: 'EU West', value: 'eu-west' }
      ])
    })

    it('falls back to code when API region has no displayName', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ sovereigntyRegionsList: [{ code: 'westus' }] })
      expect(wrapper.vm.dataResidencyRegionItems[1]).toEqual({
        displayName: 'westus',
        value: 'westus'
      })
    })
  })

  describe('pickCompanyRegionCodeFromExtend', () => {
    let wrapper
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('returns empty string for falsy input', () => {
      expect(wrapper.vm.pickCompanyRegionCodeFromExtend(null)).toBe('')
      expect(wrapper.vm.pickCompanyRegionCodeFromExtend(undefined)).toBe('')
    })

    it('reads nested camelCase region.code', () => {
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ region: { code: 'canadacentral' } })
      ).toBe('canadacentral')
    })

    it('reads nested PascalCase Region.RegionCode', () => {
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ Region: { RegionCode: 'eu-west' } })
      ).toBe('eu-west')
    })

    it('reads top-level regionCode when no nested object', () => {
      expect(wrapper.vm.pickCompanyRegionCodeFromExtend({ regionCode: 'us-east' })).toBe('us-east')
    })

    it('trims whitespace', () => {
      expect(wrapper.vm.pickCompanyRegionCodeFromExtend({ regionCode: '  westus  ' })).toBe(
        'westus'
      )
    })

    it('skips empty / whitespace-only values', () => {
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ regionCode: '', azureRegionCode: 'eastus' })
      ).toBe('eastus')
    })

    it('reads each nested key variant after region.code', () => {
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ region: { Code: 'pascal-nested' } })
      ).toBe('pascal-nested')
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ region: { regionCode: 'snake-nested' } })
      ).toBe('snake-nested')
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ region: { azureRegionCode: 'azure-nested' } })
      ).toBe('azure-nested')
    })

    it('reads each flat key variant when nested is absent', () => {
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ regionResourceCode: 'flat-resource' })
      ).toBe('flat-resource')
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ RegionResourceCode: 'flat-resource-pascal' })
      ).toBe('flat-resource-pascal')
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ AzureRegionCode: 'flat-azure-pascal' })
      ).toBe('flat-azure-pascal')
      expect(
        wrapper.vm.pickCompanyRegionCodeFromExtend({ dataResidencyRegionCode: 'flat-residency' })
      ).toBe('flat-residency')
    })
  })

  describe('pickPresetRegionDisplayFromExtend', () => {
    let wrapper
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('returns empty string for falsy input', () => {
      expect(wrapper.vm.pickPresetRegionDisplayFromExtend(null)).toBe('')
    })

    it('reads regionDisplayName first', () => {
      expect(
        wrapper.vm.pickPresetRegionDisplayFromExtend({
          regionDisplayName: 'Canada Central (Toronto)'
        })
      ).toBe('Canada Central (Toronto)')
    })

    it('falls back to nested region.displayName', () => {
      expect(
        wrapper.vm.pickPresetRegionDisplayFromExtend({ region: { displayName: 'EU West' } })
      ).toBe('EU West')
    })

    it('returns empty string when nothing matches', () => {
      expect(wrapper.vm.pickPresetRegionDisplayFromExtend({ regionCode: 'eu-west' })).toBe('')
    })

    it('reads each flat label variant', () => {
      expect(
        wrapper.vm.pickPresetRegionDisplayFromExtend({ RegionDisplayName: 'FlatPascal' })
      ).toBe('FlatPascal')
      expect(wrapper.vm.pickPresetRegionDisplayFromExtend({ regionName: 'flatName' })).toBe(
        'flatName'
      )
      expect(wrapper.vm.pickPresetRegionDisplayFromExtend({ RegionName: 'FlatName' })).toBe(
        'FlatName'
      )
    })

    it('reads each nested label variant after displayName', () => {
      expect(
        wrapper.vm.pickPresetRegionDisplayFromExtend({ region: { DisplayName: 'NestedPascal' } })
      ).toBe('NestedPascal')
      expect(wrapper.vm.pickPresetRegionDisplayFromExtend({ region: { name: 'nestedName' } })).toBe(
        'nestedName'
      )
      expect(wrapper.vm.pickPresetRegionDisplayFromExtend({ region: { Name: 'NestedName' } })).toBe(
        'NestedName'
      )
      expect(
        wrapper.vm.pickPresetRegionDisplayFromExtend({ region: { regionName: 'nestedRegionName' } })
      ).toBe('nestedRegionName')
    })
  })

  describe('editDataResidencyDisplayLabel', () => {
    it('returns empty string when not in edit mode', () => {
      const wrapper = createWrapper({ edit: false })
      expect(wrapper.vm.editDataResidencyDisplayLabel).toBe('')
    })

    it('returns "Central (no region)" when edit company has no region', () => {
      const wrapper = createWrapper({ edit: true, selectedExtend: { regionCode: '' } })
      expect(wrapper.vm.editDataResidencyDisplayLabel).toBe('Central (no region)')
    })

    it('uses preset display label when present', () => {
      const wrapper = createWrapper({
        edit: true,
        selectedExtend: { regionCode: 'canadacentral', regionDisplayName: 'Preset Display' }
      })
      expect(wrapper.vm.editDataResidencyDisplayLabel).toBe('Preset Display')
    })

    it('looks up displayName from cached regions when no preset', async () => {
      const wrapper = createWrapper({
        edit: true,
        selectedExtend: { regionCode: 'canadacentral' }
      })
      await wrapper.setData({
        sovereigntyRegionsList: [
          { code: 'canadacentral', displayName: 'Canada Central (Toronto)' }
        ]
      })
      expect(wrapper.vm.editDataResidencyDisplayLabel).toBe('Canada Central (Toronto)')
    })

    it('falls back to raw code when code is set but not found in cache', () => {
      const wrapper = createWrapper({
        edit: true,
        selectedExtend: { regionCode: 'unknown-region' }
      })
      expect(wrapper.vm.editDataResidencyDisplayLabel).toBe('unknown-region')
    })
  })

  describe('editCompanyRegionCode', () => {
    it('returns empty string when not in edit mode', () => {
      const wrapper = createWrapper({ edit: false, selectedExtend: { regionCode: 'eu-west' } })
      expect(wrapper.vm.editCompanyRegionCode).toBe('')
    })

    it('returns the picked code in edit mode', () => {
      const wrapper = createWrapper({ edit: true, selectedExtend: { regionCode: 'eu-west' } })
      expect(wrapper.vm.editCompanyRegionCode).toBe('eu-west')
    })
  })
})
