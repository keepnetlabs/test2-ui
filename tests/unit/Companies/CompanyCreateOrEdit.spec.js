import { shallowMount } from '@vue/test-utils'
import CompanyCreateOrEdit from '@/components/Companies/CompanyCreateOrEdit.vue'
import CallbackService from '@/api/callback'

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
  getSelectSearchPayload: jest.fn((payload) => payload),
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn((a, b) => JSON.stringify(a) !== JSON.stringify(b)),
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

describe('CompanyCreateOrEdit.vue', () => {
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
        VCheckbox: true,
        VBtn: true
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

  it('normalizes date format variants', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.normalizeDateFormat('d.M.y')).toBe('dd/MM/yyyy')
    expect(wrapper.vm.normalizeDateFormat('dd-MM-yyyy')).toBe('dd/MM/yyyy')
    expect(wrapper.vm.normalizeDateFormat()).toBe('dd/MM/yyyy')
  })

  it('corrects known date format values', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ formData: { ...wrapper.vm.formData, DateFormat: 'mm/dd/yyyy' } })
    wrapper.vm.correctDateFormat()
    expect(wrapper.vm.formData.DateFormat).toBe('MM/dd/yyyy')

    await wrapper.setData({ formData: { ...wrapper.vm.formData, DateFormat: 'yyyy/mm/dd' } })
    wrapper.vm.correctDateFormat()
    expect(wrapper.vm.formData.DateFormat).toBe('yyyy/MM/dd')
  })

  it('computes selected country code and callback selection state', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      countries: [{ resourceId: 'tr', code: 'TR' }],
      formData: {
        ...wrapper.vm.formData,
        CountryResourceId: 'tr',
        LicenseModuleResourceIdArray: ['AYAPp3vt3SvS']
      }
    })

    expect(wrapper.vm.getSelectedCountry).toBe('TR')
    expect(wrapper.vm.isCallbackSelected).toBe(true)
  })

  it('computes date/time formats and preview logo url', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dateFormat: 'YYYY/MM/DD',
      timeFormat: '12h',
      formData: { ...wrapper.vm.formData, logoURL: 'https://cdn/logo.png', File: null }
    })

    expect(wrapper.vm.getDateFormat).toBe('yyyy.MM.dd')
    expect(wrapper.vm.selectionDateFormat).toBe('YYYY.MM.DD')
    expect(wrapper.vm.getTimeFormat).toBe('hh:mm a')
    expect(wrapper.vm.getPreviewLogoUrl).toBe('https://cdn/logo.png')
    expect(wrapper.vm.getImagePreview).toBe('https://cdn/logo.png')
  })

  it('uses file object for image preview branch', async () => {
    const wrapper = createWrapper()
    if (!URL.createObjectURL) {
      URL.createObjectURL = jest.fn()
    }
    const spy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:logo')
    const file = new Blob(['x'], { type: 'image/png' })

    await wrapper.setData({ formData: { ...wrapper.vm.formData, logoURL: '', File: file } })

    expect(wrapper.vm.getImagePreview).toBe('blob:logo')
    spy.mockRestore()
  })

  it('updates module ids by selected license type with availability filter', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      licenceTypes: [
        {
          resourceId: 'lic-1',
          licenseModules: [
            { resourceId: 'm-1', isAvailable: true },
            { resourceId: 'm-2', isAvailable: false },
            { resourceId: 'm-3', isAvailable: true }
          ]
        }
      ]
    })

    wrapper.vm.handleLicenseTypeChange('lic-1')
    expect(wrapper.vm.formData.LicenseModuleResourceIdArray).toEqual(['m-1', 'm-3'])
  })

  it('groups company groups by owner flag in setCompanyGroups', () => {
    const wrapper = createWrapper()

    wrapper.vm.setCompanyGroups({
      data: {
        data: {
          results: [
            { resourceId: 'g-1', isOwner: false },
            { resourceId: 'g-2', isOwner: true }
          ]
        }
      }
    })

    expect(wrapper.vm.companyGroupList[0]).toEqual({ header: 'Groups That Company Belongs To' })
    expect(wrapper.vm.companyGroupList[2]).toEqual({ header: 'Groups That Created By The Company' })
  })

  it('loads available callback numbers for over-limit and empty cases', async () => {
    const wrapper = createWrapper({ edit: true, selectedExtend: { resourceId: 'c-9' } })

    CallbackService.getAvailableCallbackNumbers.mockResolvedValueOnce({
      data: { data: new Array(20).fill({}) }
    })
    wrapper.vm.getAvailableCallbackNumbers()
    await flushPromises()
    expect(wrapper.vm.callbackNumberItems).toHaveLength(12)

    CallbackService.getAvailableCallbackNumbers.mockResolvedValueOnce({
      data: { data: [] }
    })
    wrapper.vm.getAvailableCallbackNumbers()
    await flushPromises()
    expect(wrapper.vm.callbackNumberItems).toEqual([])
  })

  it('handles next/prev step boundaries', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ activeStep: 1, totalStep: 4 })
    wrapper.vm.$refs.refStep1Form = { validate: jest.fn(() => true) }

    wrapper.vm.nextStep()
    expect(wrapper.vm.activeStep).toBe(2)

    wrapper.vm.prevStep()
    expect(wrapper.vm.activeStep).toBe(1)
  })

  it('cancels form with leaving dialog when form changed', () => {
    const wrapper = createWrapper()
    wrapper.vm.isFormDataChanged = jest.fn(() => true)

    wrapper.vm.handleCancel()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
  })

  it('emits cancelForm when no changes', async () => {
    const wrapper = createWrapper()
    wrapper.vm.isFormDataChanged = jest.fn(() => false)

    wrapper.vm.handleCancel()
    expect(wrapper.emitted('cancelForm')).toBeTruthy()
  })

  it('handles file change by clearing logoURL and setting file', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ formData: { ...wrapper.vm.formData, logoURL: 'x' } })

    wrapper.vm.onFileChanged(['a.png'])

    expect(wrapper.vm.formData.logoURL).toBe('')
    expect(wrapper.vm.formData.File).toEqual(['a.png'])
  })

  it('closes warning modal and configure dialog helpers', async () => {
    const wrapper = createWrapper()
    wrapper.vm.cancelForm = jest.fn()
    await wrapper.setData({ isWarningModalVisible: true, isShowConfigureNewCompany: true })

    wrapper.vm.handleCloseWarningModal()
    expect(wrapper.vm.isWarningModalVisible).toBe(false)

    wrapper.vm.closeConfigureNewCompanyDialog()
    expect(wrapper.vm.isShowConfigureNewCompany).toBe(false)
    expect(wrapper.vm.cancelForm).toHaveBeenCalled()
  })
})
