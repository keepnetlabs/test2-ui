jest.mock('@/api/investigations', () => ({
  cancelInvestigation: jest.fn(),
  deleteInvestigationDetailsItem: jest.fn(),
  getInvestigationDetailsDataFunction: jest.fn(),
  getStatsAndMenuDataFunction: jest.fn(),
  getTargetUsers: jest.fn(),
  investigationDetailsListFunction: jest.fn(),
  investigationDetailsTargetUsersListFunction: jest.fn(),
  investigationList: jest.fn(),
  irSummary: jest.fn(),
  saveNewInvestigation: jest.fn(),
  sendInvestigationWarningMessage: jest.fn()
}))

import investigations from '@/store/modules/investigations'

const createState = () => JSON.parse(JSON.stringify(investigations.state))

describe('investigations store module (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('mutations branch coverage', () => {
    it('SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA handles null payload', () => {
      const state = createState()
      investigations.mutations.SET_INVESTIGATION_DETAILS_TARGET_USERS_LIST_DATA(state, null)
      expect(state.getInvestigationDetailsTargetUsersListData).toEqual({ results: [] })
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA handles payload with empty results', () => {
      const state = createState()
      investigations.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, {
        data: { results: [] }
      })
      expect(state.getInvestigationDetailsListData).toEqual({ results: [] })
    })

    it('SET_INVESTIGATIONDETAILSLISTDATA maps BodyUrl to BodyDomain in filterTags', () => {
      const state = createState()
      investigations.mutations.SET_INVESTIGATIONDETAILSLISTDATA(state, {
        data: {
          results: [
            {
              id: 1,
              filterTags: ['BodyUrl', 'Other']
            }
          ]
        }
      })
      expect(state.getInvestigationDetailsListData.results[0].filterTags).toEqual([
        'BodyDomain',
        'Other'
      ])
    })

    it('SET_INVESTIGATIONLIST handles null payload', () => {
      const state = createState()
      investigations.mutations.SET_INVESTIGATIONLIST(state, null)
      expect(state.investigationList).toEqual({
        totalNumberOfRecords: undefined,
        data: undefined
      })
    })

    it('SET_INVESTIGATIONLIST maps userStatus and scanStatusText', () => {
      const state = createState()
      investigations.mutations.SET_INVESTIGATIONLIST(state, {
        data: {
          results: [
            {
              id: 1,
              completedUsersCount: 5,
              scannedUsersCount: 10
            }
          ],
          totalNumberOfRecords: 1
        }
      })
      expect(state.investigationList.data[0].userStatus).toEqual([5, 5])
      expect(state.investigationList.data[0].scanStatusText).toBe('5 / 10')
    })

    it('SET_INVESTIGATIONDETAILSDATA handles null', () => {
      const state = createState()
      investigations.mutations.SET_INVESTIGATIONDETAILSDATA(state, null)
      expect(state.getInvestigationDetailsData).toBeUndefined()
    })

    it('SET_STATSANDMENUDATA handles null', () => {
      const state = createState()
      investigations.mutations.SET_STATSANDMENUDATA(state, null)
      expect(state.getStatsAndMenuData).toBeUndefined()
    })
  })

  describe('getters', () => {
    it('returns state values', () => {
      const state = createState()
      state.investigationList = [{ id: 1 }]
      state.targetUsersList = [{ id: 2 }]
      expect(investigations.getters.investigationListGetter(state)).toEqual([{ id: 1 }])
      expect(investigations.getters.getTargetUsersListGetter(state)).toEqual([{ id: 2 }])
    })
  })
})
