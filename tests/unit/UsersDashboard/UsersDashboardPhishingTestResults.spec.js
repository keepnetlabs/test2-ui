import { shallowMount } from '@vue/test-utils'
import UsersDashboardPhishingTestResults from '@/components/UsersDashboard/UsersDashboardPhishingTestResults.vue'

describe('UsersDashboardPhishingTestResults.vue', () => {
  const labels = {
    phishingTestResultsTitle: 'Phishing Test Results',
    phishingTestResultsSubtitle: 'Subtitle',
    phishingTestResultsReportedPhishingEmails: 'Reported',
    phishingTestResultsPhishingSimulations: 'Simulations',
    phishingTestResultsDetectionAccuracy: 'Detection Accuracy',
    phishingTestResultsSuccessRate: 'Success Rate',
    phishingTestResultsEarnedPoints: (v) => `+${v}`,
    phishingTestResultsLostPoints: (v) => `-${v}`,
    phishingTestResultsAccuracyUp: (v) => `${v}% up`
  }

  const createWrapper = (getterOverrides = {}) => {
    const dispatch = jest.fn()
    const wrapper = shallowMount(UsersDashboardPhishingTestResults, {
      stubs: {
        VCard: true,
        VCardText: true,
        VRow: true,
        VCol: true,
        'v-skeleton-loader': true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getPhishingResult': null,
            'usersDashboard/getPhishingResultLoading': false,
            ...getterOverrides
          },
          dispatch
        }
      }
    })

    return { wrapper, dispatch }
  }

  it('renders and has expected component name', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardPhishingTestResults')
  })

  it('dispatches fetchPhishingResult on created', () => {
    const { dispatch } = createWrapper()
    expect(dispatch).toHaveBeenCalledWith('usersDashboard/fetchPhishingResult', '4BCeEWHwAKME')
  })

  it('returns default phishingData when phishingResult is missing', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.vm.phishingData).toEqual({
      reportedPhishingEmails: 0,
      totalPhishingEmails: 0,
      phishingSimulations: 0,
      totalSimulations: 0,
      detectionAccuracy: 0,
      earnedPoints: 0,
      lostPoints: 0,
      accuracyIncrease: 0
    })
  })

  it('maps phishingResult into phishingData correctly', () => {
    const { wrapper } = createWrapper({
      'usersDashboard/getPhishingResult': {
        last30Days: {
          totalCount: 20,
          reportedCount: 8,
          earnedPoints: 40,
          missedPoints: 12
        },
        successRate: 75,
        accuracyChangePercentage: 9
      }
    })

    expect(wrapper.vm.phishingData).toEqual({
      reportedPhishingEmails: 8,
      totalPhishingEmails: 20,
      phishingSimulations: 12,
      totalSimulations: 20,
      detectionAccuracy: 75,
      earnedPoints: 40,
      lostPoints: 12,
      accuracyIncrease: 9
    })
  })
})
