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
                @click="handleDownload(scope.row)"
              >
                <VIcon>mdi-download</VIcon>
              </VBtn>
            </template>
            <span>{{ labels.yourCertificatesDownloadCertificate }}</span>
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
  name: 'UsersDashboardYourCertificates',
  components: {
    DataTable,
    Badge
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
          minWidth:200,
          show: true,
          hideSort: true
        },
        {
          property: 'certificateDate',
          label: this.labels.yourCertificatesCertificateDate,
          type: 'text',
          minWidth:200,
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
        trainingUrl: cert.trainingUrl
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
        Completed: '#217124'
      }
      return statusMap[status] || '#757575'
    },
    getStatusLabel(status) {
      const statusMap = {
        'Not Started': this.labels.yourLearningNotStarted,
        'Not Completed': this.labels.yourLearningNotCompleted,
        Completed: this.labels.yourLearningCompleted
      }
      return statusMap[status] || status
    },
    handleDownload(row) {
      // TODO: Implement download certificate
      console.log('Download certificate:', row.certificateName)
    }
  }
}
</script>
