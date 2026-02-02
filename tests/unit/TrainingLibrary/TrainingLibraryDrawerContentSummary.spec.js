import { createLocalVue, shallowMount } from '@vue/test-utils'
import TrainingLibraryDrawerContentSummary from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerContentSummary.vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

// Mock dependencies
const TrainingLibraryDrawerInfoCard = { render: () => {} }
const TrainingLibraryDrawerLanguageMenu = { render: () => {} }
const TrainingLibraryDrawerActionsMenu = { render: () => {} }
const TrainingLibraryDrawerContentSteps = { render: () => {} }

// Mock Service
jest.mock('@/api/awarenessEducator', () => ({
  getLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getTraining: jest.fn(() => Promise.resolve({ data: { data: { name: 'Test Training Detailed' } } })),
  getTrainingUrlForPreview: jest.fn(),
  downloadPoster: jest.fn(),
  duplicateTraining: jest.fn(),
  deleteTraining: jest.fn()
}))

import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryDrawerContentSummary.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let vuetify
  let store
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
      modules: {
        trainingLibrary: {
          namespaced: true,
          mutations: {
            SET_NESTED_DRAWER: jest.fn(),
            SET_DEEP_NESTED_DRAWER: jest.fn(),
            SET_LIGHTBOX: jest.fn(),
            SET_DELETE_DIALOG: jest.fn()
          },
          actions: {
            setNewTrainingModal: jest.fn(),
            setNewLearningPathModal: jest.fn(),
            setNewPosterModal: jest.fn(),
            setNewInfographicModal: jest.fn(),
            setNewScreensaverModal: jest.fn(),
            setNewSurveyModal: jest.fn()
          }
        }
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    if (wrapper) wrapper.destroy()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(TrainingLibraryDrawerContentSummary, {
      localVue,
      vuetify,
      store,
      components: {
        TrainingLibraryDrawerInfoCard,
        TrainingLibraryDrawerLanguageMenu,
        TrainingLibraryDrawerActionsMenu,
        TrainingLibraryDrawerContentSteps
      },
      propsData: {
        trainingData: {
          trainingId: '123',
          name: 'Test Training',
          description: 'Test Description',
          languages: ['EN'],
          coverImage: 'http://test.com/image.jpg'
        },
        ...propsData
      },
      stubs: ['VIcon', 'VBtn']
    })
  }

  it('renders correctly', () => {
    wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    // Initially loads, so skeleton should be present
    expect(wrapper.find('.training-library-drawer-content-summary__skeleton').exists()).toBe(true)
  })

  it('shows skeleton loader when loading languages', () => {
    // isLoadingLanguages defaults to true in data
    wrapper = mountComponent()
    // Initial state is loading
    expect(wrapper.vm.isLoadingLanguages).toBe(true)
    expect(wrapper.find('.training-library-drawer-content-summary__skeleton').exists()).toBe(true)
  })

  it('shows content after loading', async () => {
    wrapper = mountComponent()
    // Wait for promises in mounted
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0)) // Flush promises
    
    expect(wrapper.vm.isLoadingLanguages).toBe(false)
    expect(wrapper.find('.training-library-drawer-content-summary__content').exists()).toBe(true)
    // Name comes from API detail or prop. Our mock returns 'Test Training Detailed'
    expect(wrapper.find('.training-library-drawer-content-summary__title').text()).toBe('Test Training Detailed')
  })

  it('computes isScreensaver, isLearningPath correctly', () => {
    wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.SCREENSAVER })
    expect(wrapper.vm.isScreensaver).toBe(true)
    expect(wrapper.vm.isLearningPath).toBe(false)

    const wrapper2 = mountComponent({ type: TRAINING_LIBRARY_TYPES.LEARNING_PATH })
    expect(wrapper2.vm.isLearningPath).toBe(true)
  })

  it('computes preview button text based on type', () => {
    const types = [
      { type: TRAINING_LIBRARY_TYPES.TRAINING, text: 'PREVIEW TRAINING' },
      { type: TRAINING_LIBRARY_TYPES.LEARNING_PATH, text: 'SEND LEARNING PATH' }, // Defined in component logic
      { type: TRAINING_LIBRARY_TYPES.POSTER, text: 'PREVIEW POSTER' }
    ]

    types.forEach(item => {
      const w = mountComponent({ type: item.type })
      expect(w.vm.getPreviewButtonText).toBe(item.text)
    })
  })

  it('calls getLanguages api on mount', () => {
    mountComponent()
    expect(AwarenessEducatorService.getLanguages).toHaveBeenCalled()
  })

})
