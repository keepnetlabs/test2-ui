/**
 * Gamification kullanıcı detay çekmecesi `created`
 * → `getUserPerformanceRates`, `common/getTimezone` (boş saat dilimi listesi),
 * `gamificationBadges/fetchBadgesForTable`. Timeline bu aşamada çağrılmaz (sekme Summary).
 */
jest.mock('@/api/reports', () => ({
  getUserPerformanceRates: jest.fn(),
  getUserTimeline: jest.fn(),
  exportUserActivityDetails: jest.fn()
}))

import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import GamificationReportUserDetailsDrawer from '@/components/GamificationReport/GamificationReportUserDetailsDrawer.vue'
import { getUserPerformanceRates, getUserTimeline } from '@/api/reports'

const localVue = createLocalVue()
localVue.use(Vuex)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Gamification Report User Details drawer created fetch (integration)', () => {
  let store
  let fetchBadgesForTable
  let getTimezone

  beforeEach(() => {
    jest.clearAllMocks()
    fetchBadgesForTable = jest.fn().mockResolvedValue(undefined)
    getTimezone = jest.fn().mockResolvedValue(undefined)

    store = new Vuex.Store({
      modules: {
        common: {
          namespaced: true,
          state: {
            downloadModalStatus: false,
            timezones: {}
          },
          getters: {
            getDownloadModalStatus: (s) => s.downloadModalStatus,
            getTimezones: (s) => s.timezones
          },
          actions: {
            getTimezone
          }
        },
        gamificationBadges: {
          namespaced: true,
          actions: {
            fetchBadgesForTable
          }
        }
      }
    })

    getUserPerformanceRates.mockResolvedValue({
      data: {
        data: [
          {
            performance: 72,
            phishingType: 'PHISHING SIMULATOR - EASY',
            totalPerformance: 72,
            totalPoints: 150,
            rank: 4
          }
        ],
        rank: 4
      }
    })
  })

  const mountDrawer = () =>
    shallowMount(GamificationReportUserDetailsDrawer, {
      localVue,
      store,
      propsData: {
        status: true,
        selectedRow: {
          firstName: 'Ada',
          lastName: 'Test',
          targetUserResourceId: 'tu-gm-drawer-created-1',
          email: 'ada@test.local'
        },
        datePayload: {
          datePeriod: 'CUSTOM',
          startDate: '2026-01-01',
          endDate: '2026-05-01'
        },
        formDetails: {
          gamificationActionTypes: [],
          gamificationProductTypes: [],
          gamificationScenarioDifficultyTypes: []
        }
      },
      stubs: {
        Fragment: true,
        DownloadModal: true,
        VNavigationDrawer: { template: '<div class="drawer-stub"><slot /></div>' },
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VListItemSubtitle: true,
        VMenu: true,
        VIcon: true,
        VTextField: true,
        VCheckbox: true,
        VBtn: true,
        VTooltip: true,
        VHover: true,
        VTimeline: true,
        VTimelineItem: true,
        ElTabs: true,
        ElTabPane: true,
        DatatableLoading: true,
        TrainingLibrarySearchFilter: true,
        GamificationReportUserDetailsDrawerFilterBadge: true,
        GamificationReportUserDetailsDrawerSummaryTab: true,
        GamificationReportUserDetailsDrawerPerformanceDetailsTab: true,
        GamificationReportUserDetailsDrawerBadgesTab: true
      },
      directives: { 'click-outside': {} }
    })

  it('loads performance rates, prefetches timezones, dispatches badges; skips timeline', async () => {
    const wrapper = mountDrawer()
    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getUserPerformanceRates).toHaveBeenCalledWith(
      expect.objectContaining({
        targetUserResourceId: 'tu-gm-drawer-created-1',
        datePeriod: 'CUSTOM',
        startDate: '2026-01-01',
        endDate: '2026-05-01'
      })
    )
    expect(getUserTimeline).not.toHaveBeenCalled()
    expect(getTimezone).toHaveBeenCalled()
    expect(fetchBadgesForTable).toHaveBeenCalledWith(
      expect.any(Object),
      ['tu-gm-drawer-created-1']
    )

    expect(wrapper.vm.isPerformanceRatesLoading).toBe(false)
    expect(wrapper.vm.productScores).toHaveLength(1)
    expect(wrapper.vm.productScores[0]).toEqual(
      expect.objectContaining({
        percentage: '72%',
        product: 'PHISHING SIMULATOR - EASY',
        totalPerformance: 72,
        totalPoints: 150
      })
    )
    expect(wrapper.vm.overallScore).toEqual(
      expect.objectContaining({
        points: 150,
        percentage: 72,
        rank: 4
      })
    )
  })
})
