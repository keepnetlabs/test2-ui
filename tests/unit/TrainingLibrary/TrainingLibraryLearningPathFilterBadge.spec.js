import { createLocalVue, shallowMount } from '@vue/test-utils'
import TrainingLibraryLearningPathFilterBadge from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryLearningPathFilterBadge.vue'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('TrainingLibraryLearningPathFilterBadge.vue', () => {
  const localVue = createLocalVue()

  const buildWrapper = (filterOverrides = {}, getterOverrides = {}) => {
    const dispatch = jest.fn()
    const wrapper = shallowMount(TrainingLibraryLearningPathFilterBadge, {
      localVue,
      propsData: {
        filter: {
          filterType: 'select',
          key: PROPERTY_STORE.LANGUAGES,
          text: 'Language',
          activeOperator: 'Include',
          activeValue: 'en',
          value: 'en',
          isFilterActive: true,
          ...filterOverrides
        }
      },
      mocks: {
        $store: {
          getters: {
            'trainingLibraryHelpers/getLanguages': [{ code: 'en', isoFriendlyName: 'English' }],
            'trainingLibraryHelpers/getCompliances': [{ value: 'iso', text: 'ISO 27001' }],
            'trainingLibraryHelpers/getCategories': [{ value: 'cat1', text: 'Awareness' }],
            'trainingLibraryHelpers/getBehaviours': [{ value: 'beh1', text: 'Safe Click' }],
            'trainingLibraryHelpers/getLearningPathTrainingTypes': [{ value: 'type1', text: 'Course' }],
            'trainingLibraryHelpers/getTargetAudiences': [{ value: 'aud1', text: 'Admins' }],
            'trainingLibraryHelpers/getTrainingVendors': [{ value: 'ven1', text: 'Vendor A' }],
            ...getterOverrides
          },
          dispatch
        }
      },
      stubs: {
        Fragment: { template: '<div><slot /></div>' },
        VTooltip: { template: '<div><slot /><slot name="activator" :on="{}" /></div>' },
        VIcon: true
      }
    })

    return { wrapper, dispatch }
  }

  it('renders with expected component name', () => {
    const { wrapper } = buildWrapper()
    expect(wrapper.vm.$options.name).toBe('TrainingLibraryLearningPathFilterBadge')
    expect(wrapper.vm.isRenderComponent).toBeTruthy()
  })

  it('maps operator labels and keeps unknown operator as-is', () => {
    const { wrapper } = buildWrapper()
    expect(wrapper.vm.getOperatorLabel('Include')).toBe('Equal')
    expect(wrapper.vm.getOperatorLabel('custom-op')).toBe('custom-op')
  })

  it('resolves filter values from lookup getters', () => {
    const { wrapper } = buildWrapper()

    expect(wrapper.vm.getFilterValue({ key: PROPERTY_STORE.LANGUAGES }, 'en')).toBe('English')
    expect(wrapper.vm.getFilterValue({ key: PROPERTY_STORE.COMPLIANCE }, 'iso')).toBe('ISO 27001')
    expect(wrapper.vm.getFilterValue({ key: PROPERTY_STORE.CATEGORY }, 'cat1')).toBe('Awareness')
    expect(wrapper.vm.getFilterValue({ key: PROPERTY_STORE.BEHAVIOURS }, 'beh1')).toBe('Safe Click')
    expect(wrapper.vm.getFilterValue({ key: PROPERTY_STORE.TYPE }, 'type1')).toBe('Course')
    expect(wrapper.vm.getFilterValue({ key: PROPERTY_STORE.TARGET_AUDIENCE }, 'aud1')).toBe('Admins')
    expect(wrapper.vm.getFilterValue({ key: PROPERTY_STORE.VENDOR }, 'ven1')).toBe('Vendor A')
    expect(wrapper.vm.getFilterValue({ key: 'unknown' }, 'raw')).toBe('raw')
  })

  it('clears select filter and dispatches removeFilterFromPayload', () => {
    const { wrapper, dispatch } = buildWrapper()

    wrapper.vm.removeSelectFilter()

    expect(wrapper.vm.filter.activeValue).toBe('')
    expect(wrapper.vm.filter.value).toBe('')
    expect(wrapper.vm.filter.isFilterActive).toBe(false)
    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/removeFilterFromPayload', wrapper.vm.filter)
  })

  it('removes search value and keeps filter active when values remain', () => {
    const { wrapper, dispatch } = buildWrapper({
      filterType: 'search',
      key: PROPERTY_STORE.CATEGORY,
      activeValue: ['cat1', 'cat2'],
      value: ['cat1', 'cat2']
    })

    wrapper.vm.removeSearchFilter('cat1', 0)

    expect(wrapper.vm.filter.activeValue).toEqual(['cat2'])
    expect(wrapper.vm.filter.value).toEqual(['cat2'])
    expect(wrapper.vm.filter.isFilterActive).toBe(true)
    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/removeFilterFromPayload', wrapper.vm.filter)
  })

  it('removes last search value and deactivates filter', () => {
    const { wrapper } = buildWrapper({
      filterType: 'search',
      activeValue: ['only'],
      value: ['only']
    })

    wrapper.vm.removeSearchFilter('only', 0)

    expect(wrapper.vm.filter.activeValue).toEqual([])
    expect(wrapper.vm.filter.isFilterActive).toBe(false)
  })

  it('formats date filter values for between and single operators', () => {
    const { wrapper } = buildWrapper()

    expect(
      wrapper.vm.getDateFilterValue({ activeOperator: 'between', activeValue: ['2024-01-01', '2024-01-31'] })
    ).toBe('2024-01-01 - 2024-01-31')
    expect(wrapper.vm.getDateFilterValue({ activeOperator: '=', activeValue: '2024-02-01' })).toBe('2024-02-01')
  })

  it('applies tooltip and truncation thresholds correctly', () => {
    const { wrapper } = buildWrapper()
    const longValue = 'X'.repeat(40)

    expect(wrapper.vm.shouldRenderTooltip('Language', 'EN')).toBe(false)
    expect(wrapper.vm.shouldRenderTooltip('Language', longValue)).toBe(true)
    expect(wrapper.vm.getTruncatedFilterValue('Language', longValue)).toBe(`${longValue.substring(0, 30)}...`)
    expect(wrapper.vm.getTruncatedFilterValue('Language', 'Short')).toBe('Short')
  })

  it('computes filter-type flags correctly for date filter', () => {
    const { wrapper } = buildWrapper({ filterType: 'date', activeValue: '2024-02-01' })

    expect(wrapper.vm.isFilterTypeSelect).toBe(false)
    expect(wrapper.vm.isFilterTypeSearch).toBe(false)
    expect(wrapper.vm.isFilterTypeDateSelect).toBe('2024-02-01')
    expect(wrapper.vm.isRenderComponent).toBeTruthy()
  })
})
