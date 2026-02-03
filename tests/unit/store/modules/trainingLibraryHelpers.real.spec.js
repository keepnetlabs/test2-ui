jest.mock('@/api/awarenessEducator', () => ({
  getCategories: jest.fn(),
  getLanguages: jest.fn(),
  getTrainingDurations: jest.fn(),
  getTrainingTypes: jest.fn(),
  getTrainingLevels: jest.fn()
}))

import trainingLibraryHelpers from '@/store/modules/trainingLibraryHelpers'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('trainingLibraryHelpers store module (real)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('actions', () => {
    it('callForDurations maps durations and dispatches filter items', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: {
          data: [
            { id: 1, name: 'Minute30', displayName: '30 minutes' },
            { resourceId: 2, displayName: '1 hour' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_DURATIONS', [
        { id: 1, name: 'Minute30', text: '30 minutes', value: '1' },
        { id: 2, name: '1 hour', text: '1 hour', value: '' }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.DURATION, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.DURATION, items: expect.any(Array) },
        { root: true }
      )
    })

    it('callForTypes sets types and filters learningPathTrainingTypes', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: {
          data: [
            { id: 1, displayName: 'Training' },
            { id: 2, displayName: 'Screensaver' },
            { id: 3, displayName: 'Learning Path' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForTypes({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_TYPES', [
        { text: 'Training', value: '1' },
        { text: 'Screensaver', value: '2' },
        { text: 'Learning Path', value: '3' }
      ])
      expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_TRAINING_TYPES', [
        { text: 'Training', value: '1' }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.TYPE, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.TYPE, items: expect.any(Array) },
        { root: true }
      )
    })

    it('callForCategories maps categories and dispatches filter items', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: {
          data: [
            { name: 'SocialEngineering', displayName: 'Social Engineering' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForCategories({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', [
        { text: 'Social Engineering', value: 'SocialEngineering' }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.CATEGORY, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.CATEGORY, items: expect.any(Array) },
        { root: true }
      )
    })

    it('callForLanguages maps languages and dispatches filter items', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getLanguages.mockResolvedValue({
        data: {
          data: [
            { isoFriendlyName: 'English', code: 'EN' },
            { isoFriendlyName: 'Turkish', code: 'TR' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForLanguages({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_LANGUAGES', [
        { isoFriendlyName: 'English', code: 'EN' },
        { isoFriendlyName: 'Turkish', code: 'TR' }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        {
          key: PROPERTY_STORE.LANGUAGES,
          items: [
            { text: 'English', value: 'EN' },
            { text: 'Turkish', value: 'TR' }
          ]
        },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        {
          key: PROPERTY_STORE.LANGUAGES,
          items: [
            { text: 'English', value: 'EN' },
            { text: 'Turkish', value: 'TR' }
          ]
        },
        { root: true }
      )
    })

    it('callForLevels maps levels and dispatches filter items', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingLevels.mockResolvedValue({
        data: {
          data: [
            { id: 1, name: 'Beginner', displayName: 'Beginner' },
            { resourceId: 2, displayName: 'Advanced' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForLevels({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_LEVELS', [
        { id: 1, name: 'Beginner', text: 'Beginner', value: '1' },
        { id: 2, name: 'Advanced', text: 'Advanced', value: '' }
      ])
      expect(dispatch).toHaveBeenCalledWith(
        'trainingLibrary/setFilterItems',
        { key: PROPERTY_STORE.LEVEL, items: expect.any(Array) },
        { root: true }
      )
      expect(dispatch).toHaveBeenCalledWith(
        'learningPath/setLearningPathFilterItems',
        { key: PROPERTY_STORE.LEVEL, items: expect.any(Array) },
        { root: true }
      )
    })
  })
})
