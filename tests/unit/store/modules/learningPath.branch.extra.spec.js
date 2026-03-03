jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn((payload) => ({
    pageNumber: 1,
    pageSize: payload?.pageSize || 10,
    filter: payload?.filter || {
      Condition: 'AND',
      FilterGroups: [
        { Condition: 'AND', FilterItems: [], FilterGroups: [] },
        { Condition: 'OR', FilterItems: [], FilterGroups: [] }
      ]
    },
    trainingSearchType: payload?.trainingSearchType,
    trainingType: payload?.trainingType,
    trainingId: payload?.trainingId || ''
  }))
}))

jest.mock('@/api/awarenessEducator', () => ({
  searchTraining: jest.fn()
}))

import learningPath from '@/store/modules/learningPath'
import * as AwarenessEducatorService from '@/api/awarenessEducator'

const createState = () => JSON.parse(JSON.stringify(learningPath.state))

describe('learningPath store (branch extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ORDER_LEARNING_PATH_DATA does not update availableFor when payload is null', () => {
    const state = createState()
    state.availableFor = ['CompanyA']
    state.learningPathTableData = [
      { trainingId: 1, availableFor: ['CompanyA'] },
      { trainingId: 2, availableFor: ['CompanyB'] }
    ]

    learningPath.mutations.ORDER_LEARNING_PATH_DATA(state, null)

    expect(state.availableFor).toEqual(['CompanyA'])
  })

  it('ORDER_LEARNING_PATH_DATA keeps available first when both available', () => {
    const state = createState()
    state.availableFor = ['MyCompanyOnly']
    state.learningPathTableData = [
      { trainingId: 1, availableFor: ['MyCompanyOnly'] },
      { trainingId: 2, availableFor: ['MyCompanyOnly'] }
    ]

    learningPath.mutations.ORDER_LEARNING_PATH_DATA(state, ['MyCompanyOnly'])

    expect(state.learningPathTableData[0].trainingId).toBe(1)
    expect(state.learningPathTableData[1].trainingId).toBe(2)
  })

  it('ORDER_LEARNING_PATH_DATA sorts unavailable to end', () => {
    const state = createState()
    state.availableFor = ['MyCompanyOnly']
    state.learningPathTableData = [
      { trainingId: 1, availableFor: ['OtherCompany'] },
      { trainingId: 2, availableFor: ['MyCompanyOnly'] }
    ]

    learningPath.mutations.ORDER_LEARNING_PATH_DATA(state, ['MyCompanyOnly'])

    expect(state.learningPathTableData[0].trainingId).toBe(2)
    expect(state.learningPathTableData[1].trainingId).toBe(1)
  })

  it('RESET_LEARNING_PATH_PAGINATION resets page numbers', () => {
    const state = createState()
    state.learningPathAxiosPayload.pageNumber = 5
    state.learningPathServerSideProps.pageNumber = 5

    learningPath.mutations.RESET_LEARNING_PATH_PAGINATION(state)

    expect(state.learningPathAxiosPayload.pageNumber).toBe(1)
    expect(state.learningPathServerSideProps.pageNumber).toBe(1)
  })

  it('SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD updates axios payload', () => {
    const state = createState()
    learningPath.mutations.SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD(state, {
      ascending: true,
      orderBy: 'trainingName'
    })
    expect(state.learningPathAxiosPayload.ascending).toBe(true)
    expect(state.learningPathAxiosPayload.orderBy).toBe('trainingName')
  })

  it('SET_LEARNING_PATH_FILTER_TO_PAYLOAD handles non-string non-array activeValue', () => {
    const state = createState()
    learningPath.mutations.SET_LEARNING_PATH_FILTER_TO_PAYLOAD(state, {
      key: 'category',
      activeValue: 123,
      activeOperator: '='
    })
    const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
    const item = items.find((f) => f.FieldName === 'category')
    expect(item).toBeDefined()
    expect(item.Value).toBeUndefined()
    expect(item.Operator).toBe('=')
  })

  it('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD removes non-search filter by splice', () => {
    const state = createState()
    state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'category', Value: 'A', Operator: 'Include' }
    ]

    learningPath.mutations.REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, {
      key: 'category',
      filterType: 'select',
      activeValue: 'x'
    })

    expect(state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('SET_LEARNING_PATH_FILTER_TO_PAYLOAD updates existing value', () => {
    const state = createState()
    state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'vendor', Value: 'old', Operator: 'Contains' }
    ]

    learningPath.mutations.SET_LEARNING_PATH_FILTER_TO_PAYLOAD(state, {
      key: 'vendor',
      activeValue: 'new',
      activeOperator: 'Contains'
    })

    expect(state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('new')
  })

  it('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD returns when filter does not exist', () => {
    const state = createState()
    state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = []

    learningPath.mutations.REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, {
      key: 'vendor',
      filterType: 'search',
      activeValue: []
    })

    expect(state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD keeps search filter and updates joined value', () => {
    const state = createState()
    state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'vendor', Value: 'x', Operator: 'Contains' }
    ]

    learningPath.mutations.REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, {
      key: 'vendor',
      filterType: 'search',
      activeValue: ['A', 'B']
    })

    expect(state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('A,B')
  })

  it('callForLearningPathTableData uses selected training ids when available', async () => {
    const state = createState()
    state.selectedLearningPathTrainings = [{ detailTrainingId: 'd-1' }, { trainingId: 't-2' }]
    const commit = jest.fn()

    AwarenessEducatorService.searchTraining.mockResolvedValue({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
    })

    await learningPath.actions.callForLearningPathTableData({ commit, state }, {})

    expect(state.learningPathAxiosPayload.trainingIds).toEqual(['d-1', 't-2'])
    expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_TABLE_DATA', [])
  })

  it('getDataAfterValidScroll does not dispatch when search is active or no next page', () => {
    const dispatch = jest.fn()
    const stateWithSearch = createState()
    stateWithSearch.learningPathSearch = 'abc'
    stateWithSearch.learningPathAxiosPayload.pageNumber = 1
    stateWithSearch.learningPathServerSideProps.totalNumberOfPages = 5

    learningPath.actions.getDataAfterValidScroll({ state: stateWithSearch, dispatch })

    const stateNoNextPage = createState()
    stateNoNextPage.learningPathSearch = ''
    stateNoNextPage.learningPathAxiosPayload.pageNumber = 3
    stateNoNextPage.learningPathServerSideProps.totalNumberOfPages = 3

    learningPath.actions.getDataAfterValidScroll({ state: stateNoNextPage, dispatch })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('learningPathClearAllFilters does not dispatch fetch when isFetch is false', () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    learningPath.actions.learningPathClearAllFilters({ commit, dispatch }, { isFetch: false })
    expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('SET_LEARNING_PATH_FILTER_TO_PAYLOAD pushes >= and <= filters for between operator', () => {
    const state = createState()
    learningPath.mutations.SET_LEARNING_PATH_FILTER_TO_PAYLOAD(state, {
      key: 'dateCreated',
      activeValue: ['2026-01-01', '2026-01-31'],
      activeOperator: 'between'
    })

    const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ FieldName: 'dateCreated', Operator: '>=' }),
        expect.objectContaining({ FieldName: 'dateCreated', Operator: '<=' })
      ])
    )
  })

  it('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD keeps date-between payload unchanged when field is missing', () => {
    const state = createState()
    state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = [
      { FieldName: 'vendor', Value: 'A', Operator: 'Contains' }
    ]

    learningPath.mutations.REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, {
      key: 'dateCreated',
      filterType: 'date',
      activeOperator: 'between'
    })

    expect(state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'vendor', Value: 'A', Operator: 'Contains' }
    ])
  })

  it('callForLearningPathTableData uses selected training ids when both payload and selected exist', async () => {
    const state = createState()
    state.selectedLearningPathTrainings = [{ trainingId: 'selected-1' }]
    const commit = jest.fn()
    AwarenessEducatorService.searchTraining.mockResolvedValue({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 1, pageNumber: 1 } }
    })

    await learningPath.actions.callForLearningPathTableData(
      { commit, state },
      { trainingIds: ['payload-1', 'payload-2'] }
    )

    expect(state.learningPathAxiosPayload.trainingIds).toEqual(['selected-1'])
  })

  it('callForLearningPathTableData uses payload training ids when selected list is empty', async () => {
    const state = createState()
    const commit = jest.fn()
    AwarenessEducatorService.searchTraining.mockResolvedValue({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
    })

    await learningPath.actions.callForLearningPathTableData(
      { commit, state },
      { trainingIds: ['z-1', 'z-2'] }
    )

    expect(state.learningPathAxiosPayload.trainingIds).toEqual(['z-1', 'z-2'])
    expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_TABLE_DATA', [])
  })

  it('callForLearningPathTableData commits append branch when isAppend=true', async () => {
    const state = createState()
    const commit = jest.fn()
    AwarenessEducatorService.searchTraining.mockResolvedValue({
      data: {
        data: {
          results: [{ trainingId: 'append-1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    await learningPath.actions.callForLearningPathTableData(
      { commit, state },
      { isAppend: true }
    )

    expect(commit).toHaveBeenCalledWith('APPEND_LEARNING_PATH_TABLE_DATA', [{ trainingId: 'append-1' }])
    expect(commit).toHaveBeenCalledWith('ORDER_LEARNING_PATH_DATA')
  })

  it('callForLearningPathTrainingLibrary proxies payload to table data action', () => {
    const dispatch = jest.fn()
    learningPath.actions.callForLearningPathTrainingLibrary(
      { dispatch },
      { isAppend: true, trainingIds: ['x'] }
    )
    expect(dispatch).toHaveBeenCalledWith('callForLearningPathTableData', {
      isAppend: true,
      trainingIds: ['x']
    })
  })

  it('getDataAfterValidScroll increments page and dispatches append load', () => {
    const state = createState()
    const dispatch = jest.fn()
    state.learningPathAxiosPayload.pageNumber = 1
    state.learningPathServerSideProps.totalNumberOfPages = 3
    state.learningPathSearch = ''

    learningPath.actions.getDataAfterValidScroll({ state, dispatch })

    expect(state.learningPathAxiosPayload.pageNumber).toBe(2)
    expect(dispatch).toHaveBeenCalledWith('callForLearningPathTrainingLibrary', { isAppend: true })
  })
})
