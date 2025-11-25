<template>
  <VCard class="users-dashboard-your-learning">
    <div class="users-dashboard-your-learning__header">
      <h2
        id="text--users-dashboard-your-learning-title"
        class="users-dashboard-your-learning__title"
      >
        {{ labels.yourLearningTitle }}
      </h2>
      <p
        id="text--users-dashboard-your-learning-subtitle"
        class="users-dashboard-your-learning__subtitle"
      >
        {{ labels.yourLearningSubtitle }}
      </p>
    </div>
    <div class="users-dashboard-your-learning__table">
      <DataTable
        ref="refTable"
        :id="tableId"
        :table="tableData"
        :columns="tableColumns"
        :empty="emptyOptions"
        :loading="isLoading"
        :row-actions="rowActions"
        :count-row="5"
        :show-refresh-button="false"
        :download-button="{ show: false }"
        :filterable="false"
        :options="false"
        :show-filter-options="false"
      >
        <template #datatable-custom-column="{ scope, col }">
          <div
            v-if="col.property === 'status'"
            class="users-dashboard-your-learning__status-column"
          >
            <VBtn style="display: none;" />
            <Badge
              :color="getStatusColor(scope.row.status)"
              :text="getStatusLabel(scope.row.status)"
              size="medium"
            />
          </div>
          <div
            v-if="col.property === 'points'"
            class="users-dashboard-your-learning__points-column"
          >
            <VIcon
              :color="scope.row.points.includes('(max)') ? '#FFC107' : '#217124'"
              size="18"
              class="users-dashboard-your-learning__points-icon"
            >
              {{ scope.row.points.includes('(max)') ? 'mdi-star' : 'mdi-check-circle' }}
            </VIcon>
            <span class="users-dashboard-your-learning__points-text">
              {{ scope.row.points }}
            </span>
          </div>
        </template>
        <template #datatable-row-actions="{ scope }">
          <VTooltip bottom>
            <template #activator="{ on }">
              <VBtn
                v-on="on"
                :id="`btn-action--your-learning-${scope.$index}`"
                class="btn-hover"
                icon
                @click="handleAction(scope.row)"
              >
                <VIcon>
                  {{ getActionIcon(scope.row.status) }}
                </VIcon>
              </VBtn>
            </template>
            <span>{{ getActionTooltip(scope.row.status) }}</span>
          </VTooltip>
        </template>
      </DataTable>
    </div>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'

export default {
  name: 'UsersDashboardYourLearning',
  components: {
    DataTable,
    Badge
  },
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels'
    }),
    tableColumns() {
      return [
        {
          label: this.labels.yourLearningTrainingMaterialName,
          property: 'name',
          type: 'text',
          show: true,
          width: '200',
          hideSort: true
        },
        {
          label: this.labels.yourLearningStartDate,
          property: 'startDate',
          type: 'date',
          show: true,
          width: '150',
          hideSort: true
        },
        {
          label: this.labels.yourLearningTrainingStatus,
          property: 'status',
          type: 'slot',
          show: true,
          width: '180',
          hideSort: true
        },
        {
          label: this.labels.yourLearningCertificate,
          property: 'certificate',
          type: 'text',
          show: true,
          width: '120',
          hideSort: true
        },
        {
          label: this.labels.yourLearningPoints,
          property: 'points',
          type: 'slot',
          show: true,
          width: '120',
          hideSort: true
        }
      ]
    },
    emptyOptions() {
      return {
        message: this.labels.yourLearningNoTrainingMaterials
      }
    }
  },
  data() {
    return {
      tableId: 'users-dashboard-your-learning-table',
      isLoading: false,
      tableData: [],
      rowActions: [
        {
          name: 'Action',
          id: 'btn-action--your-learning',
          icon: 'mdi-play',
          action: 'handle-action'
        }
      ]
    }
  },
  created() {
    // Simulate API call
    this.fetchTrainingMaterials()
  },
  methods: {
    fetchTrainingMaterials() {
      this.isLoading = true
      // Simulate API delay
      setTimeout(() => {
        // TODO: Replace with actual API call
        this.tableData = [
          {
            id: 1,
            name: 'MFA-Security',
            startDate: '2025-11-14T12:00:00',
            status: 'Not Started',
            certificate: 'Available',
            points: '200 (max)',
            pointsEarned: false
          },
          {
            id: 2,
            name: 'AWARE S06 | E07',
            startDate: '2025-11-07T12:00:00',
            status: 'Not Completed',
            certificate: 'Available',
            points: '100 (max)',
            pointsEarned: false
          },
          {
            id: 3,
            name: 'QR Cyber Security',
            startDate: '2025-10-28T12:00:00',
            status: 'Completed',
            certificate: 'Not Available',
            points: '150',
            pointsEarned: true
          },
          {
            id: 4,
            name: 'Advanced Persistent Threats',
            startDate: '2025-10-21T12:00:00',
            status: 'Completed',
            certificate: 'Not Available',
            points: '120',
            pointsEarned: true
          },
          {
            id: 5,
            name: 'Entain Digital Security Training',
            startDate: '2025-10-14T12:00:00',
            status: 'Completed',
            certificate: 'Available',
            points: '200',
            pointsEarned: true
          },
          {
            id: 6,
            name: 'Phishing Awareness Training',
            startDate: '2025-10-07T12:00:00',
            status: 'Completed',
            certificate: 'Available',
            points: '180',
            pointsEarned: true
          },
          {
            id: 7,
            name: 'Social Engineering Basics',
            startDate: '2025-09-30T12:00:00',
            status: 'Not Started',
            certificate: 'Not Available',
            points: '150 (max)',
            pointsEarned: false
          },
          {
            id: 8,
            name: 'Password Security Best Practices',
            startDate: '2025-09-23T12:00:00',
            status: 'Not Completed',
            certificate: 'Available',
            points: '100 (max)',
            pointsEarned: false
          },
          {
            id: 9,
            name: 'Data Protection Fundamentals',
            startDate: '2025-09-16T12:00:00',
            status: 'Completed',
            certificate: 'Available',
            points: '220',
            pointsEarned: true
          },
          {
            id: 10,
            name: 'Incident Response Training',
            startDate: '2025-09-09T12:00:00',
            status: 'Completed',
            certificate: 'Not Available',
            points: '190',
            pointsEarned: true
          },
          {
            id: 11,
            name: 'Network Security Essentials',
            startDate: '2025-09-02T12:00:00',
            status: 'Not Started',
            certificate: 'Available',
            points: '170 (max)',
            pointsEarned: false
          },
          {
            id: 12,
            name: 'Cloud Security Basics',
            startDate: '2025-08-26T12:00:00',
            status: 'Not Completed',
            certificate: 'Not Available',
            points: '140 (max)',
            pointsEarned: false
          },
          {
            id: 13,
            name: 'Security Compliance Training',
            startDate: '2025-08-19T12:00:00',
            status: 'Completed',
            certificate: 'Available',
            points: '210',
            pointsEarned: true
          }
        ]
        this.isLoading = false
      }, 500) // Simulate 500ms API delay
    },
    getActionIcon(status) {
      if (status === 'Completed') {
        return 'mdi-replay'
      }
      return 'mdi-play-circle'
    },
    getActionTooltip(status) {
      if (status === 'Completed') {
        return this.labels.yourLearningRedoTraining
      }
      return this.labels.yourLearningStartTraining
    },
    getStatusLabel(status) {
      const statusMap = {
        'Not Started': this.labels.yourLearningNotStarted,
        'Not Completed': this.labels.yourLearningNotCompleted,
        Completed: this.labels.yourLearningCompleted
      }
      return statusMap[status] || status
    },
    getStatusColor(status) {
      const statusMap = {
        'Not Started': '#757575', // Light gray
        'Not Completed': '#B83A3A', // Red
        Completed: '#217124' // Green
      }
      return statusMap[status] || '#757575'
    },
    handleAction(row) {
      // TODO: Implement action handler
      if (row.status === 'Completed') {
        console.log('Redo training:', row)
      } else {
        console.log('Start training:', row)
      }
    }
  }
}
</script>
