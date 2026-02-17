import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import TrainingLibraryShowFilterItems from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryShowFilterItems'

describe('TrainingLibraryShowFilterItems.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  it('renders filter labels from getter', () => {
    const store = new Vuex.Store({
      modules: {
        trainingLibrary: {
          namespaced: true,
          getters: {
            getFilterOptionsFilters: () => [
              { label: 'Department', property: 'department', show: true },
              { label: 'Language', property: 'language', show: false }
            ]
          },
          actions: {
            setFilterItemsShow: jest.fn()
          }
        }
      }
    })

    const wrapper = shallowMount(TrainingLibraryShowFilterItems, {
      localVue,
      store
    })

    expect(wrapper.text()).toContain('Department')
    expect(wrapper.text()).toContain('Language')
  })

  it('dispatches action with expected payload on handleListItemClick', () => {
    const setFilterItemsShow = jest.fn()
    const store = new Vuex.Store({
      modules: {
        trainingLibrary: {
          namespaced: true,
          getters: {
            getFilterOptionsFilters: () => []
          },
          actions: {
            setFilterItemsShow
          }
        }
      }
    })

    const wrapper = shallowMount(TrainingLibraryShowFilterItems, {
      localVue,
      store
    })

    wrapper.vm.handleListItemClick({ property: 'department' }, true)

    expect(setFilterItemsShow).toHaveBeenCalled()
    expect(setFilterItemsShow.mock.calls[0][1]).toEqual({
      key: 'department',
      show: true
    })
  })
})

