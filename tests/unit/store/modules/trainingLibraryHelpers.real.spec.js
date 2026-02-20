jest.mock('@/api/awarenessEducator', () => ({
  getCategories: jest.fn(),
  getLanguages: jest.fn(),
  getTrainingDurations: jest.fn(),
  getTrainingTypes: jest.fn(),
  getTrainingLevels: jest.fn()
}))

jest.mock('@/api/scenarios', () => ({
  getScenarioDataDetails: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn()
  }
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

  describe('module structure', () => {
    it('should be a valid Vuex module', () => {
      expect(trainingLibraryHelpers).toBeDefined()
      expect(trainingLibraryHelpers.state).toBeDefined()
      expect(trainingLibraryHelpers.mutations).toBeDefined()
      expect(trainingLibraryHelpers.actions).toBeDefined()
    })

    it('should have all required action methods', () => {
      expect(typeof trainingLibraryHelpers.actions.callForDurations).toBe('function')
      expect(typeof trainingLibraryHelpers.actions.callForTypes).toBe('function')
      expect(typeof trainingLibraryHelpers.actions.callForCategories).toBe('function')
      expect(typeof trainingLibraryHelpers.actions.callForLanguages).toBe('function')
      expect(typeof trainingLibraryHelpers.actions.callForLevels).toBe('function')
    })

    it('should have all required mutations', () => {
      expect(typeof trainingLibraryHelpers.mutations.SET_DURATIONS).toBe('function')
      expect(typeof trainingLibraryHelpers.mutations.SET_TYPES).toBe('function')
      expect(typeof trainingLibraryHelpers.mutations.SET_CATEGORIES).toBe('function')
      expect(typeof trainingLibraryHelpers.mutations.SET_LANGUAGES).toBe('function')
      expect(typeof trainingLibraryHelpers.mutations.SET_LEVELS).toBe('function')
      expect(typeof trainingLibraryHelpers.mutations.SET_LEARNING_PATH_TRAINING_TYPES).toBe('function')
    })
  })

  describe('API integration', () => {
    it('should call awarenessEducator API methods', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [] }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })
      expect(AwarenessEducatorService.getTrainingDurations).toHaveBeenCalled()
    })

    it('should handle API responses for all filter types', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: { data: [{ id: 1, displayName: 'Type' }] }
      })

      await trainingLibraryHelpers.actions.callForTypes({ commit, dispatch })
      expect(commit).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalled()
    })

    it('should handle empty API responses', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: { data: [] }
      })

      await trainingLibraryHelpers.actions.callForCategories({ commit, dispatch })
      expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', [])
    })
  })

  describe('data transformation', () => {
    it('should transform duration data correctly', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: {
          data: [
            { id: 1, name: 'Minute30', displayName: '30 minutes' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })

      const callArgs = commit.mock.calls[0]
      expect(callArgs[0]).toBe('SET_DURATIONS')
      expect(callArgs[1][0]).toHaveProperty('text')
      expect(callArgs[1][0]).toHaveProperty('value')
    })

    it('should map type data with correct structure', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: {
          data: [
            { id: 1, displayName: 'Training' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForTypes({ commit, dispatch })

      const callArgs = commit.mock.calls[0]
      expect(callArgs[1][0]).toHaveProperty('text')
      expect(callArgs[1][0]).toHaveProperty('value')
      expect(callArgs[1][0].text).toBe('Training')
    })

    it('should filter Learning Path types correctly', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: {
          data: [
            { id: 1, displayName: 'Training' },
            { id: 3, displayName: 'Learning Path' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForTypes({ commit, dispatch })

      const learningPathTypeCall = commit.mock.calls[1]
      expect(learningPathTypeCall[0]).toBe('SET_LEARNING_PATH_TRAINING_TYPES')
      expect(learningPathTypeCall[1].length).toBe(1)
    })

    it('should handle missing ID fields in duration data', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: {
          data: [
            { resourceId: 2, displayName: '1 hour' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })

      const callArgs = commit.mock.calls[0]
      expect(callArgs[1][0]).toBeDefined()
      expect(callArgs[1][0]).toHaveProperty('text', '1 hour')
    })
  })

  describe('store dispatch', () => {
    it('should dispatch trainingLibrary filter items', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [{ id: 1, displayName: '30 minutes' }] }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })

      const dispatchCalls = dispatch.mock.calls.filter(call =>
        call[0].includes('trainingLibrary/setFilterItems')
      )
      expect(dispatchCalls.length).toBeGreaterThan(0)
    })

    it('should dispatch learningPath filter items', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: { data: [{ name: 'Category', displayName: 'Category' }] }
      })

      await trainingLibraryHelpers.actions.callForCategories({ commit, dispatch })

      const dispatchCalls = dispatch.mock.calls.filter(call =>
        call[0].includes('learningPath/setLearningPathFilterItems')
      )
      expect(dispatchCalls.length).toBeGreaterThan(0)
    })

    it('should use root dispatch context', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getLanguages.mockResolvedValue({
        data: { data: [{ isoFriendlyName: 'English', code: 'EN' }] }
      })

      await trainingLibraryHelpers.actions.callForLanguages({ commit, dispatch })

      const calls = dispatch.mock.calls
      calls.forEach(call => {
        expect(call[2]).toEqual({ root: true })
      })
    })
  })

  describe('error handling', () => {
    it('should commit and dispatch even with unusual data structures', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [{ displayName: 'Item without ID' }] }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })

      expect(commit).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalled()
    })

    it('should handle empty data in response', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: { data: [] }
      })

      await trainingLibraryHelpers.actions.callForCategories({ commit, dispatch })

      expect(commit).toHaveBeenCalledWith('SET_CATEGORIES', [])
      expect(dispatch).toHaveBeenCalled()
    })

    it('should commit with valid partial data structures', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getLanguages.mockResolvedValue({
        data: {
          data: [
            { isoFriendlyName: 'English', code: 'EN' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForLanguages({ commit, dispatch })
      expect(commit).toHaveBeenCalledWith('SET_LANGUAGES', expect.any(Array))
    })
  })

  describe('multiple calls and state management', () => {
    it('should handle sequential API calls', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [{ id: 1, displayName: '30 minutes' }] }
      })
      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: { data: [{ id: 1, displayName: 'Training' }] }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })
      await trainingLibraryHelpers.actions.callForTypes({ commit, dispatch })

      expect(commit).toHaveBeenCalledTimes(3)
    })

    it('should handle parallel API calls', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [] }
      })
      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: { data: [] }
      })
      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: { data: [] }
      })

      await Promise.all([
        trainingLibraryHelpers.actions.callForDurations({ commit, dispatch }),
        trainingLibraryHelpers.actions.callForTypes({ commit, dispatch }),
        trainingLibraryHelpers.actions.callForCategories({ commit, dispatch })
      ])

      expect(commit).toHaveBeenCalled()
    })

    it('should update filters correctly with fresh data', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingLevels.mockResolvedValue({
        data: { data: [{ id: 1, displayName: 'Beginner' }] }
      })

      await trainingLibraryHelpers.actions.callForLevels({ commit, dispatch })

      const setLevelsCall = commit.mock.calls[0]
      expect(setLevelsCall[0]).toBe('SET_LEVELS')
    })
  })

  describe('filter property constants', () => {
    it('should use correct property store constants', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [] }
      })

      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })

      const dispatchCall = dispatch.mock.calls[0]
      expect(dispatchCall[1]).toHaveProperty('key')
      expect(dispatchCall[1].key).toBe(PROPERTY_STORE.DURATION)
    })

    it('should dispatch with correct property keys for each filter', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      const testCases = [
        {
          action: 'callForDurations',
          mock: 'getTrainingDurations',
          key: PROPERTY_STORE.DURATION
        },
        {
          action: 'callForTypes',
          mock: 'getTrainingTypes',
          key: PROPERTY_STORE.TYPE
        },
        {
          action: 'callForCategories',
          mock: 'getCategories',
          key: PROPERTY_STORE.CATEGORY
        },
        {
          action: 'callForLanguages',
          mock: 'getLanguages',
          key: PROPERTY_STORE.LANGUAGES
        },
        {
          action: 'callForLevels',
          mock: 'getTrainingLevels',
          key: PROPERTY_STORE.LEVEL
        }
      ]

      for (const testCase of testCases) {
        commit.mockClear()
        dispatch.mockClear()

        AwarenessEducatorService[testCase.mock].mockResolvedValue({
          data: { data: [] }
        })

        await trainingLibraryHelpers.actions[testCase.action]({ commit, dispatch })

        const dispatchCalls = dispatch.mock.calls
        const hasCorrectKey = dispatchCalls.some(call => call[1].key === testCase.key)
        expect(hasCorrectKey).toBe(true)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle very large data sets', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      const largeData = []
      for (let i = 0; i < 1000; i++) {
        largeData.push({ id: i, displayName: `Item ${i}` })
      }

      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: { data: largeData }
      })

      await trainingLibraryHelpers.actions.callForTypes({ commit, dispatch })

      const callArgs = commit.mock.calls[0]
      expect(callArgs[1].length).toBe(1000)
    })

    it('should handle special characters in data', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: {
          data: [
            { name: 'Category@#$%', displayName: 'Special Characters & Symbols' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForCategories({ commit, dispatch })

      const callArgs = commit.mock.calls[0]
      expect(callArgs[1][0]).toHaveProperty('text')
    })

    it('should handle unicode characters', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getLanguages.mockResolvedValue({
        data: {
          data: [
            { isoFriendlyName: '中文', code: 'ZH' },
            { isoFriendlyName: 'العربية', code: 'AR' }
          ]
        }
      })

      await trainingLibraryHelpers.actions.callForLanguages({ commit, dispatch })

      const callArgs = commit.mock.calls[0]
      expect(callArgs[1].length).toBe(2)
    })
  })

  describe('performance', () => {
    it('should complete API calls within reasonable time', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [{ id: 1, displayName: '30 minutes' }] }
      })

      const start = Date.now()
      await trainingLibraryHelpers.actions.callForDurations({ commit, dispatch })
      const duration = Date.now() - start

      expect(duration).toBeLessThan(5000)
    })

    it('should handle multiple simultaneous operations', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()

      AwarenessEducatorService.getTrainingDurations.mockResolvedValue({
        data: { data: [] }
      })
      AwarenessEducatorService.getTrainingTypes.mockResolvedValue({
        data: { data: [] }
      })
      AwarenessEducatorService.getCategories.mockResolvedValue({
        data: { data: [] }
      })
      AwarenessEducatorService.getLanguages.mockResolvedValue({
        data: { data: [] }
      })
      AwarenessEducatorService.getTrainingLevels.mockResolvedValue({
        data: { data: [] }
      })

      const start = Date.now()
      await Promise.all([
        trainingLibraryHelpers.actions.callForDurations({ commit, dispatch }),
        trainingLibraryHelpers.actions.callForTypes({ commit, dispatch }),
        trainingLibraryHelpers.actions.callForCategories({ commit, dispatch }),
        trainingLibraryHelpers.actions.callForLanguages({ commit, dispatch }),
        trainingLibraryHelpers.actions.callForLevels({ commit, dispatch })
      ])
      const duration = Date.now() - start

      expect(duration).toBeLessThan(10000)
    })
  })
})
