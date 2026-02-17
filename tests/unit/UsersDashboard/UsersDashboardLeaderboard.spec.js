import { shallowMount } from '@vue/test-utils'
import UsersDashboardLeaderboard from '@/components/UsersDashboard/UsersDashboardLeaderboard.vue'

describe('UsersDashboardLeaderboard.vue', () => {
  const labels = {
    leaderboardTitle: 'Leaderboard',
    leaderboardSubtitle: 'Subtitle',
    leaderboardYou: 'You',
    leaderboardRank: 'Rank',
    leaderboardFirstName: 'First Name',
    leaderboardLastName: 'Last Name',
    leaderboardEmail: 'Email',
    leaderboardDepartment: 'Department',
    leaderboardPerformance: 'Performance',
    leaderboardTotalPoints: 'Total Points',
    leaderboardEmptyMessage: 'No data'
  }

  const topPerformance = [
    {
      rank: 1,
      firstName: 'A',
      lastName: 'AA',
      email: 'a@example.com',
      department: 'IT',
      performance: 95,
      points: 300
    },
    {
      rank: 2,
      firstName: 'B',
      lastName: 'BB',
      email: 'b@example.com',
      department: 'HR',
      performance: 90,
      points: 250
    },
    {
      rank: 3,
      firstName: 'C',
      lastName: 'CC',
      email: 'c@example.com',
      department: null,
      performance: 80,
      points: 200
    },
    {
      rank: 4,
      firstName: 'U',
      lastName: 'UU',
      email: 'user@example.com',
      department: 'Ops',
      performance: 70,
      points: 100
    }
  ]

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardLeaderboard, {
      stubs: {
        DataTable: true,
        DatatableLoading: true,
        UsersDashboardLeaderboardTopPerformerCard: true,
        VCard: true,
        'v-skeleton-loader': true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getUserInfo': { email: 'user@example.com' },
            'usersDashboard/getTopPerformance': topPerformance,
            'usersDashboard/getTopPerformanceLoading': false,
            ...getterOverrides
          }
        }
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardLeaderboard')
  })

  it('computes topPerformers as first 3 users', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.topPerformers).toHaveLength(3)
    expect(wrapper.vm.topPerformers[0]).toEqual(
      expect.objectContaining({
        rank: 1,
        firstName: 'A',
        totalPoints: 300
      })
    )
  })

  it('maps tableData and marks current user with isUser', () => {
    const wrapper = createWrapper()
    const currentUserRow = wrapper.vm.tableData.find((row) => row.email === 'user@example.com')

    expect(currentUserRow.isUser).toBe(true)
    expect(wrapper.vm.tableData[0].performance).toBe('95%')
  })

  it('returns empty arrays when topPerformance is empty', () => {
    const wrapper = createWrapper({
      'usersDashboard/getTopPerformance': []
    })

    expect(wrapper.vm.topPerformers).toEqual([])
    expect(wrapper.vm.tableData).toEqual([])
  })

  it('returns proper rank badge classes', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getRankBadgeClass(1)).toBe('gold')
    expect(wrapper.vm.getRankBadgeClass(2)).toBe('silver')
    expect(wrapper.vm.getRankBadgeClass(3)).toBe('bronze')
    expect(wrapper.vm.getRankBadgeClass(10)).toBe('user')
  })

  it('computes table columns and empty options from labels', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.tableColumns).toHaveLength(7)
    expect(wrapper.vm.tableColumns[0].label).toBe(labels.leaderboardRank)
    expect(wrapper.vm.emptyOptions).toEqual({ message: labels.leaderboardEmptyMessage })
  })
})
