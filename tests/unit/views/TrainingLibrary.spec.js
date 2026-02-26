import TrainingLibrary from '@/views/TrainingLibrary.vue'
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

describe('TrainingLibrary.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrary.name).toBe('TrainingLibrary')
  })

  it('registers expected child components', () => {
    expect(TrainingLibrary.components.KContainer).toBeDefined()
    expect(TrainingLibrary.components.TrainingLibraryFirstCard).toBeDefined()
    expect(TrainingLibrary.components.TrainingLibraryListViewCard).toBeDefined()
    expect(TrainingLibrary.components.TrainingLibraryCardView).toBeDefined()
  })

  it('beforeRouteLeave resets modals and allows navigation', () => {
    const resetAllModals = jest.fn()
    const next = jest.fn()
    const ctx = { resetAllModals }

    TrainingLibrary.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(resetAllModals).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('created hook triggers initialization actions', () => {
    const ctx = {
      resetAllModals: jest.fn(),
      initDefaultTableSettings: jest.fn(),
      initDefaultTableFilters: jest.fn(),
      callForTrainingHelpers: jest.fn(),
      callForTrainingLibrary: jest.fn()
    }

    TrainingLibrary.created.call(ctx)

    expect(ctx.resetAllModals).toHaveBeenCalledTimes(1)
    expect(ctx.initDefaultTableSettings).toHaveBeenCalledTimes(1)
    expect(ctx.initDefaultTableFilters).toHaveBeenCalledTimes(1)
    expect(ctx.callForTrainingHelpers).toHaveBeenCalledTimes(1)
    expect(ctx.callForTrainingLibrary).toHaveBeenCalledTimes(1)
  })

  it('beforeDestroy resets store state', () => {
    const ctx = { resetState: jest.fn() }

    TrainingLibrary.beforeDestroy.call(ctx)
    expect(ctx.resetState).toHaveBeenCalledTimes(1)
  })

  it('isListView getter drives rendered card component branch', () => {
    const createWrapper = (isListView) => {
      const store = new Vuex.Store({
        modules: {
          trainingLibrary: {
            namespaced: true,
            getters: {
              getIsListView: () => isListView
            },
            actions: {
              initDefaultTableSettings: jest.fn(),
              initDefaultTableFilters: jest.fn(),
              callForTrainingLibrary: jest.fn(),
              resetState: jest.fn(),
              resetAllModals: jest.fn()
            }
          },
          trainingLibraryHelpers: {
            namespaced: true,
            actions: { callForTrainingHelpers: jest.fn() }
          }
        }
      })
      return shallowMount(TrainingLibrary, {
        store,
        stubs: {
          KContainer: true,
          TrainingLibraryCommonComponents: true,
          TrainingLibraryFirstCard: true,
          TrainingLibraryListViewCard: true,
          TrainingLibraryCardView: true
        }
      })
    }

    const listWrapper = createWrapper(true)
    expect(listWrapper.vm.isListView).toBe(true)
    listWrapper.destroy()

    const cardWrapper = createWrapper(false)
    expect(cardWrapper.vm.isListView).toBe(false)
    cardWrapper.destroy()
  })
})
