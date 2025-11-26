<template>
  <VCard id="users-dashboard-leaderboard" class="users-dashboard-leaderboard">
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
      userInfo: 'usersDashboard/getUserInfo',
      topPerformance: 'usersDashboard/getTopPerformance',
      topPerformanceLoading: 'usersDashboard/getTopPerformanceLoading'
    }),
    isLoading() {
      return this.topPerformanceLoading
    },
    isTableLoading() {
      return this.topPerformanceLoading
    },
    topPerformers() {
      // Get top 3 performers
      if (!this.topPerformance || this.topPerformance.length === 0) {
        return []
      }
      return this.topPerformance.slice(0, 3).map((user) => ({
        rank: user.rank,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department || '',
        performance: user.performance,
        totalPoints: user.points
      }))
    },
    tableData() {
      if (!this.topPerformance || this.topPerformance.length === 0) {
        return []
      }
      const currentUserId = '4BCeEWHwAKME'
      return this.topPerformance.map((user) => ({
        rank: user.rank,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department || '',
        performance: `${user.performance}%`,
        totalPoints: user.points,
        isUser: user.targetUserResourceId === currentUserId
      }))
    },
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
          minWidth: 150,
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
      tableId: 'users-dashboard-leaderboard-table'
    }
  },
  methods: {
    getRankBadgeClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return 'user'
    }
  }
}
</script>
