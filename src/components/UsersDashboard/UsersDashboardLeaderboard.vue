<template>
  <VCard id="users-dashboard-leaderboard" class="users-dashboard-leaderboard">
    <div class="users-dashboard-leaderboard__header">
      <h2 id="text--users-dashboard-leaderboard-title" class="users-dashboard-leaderboard__title">
        {{ labels.leaderboardTitle }}
      </h2>
      <div
        v-if="showToggle"
        class="users-dashboard-leaderboard__toggle"
      >
        <div class="users-dashboard-leaderboard__toggle-buttons">
          <span
            class="users-dashboard-leaderboard__toggle-indicator"
            :style="toggleIndicatorStyle"
          ></span>
          <span
            ref="toggleLabel0"
            class="users-dashboard-leaderboard__toggle-label"
            :class="{
              'users-dashboard-leaderboard__toggle-label--active': selectedTab === 0
            }"
            @click="selectTab(0)"
          >
            {{ labels.leaderboardIndividualRanking }}
          </span>
          <span
            ref="toggleLabel1"
            class="users-dashboard-leaderboard__toggle-label"
            :class="{
              'users-dashboard-leaderboard__toggle-label--active': selectedTab === 1
            }"
            @click="selectTab(1)"
          >
            {{ labels.leaderboardDepartmentRanking }}
          </span>
        </div>
      </div>
    </div>

    <!-- Individual Ranking -->
    <template v-if="!isDepartmentMode">
      <div class="users-dashboard-leaderboard__section-header">
        <h3 class="users-dashboard-leaderboard__section-title">
          {{ labels.leaderboardIndividualRankingTitle }}
        </h3>
        <p class="users-dashboard-leaderboard__section-subtitle">
          {{ labels.leaderboardIndividualRankingSubtitle }}
        </p>
      </div>
      <div v-if="isLoading" class="users-dashboard-leaderboard__top-performers">
        <v-skeleton-loader
          v-for="n in 3"
          :key="`skeleton-${n}`"
          type="card"
          class="users-dashboard-leaderboard__skeleton-card"
          boilerplate
        ></v-skeleton-loader>
      </div>
      <DatatableLoading :loading="isLoading" />
      <div v-show="!isLoading">
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
            :isUseLocales="true"
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
    </template>

    <!-- Department Ranking -->
    <template v-else>
      <DatatableLoading :loading="isDepartmentLoading" />
      <div v-show="!isDepartmentLoading">
        <!-- Your Rank in {Department} -->
        <div class="users-dashboard-leaderboard__department-section">
          <h3 class="users-dashboard-leaderboard__section-title">
            {{ userDepartment ? labels.leaderboardYourRankIn(userDepartment) : labels.leaderboardYourRankInYourDepartment }}
          </h3>
          <p class="users-dashboard-leaderboard__section-subtitle">
            {{ labels.leaderboardYourRankInSubtitle }}
          </p>
          <!-- No department alert -->
          <v-alert
            v-if="!userDepartment"
            type="info"
            outlined
            dense
            class="users-dashboard-leaderboard__no-department-alert"
          >
            {{ labels.leaderboardNoDepartmentMessage }}
          </v-alert>
          <!-- Department members table -->
          <div v-else class="users-dashboard-leaderboard__table">
            <DataTable
              ref="refDepartmentMembersTable"
              :id="`${tableId}-department-members`"
              :table="departmentMembersTableData"
              :columns="tableColumns"
              :empty="emptyOptions"
              :loading="topDepartmentUserPerformanceLoading"
              :count-row="4"
              :show-refresh-button="false"
              :download-button="{ show: false }"
              :filterable="false"
              :options="false"
              :show-filter-options="false"
              :page-sizes="[]"
              :isUseLocales="true"
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

        <!-- Department Rankings -->
        <div class="users-dashboard-leaderboard__department-section">
          <h3 class="users-dashboard-leaderboard__section-title">
            {{ labels.leaderboardDepartmentRankingsTitle }}
          </h3>
          <p class="users-dashboard-leaderboard__section-subtitle">
            {{ labels.leaderboardDepartmentRankingsSubtitle }}
          </p>
          <div class="users-dashboard-leaderboard__table">
            <DataTable
              ref="refDepartmentRankingTable"
              :id="`${tableId}-department-ranking`"
              :table="departmentRankingTableData"
              :columns="departmentRankingColumns"
              :empty="emptyOptions"
              :loading="topDepartmentPerformanceLoading"
              :count-row="4"
              :show-refresh-button="false"
              :download-button="{ show: false }"
              :filterable="false"
              :options="false"
              :show-filter-options="false"
              :page-sizes="[]"
              :isUseLocales="true"
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
                  v-if="col.property === 'departmentName'"
                  class="users-dashboard-leaderboard__first-name"
                >
                  <span>{{ scope.row.departmentName }}</span>
                  <span
                    v-if="scope.row.isCurrentUserDepartment"
                    class="users-dashboard-leaderboard__you-badge"
                  >
                    {{ labels.leaderboardYourDepartment }}
                  </span>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'
import DataTable from '@/components/DataTable'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading.vue'
import UsersDashboardLeaderboardTopPerformerCard from './UsersDashboardLeaderboardTopPerformerCard'

export default {
  name: 'UsersDashboardLeaderboard',
  components: {
    DataTable,
    DatatableLoading,
    UsersDashboardLeaderboardTopPerformerCard
  },
  data() {
    return {
      tableId: 'users-dashboard-leaderboard-table',
      selectedTab: 0,
      indicatorLeft: 0,
      indicatorWidth: 0
    }
  },
  watch: {
    showToggle(val) {
      if (val) {
        this.$nextTick(() => this.updateIndicator())
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.updateIndicator())
  },
  computed: {
    toggleIndicatorStyle() {
      return {
        left: `${this.indicatorLeft}px`,
        width: `${this.indicatorWidth}px`
      }
    },
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      userInfo: 'usersDashboard/getUserInfo',
      topPerformance: 'usersDashboard/getTopPerformance',
      topPerformanceLoading: 'usersDashboard/getTopPerformanceLoading',
      topDepartmentPerformance: 'usersDashboard/getTopDepartmentPerformance',
      topDepartmentPerformanceLoading: 'usersDashboard/getTopDepartmentPerformanceLoading',
      topDepartmentUserPerformance: 'usersDashboard/getTopDepartmentUserPerformance',
      topDepartmentUserPerformanceLoading: 'usersDashboard/getTopDepartmentUserPerformanceLoading'
    }),
    showToggle() {
      return (
        !this.topDepartmentPerformanceLoading &&
        this.topDepartmentPerformance &&
        this.topDepartmentPerformance.length > 0
      )
    },
    isDepartmentMode() {
      return this.selectedTab === 1 && this.showToggle
    },
    isLoading() {
      return this.topPerformanceLoading
    },
    isDepartmentLoading() {
      return this.topDepartmentUserPerformanceLoading || this.topDepartmentPerformanceLoading
    },
    isTableLoading() {
      return this.topPerformanceLoading
    },
    userDepartment() {
      return this.userInfo?.department || ''
    },
    topPerformers() {
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
      return this.topPerformance.map((user) => ({
        rank: user.rank,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department || '',
        performance: `${user.performance}%`,
        totalPoints: user.points,
        isUser: user.email === this.userInfo?.email
      }))
    },
    departmentMembersTableData() {
      if (!this.topDepartmentUserPerformance || this.topDepartmentUserPerformance.length === 0) {
        return []
      }
      return this.topDepartmentUserPerformance.map((user) => ({
        rank: user.rank,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department || '',
        performance: `${user.performance}%`,
        totalPoints: user.points,
        isUser: user.email === this.userInfo?.email
      }))
    },
    departmentRankingTableData() {
      if (!this.topDepartmentPerformance || this.topDepartmentPerformance.length === 0) {
        return []
      }
      return this.topDepartmentPerformance.map((dept) => ({
        rank: dept.rank,
        departmentName: dept.departmentName,
        numberOfEmployees: dept.numberOfEmployees,
        performance: `${dept.performance}%`,
        isCurrentUserDepartment: dept.isCurrentUserDepartment
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
    departmentRankingColumns() {
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
          label: this.labels.leaderboardDepartmentName,
          property: 'departmentName',
          type: 'slot',
          show: true,
          width: '250',
          hideSort: true
        },
        {
          label: this.labels.leaderboardNumberOfEmployees,
          property: 'numberOfEmployees',
          type: 'text',
          show: true,
          width: '200',
          hideSort: true
        },
        {
          label: this.labels.leaderboardPerformance,
          property: 'performance',
          type: 'text',
          show: true,
          minWidth: 150,
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
  methods: {
    getRankBadgeClass(rank) {
      if (rank === 1) return 'gold'
      if (rank === 2) return 'silver'
      if (rank === 3) return 'bronze'
      return 'user'
    },
    selectTab(tab) {
      this.selectedTab = tab
      this.$nextTick(() => this.updateIndicator())
    },
    updateIndicator() {
      const label = this.$refs[`toggleLabel${this.selectedTab}`]
      if (label) {
        this.indicatorLeft = label.offsetLeft
        this.indicatorWidth = label.offsetWidth
      }
    }
  }
}
</script>
