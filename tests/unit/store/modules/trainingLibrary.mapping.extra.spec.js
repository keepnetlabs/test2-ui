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

  it('SET_LIST_VIEW toggles page size for list and grid views', () => {
    const state = createState()
    state.isListView = false
    state.serverSideProps.pageSize = 9
    state.axiosPayload.pageSize = 9

    trainingLibrary.mutations.SET_LIST_VIEW(state, true)
    expect(state.isListView).toBe(true)
    expect(state.serverSideProps.pageSize).toBe(10)
    expect(state.axiosPayload.pageSize).toBe(10)

    trainingLibrary.mutations.SET_LIST_VIEW(state, false)
    expect(state.isListView).toBe(false)
    expect(state.serverSideProps.pageSize).toBe(9)
    expect(state.axiosPayload.pageSize).toBe(9)
  })

  it('SET_DEFAULT_TABLE_SETTINGS hydrates rendered columns and fixed flags from localStorage', () => {
    const state = createState()
    localStorage.setItem(
      'training-library-columns',
      JSON.stringify({
        renderedColumns: ['type', 'category'],
        firstColFixed: true,
        lastColFixed: false
      })
    )

    trainingLibrary.mutations.SET_DEFAULT_TABLE_SETTINGS(state)

    expect(state.renderedColumns).toEqual(['type', 'category'])
    expect(state.firstColFixed).toBe(true)
    expect(state.lastColFixed).toBe(false)
  })

  it('setSortBy commits sort mapping and dispatches table data reload', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    trainingLibrary.actions.setSortBy(
      { commit, dispatch },
      {
        item: { text: 'Name', orderBy: 'name' },
        sort: { text: 'A-Z', ascending: true }
      }
    )

    expect(commit).toHaveBeenNthCalledWith(1, 'SET_SORT_BY', 'Name - A-Z')
    expect(commit).toHaveBeenNthCalledWith(2, 'SET_SORT_BY_TO_PAYLOAD', {
      ascending: true,
      orderBy: 'name'
    })
    expect(dispatch).toHaveBeenCalledWith('callForTableData')
  })

  it('setFilterType commits payload condition changes and reloads table', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    trainingLibrary.actions.setFilterType({ commit, dispatch }, 'AND')

    expect(commit).toHaveBeenNthCalledWith(1, 'SET_FILTER_TYPE', 'AND')
    expect(commit).toHaveBeenNthCalledWith(2, 'SET_FILTER_TYPE_TO_PAYLOAD')
    expect(commit).toHaveBeenNthCalledWith(3, 'RESET_PAGINATION')
    expect(dispatch).toHaveBeenCalledWith('callForTableData')
  })

  it('setNewLearningPathModal dispatches reset when status is false', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    trainingLibrary.actions.setNewLearningPathModal(
      { commit, dispatch },
      { status: false }
    )

    expect(commit).toHaveBeenCalledWith('SET_NEW_LEARNING_PATH_MODAL', { status: false })
    expect(dispatch).toHaveBeenCalledWith(
      'learningPath/resetSelectedLearningPathTrainings',
      undefined,
      { root: true }
    )
  })
})
