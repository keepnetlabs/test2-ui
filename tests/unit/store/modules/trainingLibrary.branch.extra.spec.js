jest.mock('@/utils/functions', () => ({
  cancellableAxiosRequest: jest.fn((fn) => (...args) => fn(...args)),
  createRandomCryptStringNumber: jest.fn(() => '9'),
  getDefaultAxiosPayload: jest.fn((payload) => ({
    pageNumber: 1,
    pageSize: payload?.pageSize || 10,
    ascending: payload?.ascending,
    orderBy: payload?.orderBy,
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
import * as AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES, TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const createState = () => JSON.parse(JSON.stringify(trainingLibrary.state))

describe('trainingLibrary store (branch extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('SET_DEFAULT_TABLE_SETTINGS exits when no localStorage settings', () => {
    const state = createState()
    const before = JSON.stringify(state.tableColumns)
    trainingLibrary.mutations.SET_DEFAULT_TABLE_SETTINGS(state)
    expect(JSON.stringify(state.tableColumns)).toBe(before)
  })

  it('SET_DEFAULT_TABLE_SETTINGS merges default columns when saved renderedColumns is empty', () => {
    const state = createState()
    localStorage.setItem(
      'training-library-columns',
      JSON.stringify({
        renderedColumns: [],
        firstColFixed: false,
        lastColFixed: false
      })
    )
    trainingLibrary.mutations.SET_DEFAULT_TABLE_SETTINGS(state)
    expect(state.renderedColumns.length).toBeGreaterThan(0)
    expect(state.renderedColumns).toEqual(
      expect.arrayContaining(state.tableColumns.map((c) => c.property))
    )
    expect(state.firstColFixed).toBe(false)
    expect(state.lastColFixed).toBe(false)
  })

  it('SET_DEFAULT_TABLE_FILTERS sets default OR condition when localStorage is empty', () => {
    const state = createState()
    state.filterType = 'And'
    state.axiosPayload.filter.FilterGroups[0].Condition = 'AND'

    trainingLibrary.mutations.SET_DEFAULT_TABLE_FILTERS(state)

    expect(state.filterType).toBe('Or')
    expect(state.axiosPayload.filter.FilterGroups[0].Condition).toBe('Or')
  })

  it('SET_DEFAULT_TABLE_FILTERS hydrates saved settings from localStorage', () => {
    const state = createState()
    localStorage.setItem(
      'training-library-filters',
      JSON.stringify({
        filters: state.filters,
        filterOptionsFilters: state.filterOptionsFilters,
        filterType: 'AND',
        sortBy: 'Name - A-Z',
        search: 'abc',
        axiosPayload: state.axiosPayload,
        selectedTrainingContent: 'Favourites',
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.TRAINING
      })
    )

    trainingLibrary.mutations.SET_DEFAULT_TABLE_FILTERS(state)
    jest.advanceTimersByTime(600)

    expect(state.filterType).toBe('AND')
    expect(state.sortBy).toBe('Name - A-Z')
    expect(state.search).toBe('abc')
    expect(state.selectedSubTrainingContent).toBe(TRAINING_LIBRARY_TYPES.TRAINING)
  })

  it('SET_DEFAULT_TABLE_FILTERS merges missing default filters when saved has fewer', () => {
    const state = createState()
    const minimalFilters = [{ key: 'type', text: 'Type', items: [] }]
    localStorage.setItem(
      'training-library-filters',
      JSON.stringify({
        filters: minimalFilters,
        filterOptionsFilters: [],
        filterType: 'Or',
        sortBy: 'Date Created - New to old',
        search: '',
        axiosPayload: state.axiosPayload,
        selectedTrainingContent: 'All Materials',
        selectedSubTrainingContent: 'All Types'
      })
    )

    trainingLibrary.mutations.SET_DEFAULT_TABLE_FILTERS(state)

    expect(state.filters.length).toBeGreaterThan(minimalFilters.length)
    expect(state.filters.some((f) => f.key === 'type')).toBe(true)
  })

  it('SET_FILTER_TO_PAYLOAD maps targetAudience to roles and updates existing filter', () => {
    const state = createState()
    state.axiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'roles', Value: 'Old', Operator: 'Contains' }
    ]
    trainingLibrary.mutations.SET_FILTER_TO_PAYLOAD(state, {
      key: 'targetAudience',
      activeValue: '  Admin ',
      activeOperator: 'Include'
    })

    expect(state.axiosPayload.filter.FilterGroups[0].FilterItems[0]).toEqual({
      FieldName: 'roles',
      Value: 'Admin',
      Operator: 'Include'
    })
  })

  it('SET_SEARCH_TO_PAYLOAD updates existing trainingName filter and pushes when missing', () => {
    const state = createState()
    state.search = 'first'
    state.axiosPayload.filter.FilterGroups[1].FilterItems = []

    trainingLibrary.mutations.SET_SEARCH_TO_PAYLOAD(state)
    expect(state.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'trainingName', Value: 'first', Operator: 'Contains' }
    ])

    state.search = 'second'
    trainingLibrary.mutations.SET_SEARCH_TO_PAYLOAD(state)
    expect(state.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'trainingName', Value: 'second', Operator: 'Contains' }
    ])
  })

  it('REMOVE_FILTER_FROM_PAYLOAD handles search filters for empty and non-empty values', () => {
    const state = createState()
    state.axiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'vendor', Value: 'A,B', Operator: 'Include' }
    ]

    trainingLibrary.mutations.REMOVE_FILTER_FROM_PAYLOAD(state, {
      key: 'vendor',
      filterType: 'search',
      activeValue: ['A']
    })
    expect(state.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('A')

    trainingLibrary.mutations.REMOVE_FILTER_FROM_PAYLOAD(state, {
      key: 'vendor',
      filterType: 'search',
      activeValue: []
    })
    expect(state.axiosPayload.filter.FilterGroups[0].FilterItems).toHaveLength(0)
  })

  it('SET_FILTER_TO_PAYLOAD adds between operator filters', () => {
    const state = createState()
    trainingLibrary.mutations.SET_FILTER_TO_PAYLOAD(state, {
      key: 'dateCreated',
      activeValue: ['2025-01-01', '2025-01-31'],
      activeOperator: 'between'
    })
    const items = state.axiosPayload.filter.FilterGroups[0].FilterItems
    const betweenItems = items.filter((f) => f.FieldName === 'dateCreated')
    expect(betweenItems).toHaveLength(2)
    expect(betweenItems[0].Operator).toBe('>=')
    expect(betweenItems[1].Operator).toBe('<=')
  })

  it('REMOVE_FILTER_FROM_PAYLOAD splices non-search filter', () => {
    const state = createState()
    state.axiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'category', Value: 'A', Operator: 'Include' }
    ]
    trainingLibrary.mutations.REMOVE_FILTER_FROM_PAYLOAD(state, {
      key: 'category',
      filterType: 'select',
      activeValue: 'x'
    })
    expect(state.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('SET_FILTER_TYPE_TO_PAYLOAD updates filter condition', () => {
    const state = createState()
    state.filterType = 'AND'
    trainingLibrary.mutations.SET_FILTER_TYPE_TO_PAYLOAD(state)
    expect(state.axiosPayload.filter.FilterGroups[0].Condition).toBe('AND')
  })

  it('SET_SORT_BY_TO_PAYLOAD updates ascending and orderBy', () => {
    const state = createState()
    trainingLibrary.mutations.SET_SORT_BY_TO_PAYLOAD(state, {
      ascending: true,
      orderBy: 'trainingName'
    })
    expect(state.axiosPayload.ascending).toBe(true)
    expect(state.axiosPayload.orderBy).toBe('trainingName')
  })

  it('RESET_PAGINATION resets page numbers', () => {
    const state = createState()
    state.axiosPayload.pageNumber = 5
    state.serverSideProps.pageNumber = 5
    trainingLibrary.mutations.RESET_PAGINATION(state)
    expect(state.axiosPayload.pageNumber).toBe(1)
    expect(state.serverSideProps.pageNumber).toBe(1)
  })

  it('REMOVE_FILTER_FROM_PAYLOAD removes 2 items for date-between filter', () => {
    const state = createState()
    state.axiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'dateCreated', Value: '2026-01-01', Operator: '>=' },
      { FieldName: 'dateCreated', Value: '2026-01-31', Operator: '<=' },
      { FieldName: 'vendor', Value: 'A', Operator: 'Contains' }
    ]

    trainingLibrary.mutations.REMOVE_FILTER_FROM_PAYLOAD(state, {
      key: 'dateCreated',
      filterType: 'date',
      activeOperator: 'between'
    })

    expect(state.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'vendor', Value: 'A', Operator: 'Contains' }
    ])
  })

  it('SET_TRAINING_TYPE sets null for all types and value for specific type', () => {
    const state = createState()
    trainingLibrary.mutations.SET_TRAINING_TYPE(state, TRAINING_LIBRARY_PAYLOAD_TYPES.ALL_TYPES)
    expect(state.axiosPayload.trainingType).toBe(null)

    trainingLibrary.mutations.SET_TRAINING_TYPE(state, TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
    expect(state.axiosPayload.trainingType).toBe(TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
  })

  it('setListView returns early when payload matches current state', () => {
    const state = createState()
    const commit = jest.fn()
    const dispatch = jest.fn()
    trainingLibrary.actions.setListView({ commit, dispatch, state }, state.isListView)
    expect(commit).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('setSubSelectedTrainingContent returns early when selected item is same', () => {
    const state = createState()
    state.selectedSubTrainingContent = TRAINING_LIBRARY_TYPES.TRAINING
    const commit = jest.fn()
    const dispatch = jest.fn()

    trainingLibrary.actions.setSubSelectedTrainingContent(
      { commit, dispatch, state },
      { name: TRAINING_LIBRARY_TYPES.TRAINING }
    )

    expect(commit).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('callForTableData handles aborted empty response without turning loader off', async () => {
    const state = createState()
    const commit = jest.fn()
    AwarenessEducatorService.searchTraining.mockResolvedValue({})
    await trainingLibrary.actions.callForTableData({ commit, state, rootGetters: {} })
    expect(commit).toHaveBeenCalledWith('SET_IS_LOADING', true)
    expect(commit).not.toHaveBeenCalledWith('SET_IS_LOADING', false)
  })

  it('callForSummary honors hideLoader branch and always finalizes tabs loading', async () => {
    const state = createState()
    const commit = jest.fn()
    AwarenessEducatorService.getTrainingTypeCount.mockResolvedValue({
      data: { data: [] }
    })

    await trainingLibrary.actions.callForSummary({ commit, state }, { hideLoader: true })
    expect(commit).toHaveBeenCalledWith('SET_TABS_LOADING', false)
    expect(commit).toHaveBeenCalledWith('SET_TRAINING_SUB_TABS', expect.any(Array))
  })

  it('restoreDefaultFilters resets when localStorage has no saved filters', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    trainingLibrary.actions.restoreDefaultFilters({ commit, dispatch })
    expect(commit).toHaveBeenCalledWith('RESET_FILTERS')
    expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
  })

  it('setFilterToPayload and removeFilterFromPayload commit reset and reload actions', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const payload = { key: 'vendor', activeValue: ['A'], activeOperator: 'Include' }

    trainingLibrary.actions.setFilterToPayload({ commit, dispatch }, payload)
    expect(commit).toHaveBeenNthCalledWith(1, 'SET_FILTER_TO_PAYLOAD', payload)
    expect(commit).toHaveBeenNthCalledWith(2, 'RESET_PAGINATION')
    expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')

    commit.mockClear()
    dispatch.mockClear()
    trainingLibrary.actions.removeFilterFromPayload({ commit, dispatch }, payload)
    expect(commit).toHaveBeenNthCalledWith(1, 'REMOVE_FILTER_FROM_PAYLOAD', payload)
    expect(commit).toHaveBeenNthCalledWith(2, 'RESET_PAGINATION')
    expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
  })

  it('simple actions commit their target mutations', () => {
    const commit = jest.fn()
    trainingLibrary.actions.setLearningPathSendModal({ commit }, { status: true })
    expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_SEND_MODAL', { status: true })

    commit.mockClear()
    trainingLibrary.actions.setFilterItems({ commit }, { key: 'vendor', items: [{ text: 'A' }] })
    expect(commit).toHaveBeenCalledWith('SET_FILTER_ITEMS', { key: 'vendor', items: [{ text: 'A' }] })

    commit.mockClear()
    trainingLibrary.actions.initDefaultTableFilters({ commit })
    expect(commit).toHaveBeenCalledWith('SET_DEFAULT_TABLE_FILTERS')

    commit.mockClear()
    trainingLibrary.actions.writeFiltersToLocalStorage({ commit })
    expect(commit).toHaveBeenCalledWith('SET_FILTERS_TO_LOCAL_STORAGE')
  })

  it('send modal actions commit correct mutation targets', () => {
    const commit = jest.fn()
    trainingLibrary.actions.setTrainingSendModal({ commit }, { status: true })
    expect(commit).toHaveBeenCalledWith('SET_TRAINING_SEND_MODAL', { status: true })

    commit.mockClear()
    trainingLibrary.actions.setPosterSendModal({ commit }, { status: true })
    expect(commit).toHaveBeenCalledWith('SET_POSTER_SEND_MODAL', { status: true })

    commit.mockClear()
    trainingLibrary.actions.setInfographicSendModal({ commit }, { status: true })
    expect(commit).toHaveBeenCalledWith('SET_INFOGRAPHIC_SEND_MODAL', { status: true })

    commit.mockClear()
    trainingLibrary.actions.setScreensaverSendModal({ commit }, { status: true })
    expect(commit).toHaveBeenCalledWith('SET_SCREENSAVER_SEND_MODAL', { status: true })
  })

  it('SET_FILTER_ITEMS and SET_FILTER_ITEMS_SHOW ignore unknown filter key', () => {
    const state = createState()
    const before = JSON.stringify(state.filters)

    trainingLibrary.mutations.SET_FILTER_ITEMS(state, {
      key: '__unknown__',
      items: [{ text: 'A' }]
    })
    trainingLibrary.mutations.SET_FILTER_ITEMS_SHOW(state, {
      key: '__unknown__',
      show: true
    })

    expect(JSON.stringify(state.filters)).toBe(before)
  })

  it('SET_FILTER_ITEMS does not throw when payload is null', () => {
    const state = createState()
    expect(() => {
      trainingLibrary.mutations.SET_FILTER_ITEMS(state, null)
    }).not.toThrow()
  })

  it('SET_FILTER_ITEMS does not throw when filters array is empty', () => {
    const state = createState()
    state.filters = []
    expect(() => {
      trainingLibrary.mutations.SET_FILTER_ITEMS(state, { key: 'type', items: [{ text: 'A' }] })
    }).not.toThrow()
  })

  it('SET_FILTER_ITEMS_SHOW does not throw when payload is null', () => {
    const state = createState()
    expect(() => {
      trainingLibrary.mutations.SET_FILTER_ITEMS_SHOW(state, null)
    }).not.toThrow()
  })

  it('callForSummary handles aborted empty response without committing tabs data', async () => {
    const state = createState()
    const commit = jest.fn()
    AwarenessEducatorService.getTrainingTypeCount.mockResolvedValue({})

    await trainingLibrary.actions.callForSummary({ commit, state })

    expect(commit).toHaveBeenCalledWith('SET_TABS_LOADING', true)
    expect(commit).not.toHaveBeenCalledWith('SET_TRAINING_SUB_TABS', expect.anything())
  })

  it('delegating actions call expected downstream actions/mutations', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()

    trainingLibrary.actions.callForTrainingLibrary({ dispatch })
    expect(dispatch).toHaveBeenCalledWith('callForSummary')
    expect(dispatch).toHaveBeenCalledWith('callForTableData')

    dispatch.mockClear()
    trainingLibrary.actions.setSearch({ commit, dispatch }, 'abc')
    expect(commit).toHaveBeenNthCalledWith(1, 'SET_SEARCH', 'abc')
    expect(commit).toHaveBeenNthCalledWith(2, 'SET_SEARCH_TO_PAYLOAD')
    expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')

    commit.mockClear()
    trainingLibrary.actions.setChangeVisibilityOfColumn({ commit })
    expect(commit).toHaveBeenNthCalledWith(1, 'SET_RENDERED_COLUMNS')
    expect(commit).toHaveBeenNthCalledWith(2, 'SET_TABLE_SETTINGS_CHANGE')

    commit.mockClear()
    trainingLibrary.actions.setColFixedChange(
      { commit },
      { key: 'firstColFixed', value: false }
    )
    expect(commit).toHaveBeenNthCalledWith(1, 'SET_FIXED_COL', {
      key: 'firstColFixed',
      value: false
    })
    expect(commit).toHaveBeenNthCalledWith(2, 'SET_TABLE_SETTINGS_CHANGE')
  })
})
