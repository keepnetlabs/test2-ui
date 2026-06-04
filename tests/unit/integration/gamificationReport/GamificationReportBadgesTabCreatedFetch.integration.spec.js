/**
 * Gamification kullanıcı çekmecesi — Badges sekmesi `created`
 * → `gamificationBadges/fetchBadgesForTable` → `calculateGamificationBadges` + 5s gecikme + `getGamificationBadgesCached`.
 */
jest.mock('@/api/reports', () => ({
  calculateGamificationBadges: jest.fn(() => Promise.resolve()),
  getGamificationBadgesCached: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import gamificationBadges from '@/store/modules/gamificationBadges'
import GamificationReportUserDetailsDrawerBadgesTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerBadgesTab.vue'
import { calculateGamificationBadges, getGamificationBadgesCached } from '@/api/reports'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Gamification Report Badges tab created fetch (integration)', () => {
  let vuetify
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getGamificationBadgesCached.mockResolvedValue({
      data: {
        data: [
          {
            badgeName: 'Integration Badge',
            earned: true,
            level: 1,
            badgeType: 'Training',
            earnedDate: '2026-05-01T00:00:00Z'
          }
        ]
      }
    })
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

  it('dispatches badge pipeline and loads badges after calculate delay', async () => {
    jest.useFakeTimers()
    mount(GamificationReportUserDetailsDrawerBadgesTab, {
      localVue,
      vuetify,
      store,
      propsData: {
        selectedRow: {
          firstName: 'Ada',
          lastName: 'Test',
          targetUserResourceId: 'tu-gm-badges-1'
        }
      },
      stubs: {
        ElTabs: { name: 'ElTabs', template: '<div class="el-tabs"><slot /></div>' },
        ElTabPane: { name: 'ElTabPane', template: '<div class="el-tab-pane"><slot /></div>' },
        VSkeletonLoader: true,
        VTooltip: {
          name: 'VTooltip',
          template: '<div><slot name="activator" :on="{}" :attrs="{}" /><slot /></div>'
        },
        VIcon: true
      }
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(calculateGamificationBadges).toHaveBeenCalledWith({
      targetUserResourceIds: ['tu-gm-badges-1']
    })

    jest.advanceTimersByTime(5000)
    await Promise.resolve()
    await Promise.resolve()

    expect(getGamificationBadgesCached).toHaveBeenCalledWith('tu-gm-badges-1')

    const cached = store.state.gamificationBadges.badgesByUserId['tu-gm-badges-1']
    expect(cached?.badges).toHaveLength(1)
    expect(cached.badges[0]).toEqual(
      expect.objectContaining({
        badgeName: 'Integration Badge',
        earned: true,
        level: 1
      })
    )

    jest.useRealTimers()
  })
})
