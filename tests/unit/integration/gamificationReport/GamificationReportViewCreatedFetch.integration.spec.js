/**
 * Gamification Leaderboard görünümü `created`
 * → `getLeaderboardData`, `getTopPerformersData`, `getLeaderboardFormDetails`, `LookupLocalStorage.getSingle(21)`.
 * Satırlarda `targetUserResourceId` varsa `gamificationBadges/fetchBadgesForTable`.
 */
jest.mock('@/api/reports', () => ({
  getLeaderboardData: jest.fn(),
  getTopPerformersData: jest.fn(),
  getLeaderboardFormDetails: jest.fn(),
  exportLeaderboardData: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() => Promise.resolve([]))
  }
}))

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import GamificationReport from '@/views/GamificationReport.vue'
import {
  getLeaderboardData,
  getTopPerformersData,
  getLeaderboardFormDetails
} from '@/api/reports'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

const localVue = createLocalVue()
localVue.use(Vuex)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Gamification Report view created fetch (integration)', () => {
  let store
  let fetchBadgesForTable

  beforeEach(() => {
    jest.clearAllMocks()
    fetchBadgesForTable = jest.fn().mockResolvedValue(undefined)

    store = new Vuex.Store({
      modules: {
        permissions: {
          namespaced: true,
          getters: {
            getGamificationReportSearchPermissions: () => true,
            getGamificationReportTopPerformersPermissions: () => true,
            getGamificationReportFormDetailsPermissions: () => true
          }
        },
        gamificationBadges: {
          namespaced: true,
          state: { badgesByUserId: {} },
          getters: {
            getBadgesForUser: () => () => [],
            hasValidCache: () => () => false,
            isCalculating: () => false,
            isFetching: () => false
          },
          actions: {
            fetchBadgesForTable
          }
        },
        login: {
          namespaced: true,
          getters: {
            getHasAgenticAILicense: () => false,
            getAgenticAIEnabled: () => false,
            getAgenticAIExecutionMode: () => 'Autonomous'
          }
        }
      }
    })

    getLeaderboardData.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              firstName: 'Top',
              lastName: 'User',
              targetUserResourceId: 'tu-gm-view-lb-1',
              performance: 88,
              rank: 1
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    getTopPerformersData.mockResolvedValue({
      data: { data: { results: [{ firstName: 'Gold', rank: 1 }] } }
    })
    getLeaderboardFormDetails.mockResolvedValue({
      data: { data: { gamificationActionTypes: [], gamificationProductTypes: [] } }
    })
  })

  const momentMock = () => ({
    subtract: () => ({ format: () => '2026-04-01 00:00:00' }),
    format: () => '2026-05-01 00:00:00'
  })

  it('loads leaderboard, top performers, form details, languages lookup; dispatches badges', async () => {
    shallowMount(GamificationReport, {
      localVue,
      store,
      mocks: {
        $moment: momentMock
      },
      stubs: {
        Fragment: true,
        KContainer: { template: '<div><slot /></div>' },
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CompanySettingsHeader: true,
        LeaderboardTopPerformerCard: true,
        LeaderboardTopPerformerCardSkeleton: true,
        InputDate: true,
        GamificationReportUserDetailsDrawer: true,
        SendWithAIDialog: true,
        LeaderboardBadgesColumn: true
      }
    })

    await flushPromises()
    await flushPromises()

    expect(getLeaderboardData).toHaveBeenCalled()
    expect(getTopPerformersData).toHaveBeenCalled()
    expect(getLeaderboardFormDetails).toHaveBeenCalled()
    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)

    expect(fetchBadgesForTable).toHaveBeenCalledWith(
      expect.any(Object),
      ['tu-gm-view-lb-1']
    )
  })
})
