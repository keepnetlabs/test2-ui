<template>
  <div id="training-report-no-response" class="training-report-no-response">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="confirmResend"
    />
    <CampaignManagerReportHeader
      class="mb-6"
      title="Users who haven’t opened the training email"
      subtitle="List of users who had no interaction with the training email"
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
      @downloadEvent="exportTrainingReportNoResponseTable"
      @refreshAction="callForData"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
          @on-click="handleResend(scope.row)"
        />
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
export default {
  name: 'TrainingReportExamResults',
  components: {
    TrainingReportResendDialog,
    DataTable,
    DefaultButtonRowAction,
    CampaignManagerReportHeader
  },
  mixins: [useLoading],
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      selectedRow: null,
      isShowResendDialog: false,
      isResendActionButtonDisabled: false,
      CONSTANTS: {
        id: 'training-report-no-response-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'EmailSendDate' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_NO_RESPONSE_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_NO_RESPONSE_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true
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
            width: 150
          },
          {
            property: 'lastName',
            align: 'left',
            editable: false,
            label: 'Last Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'email',
            align: 'left',
            editable: false,
            label: 'Email',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'department',
            align: 'left',
            editable: false,
            label: 'Department',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'emailSendDate',
            align: 'left',
            editable: false,
            label: 'Email Send Date',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
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
            name: labels.Resend,
            id: 'btn-no-response--row-actions-training-report-users',
            icon: '$custom-resend',
            action: 'on-resend'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-details',
            action: 'on-details'
            // disabled: !this.$store.getters['permissions/getCampaignReportsResendPermissions']
          }
        ]
      },
      tableData: [
        {
          firstName: 'Bruce',
          lastName: 'Wayne',
          email: 'bruce@wayne.com',
          department: 'Executives',
          emailSendDate: '31.05.2021 16:31:33'
        },
        {
          firstName: 'Bruce',
          lastName: 'Wayne',
          email: 'bruce@wayne.com',
          department: 'Executives',
          emailSendDate: '31.05.2021 16:31:33'
        }
      ]
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      // this.setLoading(true)
      // searchCampaignJobUserEmailOpened(this.axiosPayload, this.id)
      //   .then((response) => {
      //     const {
      //       data: {
      //         data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
      //       }
      //     } = response
      //     this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
      //     this.serverSideProps.totalNumberOfPages = totalNumberOfPages
      //     this.serverSideProps.pageNumber = pageNumber
      //     this.tableData = results
      //   })
      //   .finally(this.setLoading)
    },
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === this.CONSTANTS.ascending
      this.axiosPayload.orderBy = prop
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
    },
    exportTrainingReportNoResponseTable(downloadTypes) {
      // downloadTypes.exportTypes.forEach((item) => {
      //   let payload = {
      //     pageNumber: downloadTypes.pageNumber,
      //     pageSize: downloadTypes.pageSize,
      //     orderBy: this.axiosPayload.orderBy,
      //     ascending: this.axiosPayload.ascending,
      //     reportAllPages: downloadTypes.reportAllPages,
      //     exportType: item === 'XLS' ? 'Excel' : item,
      //     filter: this.axiosPayload.filter
      //   }
      //   exportCampaignJobUserEmailOpened(payload, this.id).then((response) => {
      //     const { data } = response
      //     const link = document.createElement('a')
      //     link.href = window.URL.createObjectURL(data)
      //     link.download = `Campaign-Report-Opened.${
      //       item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
      //     }`
      //     link.click()
      //   })
      // })
    },
    handleResend(row) {
      this.selectedRow = row
      this.toggleIsShowResendDialog()
    },
    confirmResend() {},
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
    }
  }
}
</script>
