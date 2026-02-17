import { shallowMount } from '@vue/test-utils'
import UsersDashboardLeaderboardTopPerformerCard from '@/components/UsersDashboard/UsersDashboardLeaderboardTopPerformerCard.vue'

describe('UsersDashboardLeaderboardTopPerformerCard.vue', () => {
  const basePerformer = {
    rank: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    department: 'IT',
    performance: 98
  }

  const createWrapper = (performer = basePerformer) =>
    shallowMount(UsersDashboardLeaderboardTopPerformerCard, {
      propsData: {
        performer
      },
      stubs: {
        VCard: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': {
              leaderboardPerformance: 'Performance'
            }
          }
        }
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardLeaderboardTopPerformerCard')
  })

  it('returns gold medal/ribbon values for rank 1', () => {
    const wrapper = createWrapper({ ...basePerformer, rank: 1 })

    expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.goldMedalImg)
    expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.goldRibbonImg)
    expect(wrapper.vm.getMedalAlt).toBe('gold medal')
    expect(wrapper.vm.getRibbonAlt).toBe('gold ribbon')
    expect(wrapper.vm.getRankClass).toBe('gold')
  })

  it('returns silver medal/ribbon values for rank 2', () => {
    const wrapper = createWrapper({ ...basePerformer, rank: 2 })

    expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.silverMedalImg)
    expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.silverRibbonImg)
    expect(wrapper.vm.getMedalAlt).toBe('silver medal')
    expect(wrapper.vm.getRibbonAlt).toBe('silver ribbon')
    expect(wrapper.vm.getRankClass).toBe('silver')
  })

  it('returns bronze medal/ribbon values for rank 3 and others', () => {
    const wrapper = createWrapper({ ...basePerformer, rank: 3 })

    expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.bronzeMedalImg)
    expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.bronzeRibbonImg)
    expect(wrapper.vm.getMedalAlt).toBe('bronze medal')
    expect(wrapper.vm.getRibbonAlt).toBe('bronze ribbon')
    expect(wrapper.vm.getRankClass).toBe('bronze')
  })
})
