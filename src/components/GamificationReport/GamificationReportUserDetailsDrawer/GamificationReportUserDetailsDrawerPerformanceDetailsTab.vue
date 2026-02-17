<template>
  <div class="gamification-report-user-details-performance-details-tab">
    <div class="gamification-report-user-details-training-overview-tab">
    <div class="gamification-report-user-details-training-overview-tab__header-wrapper">
      <h2 class="gamification-report-user-details-training-overview-tab__header">
        Training Overview
      </h2>
      <p class="gamification-report-user-details-training-overview-tab__subtitle">
        View all completed and assigned trainings for {{ selectedRow.firstName }}
        {{ selectedRow.lastName }} in one place.
      </p>
    </div>

    <div class="gamification-report-user-details-training-overview-tab__table-section">
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        options
        :filterable="false"
        :show-refresh-button="false"
        :is-settings-popup="false"
        row-key="enrollmentId"
        :loading="isLoading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        :select-event="tableOptions.selectEvent"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        @refreshAction="callForData"
        @on-open-training="handleOpenTraining"
      >
        <template #datatable-row-actions="{ scope }">
          <VTooltip
            bottom
            content-class="gamification-report-training-overview-row-action-tooltip"
          >
            <template #activator="{ on }">
              <VBtn
                v-on="on"
                icon
                class="btn-hover"
                :disabled="tableOptions.rowActions[0].disabled"
                :id="`${tableOptions.rowActions[0].id}-${scope.$index}`"
                @click="handleOpenTraining(scope.row)"
              >
                <VIcon>{{ tableOptions.rowActions[0].icon }}</VIcon>
              </VBtn>
            </template>
            <span>{{ tableOptions.rowActions[0].name }}</span>
          </VTooltip>
        </template>
        <template #datatable-custom-column="{ scope, col }">
          <div
            v-if="col.property === 'status'"
            class="gamification-report-user-details-training-overview-tab__status-column"
          >
            <Badge
              v-if="getStatusBadgeProps(scope.row.status)"
              v-bind="getStatusBadgeProps(scope.row.status)"
              :col="col"
              size="medium"
            />
            <span v-else>{{ scope.row.status || '—' }}</span>
          </div>
          <div
            v-else-if="col.property === 'points'"
            class="gamification-report-user-details-training-overview-tab__points-column"
          >
            <VIcon
              :color="getPointsIconColor(scope.row.points, scope.row.isMaxPoints)"
              size="18"
              class="gamification-report-user-details-training-overview-tab__points-icon"
            >
              {{ getPointsIcon(scope.row.points, scope.row.isMaxPoints) }}
            </VIcon>
            <span class="gamification-report-user-details-training-overview-tab__points-text">
              {{ scope.row.points
              }}<template v-if="scope.row.isMaxPoints">
                ({{ usersDashboardLabels?.yourLearningMaxPoints || 'max' }})</template
              >
            </span>
          </div>
        </template>
      </DataTable>
    </div>
  </div>

  <GamificationReportPhishingActivityResults :selected-row="selectedRow" />
  </div>
</template>

<script>
import { getLearningEnrollments } from '@/api/reports'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import GamificationReportPhishingActivityResults from '@/components/GamificationReport/GamificationReportPhishingActivityResults.vue'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultFilter } from '@/utils/functions'
import { labels } from '@/model/constants/labels'
import { mapGetters } from 'vuex'

const PAGE_SIZE = 1000

export default {
  name: 'GamificationReportUserDetailsDrawerPerformanceDetailsTab',
  components: {
    DataTable,
    Badge,
    GamificationReportPhishingActivityResults
  },
  computed: {
    ...mapGetters({
      usersDashboardLabels: 'usersDashboard/getLabels'
    }),
    targetUserResourceId() {
      return this.selectedRow?.targetUserResourceId || this.selectedRow?.resourceId
    }
  },
  props: {
    selectedRow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'gamification-training-overview-data-table'
      },
      isLoading: false,
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.GAMIFICATION_TRAINING_OVERVIEW,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.GAMIFICATION_TRAINING_OVERVIEW,
        selectEvent: { clipboard: false, edit: false, delete: false, download: false },
        addButton: { show: false },
        downloadButton: { show: false },
        rowActions: [
          {
            name: labels.ViewReport,
            id: 'btn-view-report-row-actions-gamification-training-overview',
            icon: 'mdi-text-box',
            action: 'on-open-training'
          }
        ],
        iEmpty: {
          message: 'The user does not have any training enrollments.'
        },
        columns: [
          {
            property: 'enrollmentName',
            label: 'Enrollment Name',
            type: 'text',
            sortable: false,
            hideSort: true,
            show: true,
            minWidth: 160
          },
          {
            property: 'trainingTypeName',
            label: 'Material Type',
            type: 'text',
            sortable: false,
            hideSort: true,
            show: true,
            minWidth: 120
          },
          {
            property: 'trainingName',
            label: 'Material Name',
            type: 'text',
            sortable: false,
            hideSort: true,
            show: true,
            minWidth: 180
          },
          {
            property: 'enrollmentStartDate',
            label: 'Start Date',
            type: 'text',
            sortable: false,
            hideSort: true,
            show: true,
            minWidth: 160
          },
          {
            property: 'status',
            label: 'Status',
            type: 'slot',
            sortable: false,
            hideSort: true,
            show: true,
            align: 'center',
            minWidth: 140
          },
          {
            property: 'points',
            label: 'Points',
            type: 'slot',
            sortable: false,
            hideSort: true,
            show: true,
            align: 'center',
            minWidth: 140
          }
        ]
      }
    }
  },
  watch: {
    targetUserResourceId: {
      immediate: true,
      handler(id) {
        if (id) this.callForData()
      }
    }
  },
  methods: {
    getStatusBadgeProps,
    async callForData() {
      if (!this.targetUserResourceId) return
      this.isLoading = true
      try {
        const payload = {
          pagination: {
            pageNumber: 1,
            pageSize: PAGE_SIZE,
            orderBy: 'StartDate',
            ascending: false
          },
          filter: getDefaultFilter().filter
        }
        const response = await getLearningEnrollments(this.targetUserResourceId, payload)
        const apiData = response?.data?.data || response?.data || {}
        const results = apiData.results || apiData.items || []
        this.tableData = results
      } catch {
        this.tableData = []
      } finally {
        this.isLoading = false
      }
    },
    handleOpenTraining(row) {
      if (row?.enrollmentId) {
        window.open(`/awareness-educator/enrollments/training-report/${row.enrollmentId}`, '_blank', 'noopener,noreferrer')
      }
    },
    getPointsIcon(points, isMaxPoints) {
      if (isMaxPoints === true) return 'mdi-star'
      const pointsValue = Number.parseInt(points)
      if (isNaN(pointsValue)) return 'mdi-check-circle'
      if (pointsValue < 0) return 'mdi-close-circle'
      if (pointsValue === 0) return 'mdi-minus-circle'
      if (points && String(points).includes('(max)')) return 'mdi-star'
      return 'mdi-check-circle'
    },
    getPointsIconColor(points, isMaxPoints) {
      if (isMaxPoints === true) return '#D1AD0C'
      const pointsValue = Number.parseInt(points)
      if (Number.isNaN(pointsValue)) return '#217124'
      if (pointsValue < 0) return '#B83A3A'
      if (pointsValue === 0) return '#757575'
      if (points && String(points).includes('(max)')) return '#D1AD0C'
      return '#217124'
    }
  }
}
</script>
