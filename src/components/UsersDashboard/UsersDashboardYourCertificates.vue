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
      <DatatableLoading :loading="isLoading" />
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
          <VTooltip bottom>
            <template #activator="{ on }">
              <VBtn
                v-on="on"
                :id="`btn-action--your-certificates-${scope.$index}`"
                class="btn-hover"
                icon
                @click="handleAction(scope.row)"
              >
                <VIcon>
                  {{ getActionIcon(scope.row.trainingStatus) }}
                </VIcon>
              </VBtn>
            </template>
            <span>{{ getActionTooltip(scope.row.trainingStatus) }}</span>
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
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading.vue'
import { downloadCertificate } from '@/api/usersDashboard'

export default {
  name: 'UsersDashboardYourCertificates',
  components: {
    DataTable,
    Badge,
    DatatableLoading
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
        enrollmentId: cert.enrollmentId
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
    }
  },
  data() {
    return {
      tableId: 'users-dashboard-your-certificates-table'
    }
  },
  methods: {
    getStatusColor(status) {
      const statusMap = {
        'Not Started': '#757575',
        'Not Completed': '#B83A3A',
        Completed: '#217124',
        'In Queue': '#1173C1'
      }
      return statusMap[status] || '#757575'
    },
    getStatusLabel(status) {
      const statusMap = {
        'Not Started': this.labels.yourLearningNotStarted,
        'Not Completed': this.labels.yourLearningNotCompleted,
        Completed: this.labels.yourLearningCompleted,
        'In Queue': this.labels.yourCertificatesInQueue
      }
      return statusMap[status] || status
    },
    getActionIcon(status) {
      if (status === 'Completed') {
        return 'mdi-download'
      }
      return 'mdi-play-circle'
    },
    getActionTooltip(status) {
      if (status === 'Completed') {
        return this.labels.yourCertificatesDownloadCertificate
      }
      return this.labels.yourLearningStartTraining
    },
    handleAction(row) {
      if (row.trainingStatus === 'Completed') {
        this.handleDownload(row)
      } else {
        // If trainingUrl exists, open it in a new window
        if (row.trainingUrl) {
          window.open(row.trainingUrl, '_blank')
          return
        }
        console.log('Start training:', row)
      }
    },
    async handleDownload(row) {
      try {
        const targetUserResourceId = this.$route.query?.targetUserResourceId || '4BCeEWHwAKME'
        const response = await downloadCertificate(targetUserResourceId, row.enrollmentId)

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
    }
  }
}
</script>
