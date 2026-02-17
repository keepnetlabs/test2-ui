import { shallowMount } from '@vue/test-utils'
import TrainingLibraryFirstCard from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCard.vue'

describe('TrainingLibraryFirstCard.vue', () => {
  const mountComponent = () =>
    shallowMount(TrainingLibraryFirstCard, {
      stubs: {
        TrainingLibraryListViewFirstCardHeader: {
          name: 'TrainingLibraryListViewFirstCardHeader',
          template: '<div class="header-stub" />'
        },
        TrainingLibraryFirstCardTabs: {
          name: 'TrainingLibraryFirstCardTabs',
          template: '<div class="tabs-stub" />'
        },
        TrainingLibraryFilters: {
          name: 'TrainingLibraryFilters',
          template: '<div class="filters-stub" />'
        },
        TrainingLibraryFiltersBadges: {
          name: 'TrainingLibraryFiltersBadges',
          template: '<div class="badges-stub" />'
        }
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('TrainingLibraryFirstCard')
  })

  it('renders first-card layout with child sections', () => {
    const wrapper = mountComponent()

    expect(wrapper.find('.training-library-list-view-first-card').exists()).toBe(true)
    expect(wrapper.find('.header-stub').exists()).toBe(true)
    expect(wrapper.find('.tabs-stub').exists()).toBe(true)
    expect(wrapper.find('.filters-stub').exists()).toBe(true)
    expect(wrapper.find('.badges-stub').exists()).toBe(true)
    expect(wrapper.find('hr.mt-6.mb-4').exists()).toBe(true)
  })
})

