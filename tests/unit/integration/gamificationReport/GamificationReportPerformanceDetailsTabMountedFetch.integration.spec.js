/**
 * Gamification kullanıcı çekmecesi — Performance Details sekmesi
 * `targetUserResourceId` immediate watch → `getLearningEnrollments(targetUserResourceId, payload)`.
 */
jest.mock('@/api/reports', () => ({
  getLearningEnrollments: jest.fn(),
  getGamificationPhishingResult: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import GamificationReportUserDetailsDrawerPerformanceDetailsTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerPerformanceDetailsTab.vue'
import { getLearningEnrollments } from '@/api/reports'

const localVue = createLocalVue()
localVue.use(Vuex)
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Gamification Report Performance Details tab mounted fetch (integration)', () => {
  let vuetify
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    store = new Vuex.Store({
      modules: {
        usersDashboard: {
          namespaced: true,
          getters: {
            getLabels: () => ({ yourLearningMaxPoints: '(max)' })
          }
        }
      }
    })
    getLearningEnrollments.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              enrollmentId: 'en-gm-1',
              enrollmentName: 'Security 101',
              trainingName: 'Phishing basics',
              status: 'Completed',
              points: 10,
              isMaxPoints: false
            }
          ]
        }
      }
    })
  })

  it('loads training overview rows via getLearningEnrollments', async () => {
    const wrapper = mount(GamificationReportUserDetailsDrawerPerformanceDetailsTab, {
      localVue,
      vuetify,
      store,
      propsData: {
        selectedRow: {
          firstName: 'Ada',
          lastName: 'Test',
          targetUserResourceId: 'tu-gm-perf-1'
        }
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        GamificationReportPhishingActivityResults: true,
        Badge: true,
        VTooltip: true,
        VBtn: true,
        VIcon: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getLearningEnrollments).toHaveBeenCalledWith(
      'tu-gm-perf-1',
      expect.objectContaining({
        pagination: expect.objectContaining({
          pageNumber: 1,
          pageSize: 1000,
          orderBy: 'StartDate',
          ascending: false
        })
      })
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        enrollmentId: 'en-gm-1',
        enrollmentName: 'Security 101',
        trainingName: 'Phishing basics',
        status: 'Completed',
        points: 10
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
