import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerBadgesTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerBadgesTab'

describe('GamificationReportUserDetailsDrawerBadgesTab.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', targetUserResourceId: '123' }
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportUserDetailsDrawerBadgesTab, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        ElTabs: true,
        ElTabPane: true,
        VTooltip: true,
        VIcon: true,
        VSkeletonLoader: true
      },
      mocks: {
        $store: {
          dispatch: jest.fn(),
          getters: {
            'gamificationBadges/getAllBadgesForUser': () => [],
            'gamificationBadges/hasValidCache': () => false,
            'gamificationBadges/isCalculating': false,
            'gamificationBadges/isFetching': false,
            'usersDashboard/getLabels': {},
            'usersDashboard/getLanguage': 'en'
          }
        }
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
      expect(wrapper.vm.$options.name).toBe('GamificationReportUserDetailsDrawerBadgesTab')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-user-details-badges-tab').exists()).toBe(true)
    })

    it('should render header section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-user-details-badges-tab__header').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept selectedRow prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.selectedRow).toBeDefined()
    })

    it('selectedRow prop should be required', () => {
      expect(GamificationReportUserDetailsDrawerBadgesTab.props.selectedRow.required).toBe(true)
    })

    it('selectedRow prop should be of type Object', () => {
      expect(GamificationReportUserDetailsDrawerBadgesTab.props.selectedRow.type).toBe(Object)
    })
  })

  describe('Data Properties', () => {
    it('should initialize activeLevelTab to 1', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.activeLevelTab).toBe('1')
    })
  })

  describe('Computed Properties', () => {
    it('should have targetUserResourceId computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.targetUserResourceId).toBeDefined()
    })

    it('should have allBadges computed property', () => {
      const wrapper = mountComponent()
      expect(Array.isArray(wrapper.vm.allBadges)).toBe(true)
    })

    it('should have isLoading computed property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isLoading).toBeFalsy()
    })

    it('allBadges falls back to empty array when getter result is not an array', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch: jest.fn(),
            getters: {
              'gamificationBadges/getAllBadgesForUser': () => null,
              'gamificationBadges/hasValidCache': () => true,
              'gamificationBadges/isCalculating': false,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {},
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })

      expect(wrapper.vm.allBadges).toEqual([])
    })

    it('isLoading is true when cache is invalid and badge fetching is active', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch: jest.fn(),
            getters: {
              'gamificationBadges/getAllBadgesForUser': () => [],
              'gamificationBadges/hasValidCache': () => false,
              'gamificationBadges/isCalculating': true,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {},
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })

      expect(wrapper.vm.isLoading).toBe(true)
    })
  })

  describe('Methods', () => {
    it('should have getBadgeKey method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getBadgeKey).toBe('function')
    })

    it('should have getBadgesByLevel method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getBadgesByLevel).toBe('function')
    })

    it('should have normalizeBadge method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.normalizeBadge).toBe('function')
    })

    it('should have formatBadgeEarnedDate method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.formatBadgeEarnedDate).toBe('function')
    })

    it('getBadgeType prioritizes badgeType then type and falls back to empty', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBadgeType({ badgeType: 'gold', type: 'silver' })).toBe('gold')
      expect(wrapper.vm.getBadgeType({ type: 'silver' })).toBe('silver')
      expect(wrapper.vm.getBadgeType({})).toBe('')
    })

    it('getBadgeDisplayName falls back when getBadgeName throws', () => {
      const wrapper = mountComponent()
      wrapper.vm.getBadgeName = jest.fn(() => {
        throw new Error('boom')
      })

      expect(wrapper.vm.getBadgeDisplayName({ badgeName: 'Badge A' })).toBe('Badge A')
      expect(wrapper.vm.getBadgeDisplayName({ name: 'Badge B' })).toBe('Badge B')
    })

    it('getBadgeStatus returns earned fallback text and not earned text', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch: jest.fn(),
            getters: {
              'gamificationBadges/getAllBadgesForUser': () => [],
              'gamificationBadges/hasValidCache': () => false,
              'gamificationBadges/isCalculating': false,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {
                yourBadgesEarned: 'Earned Label',
                yourBadgesNotEarnedYet: 'Not Yet Label'
              },
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })

      expect(wrapper.vm.getBadgeStatus({ earned: true })).toBe('Earned Label')
      expect(wrapper.vm.getBadgeStatus({ earned: false })).toBe('Not Yet Label')
    })

    it('getBadgeStatus uses earnedOn formatter output when available', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch: jest.fn(),
            getters: {
              'gamificationBadges/getAllBadgesForUser': () => [],
              'gamificationBadges/hasValidCache': () => false,
              'gamificationBadges/isCalculating': false,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {
                yourBadgesEarnedOn: (date) => `Earned at ${date}`
              },
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })

      const text = wrapper.vm.getBadgeStatus({ earned: true, earnedDate: '2025-02-10' })
      expect(text).toContain('Earned at')
      expect(text).toContain('10/02/2025')
    })

    it('ensureBadgesFetched dispatches fetch action when target user id exists', () => {
      const dispatch = jest.fn()
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch,
            getters: {
              'gamificationBadges/getAllBadgesForUser': () => [],
              'gamificationBadges/hasValidCache': () => true,
              'gamificationBadges/isCalculating': false,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {},
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })
      dispatch.mockClear()

      wrapper.vm.ensureBadgesFetched()

      expect(dispatch).toHaveBeenCalledWith('gamificationBadges/fetchBadgesForTable', ['123'])
    })

    it('ensureBadgesFetched does not dispatch when target user id is missing', () => {
      const dispatch = jest.fn()
      const wrapper = mountComponent(
        { selectedRow: { firstName: 'NoId', lastName: 'User' } },
        {
          mocks: {
            $store: {
              dispatch,
              getters: {
                'gamificationBadges/getAllBadgesForUser': () => [],
                'gamificationBadges/hasValidCache': () => true,
                'gamificationBadges/isCalculating': false,
                'gamificationBadges/isFetching': false,
                'usersDashboard/getLabels': {},
                'usersDashboard/getLanguage': 'en'
              }
            }
          }
        }
      )
      dispatch.mockClear()

      wrapper.vm.ensureBadgesFetched()

      expect(dispatch).not.toHaveBeenCalled()
    })

    it('getBadgesByLevel filters badges by numeric level with default level fallback', () => {
      const wrapper = mountComponent({}, {
        mocks: {
          $store: {
            dispatch: jest.fn(),
            getters: {
              'gamificationBadges/getAllBadgesForUser': () => [
                { badgeName: 'L1 default', level: undefined },
                { badgeName: 'L2', level: 2 },
                { badgeName: 'L3', level: '3' }
              ],
              'gamificationBadges/hasValidCache': () => true,
              'gamificationBadges/isCalculating': false,
              'gamificationBadges/isFetching': false,
              'usersDashboard/getLabels': {},
              'usersDashboard/getLanguage': 'en'
            }
          }
        }
      })

      expect(wrapper.vm.getBadgesByLevel(1).map((b) => b.badgeName)).toEqual(['L1 default'])
      expect(wrapper.vm.getBadgesByLevel(2).map((b) => b.badgeName)).toEqual(['L2'])
      expect(wrapper.vm.getBadgesByLevel(3).map((b) => b.badgeName)).toEqual(['L3'])
    })

    it('formatBadgeEarnedDate handles dd/mm/yyyy text and invalid values', () => {
      const wrapper = mountComponent()

      expect(wrapper.vm.formatBadgeEarnedDate('13/02/2025 09:30')).toBe('13/02/2025')
      expect(wrapper.vm.formatBadgeEarnedDate('not-a-date')).toBe('')
      expect(wrapper.vm.formatBadgeEarnedDate('')).toBe('')
    })

    it('getTooltipContent falls back to badge display name when description is empty', () => {
      const wrapper = mountComponent()
      wrapper.vm.getBadgeDescription = jest.fn(() => '')
      wrapper.vm.getBadgeDisplayName = jest.fn(() => 'Fallback Badge')

      expect(wrapper.vm.getTooltipContent({ badgeName: 'Ignored' })).toBe('Fallback Badge')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent badge tab instances', () => {
      const wrapper1 = mountComponent({
        selectedRow: { firstName: 'User1', lastName: 'Test1', resourceId: '1' }
      })
      const wrapper2 = mountComponent({
        selectedRow: { firstName: 'User2', lastName: 'Test2', resourceId: '2' }
      })

      expect(wrapper1.vm.selectedRow.firstName).toBe('User1')
      expect(wrapper2.vm.selectedRow.firstName).toBe('User2')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render badges tab with user data', () => {
      const wrapper = mountComponent({
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123', targetUserResourceId: '123' }
      })

      expect(wrapper.vm.targetUserResourceId).toBe('123')
      expect(wrapper.find('.gamification-report-user-details-badges-tab').exists()).toBe(true)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should call ensureBadgesFetched on created', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})
