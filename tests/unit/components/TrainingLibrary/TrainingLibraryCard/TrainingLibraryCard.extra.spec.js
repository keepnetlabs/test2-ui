import { shallowMount } from '@vue/test-utils'
import TrainingLibraryCard from '@/components/TrainingLibrary/TrainingLibraryCard/TrainingLibraryCard.vue'
import {
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

jest.mock('@/api/awarenessEducator', () => ({
  duplicateTraining: jest.fn(() => Promise.resolve()),
  deleteTraining: jest.fn(() => Promise.resolve()),
  getTrainingTypeCount: jest.fn(() => Promise.resolve()),
  searchTraining: jest.fn(() => Promise.resolve())
}))

const dispatch = jest.fn()
const getters = { 'trainingLibrary/getSelectedTrainingContent': 'All Materials' }

const baseItem = {
  trainingId: 't1',
  trainingName: 'Test',
  createdBy: 'Admin',
  category: 'Security',
  tags: ['tag1'],
  languages: ['en'],
  coverImage: null,
  isNew: false,
  isFavourite: false,
  hasQuiz: false
}

const createWrapper = (propsData = {}, storeOverrides = {}) =>
  shallowMount(TrainingLibraryCard, {
    propsData: { item: { ...baseItem, ...propsData.item }, ...propsData },
    mocks: {
      $store: { dispatch, getters: { ...getters, ...storeOverrides } }
    },
    stubs: {
      TrainingLibraryNewBadge: true,
      TrainingLibraryFavoriteButton: true,
      VTooltip: true,
      VMenu: true
    }
  })

describe('TrainingLibraryCard.vue (branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window, 'addEventListener', { value: jest.fn(), writable: true })
    Object.defineProperty(window, 'removeEventListener', { value: jest.fn(), writable: true })
  })

  describe('getBgColor branches', () => {
    it('returns survey for quiz items', () => {
      const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
      expect(wrapper.vm.getBgColor).toContain('survey')
    })

    it('returns training for Training type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
      expect(wrapper.vm.getBgColor).toContain('training')
    })

    it('returns learning-path for LearningPath type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      })
      expect(wrapper.vm.getBgColor).toContain('learning-path')
    })

    it('returns poster for Poster type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
      expect(wrapper.vm.getBgColor).toContain('poster')
    })

    it('returns infographic for Infographic type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
      expect(wrapper.vm.getBgColor).toContain('infographic')
    })

    it('returns screensaver for Screensaver type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      })
      expect(wrapper.vm.getBgColor).toContain('screensaver')
    })
  })

  describe('getTypeText branches', () => {
    it('returns Survey when item has quiz', () => {
      const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
      expect(wrapper.vm.getTypeText).toBe('Survey')
    })

    it('returns Training for Training payload type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
      expect(wrapper.vm.getTypeText).toBe('Training')
    })

    it('returns item.type when not Training', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
      expect(wrapper.vm.getTypeText).toBe(TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
    })
  })

  describe('getCoverImageUrl branches', () => {
    it('returns empty string when no cover image exists', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, coverImage: null }
      })
      expect(wrapper.vm.getCoverImageUrl).toBe('')
      expect(wrapper.vm.getCardImageBackground).toEqual({})
    })

    it('returns coverImage when string', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, coverImage: 'https://img.com/x.png' }
      })
      expect(wrapper.vm.getCoverImageUrl).toBe('https://img.com/x.png')
    })

    it('returns imageUrl when coverImage is object', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, coverImage: { imageUrl: 'https://img.com/y.png' } }
      })
      expect(wrapper.vm.getCoverImageUrl).toBe('https://img.com/y.png')
      expect(wrapper.vm.getCardImageBackground).toEqual({
        backgroundImage: "url('https://img.com/y.png')"
      })
    })
  })

  describe('checkTooltipStasuses branches', () => {
    it('sets tooltip flags to false when refs are missing', () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs = {}
      wrapper.vm.checkTooltipStasuses()
      expect(wrapper.vm.isRenderTitleTooltip).toBe(false)
      expect(wrapper.vm.isRenderCreatedByTooltip).toBe(false)
      expect(wrapper.vm.isRenderCategoryTooltip).toBe(false)
    })
  })

  describe('handleFavoriteRemove else branch', () => {
    it('does not call callForTrainingLibrary when not on Favourites tab', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleFavoriteRemove()
      expect(dispatch).not.toHaveBeenCalledWith('trainingLibrary/callForTrainingLibrary')
    })
  })

  describe('handlePreviewClick branches', () => {
    it('dispatches setSurveyPreviewDialog for quiz item', () => {
      const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
      const row = { ...baseItem, hasQuiz: true }
      wrapper.vm.handlePreviewClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setSurveyPreviewDialog',
        expect.objectContaining({ type: TRAINING_LIBRARY_TYPES.SURVEY })
      )
    })

    it('dispatches setTrainingPreviewDialog for Training', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      wrapper.vm.handlePreviewClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setTrainingPreviewDialog',
        expect.objectContaining({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      )
    })

    it('dispatches setLearningPathPreviewDialog for LearningPath', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      wrapper.vm.handlePreviewClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setLearningPathPreviewDialog',
        expect.objectContaining({ type: TRAINING_LIBRARY_TYPES.LEARNING_PATH })
      )
    })

    it('dispatches setPosterPreviewDialog for Poster', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      wrapper.vm.handlePreviewClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setPosterPreviewDialog',
        expect.objectContaining({ type: TRAINING_LIBRARY_TYPES.POSTER })
      )
    })

    it('dispatches setInfographicPreviewDialog for Infographic', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      wrapper.vm.handlePreviewClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setInfographicPreviewDialog',
        expect.objectContaining({ type: TRAINING_LIBRARY_TYPES.INFOGRAPHIC })
      )
    })

    it('dispatches setScreenSaverPreviewDialog for Screensaver', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      wrapper.vm.handlePreviewClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setScreenSaverPreviewDialog',
        expect.objectContaining({ type: TRAINING_LIBRARY_TYPES.SCREENSAVER })
      )
    })
  })

  describe('handleFastLaunchClick branches', () => {
    it('dispatches setSurveySendModal when hasQuiz', () => {
      const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
      const row = { ...baseItem, hasQuiz: true }
      wrapper.vm.handleFastLaunchClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setSurveySendModal',
        expect.objectContaining({ selectedRow: row })
      )
    })

    it('dispatches setLearningPathSendModal for LearningPath', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      wrapper.vm.handleFastLaunchClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setLearningPathSendModal',
        expect.any(Object)
      )
    })

    it('dispatches setPosterSendModal for Poster', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      wrapper.vm.handleFastLaunchClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setPosterSendModal',
        expect.any(Object)
      )
    })

    it('dispatches setInfographicSendModal for Infographic', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      wrapper.vm.handleFastLaunchClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setInfographicSendModal',
        expect.any(Object)
      )
    })

    it('dispatches setScreenSaverPreviewDialog for Screensaver fast launch', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      wrapper.vm.handleFastLaunchClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setScreenSaverPreviewDialog',
        expect.objectContaining({ showSendButton: true })
      )
    })

    it('dispatches setTrainingSendModal for Training', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
      const row = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      wrapper.vm.handleFastLaunchClick(row)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setTrainingSendModal',
        expect.objectContaining({ selectedRow: row })
      )
    })
  })

  describe('handleListItemClick Edit branches', () => {
    it('dispatches setNewSurveyModal for quiz item', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, hasQuiz: true, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
      const item = { ...baseItem, hasQuiz: true, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      wrapper.vm.handleListItemClick('Edit', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setNewSurveyModal',
        expect.objectContaining({ isEdit: true })
      )
    })

    it('dispatches setNewTrainingModal for Training type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      wrapper.vm.handleListItemClick('Edit', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setNewTrainingModal',
        expect.objectContaining({ isEdit: true })
      )
    })

    it('dispatches setNewPosterModal for Poster', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      wrapper.vm.handleListItemClick('Edit', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setNewPosterModal',
        expect.objectContaining({ isEdit: true })
      )
    })

    it('dispatches setNewInfographicModal for Infographic', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      wrapper.vm.handleListItemClick('Edit', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setNewInfographicModal',
        expect.objectContaining({ isEdit: true })
      )
    })

    it('dispatches setNewScreensaverModal for Screensaver', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      wrapper.vm.handleListItemClick('Edit', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setNewScreensaverModal',
        expect.objectContaining({ isEdit: true })
      )
    })

    it('dispatches setNewLearningPathModal for LearningPath', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      wrapper.vm.handleListItemClick('Edit', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setNewLearningPathModal',
        expect.objectContaining({ isEdit: true })
      )
    })
  })

  describe('handleListItemClick Delete branches', () => {
    it('dispatches setDeleteDialog for Training type', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING, hasQuiz: false }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING, hasQuiz: false }
      wrapper.vm.handleListItemClick('Delete', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setDeleteDialog',
        expect.objectContaining({ type: 'training', title: 'Delete Training Material?' })
      )
    })

    it('dispatches setDeleteDialog for Poster', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      wrapper.vm.handleListItemClick('Delete', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setDeleteDialog',
        expect.objectContaining({ type: 'poster' })
      )
    })

    it('dispatches setDeleteDialog for Infographic', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      wrapper.vm.handleListItemClick('Delete', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setDeleteDialog',
        expect.objectContaining({ type: 'infographic' })
      )
    })

    it('dispatches setDeleteDialog for Screensaver', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      wrapper.vm.handleListItemClick('Delete', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setDeleteDialog',
        expect.objectContaining({ type: 'screensaver' })
      )
    })

    it('dispatches setDeleteDialog for LearningPath', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
      wrapper.vm.handleListItemClick('Delete', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setDeleteDialog',
        expect.objectContaining({ type: 'learning-path' })
      )
    })

    it('dispatches setDeleteDialog for Survey (hasQuiz)', () => {
      const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
      const item = { ...baseItem, hasQuiz: true }
      wrapper.vm.handleListItemClick('Delete', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setDeleteDialog',
        expect.objectContaining({ title: 'Delete Survey Material?' })
      )
    })
  })

  describe('handleListItemClick Download branches', () => {
    it('dispatches setInfographicPreviewDialog for DownloadInfographic', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      wrapper.vm.handleListItemClick('Download Infographic', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setInfographicPreviewDialog',
        expect.objectContaining({ type: 'downloadInfographic' })
      )
    })

    it('dispatches setPosterPreviewDialog for Download Poster', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
      wrapper.vm.handleListItemClick('Download Poster', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setPosterPreviewDialog',
        expect.objectContaining({ type: 'downloadPoster' })
      )
    })

    it('dispatches setScreenSaverPreviewDialog for Download Screensaver', () => {
      const wrapper = createWrapper({
        item: { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      })
      const item = { ...baseItem, type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
      wrapper.vm.handleListItemClick('Download Screensaver', item)
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setScreenSaverPreviewDialog',
        expect.objectContaining({ type: 'downloadScreensaver' })
      )
    })
  })
})
