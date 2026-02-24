jest.mock('@/utils/functions', () => ({
  cancellableAxiosRequest: jest.fn((fn) => (...args) => fn(...args)),
  createRandomCryptStringNumber: jest.fn(() => '5'),
  getDefaultAxiosPayload: jest.fn((payload) => ({
    pageNumber: 1,
    pageSize: payload?.pageSize || 10,
    trainingSearchType: payload?.trainingSearchType,
    trainingType: payload?.trainingType ?? null,
    filter:
      payload?.filter || {
        Condition: 'AND',
        FilterGroups: [
          { Condition: 'AND', FilterItems: [], FilterGroups: [] },
          { Condition: 'OR', FilterItems: [], FilterGroups: [] }
        ]
      }
  }))
}))

jest.mock('@/api/awarenessEducator', () => ({
  searchTraining: jest.fn(),
  getTrainingTypeCount: jest.fn()
}))

import trainingLibrary from '@/store/modules/trainingLibrary'
import {
  TRAINING_LIBRARY_MAIN_TABS,
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_SEARCH_TYPES } from '@/components/TrainingLibrary/utils'

const createState = () => JSON.parse(JSON.stringify(trainingLibrary.state))

describe('trainingLibrary store (mapping branch extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('setSelectedTrainingContent maps all tab names to expected search types', () => {
    const cases = [
      [TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS, TRAINING_LIBRARY_SEARCH_TYPES.All],
      [TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR, TRAINING_LIBRARY_SEARCH_TYPES.MostPopular],
      [TRAINING_LIBRARY_MAIN_TABS.FAVOURITES, TRAINING_LIBRARY_SEARCH_TYPES.Favourites],
      [TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU, TRAINING_LIBRARY_SEARCH_TYPES.CreatedByMe]
    ]

    cases.forEach(([name, expected]) => {
      const state = createState()
      state.selectedTrainingContent = '__force-change__'
      const commit = jest.fn()
      const dispatch = jest.fn()
      trainingLibrary.actions.setSelectedTrainingContent(
        { commit, dispatch, state },
        { name }
      )
      expect(commit).toHaveBeenCalledWith('SET_TRAINING_SEARCH_TYPE', expected)
      expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
    })
  })

  it('setSubSelectedTrainingContent maps all sub tabs to expected training type', () => {
    const cases = [
      [TRAINING_LIBRARY_TYPES.ALL_TYPES, TRAINING_LIBRARY_PAYLOAD_TYPES.ALL_TYPES],
      [TRAINING_LIBRARY_TYPES.LEARNING_PATH, TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH],
      [TRAINING_LIBRARY_TYPES.TRAINING, TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING],
      [TRAINING_LIBRARY_TYPES.POSTER, TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER],
      [TRAINING_LIBRARY_TYPES.INFOGRAPHIC, TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC],
      [TRAINING_LIBRARY_TYPES.SCREENSAVER, TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER],
      [TRAINING_LIBRARY_TYPES.SURVEY, TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY]
    ]

    cases.forEach(([name, expected]) => {
      const state = createState()
      state.selectedSubTrainingContent = '__force-change__'
      const commit = jest.fn()
      const dispatch = jest.fn()
      trainingLibrary.actions.setSubSelectedTrainingContent(
        { commit, dispatch, state },
        { name }
      )
      expect(commit).toHaveBeenCalledWith('SET_TRAINING_TYPE', expected)
      expect(dispatch).toHaveBeenCalledWith('callForTableData')
      expect(dispatch).toHaveBeenCalledWith('callForSummary', { hideLoader: true })
    })
  })

  it('setNewLearningPathModal does not dispatch reset when status is true', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    trainingLibrary.actions.setNewLearningPathModal(
      { commit, dispatch },
      { status: true }
    )
    expect(commit).toHaveBeenCalledWith('SET_NEW_LEARNING_PATH_MODAL', { status: true })
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('restoreDefaultFilters loads default filters from localStorage when present', () => {
    localStorage.setItem('training-library-filters', JSON.stringify({ filterType: 'AND' }))
    const commit = jest.fn()
    const dispatch = jest.fn()
    trainingLibrary.actions.restoreDefaultFilters({ commit, dispatch })
    expect(commit).toHaveBeenCalledWith('SET_DEFAULT_TABLE_FILTERS')
    expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
  })

  it('clearAllFilters and resetState commit reset mutations', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    trainingLibrary.actions.clearAllFilters({ commit, dispatch })
    expect(commit).toHaveBeenCalledWith('RESET_FILTERS')
    expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')

    commit.mockClear()
    trainingLibrary.actions.resetState({ commit })
    expect(commit).toHaveBeenNthCalledWith(1, 'RESET_TABLE_PARAMS')
    expect(commit).toHaveBeenNthCalledWith(2, 'RESET_FILTERS')
  })
})
