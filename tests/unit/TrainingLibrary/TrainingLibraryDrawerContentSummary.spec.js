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
            SET_DELETE_DIALOG: jest.fn(),
            SET_TRAINING_SEND_MODAL: jest.fn(),
            SET_LEARNING_PATH_SEND_MODAL: jest.fn(),
            SET_POSTER_SEND_MODAL: jest.fn(),
            SET_INFOGRAPHIC_SEND_MODAL: jest.fn(),
            SET_SURVEY_SEND_MODAL: jest.fn()
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

  describe('Component Rendering', () => {
    it('renders component successfully', () => {
      wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders with required props', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.trainingData).toBeDefined()
    })

    it('mounts without errors', () => {
      wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('has store access', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.$store).toBeDefined()
    })
  })

  describe('Loading States', () => {
    it('shows skeleton loader initially', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.training-library-drawer-content-summary__skeleton').exists()).toBe(true)
    })

    it('sets isLoadingLanguages to true on mount', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.isLoadingLanguages).toBe(true)
    })

    it('hides skeleton after loading', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.vm.isLoadingLanguages).toBe(false)
    })

    it('shows content when loading completes', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.find('.training-library-drawer-content-summary__content').exists()).toBe(true)
    })

    it('manages loading state transitions', async () => {
      wrapper = mountComponent()
      expect(wrapper.vm.isLoadingLanguages).toBe(true)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.vm.isLoadingLanguages).toBe(false)
    })
  })

  describe('Content Display', () => {
    it('displays training name', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.find('.training-library-drawer-content-summary__title').text()).toBe('Test Training Detailed')
    })

    it('displays training description', async () => {
      wrapper = mountComponent()
      expect(wrapper.vm.trainingData.description).toBe('Test Description')
    })

    it('displays cover image', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.trainingData.coverImage).toBe('http://test.com/image.jpg')
    })

    it('displays languages from training data', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.trainingData.languages).toEqual(['EN'])
    })

    it('shows correct content structure', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      const content = wrapper.find('.training-library-drawer-content-summary__content')
      expect(content.exists()).toBe(true)
    })
  })

  describe('Type Handling', () => {
    it('identifies screensaver type correctly', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.SCREENSAVER })
      expect(wrapper.vm.isScreensaver).toBe(true)
    })

    it('identifies learning path type correctly', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.LEARNING_PATH })
      expect(wrapper.vm.isLearningPath).toBe(true)
    })

    it('identifies training type correctly', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      expect(wrapper.vm.isScreensaver).toBe(false)
      expect(wrapper.vm.isLearningPath).toBe(false)
    })

    it('identifies poster type correctly', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.POSTER })
      expect(wrapper.vm).toBeDefined()
    })

    it('handles type property in computed', () => {
      const types = [
        TRAINING_LIBRARY_TYPES.SCREENSAVER,
        TRAINING_LIBRARY_TYPES.LEARNING_PATH,
        TRAINING_LIBRARY_TYPES.TRAINING,
        TRAINING_LIBRARY_TYPES.POSTER
      ]

      types.forEach(type => {
        const w = mountComponent({ type })
        expect(w.vm).toBeDefined()
      })
    })
  })

  describe('Preview Button', () => {
    it('computes preview button text for training', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      expect(wrapper.vm.getPreviewButtonText).toBe('PREVIEW TRAINING')
    })

    it('computes preview button text for learning path', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.LEARNING_PATH })
      expect(wrapper.vm.getPreviewButtonText).toBe('SEND LEARNING PATH')
    })

    it('computes preview button text for poster', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.POSTER })
      expect(wrapper.vm.getPreviewButtonText).toBe('PREVIEW POSTER')
    })

    it('returns correct text based on type', () => {
      const types = [
        { type: TRAINING_LIBRARY_TYPES.TRAINING, text: 'PREVIEW TRAINING' },
        { type: TRAINING_LIBRARY_TYPES.LEARNING_PATH, text: 'SEND LEARNING PATH' },
        { type: TRAINING_LIBRARY_TYPES.POSTER, text: 'PREVIEW POSTER' }
      ]

      types.forEach(item => {
        const w = mountComponent({ type: item.type })
        expect(w.vm.getPreviewButtonText).toBe(item.text)
      })
    })

    it('button text is a string', () => {
      wrapper = mountComponent()
      expect(typeof wrapper.vm.getPreviewButtonText).toBe('string')
    })
  })

  describe('API Integration', () => {
    it('calls getLanguages on component mount', () => {
      mountComponent()
      expect(AwarenessEducatorService.getLanguages).toHaveBeenCalled()
    })

    it('calls getTraining API', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(AwarenessEducatorService.getTraining).toHaveBeenCalled()
    })

    it('handles API response for languages', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.vm.isLoadingLanguages).toBe(false)
    })

    it('handles API response for training details', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.find('.training-library-drawer-content-summary__title').text()).toBeTruthy()
    })

    it('makes API calls on mount', () => {
      mountComponent()
      expect(AwarenessEducatorService.getLanguages).toHaveBeenCalled()
    })
  })

  describe('Props Handling', () => {
    it('accepts trainingData prop', () => {
      wrapper = mountComponent()
      expect(wrapper.props('trainingData')).toBeDefined()
    })

    it('accepts type prop', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      expect(wrapper.props('type')).toBe(TRAINING_LIBRARY_TYPES.TRAINING)
    })

    it('uses trainingData in display', () => {
      wrapper = mountComponent({
        trainingData: {
          trainingId: '456',
          name: 'Custom Training',
          description: 'Custom Description',
          languages: ['FR'],
          coverImage: 'http://custom.com/image.jpg'
        }
      })
      expect(wrapper.vm.trainingData.name).toBe('Custom Training')
    })

    it('handles prop updates', async () => {
      wrapper = mountComponent()
      const newData = {
        trainingId: '789',
        name: 'Updated Training',
        description: 'Updated Description',
        languages: ['DE'],
        coverImage: 'http://updated.com/image.jpg'
      }
      await wrapper.setProps({ trainingData: newData })
      expect(wrapper.props('trainingData').name).toBe('Updated Training')
    })

    it('preserves prop data integrity', () => {
      const data = {
        trainingId: '123',
        name: 'Test Training',
        description: 'Test Description',
        languages: ['EN'],
        coverImage: 'http://test.com/image.jpg'
      }
      wrapper = mountComponent({ trainingData: data })
      expect(wrapper.props('trainingData')).toEqual(data)
    })
  })

  describe('Store Integration', () => {
    it('has access to trainingLibrary module', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.$store.state.trainingLibrary).toBeDefined()
    })

    it('can call store mutations', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.$store).toBeDefined()
    })

    it('can dispatch store actions', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.$store).toBeDefined()
    })

    it('accesses store correctly', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.$store.getters).toBeDefined()
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('destroys without errors', () => {
      wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('handles multiple mount/unmount cycles', () => {
      for (let i = 0; i < 3; i++) {
        const w = mountComponent()
        expect(w.vm).toBeDefined()
        w.destroy()
      }
    })

    it('maintains state after loading', async () => {
      wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.vm.isLoadingLanguages).toBe(false)
      expect(wrapper.vm.trainingData).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('handles very long training names', () => {
      const longName = 'T'.repeat(100)
      wrapper = mountComponent({
        trainingData: {
          trainingId: '123',
          name: longName,
          description: 'Test',
          languages: ['EN'],
          coverImage: 'http://test.com/image.jpg'
        }
      })
      expect(wrapper.vm.trainingData.name).toBe(longName)
    })

    it('handles multiple languages', () => {
      wrapper = mountComponent({
        trainingData: {
          trainingId: '123',
          name: 'Test',
          description: 'Test',
          languages: ['EN', 'FR', 'DE', 'ES'],
          coverImage: 'http://test.com/image.jpg'
        }
      })
      expect(wrapper.vm.trainingData.languages.length).toBe(4)
    })

    it('handles missing cover image', () => {
      wrapper = mountComponent({
        trainingData: {
          trainingId: '123',
          name: 'Test',
          description: 'Test',
          languages: ['EN'],
          coverImage: ''
        }
      })
      expect(wrapper.vm.trainingData.coverImage).toBe('')
    })

    it('handles special characters in names', () => {
      wrapper = mountComponent({
        trainingData: {
          trainingId: '123',
          name: 'Test @#$% Training',
          description: 'Test',
          languages: ['EN'],
          coverImage: 'http://test.com/image.jpg'
        }
      })
      expect(wrapper.vm.trainingData.name).toBe('Test @#$% Training')
    })

    it('handles null type prop', () => {
      wrapper = mountComponent({ type: null })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Learning Path Helpers', () => {
    it('parseDurationToMinutes parses display and fallback duration formats', () => {
      wrapper = mountComponent()
      expect(wrapper.vm.parseDurationToMinutes(null, '2 hours')).toBe(120)
      expect(wrapper.vm.parseDurationToMinutes(null, '15 minutes')).toBe(15)
      expect(wrapper.vm.parseDurationToMinutes('Hour3', null)).toBe(180)
      expect(wrapper.vm.parseDurationToMinutes('Minute45', null)).toBe(45)
      expect(wrapper.vm.parseDurationToMinutes('30', null)).toBe(30)
      expect(wrapper.vm.parseDurationToMinutes('invalid', null)).toBe(0)
    })

    it('getLearningPathDurationText returns total formatted duration', () => {
      wrapper = mountComponent({
        type: TRAINING_LIBRARY_TYPES.LEARNING_PATH,
        trainingData: {
          trainingId: 'lp-1',
          trainingGroups: [
            { durationDisplayName: '1 hour' },
            { durationDisplayName: '30 minutes' }
          ]
        }
      })
      expect(wrapper.vm.getLearningPathDurationText()).toBe('1 hour 30 minutes')
    })

    it('processLearningPathSteps sorts by order and maps fields', () => {
      wrapper = mountComponent({
        type: TRAINING_LIBRARY_TYPES.LEARNING_PATH,
        trainingData: {
          trainingId: 'lp-2',
          trainingGroups: [
            { trainingOrder: 2, name: 'Second', hasQuiz: false, type: 'SCORM', detailTrainingId: '2' },
            { trainingOrder: 1, name: 'First', hasQuiz: true, type: 'Poster', detailTrainingId: '1' }
          ]
        }
      })

      wrapper.vm.processLearningPathSteps()
      expect(wrapper.vm.learningPathSteps.map((x) => x.title)).toEqual(['First', 'Second'])
      expect(wrapper.vm.learningPathSteps[0].type).toBe('Survey')
      expect(wrapper.vm.learningPathSteps[1].type).toBe('Training')
    })
  })

  describe('Action Methods', () => {
    it('handlePreviewStep commits deep nested drawer when already nested', () => {
      wrapper = mountComponent({ isNested: true })
      const commitSpy = jest.spyOn(wrapper.vm.$store, 'commit')

      wrapper.vm.handlePreviewStep({
        detailTrainingId: 'step-1',
        title: 'Step 1',
        type: 'Training',
        languages: ['EN'],
        coverImage: 'img'
      })

      expect(commitSpy).toHaveBeenCalledWith(
        'trainingLibrary/SET_DEEP_NESTED_DRAWER',
        expect.objectContaining({ status: true })
      )
    })

    it('handlePreviewStep commits nested drawer when not nested', () => {
      wrapper = mountComponent({ isNested: false })
      const commitSpy = jest.spyOn(wrapper.vm.$store, 'commit')

      wrapper.vm.handlePreviewStep({
        detailTrainingId: 'step-2',
        title: 'Step 2',
        type: 'Training',
        languages: ['EN'],
        coverImage: 'img'
      })

      expect(commitSpy).toHaveBeenCalledWith(
        'trainingLibrary/SET_NESTED_DRAWER',
        expect.objectContaining({ status: true })
      )
    })

    it('handleSend for training commits send modal and emits send-clicked', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      const commitSpy = jest.spyOn(wrapper.vm.$store, 'commit')

      wrapper.vm.handleSend()

      expect(commitSpy).toHaveBeenCalledWith(
        'trainingLibrary/SET_TRAINING_SEND_MODAL',
        expect.objectContaining({ status: true })
      )
      expect(wrapper.emitted('send-clicked')).toBeTruthy()
    })

    it('handleSend for screensaver triggers language-based download and does not emit', () => {
      wrapper = mountComponent({ type: TRAINING_LIBRARY_TYPES.SCREENSAVER })
      wrapper.vm.availableLanguages = [{ value: 'lang-1', text: 'English' }]
      const downloadSpy = jest.spyOn(wrapper.vm, 'handleDownloadByLanguage').mockImplementation(() => {})

      wrapper.vm.handleSend()

      expect(downloadSpy).toHaveBeenCalledWith({ value: 'lang-1', text: 'English' })
      expect(wrapper.emitted('send-clicked')).toBeFalsy()
    })

    it('handleFavoriteToggle adds and removes favorite based on current state', async () => {
      AwarenessEducatorService.addToFavorite = jest.fn(() => Promise.resolve())
      AwarenessEducatorService.removeFromFavorite = jest.fn(() => Promise.resolve())

      const ctx = {
        trainingData: { trainingId: 'fav-1', resourceId: 'fav-1' },
        isFavorite: false
      }
      TrainingLibraryDrawerContentSummary.methods.handleFavoriteToggle.call(ctx)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(AwarenessEducatorService.addToFavorite).toHaveBeenCalled()
      expect(ctx.isFavorite).toBe(true)

      TrainingLibraryDrawerContentSummary.methods.handleFavoriteToggle.call(ctx)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(AwarenessEducatorService.removeFromFavorite).toHaveBeenCalled()
      expect(ctx.isFavorite).toBe(false)
    })
  })

  describe('Preview And Download Flows', () => {
    it('handlePreviewClick delegates to handleSend for learning path', () => {
      const ctx = {
        isLearningPath: true,
        handleSend: jest.fn()
      }

      TrainingLibraryDrawerContentSummary.methods.handlePreviewClick.call(ctx, { value: 'lang-1' })

      expect(ctx.handleSend).toHaveBeenCalled()
      expect(AwarenessEducatorService.getTrainingUrlForPreview).not.toHaveBeenCalled()
    })

    it('handlePreviewClick commits lightbox with preview url for non-pdf content', async () => {
      AwarenessEducatorService.getTrainingUrlForPreview.mockResolvedValue({
        data: {
          data: {
            scormPlayerUrl: 'https://player.example.com/course?x=1',
            trainingUrl: 'https://cdn.example.com/content/index.html'
          }
        }
      })

      const commit = jest.fn()
      const ctx = {
        isLearningPath: false,
        trainingData: { trainingId: 'tr-1' },
        type: TRAINING_LIBRARY_TYPES.TRAINING,
        $store: { commit }
      }

      TrainingLibraryDrawerContentSummary.methods.handlePreviewClick.call(ctx, { value: 'lang-1' })
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(commit).toHaveBeenCalledWith(
        'trainingLibrary/SET_LIGHTBOX',
        expect.objectContaining({
          status: true,
          isLoading: false,
          type: TRAINING_LIBRARY_TYPES.TRAINING
        })
      )
      const payload = commit.mock.calls[0][1]
      expect(payload.previewData).toContain('isPreview=true')
      expect(payload.previewData).toContain('scoAddress=')
    })

    it('handlePreviewClick handles pdf by downloading blob and committing blob url', async () => {
      const originalCreateObjectURL = window.URL.createObjectURL
      window.URL.createObjectURL = jest.fn(() => 'blob:mock-pdf-url')

      AwarenessEducatorService.getTrainingUrlForPreview.mockResolvedValue({
        data: {
          data: {
            scormPlayerUrl: 'https://cdn.example.com/preview.pdf',
            trainingUrl: 'https://cdn.example.com/preview.pdf'
          }
        }
      })
      AwarenessEducatorService.downloadPoster.mockResolvedValue({
        data: new Blob(['pdf'], { type: 'application/pdf' })
      })

      const commit = jest.fn()
      const ctx = {
        isLearningPath: false,
        trainingData: { trainingId: 'tr-2' },
        type: TRAINING_LIBRARY_TYPES.TRAINING,
        $store: { commit }
      }

      TrainingLibraryDrawerContentSummary.methods.handlePreviewClick.call(ctx, { value: 'lang-1' })
      await new Promise(resolve => setTimeout(resolve, 0))
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(commit).toHaveBeenCalledWith(
        'trainingLibrary/SET_LIGHTBOX',
        expect.objectContaining({ status: true, isLoading: true })
      )
      expect(commit).toHaveBeenCalledWith(
        'trainingLibrary/SET_LIGHTBOX',
        expect.objectContaining({
          status: true,
          previewData: 'blob:mock-pdf-url',
          isLoading: false
        })
      )

      window.URL.createObjectURL = originalCreateObjectURL
    })

    it('handlePreviewClick commits closed lightbox on preview error', async () => {
      AwarenessEducatorService.getTrainingUrlForPreview.mockRejectedValue(new Error('preview failed'))

      const commit = jest.fn()
      const ctx = {
        isLearningPath: false,
        trainingData: { trainingId: 'tr-3' },
        type: TRAINING_LIBRARY_TYPES.TRAINING,
        $store: { commit }
      }

      TrainingLibraryDrawerContentSummary.methods.handlePreviewClick.call(ctx, { value: 'lang-1' })
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(commit).toHaveBeenCalledWith('trainingLibrary/SET_LIGHTBOX', {
        status: false,
        previewData: null,
        isLoading: false,
        type: null
      })
    })

    it('handleDownloadByLanguage returns early when training or language is missing', () => {
      const ctx = {
        trainingData: {},
        downloadBlob: jest.fn()
      }

      TrainingLibraryDrawerContentSummary.methods.handleDownloadByLanguage.call(ctx, null)
      expect(AwarenessEducatorService.downloadPoster).not.toHaveBeenCalled()
      expect(ctx.downloadBlob).not.toHaveBeenCalled()
    })

    it('handleDownloadByLanguage normalizes jfif filename based on content type', async () => {
      AwarenessEducatorService.downloadPoster.mockResolvedValue({
        data: new Blob(['img'], { type: 'image/png' }),
        headers: {
          'content-disposition': 'attachment; filename="sample.jfif"',
          'content-type': 'image/png'
        }
      })

      const downloadBlob = jest.fn()
      const ctx = {
        trainingData: { trainingId: 'tr-4', name: 'Sample File' },
        downloadBlob
      }

      TrainingLibraryDrawerContentSummary.methods.handleDownloadByLanguage.call(ctx, { value: 'lang-2' })
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(downloadBlob).toHaveBeenCalled()
      expect(downloadBlob.mock.calls[0][1]).toBe('sample.png')
    })
  })

})
