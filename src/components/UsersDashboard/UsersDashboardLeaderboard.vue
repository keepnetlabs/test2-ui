<template>
  <VCard class="users-dashboard-leaderboard">
    <div class="users-dashboard-leaderboard__header">
      <h2 id="text--users-dashboard-leaderboard-title" class="users-dashboard-leaderboard__title">
        {{ labels.leaderboardTitle }}
      </h2>
      <p
        id="text--users-dashboard-leaderboard-subtitle"
        class="users-dashboard-leaderboard__subtitle"
      >
        {{ labels.leaderboardSubtitle }}
      </p>
    </div>
    <div v-if="isLoading" class="users-dashboard-leaderboard__loading">
      <VProgressCircular indeterminate color="#2196F3" />
    </div>
    <div v-else>
      <div
        v-if="topPerformers && topPerformers.length > 0"
        class="users-dashboard-leaderboard__top-performers"
      >
        <UsersDashboardLeaderboardTopPerformerCard
          v-for="(performer, index) in topPerformers"
          :key="index"
          :performer="performer"
        />
      </div>
      <div class="users-dashboard-leaderboard__table">
        <DataTable
          ref="refTable"
          :id="tableId"
          :table="tableData"
          :columns="tableColumns"
          :empty="emptyOptions"
          :loading="isTableLoading"
          :count-row="4"
          :show-refresh-button="false"
          :download-button="{ show: false }"
          :filterable="false"
          :options="false"
          :show-filter-options="false"
          :page-sizes="[]"
        >
          <template #datatable-custom-column="{ scope, col }">
            <div
              v-if="col.property === 'rank'"
              :class="[
                'users-dashboard-leaderboard__rank-badge',
                `users-dashboard-leaderboard__rank-badge--${getRankBadgeClass(scope.row.rank)}`
              ]"
            >
              {{ scope.row.rank }}
            </div>
            <div
              v-if="col.property === 'firstName'"
              class="users-dashboard-leaderboard__first-name"
            >
              <span>{{ scope.row.firstName }}</span>
              <span v-if="scope.row.isUser" class="users-dashboard-leaderboard__you-badge">
                {{ labels.leaderboardYou }}
              </span>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'
import DataTable from '@/components/DataTable'
import UsersDashboardLeaderboardTopPerformerCard from './UsersDashboardLeaderboardTopPerformerCard'

export default {
  name: 'UsersDashboardLeaderboard',
  components: {
    DataTable,
    UsersDashboardLeaderboardTopPerformerCard
  },
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      userInfo: 'usersDashboard/getUserInfo'
    }),
    tableColumns() {
      return [
        {
          label: this.labels.leaderboardRank,
          property: 'rank',
          type: 'slot',
          show: true,
          width: '100',
          hideSort: true,
          align: 'center'
        },
        {
          label: this.labels.leaderboardFirstName,
          property: 'firstName',
          type: 'slot',
          show: true,
          width: '150',
          hideSort: true
        },
        {
          label: this.labels.leaderboardLastName,
          property: 'lastName',
          type: 'text',
          show: true,
          width: '150',
          hideSort: true
        },
        {
          label: this.labels.leaderboardEmail,
          property: 'email',
          type: 'text',
          show: true,
          width: '200',
          hideSort: true
        },
        {
          label: this.labels.leaderboardDepartment,
          property: 'department',
          type: 'text',
          show: true,
          width: '150',
          hideSort: true
        },
        {
          label: this.labels.leaderboardPerformance,
          property: 'performance',
          type: 'text',
          show: true,
          width: '120',
          hideSort: true
        },
        {
          label: this.labels.leaderboardTotalPoints,
          property: 'totalPoints',
          type: 'text',
          show: true,
          hideSort: true,
          fixed: 'right'
        }
      ]
    },
    emptyOptions() {
      return {
        message: this.labels.leaderboardEmptyMessage
      }
    }
  },
  data() {
    return {
      tableId: 'users-dashboard-leaderboard-table',
      isLoading: false,
      isTableLoading: false,
      topPerformers: [],
      tableData: []
    }
  },
  created() {
    this.fetchLeaderboardData()
  },
  methods: {
    fetchLeaderboardData() {
      this.isLoading = true
      this.isTableLoading = true
      // Simulate API call
      setTimeout(() => {
        // TODO: Replace with actual API call
        this.topPerformers = [
          {
            rank: 1,
            firstName: 'Justin',
            lastName: 'Saris',
            email: 'justin@example.com',
            department: 'Sales',
            performance: 95,
            totalPoints: 18300
          },
          {
            rank: 2,
            firstName: 'Darrel',
            lastName: 'Warren',
            email: 'darrel@example.com',
            department: 'Management',
            performance: 90,
            totalPoints: 16400
          },
          {
            rank: 3,
            firstName: 'Mitchell',
            lastName: 'Edwards',
            email: 'mitchell@example.com',
            department: 'Management',
            performance: 88,
            totalPoints: 14200
          }
        ]

        this.tableData = [
          {
            rank: 1,
            firstName: 'Justin',
            lastName: 'Saris',
            email: 'justin@example.com',
            department: 'Sales',
            performance: '95%',
            totalPoints: 18300,
            isCurrentUser: false,
            isUser: false
          },
          {
            rank: 2,
            firstName: 'Darrel',
            lastName: 'Warren',
            email: 'darrel@example.com',
            department: 'Accounts',
            performance: '85%',
            totalPoints: 16400,
            isCurrentUser: false,
            isUser: false
          },
          {
            rank: 3,
            firstName: 'Mitchell',
            lastName: 'Edwards',
            email: 'mitchell@example.com',
            department: 'IT',
            performance: '80%',
            totalPoints: 14200,
            isCurrentUser: false,
            isUser: false
          },
          {
            rank: 15,
            firstName: 'Jhon',
            lastName: 'Doe',
            email: 'jhon@example.com',
            department: 'Management',
            performance: '85%',
            totalPoints: 12500,
            isCurrentUser: true,
            isUser: true
          }
        ]
        this.isLoading = false
        this.isTableLoading = false
      }, 500)
    },
    getRankBadgeClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return 'user'
    }
  }
}
</script>
