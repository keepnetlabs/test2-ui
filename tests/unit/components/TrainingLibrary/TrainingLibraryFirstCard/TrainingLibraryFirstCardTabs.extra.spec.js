import { shallowMount } from '@vue/test-utils'
import TrainingLibraryFirstCardTabs from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardTabs.vue'

const createWrapper = ({ isTabsLoading = false, dispatch = jest.fn() } = {}) =>
  shallowMount(TrainingLibraryFirstCardTabs, {
    mocks: {
      $store: {
        getters: {
          'trainingLibrary/getTabsLoading': isTabsLoading,
          'trainingLibrary/getTrainingSubTabs': [{ name: 'Training', totalCount: 7 }],
          'trainingLibrary/getSelectedTrainingContent': 'All Materials',
          'trainingLibrary/getSelectedSubTrainingContent': 'Training'
        },
        dispatch
      }
    },
    stubs: {
      ElTabs: { name: 'ElTabs', template: '<div class="el-tabs"><slot /></div>' },
      ElTabPane: {
        name: 'ElTabPane',
        template: '<div class="el-tab-pane"><slot name="label" /><slot /></div>'
      },
      'v-skeleton-loader': {
        name: 'VSkeletonLoader',
        template: '<div class="skeleton-loader"></div>'
      }
    }
  })

describe('TrainingLibraryFirstCardTabs.vue (extra)', () => {
  it('renders loading skeletons while tab counts are loading', () => {
    const wrapper = createWrapper({ isTabsLoading: true })

    expect(wrapper.find('.skeleton-loader').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Training (7)')
  })

  it('renders tab counts once loading is complete', () => {
    const wrapper = createWrapper({ isTabsLoading: false })

    expect(wrapper.find('.skeleton-loader').exists()).toBe(false)
    expect(wrapper.text()).toContain('Training (7)')
  })

  it('dispatches both tab selection actions through mapped methods', () => {
    const dispatch = jest.fn()
    const wrapper = createWrapper({ dispatch })

    wrapper.vm.setSelectedTrainingContent({ name: 'Favourites' })
    wrapper.vm.setSubSelectedTrainingContent({ name: 'Survey' })

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      'trainingLibrary/setSelectedTrainingContent',
      { name: 'Favourites' }
    )
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      'trainingLibrary/setSubSelectedTrainingContent',
      { name: 'Survey' }
    )
  })
})
