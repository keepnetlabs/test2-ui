jest.mock('@/api/investigations', () => ({
  cancelInvestigation: jest.fn().mockResolvedValue({}),
  deleteInvestigationDetailsItem: jest.fn().mockResolvedValue({}),
  getInvestigationDetailsDataFunction: jest.fn().mockResolvedValue({ data: { data: { id: 1 } } }),
  getStatsAndMenuDataFunction: jest.fn().mockResolvedValue({ data: { data: { stats: {} } } }),
  getTargetUsers: jest.fn().mockResolvedValue({ data: { data: [{ id: 2 }] } }),
  investigationDetailsListFunction: jest.fn(),
  investigationDetailsTargetUsersListFunction: jest
    .fn()
    .mockResolvedValue({ data: { data: { results: [{ id: 3 }] } } }),
  investigationList: jest.fn().mockResolvedValue({ data: { data: { results: [] } } }),
  irSummary: jest.fn().mockResolvedValue({ data: { data: { total: 1 } } }),
  saveNewInvestigation: jest.fn().mockResolvedValue({ data: { id: 9 } }),
  sendInvestigationWarningMessage: jest.fn().mockResolvedValue({})
}))

import investigations from '@/store/modules/investigations'
import {
  cancelInvestigation,
  deleteInvestigationDetailsItem,
  getInvestigationDetailsDataFunction,
  getStatsAndMenuDataFunction,
  getTargetUsers,
  investigationDetailsListFunction,
  investigationDetailsTargetUsersListFunction,
  investigationList,
  irSummary,
  saveNewInvestigation,
  sendInvestigationWarningMessage
} from '@/api/investigations'

describe('investigations store (actions extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getInvestigationDetailsListData commits fallback payload when api fails', async () => {
    investigationDetailsListFunction.mockRejectedValueOnce(new Error('network'))
    const commit = jest.fn()

    const result = await investigations.actions.getInvestigationDetailsListData(
      { commit, dispatch: jest.fn() },
      { id: 5, data: {} }
    )

    expect(result).toBeUndefined()
    expect(commit).toHaveBeenCalledWith(
      'SET_INVESTIGATIONDETAILSLISTDATA',
      expect.objectContaining({
        data: expect.objectContaining({ results: [] })
      })
    )
  })

  it('getInvestigationDetailsListData returns undefined when id is missing', async () => {
    const commit = jest.fn()
    const result = await investigations.actions.getInvestigationDetailsListData(
      { commit, dispatch: jest.fn() },
      { data: {} }
    )
    expect(result).toBeUndefined()
    expect(commit).not.toHaveBeenCalled()
  })

  it('getInvestigationDetailsData skips api when id is missing', async () => {
    const commit = jest.fn()
    await investigations.actions.getInvestigationDetailsData(
      { commit, dispatch: jest.fn() },
      null
    )
    expect(getInvestigationDetailsDataFunction).not.toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
  })

  it('setWidgetsLoading commits loading flag', () => {
    const commit = jest.fn()
    investigations.actions.setWidgetsLoading({ commit }, false)
    expect(commit).toHaveBeenCalledWith('SET_WIDGETS_LOADING', false)
  })

  it('deleteInvestigationDetailsItem calls api with data and id', async () => {
    await investigations.actions.deleteInvestigationDetailsItem(
      { commit: jest.fn(), dispatch: jest.fn() },
      { data: { ids: [1] }, id: 12 }
    )
    expect(deleteInvestigationDetailsItem).toHaveBeenCalledWith({ ids: [1] }, 12)
  })

  it('sendInvestigationWarningMessage calls api with data and id', async () => {
    await investigations.actions.sendInvestigationWarningMessage(
      { commit: jest.fn(), dispatch: jest.fn() },
      { data: { message: 'warn' }, id: 42 }
    )
    expect(sendInvestigationWarningMessage).toHaveBeenCalledWith({ message: 'warn' }, 42)
  })

  it('cancelInvestigation forwards id to api', async () => {
    await investigations.actions.cancelInvestigation(
      { commit: jest.fn(), dispatch: jest.fn() },
      77
    )
    expect(cancelInvestigation).toHaveBeenCalledWith(77)
  })

  it('getInvestigationDetailsTargetUsersListData commits response data and returns response', async () => {
    const commit = jest.fn()
    const response = await investigations.actions.getInvestigationDetailsTargetUsersListData(
      { commit, dispatch: jest.fn() },
      { data: { pageNumber: 1 }, id: 3 }
    )
    expect(investigationDetailsTargetUsersListFunction).toHaveBeenCalledWith({ pageNumber: 1 }, 3)
    expect(commit).toHaveBeenCalledWith(
      'SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA',
      expect.objectContaining({ data: expect.anything() })
    )
    expect(response).toEqual(expect.objectContaining({ data: expect.anything() }))
  })

  it('getInvestigationDetailsData commits api payload when id exists', async () => {
    const commit = jest.fn()
    await investigations.actions.getInvestigationDetailsData(
      { commit, dispatch: jest.fn() },
      9
    )
    expect(getInvestigationDetailsDataFunction).toHaveBeenCalledWith(9)
    expect(commit).toHaveBeenCalledWith(
      'SET_INVESTIGATIONDETAILSDATA',
      expect.objectContaining({ data: expect.anything() })
    )
  })

  it('getStatsAndMenuData commits stats payload', async () => {
    const commit = jest.fn()
    await investigations.actions.getStatsAndMenuData(
      { commit, dispatch: jest.fn() },
      11
    )
    expect(getStatsAndMenuDataFunction).toHaveBeenCalledWith(11)
    expect(commit).toHaveBeenCalledWith(
      'SET_STATSANDMENUDATA',
      expect.objectContaining({ data: expect.anything() })
    )
  })

  it('getInvestigationList commits transformed list response and returns response', async () => {
    const commit = jest.fn()
    const response = await investigations.actions.getInvestigationList(
      { commit, dispatch: jest.fn() },
      { pageNumber: 2 }
    )
    expect(investigationList).toHaveBeenCalledWith({ pageNumber: 2 })
    expect(commit).toHaveBeenCalledWith('SET_INVESTIGATIONLIST', expect.anything())
    expect(response).toEqual(expect.objectContaining({ data: expect.anything() }))
  })

  it('getIrSummary toggles widget loading and commits summary even when payload is empty', async () => {
    irSummary.mockResolvedValueOnce({ data: {} })
    const commit = jest.fn()
    const dispatch = jest.fn()
    await investigations.actions.getIrSummary({ commit, dispatch }, { id: 5 })
    expect(dispatch).toHaveBeenNthCalledWith(1, 'setWidgetsLoading', true)
    expect(commit).toHaveBeenCalledWith('SET_IRSUMMARY', {})
    expect(dispatch).toHaveBeenNthCalledWith(2, 'setWidgetsLoading', false)
  })

  it('getTargetUsersList commits target users result', async () => {
    const commit = jest.fn()
    await investigations.actions.getTargetUsersList({ commit })
    expect(getTargetUsers).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('SET_TARGETUSERSLIST', expect.anything())
  })

  it('createInvestigation resolves response from api', async () => {
    const response = await investigations.actions.createInvestigation(
      { commit: jest.fn(), dispatch: jest.fn() },
      { title: 'Investigation A' }
    )
    expect(saveNewInvestigation).toHaveBeenCalledWith({ title: 'Investigation A' })
    expect(response).toEqual(expect.objectContaining({ data: expect.anything() }))
  })
})
