<template>
  <div>
    <CampaignManagerReportHeader
      class="mb-6"
      title="Target Users"
      subtitle="List of target users of this campaign"
    />
    <VishingReportUserInteractionsModal
      v-if="isShowInteractionsModal"
      :status="isShowInteractionsModal"
      :item="selectedRow"
      @on-close="toggleIsShowInteractionsModal"
    />
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
      selectable
      filterable
      options
      is-server-side-selection
      is-server-side
      :loading="isLoading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :server-side-props="serverSideProps"
      :server-side-events="tableOptions.serverSideEvents"
      :row-actions="tableOptions.rowActions"
      :add-button="tableOptions.addButton"
      :select-event="tableOptions.selectEvent"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @downloadEvent="exportVishingReportUsers"
      @refreshAction="callForData"
      @on-interactions="handleInteractions"
    >
      <template v-slot:datatable-custom-column="{ scope, col }">
        <div class="vishing-report-users__status-column">
          <v-tooltip
            bottom
            :disabled="scope.row.status !== 'CallingError' && scope.row.status !== 'Busy'"
          >
            <template v-slot:activator="{ on }">
              <v-btn style="display: none;" />
              <Badge
                v-bind="getStatusBadgeProps(scope.row.status)"
                :listeners="on"
                size="medium"
                :col="col"
              />
            </template>
            <span>{{ getErrorMessage(scope.row) }}</span>
          </v-tooltip>
        </div>
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
          @on-click="handleInteractions(scope.row)"
        />
      </template>
    </DataTable>
  </div>
</template>

<script>
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { exportVishingUsers, getVishingReportUsers } from '@/api/vishing'
import { getStatusBadgeProps } from '@/components/VishingReport/utils'
import Badge from '@/components/Badge'
import VishingReportUserInteractionsModal from '@/components/VishingReport/VishingReportUserInteractionsModal.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
export default {
  name: 'VishingReportUsers',
  components: {
    DataTable,
    CampaignManagerReportHeader,
    Badge,
    VishingReportUserInteractionsModal,
    DefaultButtonRowAction
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedRow: null,
      isShowInteractionsModal: false,
      CONSTANTS: {
        id: 'vishing-report-users-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.VISHING_REPORT_USERS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.VISHING_REPORT_USERS_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: false,
          clipboard: true
        },
        columns: [
          {
            property: 'firstName',
            align: 'left',
            editable: false,
            label: 'First Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            minWidth: 200,
            overrideWidth: true
          },
          {
            property: 'lastName',
            align: 'left',
            editable: false,
            label: 'Last Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            minWidth: 180,
            overrideWidth: true
          },
          {
            property: 'phoneNumber',
            align: 'right',
            editable: false,
            label: 'Phone Number',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            minWidth: 160,
            overrideWidth: true
          },
          {
            property: 'department',
            align: 'left',
            fixed: false,
            editable: false,
            label: 'Department',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            minWidth: 180,
            overrideWidth: true
          },
          {
            property: 'callDate',
            align: 'right',
            editable: false,
            label: 'Call Date',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            minWidth: 180,
            overrideWidth: true,
            filterableType: 'date'
          },
          {
            property: 'status',
            align: 'center',
            fixed: false,
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'slot',
            minWidth: 200,
            props: {
              style: {
                maxWidth: '110px !important'
              }
            },
            overrideWidth: true,
            filterableType: 'select',
            filterableItems: [
              { text: 'Not Responded', value: 'NotResponded' },
              'Answered',
              'Vished',
              'Busy',
              { text: 'In Queue', value: 'InQueue' },
              { text: 'Calling Error', value: 'CallingError' },
              'Cancelled'
            ]
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyTrainingReportUsers
        },
        rowActions: [
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-vishing-report-users',
            icon: '$custom-details',
            action: 'on-interactions'
          }
        ]
      },
      tableData: []
    }
  },
  mounted() {
    this.callForData()
  },
  watch: {
    customFields: {
      deep: true,
      immediate: true,
      handler(val) {
        const fields = createCustomFieldColumns(val)
        const departmentIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === 'department'
        )
        if (departmentIndex) {
          this.tableOptions.columns.splice(departmentIndex + 1, 0, ...fields)
        }
      }
    }
  },
  methods: {
    callForData() {
      this.isLoading = true
      getVishingReportUsers(this.axiosPayload, this.id)
        .then((response) => {
          const { data: { data = {} } = {} } = response || {}
          this.serverSideProps.totalNumberOfRecords = data.totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = data.totalNumberOfPages
          this.serverSideProps.pageNumber = data.pageNumber
          this.tableData = data?.results?.map((row) => {
            let customFields = {}
            row.customFieldValues.forEach((field) => {
              customFields[`${field.name}`] = field?.value
            })
            return { ...row, ...customFields }
          })
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(this.setLoading)
    },
    getErrorMessage(row = {}) {
      if (row.status === 'CallingError' || row.status === 'Busy') {
        return row?.errorMessage || ''
      }
      return ''
    },
    exportVishingReportUsers(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }
        exportVishingUsers(payload, this.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Vishing-Users.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    handleInteractions(row) {
      this.selectedRow = row
      this.toggleIsShowInteractionsModal()
    },
    toggleIsShowInteractionsModal() {
      if (this.isShowInteractionsModal) {
        this.selectedRow = null
      }
      this.isShowInteractionsModal = !this.isShowInteractionsModal
    }
  }
}
</script>
