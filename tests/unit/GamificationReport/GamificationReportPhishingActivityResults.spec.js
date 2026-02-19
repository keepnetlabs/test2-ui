import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportPhishingActivityResults from '@/components/GamificationReport/GamificationReportPhishingActivityResults'
import * as reportsAPI from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getGamificationPhishingResult: jest.fn()
}))

describe('GamificationReportPhishingActivityResults.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    selectedRow: {
      firstName: 'John',
      lastName: 'Doe',
      targetUserResourceId: 'user-123',
      resourceId: 'user-123'
    }
  }

  const defaultPhishingResult = {
    data: {
      data: {
        last30Days: {
          totalCount: 100,
          reportedCount: 80,
          earnedPoints: 1000,
          missedPoints: 20
        },
        successRate: 80,
        accuracyChangePercentage: 15
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    reportsAPI.getGamificationPhishingResult.mockResolvedValue(defaultPhishingResult)
  })

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportPhishingActivityResults, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      mocks: {
        $emit: jest.fn()
      },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('GamificationReportPhishingActivityResults')
    })

    it('should render main container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-phishing-activity-results').exists()).toBe(true)
    })

    it('should render header section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-phishing-activity-results__header').exists()).toBe(true)
    })

    it('should render title with correct text', () => {
      const wrapper = mountComponent()
      const title = wrapper.find('.gamification-report-phishing-activity-results__title')
      expect(title.text()).toContain('Phishing Activity Results')
    })

    it('should render three metric cards', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      const cards = wrapper.findAll('.gamification-report-phishing-activity-results__card')
      expect(cards.length).toBe(3)
    })

    it('should render skeleton loaders when loading', () => {
      const wrapper = mountComponent()
      wrapper.vm.isLoading = true
      expect(wrapper.findComponent({ name: 'VSkeletonLoader' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept selectedRow prop', () => {
      const selectedRow = {
        firstName: 'Jane',
        lastName: 'Smith',
        targetUserResourceId: 'user-456'
      }
      const wrapper = mountComponent({ selectedRow })
      expect(wrapper.vm.selectedRow).toEqual(selectedRow)
    })

    it('selectedRow prop should be required', () => {
      expect(GamificationReportPhishingActivityResults.props.selectedRow.required).toBe(true)
    })

    it('selectedRow prop should be of type Object', () => {
      expect(GamificationReportPhishingActivityResults.props.selectedRow.type).toBe(Object)
    })

    it('should display selectedRow firstName in subtitle', async () => {
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'Alice',
          lastName: 'Brown',
          targetUserResourceId: 'user-789'
        }
      })
      await wrapper.vm.$nextTick()
      const subtitle = wrapper.find('.gamification-report-phishing-activity-results__subtitle')
      expect(subtitle.text()).toContain('Alice')
      expect(subtitle.text()).toContain('Brown')
    })
  })

  describe('Data Properties', () => {
    it('should have isLoading property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should initialize phishingResult as null', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.phishingResult).toBe(null)
    })
  })

  describe('Computed Properties - targetUserResourceId', () => {
    it('should return targetUserResourceId from selectedRow', () => {
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'John',
          targetUserResourceId: 'user-id-123'
        }
      })
      expect(wrapper.vm.targetUserResourceId).toBe('user-id-123')
    })

    it('should fallback to resourceId when targetUserResourceId not available', () => {
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'John',
          resourceId: 'resource-id-456'
        }
      })
      expect(wrapper.vm.targetUserResourceId).toBe('resource-id-456')
    })

    it('should prefer targetUserResourceId over resourceId', () => {
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'John',
          targetUserResourceId: 'target-id',
          resourceId: 'resource-id'
        }
      })
      expect(wrapper.vm.targetUserResourceId).toBe('target-id')
    })

    it('should return undefined when neither ID available', () => {
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'John'
        }
      })
      expect(wrapper.vm.targetUserResourceId).toBeUndefined()
    })
  })

  describe('Computed Properties - phishingData', () => {
    it('should return default values when phishingResult is null', () => {
      const wrapper = mountComponent()
      const data = wrapper.vm.phishingData

      expect(data.reportedPhishingEmails).toBe(0)
      expect(data.totalPhishingEmails).toBe(0)
      expect(data.phishingSimulations).toBe(0)
      expect(data.totalSimulations).toBe(0)
      expect(data.detectionAccuracy).toBe(0)
      expect(data.earnedPoints).toBe(0)
      expect(data.lostPoints).toBe(0)
      expect(data.accuracyIncrease).toBe(0)
    })

    it('should extract data from phishingResult last30Days', async () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          totalCount: 100,
          reportedCount: 80,
          earnedPoints: 1000,
          missedPoints: 20
        },
        successRate: 80
      }
      await wrapper.vm.$nextTick()

      const data = wrapper.vm.phishingData
      expect(data.reportedPhishingEmails).toBe(80)
      expect(data.totalPhishingEmails).toBe(100)
      expect(data.phishingSimulations).toBe(20)
      expect(data.detectionAccuracy).toBe(80)
      expect(data.earnedPoints).toBe(1000)
    })

    it('should handle different totalPhishingEmails key names', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          totalPhishingEmails: 50,
          reportedPhishingEmails: 40
        }
      }

      const data = wrapper.vm.phishingData
      expect(data.totalPhishingEmails).toBe(50)
      expect(data.reportedPhishingEmails).toBe(40)
    })

    it('should calculate phishingSimulations as difference', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          totalCount: 100,
          reportedCount: 60
        }
      }

      const data = wrapper.vm.phishingData
      expect(data.phishingSimulations).toBe(40)
    })

    it('should handle lostPoints alias (missedPoints)', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          missedPoints: 500
        }
      }

      const data = wrapper.vm.phishingData
      expect(data.lostPoints).toBe(500)
    })

    it('should handle lostPoints directly when missedPoints not available', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          lostPoints: 300
        }
      }

      const data = wrapper.vm.phishingData
      expect(data.lostPoints).toBe(300)
    })

    it('should handle detectionAccuracy aliases', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        detectionAccuracy: 75
      }

      const data = wrapper.vm.phishingData
      expect(data.detectionAccuracy).toBe(75)
    })

    it('should handle accuracyChangePercentage alias (accuracyIncrease)', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        accuracyIncrease: 10
      }

      const data = wrapper.vm.phishingData
      expect(data.accuracyIncrease).toBe(10)
    })

    it('should use root phishingResult object when last30Days is missing', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        totalCount: 12,
        reportedCount: 7,
        earnedPoints: 30,
        missedPoints: 3,
        successRate: 58
      }

      const data = wrapper.vm.phishingData
      expect(data.totalPhishingEmails).toBe(12)
      expect(data.reportedPhishingEmails).toBe(7)
      expect(data.phishingSimulations).toBe(5)
      expect(data.earnedPoints).toBe(30)
      expect(data.lostPoints).toBe(3)
      expect(data.detectionAccuracy).toBe(58)
    })

    it('should prefer successRate over detectionAccuracy when both exist', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        successRate: 66,
        detectionAccuracy: 22
      }

      expect(wrapper.vm.phishingData.detectionAccuracy).toBe(66)
    })
  })

  describe('Computed Properties - earnedPointsText', () => {
    it('should return no points message when earnedPoints is 0', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          earnedPoints: 0
        }
      }

      const text = wrapper.vm.earnedPointsText
      expect(text.before).toContain('has not earned any points')
      expect(text.points).toBe('')
    })

    it('should return earned points message when earnedPoints > 0', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          earnedPoints: 500
        }
      }

      const text = wrapper.vm.earnedPointsText
      expect(text.before).toBe('John earned ')
      expect(text.points).toBe('+500 points')
      expect(text.after).toContain('for reported emails')
    })

    it('should use first name when available', () => {
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'Alice',
          targetUserResourceId: 'user-id'
        }
      })
      wrapper.vm.phishingResult = {
        last30Days: {
          earnedPoints: 100
        }
      }

      const text = wrapper.vm.earnedPointsText
      expect(text.before).toContain('Alice')
    })

    it('should use generic name when firstName not available', () => {
      const wrapper = mountComponent({
        selectedRow: { targetUserResourceId: 'user-id' }
      })
      wrapper.vm.phishingResult = {
        last30Days: {
          earnedPoints: 100
        }
      }

      const text = wrapper.vm.earnedPointsText
      expect(text.before).toContain('The user')
    })
  })

  describe('Computed Properties - lostPointsText', () => {
    it('should return no points message when lostPoints is 0', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          missedPoints: 0
        }
      }

      const text = wrapper.vm.lostPointsText
      expect(text.before).toContain('No points lost')
      expect(text.points).toBe('')
    })

    it('should return lost points message when lostPoints > 0', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          missedPoints: 250
        }
      }

      const text = wrapper.vm.lostPointsText
      expect(text.before).toBe('John lost ')
      expect(text.points).toBe('-250 points')
      expect(text.after).toContain('for missed reported emails')
    })

    it('should use generic user label in lost points text when firstName is missing', () => {
      const wrapper = mountComponent({
        selectedRow: { targetUserResourceId: 'user-id' }
      })
      wrapper.vm.phishingResult = {
        last30Days: {
          missedPoints: 20
        }
      }

      const text = wrapper.vm.lostPointsText
      expect(text.before).toContain('The user lost')
    })
  })

  describe('Computed Properties - accuracyText', () => {
    it('should indicate decreased accuracy when percentage < 0', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        accuracyChangePercentage: -10
      }

      const text = wrapper.vm.accuracyText
      expect(text).toContain('decreased')
      expect(text).toContain('10%')
    })

    it('should indicate increased accuracy when percentage > 0', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        accuracyChangePercentage: 15
      }

      const text = wrapper.vm.accuracyText
      expect(text).toContain('increased')
      expect(text).toContain('15%')
    })

    it('should indicate unchanged accuracy when percentage = 0', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        accuracyChangePercentage: 0
      }

      const text = wrapper.vm.accuracyText
      expect(text).toContain('unchanged')
    })

    it('should use absolute value for percentage display', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        accuracyChangePercentage: -20
      }

      const text = wrapper.vm.accuracyText
      expect(text).toContain('20%')
    })

    it('should use generic user label in accuracy text when firstName is missing', () => {
      const wrapper = mountComponent({
        selectedRow: { targetUserResourceId: 'user-id' }
      })
      wrapper.vm.phishingResult = {
        accuracyChangePercentage: 5
      }

      const text = wrapper.vm.accuracyText
      expect(text).toContain("The user's detection accuracy increased by 5%")
    })
  })

  describe('Methods - fetchPhishingResult', () => {
    it('should set isLoading to true during fetch', async () => {
      reportsAPI.getGamificationPhishingResult.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(defaultPhishingResult), 50))
      )
      const wrapper = mountComponent()

      wrapper.vm.fetchPhishingResult()
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should set isLoading to false after fetch', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.fetchPhishingResult()

      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should populate phishingResult from API response', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.fetchPhishingResult()

      expect(wrapper.vm.phishingResult).toBeDefined()
    })

    it('should clear phishingResult before fetch', async () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = { test: 'data' }

      wrapper.vm.fetchPhishingResult()
      expect(wrapper.vm.phishingResult).toBe(null)
    })

    it('should handle API response with data.data structure', async () => {
      reportsAPI.getGamificationPhishingResult.mockResolvedValue({
        data: {
          data: { successRate: 85 }
        }
      })
      const wrapper = mountComponent()

      await wrapper.vm.fetchPhishingResult()
      expect(wrapper.vm.phishingResult.successRate).toBe(85)
    })

    it('should handle API response with direct data structure', async () => {
      reportsAPI.getGamificationPhishingResult.mockResolvedValue({
        data: { successRate: 75 }
      })
      const wrapper = mountComponent()

      await wrapper.vm.fetchPhishingResult()
      expect(wrapper.vm.phishingResult.successRate).toBe(75)
    })

    it('should set phishingResult to null on error', async () => {
      reportsAPI.getGamificationPhishingResult.mockRejectedValue(new Error('API Error'))
      const wrapper = mountComponent()

      await wrapper.vm.fetchPhishingResult()
      expect(wrapper.vm.phishingResult).toBe(null)
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should not fetch when no targetUserResourceId', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John' }
      })

      await wrapper.vm.fetchPhishingResult()
      expect(reportsAPI.getGamificationPhishingResult).not.toHaveBeenCalled()
    })

    it('should keep loading false when no targetUserResourceId', async () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'NoId User' }
      })
      wrapper.vm.isLoading = false

      await wrapper.vm.fetchPhishingResult()
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should call API with correct targetUserResourceId', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.fetchPhishingResult()

      expect(reportsAPI.getGamificationPhishingResult).toHaveBeenCalledWith('user-123')
    })

    it('should keep phishingResult null when API response data is null', async () => {
      reportsAPI.getGamificationPhishingResult.mockResolvedValueOnce({ data: null })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.phishingResult).toBe(null)
      expect(wrapper.vm.isLoading).toBe(false)
    })
  })

  describe('Watcher - targetUserResourceId', () => {
    it('should fetch phishing result when targetUserResourceId changes', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', targetUserResourceId: 'id-1' }
      })

      await wrapper.vm.$nextTick()
      expect(reportsAPI.getGamificationPhishingResult).toHaveBeenCalledWith('id-1')
    })

    it('should fetch immediately on mount with immediate: true', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent()

      expect(reportsAPI.getGamificationPhishingResult).toHaveBeenCalled()
    })

    it('should fetch when targetUserResourceId prop changes', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', targetUserResourceId: 'id-1' }
      })
      await wrapper.vm.$nextTick()

      jest.clearAllMocks()
      await wrapper.setProps({
        selectedRow: { firstName: 'Jane', targetUserResourceId: 'id-2' }
      })

      expect(reportsAPI.getGamificationPhishingResult).toHaveBeenCalledWith('id-2')
    })

    it('should not fetch when selectedRow changes to a row without id', async () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', targetUserResourceId: 'id-1' }
      })
      await wrapper.vm.$nextTick()
      jest.clearAllMocks()

      await wrapper.setProps({
        selectedRow: { firstName: 'No Id User' }
      })

      expect(reportsAPI.getGamificationPhishingResult).not.toHaveBeenCalled()
    })
  })

  describe('Metric Cards Display', () => {
    it('should display reported phishing emails metric', async () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          totalCount: 100,
          reportedCount: 80
        }
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.phishingData.reportedPhishingEmails).toBe(80)
      expect(wrapper.vm.phishingData.totalPhishingEmails).toBe(100)
    })

    it('should have phishingSimulations calculation', async () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          totalCount: 100,
          reportedCount: 30
        }
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.phishingData.phishingSimulations).toBeGreaterThanOrEqual(0)
    })

    it('should have detection accuracy field', async () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        successRate: 82
      }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.phishingData.detectionAccuracy).toBeDefined()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({
        selectedRow: {
          firstName: 'User1',
          targetUserResourceId: 'user-1'
        }
      })
      const wrapper2 = mountComponent({
        selectedRow: {
          firstName: 'User2',
          targetUserResourceId: 'user-2'
        }
      })

      expect(wrapper1.vm.targetUserResourceId).toBe('user-1')
      expect(wrapper2.vm.targetUserResourceId).toBe('user-2')
    })

    it('multiple instances should fetch independently', async () => {
      jest.clearAllMocks()
      const wrapper1 = mountComponent({
        selectedRow: {
          firstName: 'User1',
          targetUserResourceId: 'user-1'
        }
      })
      const wrapper2 = mountComponent({
        selectedRow: {
          firstName: 'User2',
          targetUserResourceId: 'user-2'
        }
      })

      await wrapper1.vm.$nextTick()
      await wrapper2.vm.$nextTick()

      expect(reportsAPI.getGamificationPhishingResult).toHaveBeenCalledWith('user-1')
      expect(reportsAPI.getGamificationPhishingResult).toHaveBeenCalledWith('user-2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: load and display phishing results', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.fetchPhishingResult()

      expect(wrapper.vm.phishingResult).toBeDefined()
      expect(wrapper.vm.phishingData.reportedPhishingEmails).toBeGreaterThanOrEqual(0)
      expect(wrapper.vm.phishingData.detectionAccuracy).toBeGreaterThanOrEqual(0)
    })

    it('complete workflow: show loading state and then data', async () => {
      reportsAPI.getGamificationPhishingResult.mockImplementation(
        () => new Promise(resolve => {
          setTimeout(() => resolve(defaultPhishingResult), 50)
        })
      )
      const wrapper = mountComponent()

      wrapper.vm.fetchPhishingResult()
      expect(wrapper.vm.isLoading).toBe(true)

      await new Promise(resolve => setTimeout(resolve, 100))
      expect(wrapper.vm.isLoading).toBe(false)
      expect(wrapper.vm.phishingResult).toBeDefined()
    })

    it('complete workflow: change user and reload results', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'User1',
          targetUserResourceId: 'user-1'
        }
      })
      await wrapper.vm.$nextTick()

      jest.clearAllMocks()
      await wrapper.setProps({
        selectedRow: {
          firstName: 'User2',
          targetUserResourceId: 'user-2'
        }
      })

      expect(reportsAPI.getGamificationPhishingResult).toHaveBeenCalledWith('user-2')
    })
  })

  describe('Edge Cases', () => {
    it('should have targetUserResourceId property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.targetUserResourceId).toBeDefined()
    })

    it('should handle selectedRow with missing firstName', () => {
      const wrapper = mountComponent({
        selectedRow: {
          targetUserResourceId: 'user-id'
        }
      })
      const text = wrapper.vm.earnedPointsText
      expect(text.before).toContain('The user')
    })

    it('should handle very large point values', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          earnedPoints: 999999999
        }
      }

      const text = wrapper.vm.earnedPointsText
      expect(text.points).toBe('+999999999 points')
    })

    it('should handle negative accuracy change', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        accuracyChangePercentage: -50
      }

      const text = wrapper.vm.accuracyText
      expect(text).toContain('decreased')
      expect(text).toContain('50%')
    })

    it('should handle very large accuracy percentage', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        accuracyChangePercentage: 100
      }

      const text = wrapper.vm.accuracyText
      expect(text).toContain('increased')
      expect(text).toContain('100%')
    })

    it('should handle rapid selectedRow changes', async () => {
      const wrapper = mountComponent({
        selectedRow: {
          firstName: 'User1',
          targetUserResourceId: 'user-1'
        }
      })

      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({
          selectedRow: {
            firstName: `User${i}`,
            targetUserResourceId: `user-${i}`
          }
        })
      }

      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should maintain selectedRow after mount', async () => {
      const selectedRow = {
        firstName: 'Test',
        lastName: 'User',
        targetUserResourceId: 'test-id'
      }
      const wrapper = mountComponent({ selectedRow })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.selectedRow).toEqual(selectedRow)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('phishingData computation should be efficient', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          totalCount: 1000,
          reportedCount: 800,
          earnedPoints: 10000,
          missedPoints: 200
        },
        successRate: 85,
        accuracyChangePercentage: 25
      }

      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        const data = wrapper.vm.phishingData
        expect(data).toBeDefined()
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('computed text properties should be efficient', () => {
      const wrapper = mountComponent()
      wrapper.vm.phishingResult = {
        last30Days: {
          earnedPoints: 1000,
          missedPoints: 200
        },
        accuracyChangePercentage: 15
      }

      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        const earned = wrapper.vm.earnedPointsText
        const lost = wrapper.vm.lostPointsText
        const accuracy = wrapper.vm.accuracyText
        expect(earned).toBeDefined()
        expect(lost).toBeDefined()
        expect(accuracy).toBeDefined()
      }
    })
  })
})
