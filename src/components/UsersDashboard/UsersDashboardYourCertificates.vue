<template>
  <VCard class="users-dashboard-your-certificates">
    <div class="users-dashboard-your-certificates__header">
      <h2
        id="text--users-dashboard-your-certificates-title"
        class="users-dashboard-your-certificates__title"
      >
        {{ labels.yourCertificatesTitle }}
      </h2>
      <p
        id="text--users-dashboard-your-certificates-subtitle"
        class="users-dashboard-your-certificates__subtitle"
      >
        {{ labels.yourCertificatesSubtitle }}
      </p>
    </div>
    <div class="users-dashboard-your-certificates__table">
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
        :isUseLocales="true"
      >
        <template #datatable-custom-column="{ scope, col }">
          <div
            v-if="col.property === 'trainingStatus'"
            class="users-dashboard-your-certificates__status-column"
          >
            <VBtn style="display: none;" />
            <Badge
              :color="getStatusColor(scope.row.trainingStatus)"
              :text="getStatusLabel(scope.row.trainingStatus)"
              size="medium"
            />
          </div>
        </template>
        <template #datatable-row-actions="{ scope }">
          <span
            :style="{
              display: 'inline-block',
              cursor: isActionEnabled(scope.row) ? 'pointer' : 'default'
            }"
            @mouseenter="handleTooltipMouseEnter($event, scope.row)"
            @mouseleave="handleTooltipMouseLeave"
          >
            <VBtn
              :id="`btn-action--your-certificates-${scope.$index}`"
              class="btn-hover"
              icon
              :disabled="!isActionEnabled(scope.row)"
              @click="handleAction(scope.row)"
            >
              <VIcon>
                {{ getActionIcon(scope.row) }}
              </VIcon>
            </VBtn>
          </span>
        </template>
      </DataTable>
      <DataTableTooltip
        v-if="showTooltip"
        :tooltip-style="tooltipStyle"
        :content="tooltipContent"
      />
    </div>
    <UsersDashboardCertificateNotAvailableDialog
      v-if="showCertificateNotAvailableDialog"
      :status="showCertificateNotAvailableDialog"
      :training-url="getTrainingUrlForDialog"
      @on-close="handleDialogClose"
    />
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex'
import DataTable from '@/components/DataTable'
import Badge from '@/components/Badge'
import DataTableTooltip from '@/components/DataTableComponents/DataTableTooltip'
import UsersDashboardCertificateNotAvailableDialog from '@/components/UsersDashboard/UsersDashboardCertificateNotAvailableDialog.vue'
import { downloadCertificate } from '@/api/usersDashboard'

export default {
  name: 'UsersDashboardYourCertificates',
  components: {
    DataTable,
    Badge,
    DataTableTooltip,
    UsersDashboardCertificateNotAvailableDialog
  },
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels',
      myCertificates: 'usersDashboard/getMyCertificates',
      myCertificatesLoading: 'usersDashboard/getMyCertificatesLoading'
    }),
    tableColumns() {
      return [
        {
          property: 'certificateName',
          label: this.labels.yourCertificatesCertificateName,
          type: 'text',
          minWidth: 200,
          show: true,
          hideSort: true
        },
        {
          property: 'certificateDate',
          label: this.labels.yourCertificatesCertificateDate,
          type: 'text',
          minWidth: 200,
          show: true,
          hideSort: true
        },
        {
          property: 'trainingStatus',
          label: this.labels.yourCertificatesTrainingStatus,
          type: 'slot',
          show: true,
          hideSort: true,
          width: 180,
          align: 'center'
        }
      ]
    },
    tableData() {
      return this.myCertificates.map((cert) => ({
        certificateName: cert.certificateName,
        certificateDate: cert.enrollmentStartDate,
        trainingStatus: cert.trainingStatus,
        trainingUrl: cert.trainingUrl,
        enrollmentId: cert.enrollmentId,
        actions: cert.actions || []
      }))
    },
    isLoading() {
      return this.myCertificatesLoading
    },
    rowActions() {
      return [
        {
          name: 'Download',
          id: 'btn-action--your-certificates',
          icon: 'mdi-download',
          action: 'handleDownload'
        }
      ]
    },
    emptyOptions() {
      return {
        message: this.labels.yourCertificatesNoCertificates
      }
    },
    getTrainingUrlForDialog() {
      if (!this.selectedRowForDialog || !this.selectedRowForDialog.actions) {
        return ''
      }
      const action = this.selectedRowForDialog.actions.find(
        (a) => a.actionType === 'TrainingUrl' && a.url
      )
      return action ? action.url : ''
    }
  },
  data() {
    return {
      tableId: 'users-dashboard-your-certificates-table',
      showTooltip: false,
      tooltipContent: '',
      tooltipStyle: {},
      showCertificateNotAvailableDialog: false,
      selectedRowForDialog: null
    }
  },
  methods: {
    getStatusColor(status) {
      const statusMap = {
        'Not Started': '#757575',
        'Not Completed': '#B83A3A',
        'In Progress': '#FF9800',
        Completed: '#217124',
        'Exam Passed': '#43A047',
        'In Queue': '#1173C1',
        'Exam Failed': '#F56C6C' // Red
      }
      return statusMap[status] || '#757575'
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
    getPrimaryAction(row) {
      if (!row.actions || row.actions.length === 0) {
        return null
      }
      // Return the first enabled action, or first action if none are enabled
      const enabledAction = row.actions.find((action) => action.isEnabled)
      return enabledAction || row.actions[0]
    },
    isActionEnabled(row) {
      const action = this.getPrimaryAction(row)
      return action ? action.isEnabled : false
    },
    getActionIcon(row) {
      const action = this.getPrimaryAction(row)
      if (!action) {
        // Fallback to old logic if no actions
        return row.trainingStatus === 'Completed' ? 'mdi-download' : 'mdi-play-circle'
      }
      if (action.actionType === 'CertificateDownload') {
        return 'mdi-download'
      }
      if (action.actionType === 'TrainingUrl') {
        return 'mdi-play-circle'
      }
      return 'mdi-play-circle'
    },
    getActionTooltip(row) {
      const action = this.getPrimaryAction(row)
      if (!action) {
        // Fallback to old logic if no actions
        if (row.trainingStatus === 'Completed') {
          return this.labels.yourCertificatesDownloadCertificate
        }
        return this.labels.yourLearningStartTraining
      }
      // Backend'den gelen warningMessage sadece durum göstergesi, mesajı labels'dan kullan
      // CertificateDownload disabled + warningMessage var → Not eligible warning
      if (
        action.actionType === 'CertificateDownload' &&
        !action.isEnabled &&
        action.warningMessage
      ) {
        return this.labels.yourCertificatesWarningNotEligibleDownload
      }
      // TrainingUrl enabled + warningMessage var → Can retake but no certificate warning
      if (action.actionType === 'TrainingUrl' && action.isEnabled && action.warningMessage) {
        return this.labels.yourCertificatesWarningCanRetakeNoCertificate
      }
      // Otherwise show default tooltip based on action type
      if (action.actionType === 'CertificateDownload') {
        return this.labels.yourCertificatesDownloadCertificate
      }
      if (action.actionType === 'TrainingUrl') {
        return this.labels.yourLearningStartTraining
      }
      return ''
    },
    handleAction(row) {
      const action = this.getPrimaryAction(row)
      if (!action) {
        // Fallback to old logic if no actions
        if (row.trainingStatus === 'Completed') {
          this.handleDownload(row)
        } else if (row.trainingUrl) {
          window.open(row.trainingUrl, '_blank')
        }
        return
      }
      // If action is disabled, don't do anything
      if (!action.isEnabled) {
        return
      }
      // Handle based on action type
      if (action.actionType === 'CertificateDownload') {
        this.handleDownload(row)
      } else if (action.actionType === 'TrainingUrl' && action.url) {
        // If warningMessage exists, show dialog first
        if (action.warningMessage) {
          this.selectedRowForDialog = row
          this.showCertificateNotAvailableDialog = true
        } else {
          window.open(action.url, '_blank')
        }
      }
    },
    async handleDownload(row) {
      try {
        const response = await downloadCertificate(row.enrollmentId)

        // Create blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${row.certificateName}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading certificate:', error)
      }
    },
    handleTooltipMouseEnter(event, row) {
      const tooltipText = this.getActionTooltip(row)
      if (!tooltipText) {
        this.showTooltip = false
        return
      }
      const target = event.currentTarget || event.target
      const button = target.querySelector('button') || target
      const buttonRect = button.getBoundingClientRect()

      this.tooltipContent = tooltipText
      // Tooltip butonun altında ortalanmış gözüksün
      this.tooltipStyle = {
        top: `${buttonRect.bottom + 10}px`,
        left: `${buttonRect.left + buttonRect.width / 2}px`,
        transform: 'translateX(-50%)',
        minWidth: '160px',
        textAlign: 'center'
      }
      this.showTooltip = true
    },
    handleTooltipMouseLeave() {
      this.showTooltip = false
    },
    handleDialogClose() {
      this.showCertificateNotAvailableDialog = false
      this.selectedRowForDialog = null
    }
  }
}
</script>
<style>
.users-dashboard-your-certificates .datatable-tooltip {
  z-index: 9999999 !important;
  word-wrap: break-word;
  word-break: normal !important;
  white-space: normal;
  overflow-wrap: break-word;
}
</style>
