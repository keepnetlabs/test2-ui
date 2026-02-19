import { shallowMount } from '@vue/test-utils'
import InitializeCompanyModal from '@/components/Companies/InitializeCompanyModal.vue'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getCompanyByID, updateInitializeCompany } from '@/api/company'
import { scrollToComponent } from '@/utils/functions'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getMultiple: jest.fn(() =>
      Promise.resolve([
        { genericCodeTypeId: 1, name: 'US', resourceId: 'country-1' },
        { genericCodeTypeId: 2, name: 'IT', resourceId: 'industry-1' },
        { genericCodeTypeId: 21, name: 'English', resourceId: 'lang-1' }
      ])
    )
  }
}))

jest.mock('@/api/company', () => ({
  getCompanyByID: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          logoUrl: 'https://example.com/logo.png',
          name: 'Acme',
          description: 'desc',
          industryResourceId: 'industry-1',
          timeZoneId: 'tz-1',
          countryResourceId: 'country-1',
          preferredLanguageTypeResourceId: 'lang-1',
          address: 'Address',
          websiteUrl: 'https://example.com',
          resourceId: 'company-1',
          file: null
        }
      }
    })
  ),
  updateInitializeCompany: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn()
  }
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InitializeCompanyModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(InitializeCompanyModal, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppModal: true,
        AppModalBodyHeader: true,
        FormGroup: true,
        InputEntityName: true,
        InputDescription: true,
        KSelect: true,
        InputTimezone: true,
        InputAddress: true,
        InputUrl: true,
        KFileUpload: true,
        VForm: true,
        VBtn: true,
        VListItem: true,
        VListItemContent: true
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyRequestId', 'company-1')
  })

  it('calls lookup and company apis on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(LookupLocalStorage.getMultiple).toHaveBeenCalledWith([1, 2, 21])
    expect(getCompanyByID).toHaveBeenCalledWith('company-1', false)
    expect(wrapper.vm.countries).toHaveLength(1)
    expect(wrapper.vm.industries).toHaveLength(1)
    expect(wrapper.vm.languages[0]).toEqual({ name: 'All Languages', resourceId: '' })
  })

  it('returns image preview for array/string/file branches', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.setData({ formData: { ...wrapper.vm.formData, logoUrl: ['a.png'], file: null } })
    expect(wrapper.vm.getImagePreview).toBe('a.png')

    await wrapper.setData({ formData: { ...wrapper.vm.formData, logoUrl: [], file: null } })
    expect(wrapper.vm.getImagePreview).toBe(null)

    await wrapper.setData({ formData: { ...wrapper.vm.formData, logoUrl: 'https://x/logo.png', file: null } })
    expect(wrapper.vm.getImagePreview).toBe('https://x/logo.png')

    if (!URL.createObjectURL) {
      URL.createObjectURL = jest.fn()
    }
    const objectUrlSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:1')
    const file = new Blob(['x'], { type: 'image/png' })
    await wrapper.setData({ formData: { ...wrapper.vm.formData, logoUrl: '', file } })
    expect(wrapper.vm.getImagePreview).toBe('blob:1')
    objectUrlSpy.mockRestore()
  })

  it('handles file changes for array and single file', () => {
    const wrapper = createWrapper()
    wrapper.vm.onFileChanged([])
    expect(wrapper.vm.formData.file).toBe(null)

    wrapper.vm.onFileChanged(['x.png'])
    expect(wrapper.vm.formData.file).toEqual(['x.png'])

    const file = new Blob(['x'])
    wrapper.vm.onFileChanged(file)
    expect(wrapper.vm.formData.file).toBe(file)
  })

  it('submits form and dispatches company name when valid', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    wrapper.vm.formData = {
      ...wrapper.vm.formData,
      name: 'Acme',
      countryResourceId: 'country-1'
    }

    wrapper.vm.submit()
    await flushPromises()

    expect(updateInitializeCompany).toHaveBeenCalled()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('auth/setCompanyName', 'Acme')
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('emits on-close from handleClose method', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()

    expect(wrapper.emitted('on-close')).toEqual([[]])
  })

  it('appends array values and scalar fields to FormData on submit', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    wrapper.vm.formData = {
      ...wrapper.vm.formData,
      name: 'Acme',
      industryResourceId: 'industry-1',
      file: ['logo-a.png', 'logo-b.png']
    }
    const appendSpy = jest.spyOn(FormData.prototype, 'append')

    wrapper.vm.submit()
    await flushPromises()

    expect(appendSpy).toHaveBeenCalledWith('name', 'Acme')
    expect(appendSpy).toHaveBeenCalledWith('industryResourceId', 'industry-1')
    expect(appendSpy).toHaveBeenCalledWith('file', 'logo-a.png')
    expect(appendSpy).toHaveBeenCalledWith('file', 'logo-b.png')

    appendSpy.mockRestore()
  })

  it('scrolls to first error when form is invalid', async () => {
    const wrapper = createWrapper()
    const querySelector = jest.fn(() => '.error--text')
    wrapper.vm.$refs.refForm = {
      validate: jest.fn(() => false),
      $el: { querySelector }
    }

    wrapper.vm.submit()
    await wrapper.vm.$nextTick()

    expect(querySelector).toHaveBeenCalledWith('.error--text')
    expect(scrollToComponent).toHaveBeenCalledWith('.error--text')
  })
})
