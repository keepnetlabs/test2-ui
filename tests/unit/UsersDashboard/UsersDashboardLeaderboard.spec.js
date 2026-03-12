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
    leaderboardEmptyMessage: 'No data',
    leaderboardIndividualRanking: 'INDIVIDUAL RANKING',
    leaderboardDepartmentRanking: 'DEPARTMENT RANKING',
    leaderboardIndividualRankingTitle: 'Individual Ranking',
    leaderboardIndividualRankingSubtitle: 'Your individual ranking',
    leaderboardYourRankIn: (dept) => `Your Rank in ${dept}`,
    leaderboardYourRankInYourDepartment: 'Your Rank in Your Department',
    leaderboardYourRankInSubtitle: 'Your ranking within the department',
    leaderboardDepartmentRankingsTitle: 'Department Rankings',
    leaderboardDepartmentRankingsSubtitle: 'Department rankings subtitle',
    leaderboardDepartmentName: 'Department Name',
    leaderboardNumberOfEmployees: 'Number of Employees',
    leaderboardYourDepartment: 'Your Department',
    leaderboardNoDepartmentMessage: 'You are not currently assigned to a department.'
  }

  const topDepartmentPerformance = [
    { rank: 1, departmentName: 'IT', numberOfEmployees: 25, performance: 95, isCurrentUserDepartment: false },
    { rank: 2, departmentName: 'HR', numberOfEmployees: 12, performance: 85, isCurrentUserDepartment: true }
  ]

  const topDepartmentUserPerformance = [
    { rank: 1, firstName: 'Maria', lastName: 'V', email: 'maria@example.com', department: 'HR', performance: 95, points: 18300 },
    { rank: 2, firstName: 'U', lastName: 'UU', email: 'user@example.com', department: 'HR', performance: 80, points: 14200 }
  ]

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
        'v-skeleton-loader': true,
        'v-alert': true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getUserInfo': { email: 'user@example.com', department: 'HR' },
            'usersDashboard/getTopPerformance': topPerformance,
            'usersDashboard/getTopPerformanceLoading': false,
            'usersDashboard/getTopDepartmentPerformance': topDepartmentPerformance,
            'usersDashboard/getTopDepartmentPerformanceLoading': false,
            'usersDashboard/getTopDepartmentUserPerformance': topDepartmentUserPerformance,
            'usersDashboard/getTopDepartmentUserPerformanceLoading': false,
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

  describe('toggle and department mode', () => {
    it('showToggle is true when department data exists and not loading', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.showToggle).toBe(true)
    })

    it('showToggle is false when department data is empty', () => {
      const wrapper = createWrapper({
        'usersDashboard/getTopDepartmentPerformance': []
      })
      expect(wrapper.vm.showToggle).toBe(false)
    })

    it('showToggle is false when department data is loading', () => {
      const wrapper = createWrapper({
        'usersDashboard/getTopDepartmentPerformanceLoading': true
      })
      expect(wrapper.vm.showToggle).toBe(false)
    })

    it('isDepartmentMode is false by default (selectedTab=0)', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isDepartmentMode).toBe(false)
    })

    it('isDepartmentMode is true when selectedTab=1 and showToggle=true', () => {
      const wrapper = createWrapper()
      wrapper.setData({ selectedTab: 1 })
      expect(wrapper.vm.isDepartmentMode).toBe(true)
    })

    it('selectTab updates selectedTab', () => {
      const wrapper = createWrapper()
      wrapper.vm.selectTab(1)
      expect(wrapper.vm.selectedTab).toBe(1)
      wrapper.vm.selectTab(0)
      expect(wrapper.vm.selectedTab).toBe(0)
    })

    it('computes departmentRankingTableData from department performance', () => {
      const wrapper = createWrapper()
      const data = wrapper.vm.departmentRankingTableData

      expect(data).toHaveLength(2)
      expect(data[0]).toEqual(expect.objectContaining({
        rank: 1,
        departmentName: 'IT',
        numberOfEmployees: 25,
        performance: '95%',
        isCurrentUserDepartment: false
      }))
      expect(data[1].isCurrentUserDepartment).toBe(true)
    })

    it('computes departmentMembersTableData from department user performance', () => {
      const wrapper = createWrapper()
      const data = wrapper.vm.departmentMembersTableData

      expect(data).toHaveLength(2)
      expect(data[0]).toEqual(expect.objectContaining({
        rank: 1,
        firstName: 'Maria',
        performance: '95%',
        totalPoints: 18300
      }))
      expect(data[1].isUser).toBe(true)
    })

    it('departmentRankingTableData returns empty when no data', () => {
      const wrapper = createWrapper({
        'usersDashboard/getTopDepartmentPerformance': []
      })
      expect(wrapper.vm.departmentRankingTableData).toEqual([])
    })

    it('departmentMembersTableData returns empty when no data', () => {
      const wrapper = createWrapper({
        'usersDashboard/getTopDepartmentUserPerformance': []
      })
      expect(wrapper.vm.departmentMembersTableData).toEqual([])
    })

    it('computes departmentRankingColumns with 4 columns', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.departmentRankingColumns).toHaveLength(4)
      expect(wrapper.vm.departmentRankingColumns[1].property).toBe('departmentName')
      expect(wrapper.vm.departmentRankingColumns[2].property).toBe('numberOfEmployees')
    })

    it('userDepartment returns department from userInfo', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.userDepartment).toBe('HR')
    })

    it('userDepartment returns empty string when no department', () => {
      const wrapper = createWrapper({
        'usersDashboard/getUserInfo': { email: 'user@example.com' }
      })
      expect(wrapper.vm.userDepartment).toBe('')
    })

    it('isDepartmentLoading reflects both loading states', () => {
      const wrapper = createWrapper({
        'usersDashboard/getTopDepartmentUserPerformanceLoading': true
      })
      expect(wrapper.vm.isDepartmentLoading).toBe(true)
    })
  })
})
