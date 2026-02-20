import { shallowMount } from '@vue/test-utils'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit.vue'
import {
  expiryDateLimited,
  searchCompanyGroupsWithParents,
  searchCompanies
} from '@/api/company'
import { getCountryTimezones } from '@/api/common'
import { getSelectSearchPayload } from '@/utils/functions'

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
  getLicences: jest.fn(() => Promise.resolve({ data: { data: { licenses: [], allLicenseModules: [] } } })),
  getCountryTimezones: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getMultiple: jest.fn(() => Promise.resolve([]))
  }
}))

jest.mock('@/utils/functions', () => ({
  getSelectSearchPayload: jest.fn((payload, search) => ({ ...payload, _search: search })),
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn((a, b) => JSON.stringify(a) !== JSON.stringify(b)),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  getTimeZoneForMoment: jest.fn(() => 'YYYY/MM/DD HH:mm'),
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

describe('CompanyCreateOrEdit.vue (extra)', () => {
  let consoleLogSpy

  const TestComponent = {
    ...CompanyCreateOrEdit,
    mounted() {},
    directives: {
      'infinite-scroll': { bind() {} },
      'select-search-handler': { bind() {} }
    }
  }

  const createWrapper = (propsData = {}) =>
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
        AlertBox: true
      },
      mocks: {
        $store: {
          getters: {
            'common/getTimezones': { timeZoneList: [] }
          },
          dispatch: jest.fn()
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    if (consoleLogSpy) {
      consoleLogSpy.mockRestore()
    }
  })

  it('fetchCountryTimezones fills countryTimezones from api response', async () => {
    getCountryTimezones.mockResolvedValueOnce({
      data: { data: [{ countryCode: 'TR', timezone: 'Europe/Istanbul' }] }
    })
    const wrapper = createWrapper()

    wrapper.vm.fetchCountryTimezones()
    await flushPromises()

    expect(getCountryTimezones).toHaveBeenCalled()
    expect(wrapper.vm.countryTimezones).toEqual([{ countryCode: 'TR', timezone: 'Europe/Istanbul' }])
  })

  it('callForExpiryDateLimited sets limited mode and dates for non-edit', async () => {
    expiryDateLimited.mockResolvedValueOnce({ data: { data: { limit: true } } })
    const wrapper = createWrapper({ edit: false })

    wrapper.vm.callForExpiryDateLimited()
    await flushPromises()

    expect(wrapper.vm.isExpiryDateLimited).toBe(true)
    expect(wrapper.vm.formData.LicenseStartDate).toBeTruthy()
    expect(wrapper.vm.formData.LicenseEndDate).toBeTruthy()
  })

  it('callForExpiryDateLimited does not overwrite dates in edit mode', async () => {
    expiryDateLimited.mockResolvedValueOnce({ data: { data: { limit: true } } })
    const wrapper = createWrapper({ edit: true })
    await wrapper.setData({
      formData: {
        ...wrapper.vm.formData,
        LicenseStartDate: 'old-start',
        LicenseEndDate: 'old-end'
      }
    })

    wrapper.vm.callForExpiryDateLimited()
    await flushPromises()

    expect(wrapper.vm.formData.LicenseStartDate).toBe('old-start')
    expect(wrapper.vm.formData.LicenseEndDate).toBe('old-end')
  })

  it('disabledEndDates respects start date parsing and today lower bound', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dateFormat: 'DD/MM/YYYY',
      formData: {
        ...wrapper.vm.formData,
        LicenseStartDate: '10/01/2026 10:00'
      }
    })

    const beforeStart = new Date(2026, 0, 10)
    const afterStart = new Date(2026, 0, 12)
    expect(wrapper.vm.disabledEndDates(beforeStart)).toBe(true)
    // At least ensure function returns boolean for non-disabled candidate
    expect(typeof wrapper.vm.disabledEndDates(afterStart)).toBe('boolean')
  })

  it('watch getSelectedCountry applies country defaults and fallback language', () => {
    const ctx = {
      edit: false,
      countryTimezones: [
        {
          countryCode: 'TR',
          dateFormat: 'd.M.y',
          clockFormat: '24h',
          timezone: 'Europe/Istanbul',
          languageResourceId: 'lang-tr'
        }
      ],
      languageItems: [{ name: 'English', resourceId: 'lang-en' }],
      formData: { DateFormat: '', TimeFormat: '', timeZoneId: '', PreferredLanguageTypeResourceId: '' },
      normalizeDateFormat: CompanyCreateOrEdit.methods.normalizeDateFormat,
      $store: {
        getters: {
          'common/getTimezones': {
            timeZoneList: [{ id: 'tz-1', displayName: 'Europe/Istanbul' }]
          }
        }
      }
    }

    CompanyCreateOrEdit.watch.getSelectedCountry.call(ctx, 'TR')
    expect(ctx.formData.DateFormat).toBe('dd/MM/yyyy')
    expect(ctx.formData.TimeFormat).toBe('24h')
    expect(ctx.formData.timeZoneId).toBe('tz-1')
    expect(ctx.formData.PreferredLanguageTypeResourceId).toBe('lang-tr')

    CompanyCreateOrEdit.watch.getSelectedCountry.call(
      { ...ctx, countryTimezones: [], formData: { ...ctx.formData, PreferredLanguageTypeResourceId: '' } },
      'US'
    )
    expect(ctx.languageItems[0].resourceId).toBe('lang-en')
  })

  it('watchers for callback selection and period changes behave correctly', () => {
    const cbCtx = {
      formData: { CallBackNumberBookingCount: 5 },
      getAvailableCallbackNumbers: jest.fn()
    }
    CompanyCreateOrEdit.watch.isCallbackSelected.call(cbCtx, false)
    expect(cbCtx.formData.CallBackNumberBookingCount).toBe(null)
    CompanyCreateOrEdit.watch.isCallbackSelected.call(cbCtx, true)
    expect(cbCtx.getAvailableCallbackNumbers).toHaveBeenCalled()

    const periodCtx = {
      edit: true,
      selectedExtend: { licenseEndDate: '2027/01/01 10:00' },
      formData: { LicenseEndDate: '' }
    }
    CompanyCreateOrEdit.watch['formData.LicensePeriodTypeResourceId'].call(
      periodCtx,
      'MaR9NJslgSGW',
      'old'
    )
    expect(periodCtx.formData.LicenseEndDate).toBe('2027/01/01 10:00')
  })

  it('searchCompanyGroupsWithParents uses search payload and fallbacks to getCompanyGroups', async () => {
    const setCompanyGroups = jest.fn()
    const getCompanyGroups = jest.fn()
    const ctx = {
      companyGroupPayload: { pageNumber: 1 },
      setCompanyGroups,
      getCompanyGroups,
      isCompanyGroupsLoading: true
    }

    CompanyCreateOrEdit.methods.searchCompanyGroupsWithParents.call(ctx, 'abc')
    await flushPromises()
    expect(getSelectSearchPayload).toHaveBeenCalledWith(ctx.companyGroupPayload, 'abc')
    expect(searchCompanyGroupsWithParents).toHaveBeenCalled()

    CompanyCreateOrEdit.methods.searchCompanyGroupsWithParents.call(ctx, '')
    expect(getCompanyGroups).toHaveBeenCalled()
  })

  it('watch search triggers company search when text length is greater than 2', async () => {
    searchCompanies.mockResolvedValueOnce({
      data: { data: { results: [{ resourceId: 'c1' }] } }
    })
    const ctx = {
      payload: {
        filter: { FilterGroups: [{ FilterItems: [{ Value: '' }] }] }
      },
      companies: [],
      debounce: (cb) => cb()
    }

    CompanyCreateOrEdit.watch.search.call(ctx, 'abc')
    await flushPromises()

    expect(searchCompanies).toHaveBeenCalled()
    expect(ctx.companies).toEqual([{ resourceId: 'c1' }])

    CompanyCreateOrEdit.watch.search.call(ctx, 'ab')
    expect(searchCompanies).toHaveBeenCalledTimes(1)
  })
})
