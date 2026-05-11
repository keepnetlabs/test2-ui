/**
 * Gamification Leaderboard dışa aktarma
 * → `exportLeaderboardData(payload)` + indirme linki (`URL.createObjectURL`).
 */
jest.mock('@/api/reports', () => ({
  getLeaderboardData: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  getTopPerformersData: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] } } })
  ),
  getLeaderboardFormDetails: jest.fn(() =>
    Promise.resolve({ data: { data: {} } })
  ),
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
import { exportLeaderboardData } from '@/api/reports'

const localVue = createLocalVue()
localVue.use(Vuex)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const buildStore = () =>
  new Vuex.Store({
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
          fetchBadgesForTable: jest.fn().mockResolvedValue()
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

const momentMock = () => ({
  subtract: () => ({ format: () => '2026-04-01 00:00:00' }),
  format: () => '2026-05-01 00:00:00'
})

const viewStubs = {
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

describe('Gamification Report view export leaderboard (integration)', () => {
  let store
  let origCreateObjectURL
  let origRevokeObjectURL

  beforeEach(() => {
    jest.clearAllMocks()
    store = buildStore()
    origCreateObjectURL = globalThis.URL.createObjectURL
    origRevokeObjectURL = globalThis.URL.revokeObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-leaderboard')
    globalThis.URL.revokeObjectURL = jest.fn()
    exportLeaderboardData.mockResolvedValue({
      data: new Blob(['x'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    })
  })

  afterEach(() => {
    globalThis.URL.createObjectURL = origCreateObjectURL
    globalThis.URL.revokeObjectURL = origRevokeObjectURL
  })

  it('exportLeaderboard maps XLS to Excel and triggers download flow', async () => {
    const createElementSpy = jest.spyOn(document, 'createElement')

    const wrapper = shallowMount(GamificationReport, {
      localVue,
      store,
      mocks: { $moment: momentMock },
      stubs: viewStubs
    })

    await flushPromises()
    await flushPromises()

    wrapper.vm.exportLeaderboard({
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(exportLeaderboardData).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        reportAllPages: false,
        pagination: expect.objectContaining({
          pageNumber: 1,
          pageSize: 10
        })
      })
    )
    expect(createElementSpy).toHaveBeenCalledWith('a')
    createElementSpy.mockRestore()
  })
})
