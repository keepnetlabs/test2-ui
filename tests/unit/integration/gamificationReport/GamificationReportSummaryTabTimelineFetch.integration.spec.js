/**
 * Gamification kullanıcı çekmecesi — Summary sekmesi `created`
 * → `getUserTimeline(payload)` ile son aktivite önizlemesi (`timelinePreview`).
 */
jest.mock('@/api/reports', () => ({
  getUserTimeline: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import gamificationBadges from '@/store/modules/gamificationBadges'
import GamificationReportUserDetailsDrawerSummaryTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerSummaryTab.vue'
import { getUserTimeline } from '@/api/reports'

const localVue = createLocalVue()
localVue.use(Vuex)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Gamification Report Summary tab timeline fetch (integration)', () => {
  let vuetify
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    store = new Vuex.Store({
      modules: {
        gamificationBadges,
        usersDashboard: {
          namespaced: true,
          state: { language: 'en' },
          getters: {
            getLabels: () => ({
              yourBadgesEarned: 'Earned',
              yourBadgesEarnedOn: (d) => `Earned on ${d}`,
              yourBadgesNotEarnedYet: 'Not earned yet'
            }),
            getLanguage: (s) => s.language
          }
        }
      }
    })
    getUserTimeline.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              ActionType: 'Opened Email',
              ActionTime: '2026-05-01',
              name: 'Campaign A',
              productType: 'PHISHING SIMULATOR - EASY',
              result: 'Delivered'
            }
          ]
        }
      }
    })
  })

  it('loads timeline preview via getUserTimeline on created', async () => {
    const wrapper = mount(GamificationReportUserDetailsDrawerSummaryTab, {
      localVue,
      vuetify,
      store,
      propsData: {
        selectedRow: {
          firstName: 'Ada',
          lastName: 'Test',
          targetUserResourceId: 'tu-gm-sum-tl-1'
        },
        datePayload: {
          datePeriod: 'LAST_30_DAYS',
          startDate: null,
          endDate: null
        },
        overallScore: { percentage: 50, points: 100, rank: 3 },
        productScores: [],
        isPerformanceRatesLoading: false
      },
      stubs: {
        VSkeletonLoader: true,
        VTooltip: true,
        VIcon: true,
        DatatableLoading: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getUserTimeline).toHaveBeenCalledWith(
      expect.objectContaining({
        targetUserResourceId: 'tu-gm-sum-tl-1',
        datePeriod: 'LAST_30_DAYS',
        pagination: expect.objectContaining({
          pageNumber: 1,
          pageSize: 3,
          orderBy: 'ActionTime',
          ascending: false
        })
      })
    )
    expect(wrapper.vm.timelinePreview).toHaveLength(1)
    expect(wrapper.vm.timelinePreview[0]).toEqual(
      expect.objectContaining({
        ActionType: 'Opened Email',
        name: 'Campaign A'
      })
    )
    expect(wrapper.vm.isTimelineLoading).toBe(false)
  })
})
