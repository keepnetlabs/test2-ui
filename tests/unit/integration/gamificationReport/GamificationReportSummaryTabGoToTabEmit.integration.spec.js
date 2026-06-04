/**
 * Gamification Summary sekmesi — kart başlıklarındaki linkler `go-to-tab` ile sekme adı yayınlar.
 */
jest.mock('@/api/reports', () => ({
  getUserTimeline: jest.fn(() =>
    Promise.resolve({
      data: {
        data: { results: [] }
      }
    })
  )
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import gamificationBadges from '@/store/modules/gamificationBadges'
import GamificationReportUserDetailsDrawerSummaryTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerSummaryTab.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Gamification Report Summary tab go-to-tab emit (integration)', () => {
  let vuetify
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
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
  })

  const mountTab = () =>
    mount(GamificationReportUserDetailsDrawerSummaryTab, {
      localVue,
      vuetify,
      store,
      propsData: {
        selectedRow: {
          firstName: 'Ada',
          lastName: 'Test',
          targetUserResourceId: 'tu-gm-sum-gotab-1'
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

  it('emits go-to-tab performanceDetails, badges, activityTimeline from header links', async () => {
    const wrapper = mountTab()

    await flushPromises()
    await wrapper.vm.$nextTick()

    const links = wrapper.findAll('.gamification-report-user-details-summary-tab__link')
    expect(links).toHaveLength(3)

    await links.at(0).trigger('click')
    await links.at(1).trigger('click')
    await links.at(2).trigger('click')

    expect(wrapper.emitted('go-to-tab')).toEqual([
      ['performanceDetails'],
      ['badges'],
      ['activityTimeline']
    ])
  })
})
