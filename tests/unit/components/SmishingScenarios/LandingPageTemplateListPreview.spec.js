import { shallowMount } from '@vue/test-utils'
import LandingPageTemplateListPreview from '@/components/SmishingScenarios/LandingPageTemplateListPreview.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  searchLandingPageTemplates: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfPages: 2,
          results: [
            {
              id: 1,
              resourceId: 'lp-1',
              name: 'Landing One',
              languageTypeName: 'English',
              tags: [],
              difficulty: 'Easy',
              createdBy: 'Admin'
            }
          ]
        }
      }
    })
  ),
  getLandingPageTemplate: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Landing One',
          urlTemplate: 'https://test.local/{url}',
          landingPages: [{ name: 'Page 1', content: '<p>test</p>' }]
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingScenarios LandingPageTemplateListPreview.vue', () => {
  const createWrapper = (propsData = {}, storeOverrides = {}) =>
    shallowMount(LandingPageTemplateListPreview, {
      propsData: {
        scenarioDetailsLookup: {
          difficultyTypes: [{ text: 'Easy', value: 'Easy' }]
        },
        landingPageTemplateResourceId: 'lp-1',
        languageOptions: [{ languageTypeName: 'English', text: 'EN' }],
        method: 'Click-Only',
        isMethodMfa: false,
        mfaData: { mfaTextTemplate: '' },
        textTemplateMethod: 'Click-Only',
        ...propsData
      },
      mocks: {
        $store: {
          dispatch: jest.fn(),
          ...storeOverrides
        }
      },
      stubs: {
        AppDialog: true,
        KEmailPreview: true,
        ShowMoreTags: true,
        KSelect: true,
        ConfigureCompanyStepHeader: true,
        InputCallerPhoneNumber: true,
        FormGroup: true,
        EmailTemplateListLeftSideLanguages: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('mounted fetches templates and selects initial template', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(SmishingService.searchLandingPageTemplates).toHaveBeenCalled()
    expect(SmishingService.getLandingPageTemplate).toHaveBeenCalledWith('lp-1')
    expect(wrapper.vm.listData.length).toBe(1)
    expect(wrapper.vm.listData[0].selected).toBe(true)
  })

  it('getItemDescription handles empty and invalid string values', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getItemDescription({})).toBe('\xa0')
    expect(wrapper.vm.getItemDescription({ description: 'null' })).toBe('\xa0')
    expect(wrapper.vm.getItemDescription({ description: 'undefined' })).toBe('\xa0')
    expect(wrapper.vm.getItemDescription({ description: 'ok' })).toBe('ok')
  })

  it('checkAndAddResourceIdToPayload appends ResourceId when initial and prop exists', () => {
    const wrapper = createWrapper({ landingPageTemplateResourceId: 'lp-22' })
    const payload = {
      filter: {
        FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
      }
    }

    wrapper.vm.checkAndAddResourceIdToPayload(true, payload)
    expect(payload.filter.FilterGroups[1].FilterItems[0]).toEqual(
      expect.objectContaining({ FieldName: 'ResourceId', value: 'lp-22' })
    )
  })

  it('getDataAfterValidScroll increments page and loads more data only when valid', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTemplates = jest.fn()
    wrapper.vm.totalNumberOfPages = 3
    wrapper.vm.bodyData.pageNumber = 1
    wrapper.vm.search = null

    wrapper.vm.getDataAfterValidScroll()
    expect(wrapper.vm.bodyData.pageNumber).toBe(2)
    expect(wrapper.vm.getTemplates).toHaveBeenCalled()

    wrapper.vm.search = 'abc'
    wrapper.vm.getDataAfterValidScroll()
    expect(wrapper.vm.bodyData.pageNumber).toBe(2)
  })

  it('watch search calls callForSearch when value changes and restores defaults when cleared', async () => {
    const wrapper = createWrapper()
    wrapper.vm.callForSearch = jest.fn()
    wrapper.vm.getTemplates = jest.fn()
    wrapper.vm.defaultListData = [{ resourceId: 'lp-1' }]
    wrapper.vm.bodyData.filter.FilterGroups[0].FilterItems[0].value = ''
    wrapper.vm.bodyData.filter.FilterGroups[0].FilterItems[1].value = ''

    await wrapper.setData({ search: 'term' })
    expect(wrapper.vm.callForSearch).toHaveBeenCalled()

    await wrapper.setData({ search: '' })
    expect(wrapper.vm.listData[0].selected).toBe(true)
  })

  it('validateMfaForm handles MFA branches', () => {
    const wrapper = createWrapper({ isMethodMfa: false })
    expect(wrapper.vm.validateMfaForm()).toBe(true)

    const wrapperMfa = createWrapper({ isMethodMfa: true, mfaData: { mfaTextTemplate: 'Code {MFA_CODE}' } })
    wrapperMfa.vm.$refs = { refMfaForm: { validate: jest.fn(() => true) } }
    expect(wrapperMfa.vm.validateMfaForm()).toBe(true)

    const wrapperInvalid = createWrapper({ isMethodMfa: true, mfaData: { mfaTextTemplate: 'Code {mfa_code}' } })
    wrapperInvalid.vm.$refs = { refMfaForm: { validate: jest.fn(() => true) } }
    expect(wrapperInvalid.vm.validateMfaForm()).toBe(false)
    expect(wrapperInvalid.vm.$store.dispatch).toHaveBeenCalled()
  })

  it('callForSearch with no results clears listData', async () => {
    SmishingService.searchLandingPageTemplates.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })

    const ctx = {
      debounce: (fn) => fn(),
      search: 'x',
      landingPageTemplateResourceId: 'lp-1',
      languageOptions: [],
      bodyData: {
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            {
              FilterItems: [
                { value: '' },
                { value: '' },
                { value: '' },
                { value: '' },
                { value: '' },
                { value: '' }
              ]
            }
          ]
        }
      },
      listData: [{ resourceId: 'old' }],
      loadingTemplates: true,
      showLoader: true,
      checkAndAddResourceIdToPayload: jest.fn(),
      $emit: jest.fn()
    }

    LandingPageTemplateListPreview.methods.callForSearch.call(ctx)
    await flushPromises()

    expect(ctx.listData).toEqual([])
    expect(ctx.$emit).toHaveBeenCalledWith('loading', false)
  })
})
