import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerFilterBadge from '@/components/GamificationReport/GamificationReportUserDetailsDrawerFilterBadge.vue'

describe('GamificationReportUserDetailsDrawerFilterBadge.vue (extra coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) =>
    shallowMount(GamificationReportUserDetailsDrawerFilterBadge, {
      localVue,
      propsData: {
        filter: {
          filterType: 'select',
          key: 'status',
          text: 'Status',
          activeValue: 'active'
        },
        activityTypeFilterItems: [],
        productFilterItems: [],
        difficulityFilterItems: [],
        ...propsData
      },
      stubs: {
        Fragment: { template: '<div><slot /></div>' },
        VIcon: true,
        VTooltip: true
      },
      ...options
    })

  it('PROPERTY_STORE computed is exposed', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.PROPERTY_STORE).toBeDefined()
  })

  it('removeSelectFilter emits activeValue payload at index 0', () => {
    const wrapper = mountComponent({
      filter: {
        filterType: 'select',
        key: 'status',
        text: 'Status',
        activeValue: 'pending'
      }
    })

    wrapper.vm.removeSelectFilter()

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')[0][0]).toEqual({
      filter: 'pending',
      index: 0
    })
  })

  it('getFilterValue routes to related map function by key', () => {
    const wrapper = mountComponent({
      activityTypeFilterItems: [{ value: 'CLICK', text: 'Clicked Link' }],
      productFilterItems: [{ value: 'PHISH', text: 'Phishing Simulator' }],
      difficulityFilterItems: [{ value: 'EASY', text: 'Easy' }]
    })

    expect(wrapper.vm.getFilterValue({ key: 'activityType' }, 'CLICK')).toBe('Clicked Link')
    expect(wrapper.vm.getFilterValue({ key: 'product' }, 'PHISH')).toBe('Phishing Simulator')
    expect(wrapper.vm.getFilterValue({ key: 'difficulty' }, 'EASY')).toBe('Easy')
    expect(wrapper.vm.getFilterValue({ key: 'other' }, 'RAW')).toBe('RAW')
  })

  it('search filter render branch activates only when activeValue has entries', async () => {
    const wrapper = mountComponent({
      filter: {
        filterType: 'search',
        key: 'activityType',
        text: 'Activity Type',
        activeValue: []
      }
    })

    expect(wrapper.vm.isFilterTypeSearch).toBeFalsy()

    await wrapper.setProps({
      filter: {
        filterType: 'search',
        key: 'activityType',
        text: 'Activity Type',
        activeValue: ['CLICK']
      }
    })

    expect(wrapper.vm.isFilterTypeSearch).toBeTruthy()
    expect(wrapper.findAll('.training-library-filter-badge').length).toBe(1)
  })

  it('date filter branch is active when filterType is date and activeValue exists', () => {
    const wrapper = mountComponent(
      {
        filter: {
          filterType: 'date',
          key: 'startDate',
          text: 'Date',
          activeValue: '2025-01-01'
        }
      },
      {
        methods: {
          getDateFilterValue: jest.fn(() => '2025-01-01')
        }
      }
    )

    expect(wrapper.vm.isFilterTypeDateSelect).toBeTruthy()
    expect(wrapper.vm.isRenderComponent).toBeTruthy()
  })

  it('longTextSearch branch becomes inactive when activeValue is null', () => {
    const wrapper = mountComponent({
      filter: {
        filterType: 'longTextSearch',
        key: 'query',
        text: 'Query',
        activeValue: null
      }
    })

    expect(wrapper.vm.isFilterTypeLongTextSearch).toBeFalsy()
  })

  it('isRenderComponent is false for unsupported filter type', () => {
    const wrapper = mountComponent({
      filter: {
        filterType: 'unsupported',
        key: 'x',
        text: 'X',
        activeValue: null
      }
    })

    expect(wrapper.vm.isRenderComponent).toBe(false)
  })

  it('removeSearchFilter emits payload with given value/index', () => {
    const wrapper = mountComponent({
      filter: {
        filterType: 'search',
        key: 'product',
        text: 'Product',
        activeValue: ['PHISH']
      }
    })

    wrapper.vm.removeSearchFilter('PHISH', 2)

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')[0][0]).toEqual({ filter: 'PHISH', index: 2 })
  })
})
