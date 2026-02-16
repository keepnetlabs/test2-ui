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
        :loading="myLearningLoading"
        :row-actions="rowActions"
        :count-row="5"
        :show-refresh-button="false"
        :download-button="{ show: false }"
        :filterable="false"
        :options="false"
        :show-filter-options="false"
        :isUseLocales="true"
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
              :color="getPointsIconColor(scope.row.points, scope.row.isMaxPoints)"
              size="18"
              class="users-dashboard-your-learning__points-icon"
            >
              {{ getPointsIcon(scope.row.points, scope.row.isMaxPoints) }}
            </VIcon>
            <span class="users-dashboard-your-learning__points-text">
              {{ scope.row.points
              }}<template v-if="scope.row.isMaxPoints">
                ({{ labels.yourLearningMaxPoints }})</template
              >
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
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'UsersDashboardYourLearning',
  components: {
    DataTable,
    Badge
  },
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      myLearning: 'usersDashboard/getMyLearning',
      myLearningLoading: 'usersDashboard/getMyLearningLoading'
    }),
    tableData() {
      // Transform API data to table format
      if (!this.myLearning || this.myLearning.length === 0) {
        return []
      }
      return this.myLearning.map((item) => {
        // Map status from API format to component format
        let status = item.status
        if (item.status === 'NotStarted') {
          status = 'Not Started'
        } else if (item.status === 'NotCompleted') {
          status = 'Not Completed'
        } else if (item.status === 'Completed') {
          status = 'Completed'
        }

        // Format points - keep negative values as is
        // If points is undefined or null, default to 0, otherwise use the actual value (including negatives)
        let pointsValue = 0
        if (typeof item.points === 'number') {
          pointsValue = item.points
        } else if (item.points !== undefined && item.points !== null) {
          // Handle string or other types
          const parsed = Number(item.points)
          pointsValue = Number.isNaN(parsed) ? 0 : parsed
        }
        const pointsString = String(pointsValue)

        return {
          id: item.enrollmentId || createRandomCryptStringNumber(),
          name: item.trainingName || '',
          startDate: item.enrollmentStartDate || '',
          status: status,
          certificate: item.certificate
            ? this.labels.yourLearningAvailable
            : this.labels.yourLearningNotAvailable,
          points: pointsString,
          isMaxPoints: item.isMaxPoints || false, // Backend'den gelen isMaxPoints değeri
          pointsEarned: item.status === 'Completed' && pointsValue > 0,
          trainingUrl: item.trainingUrl || ''
        }
      })
    },
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
          hideSort: true,
          align: 'center'
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
  methods: {
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
        'In Progress': this.labels.yourLearningInProgress,
        Completed: this.labels.yourLearningCompleted,
        'Exam Passed': this.labels.actionTypeExamPassed,
        'In Queue': this.labels.yourCertificatesInQueue,
        'Exam Failed': this.labels.actionTypeExamFailed
      }
      return statusMap[status] || status
    },
    getStatusColor(status) {
      const statusMap = {
        'Not Started': '#757575', // Light gray
        'Not Completed': '#B83A3A', // Red
        'In Progress': '#FF9800', // Orange
        Completed: '#217124', // Green
        'Exam Passed': '#43A047', // Green (Exam Passed)
        'In Queue': '#1173C1', // Blue
        'Exam Failed': '#F56C6C' // Red
      }
      return statusMap[status] || '#757575'
    },
    getPointsIcon(points, isMaxPoints) {
      // Backend'den gelen isMaxPoints kontrolü
      if (isMaxPoints === true) {
        return 'mdi-star'
      }
      const pointsValue = Number.parseInt(points)
      if (Number.isNaN(pointsValue)) {
        return 'mdi-check-circle'
      }
      if (pointsValue < 0) {
        return 'mdi-close-circle'
      }
      if (pointsValue === 0) {
        return 'mdi-minus-circle'
      }
      // Fallback: Eski (max) kontrolü (geriye dönük uyumluluk için)
      if (points && points.includes('(max)')) {
        return 'mdi-star'
      }
      return 'mdi-check-circle'
    },
    getPointsIconColor(points, isMaxPoints) {
      // Backend'den gelen isMaxPoints kontrolü
      if (isMaxPoints === true) {
        return '#D1AD0C' // Gold color for max points
      }
      const pointsValue = Number.parseInt(points)
      if (Number.isNaN(pointsValue)) {
        return '#217124'
      }
      if (pointsValue < 0) {
        return '#B83A3A' // Red for negative points
      }
      if (pointsValue === 0) {
        return '#757575' // Gray for zero points
      }
      // Fallback: Eski (max) kontrolü (geriye dönük uyumluluk için)
      if (points && points.includes('(max)')) {
        return '#D1AD0C' // Gold color for max points
      }
      return '#217124' // Green for positive points
    },
    handleAction(row) {
      // If trainingUrl exists, open it in a new window
      if (row.trainingUrl) {
        window.open(row.trainingUrl, '_blank')
        return
      }

      if (row.status === 'Completed') {
        console.log('Redo training:', row)
      } else {
        console.log('Start training:', row)
      }
    }
  }
}
</script>
