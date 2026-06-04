/**
 * Gamification phishing aktivite kartları
 * `targetUserResourceId` immediate watch → `getGamificationPhishingResult(targetUserResourceId)`.
 */
jest.mock('@/api/reports', () => ({
  getGamificationPhishingResult: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import GamificationReportPhishingActivityResults from '@/components/GamificationReport/GamificationReportPhishingActivityResults.vue'
import { getGamificationPhishingResult } from '@/api/reports'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Gamification Report Phishing Activity Results mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getGamificationPhishingResult.mockResolvedValue({
      data: {
        data: {
          last30Days: {
            reportedCount: 4,
            totalCount: 10,
            earnedPoints: 12,
            missedPoints: 3
          },
          successRate: 75,
          accuracyChangePercentage: 2
        }
      }
    })
  })

  it('loads phishing metrics via getGamificationPhishingResult', async () => {
    const wrapper = mount(GamificationReportPhishingActivityResults, {
      localVue,
      vuetify,
      propsData: {
        selectedRow: {
          firstName: 'Bob',
          lastName: 'User',
          resourceId: 'tu-gm-phish-1'
        }
      },
      stubs: {
        VSkeletonLoader: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getGamificationPhishingResult).toHaveBeenCalledWith('tu-gm-phish-1')
    expect(wrapper.vm.phishingData).toEqual(
      expect.objectContaining({
        reportedPhishingEmails: 4,
        totalPhishingEmails: 10,
        detectionAccuracy: 75
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
