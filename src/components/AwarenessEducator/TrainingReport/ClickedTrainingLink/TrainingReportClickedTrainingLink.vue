<template>
  <div id="training-report-clicked-training-link" class="training-report-clicked-training-link">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="confirmResend"
    />
    <TrainingReportClickedTrainingLinkDetails
      v-if="isShowDetailsModal"
      :status="isShowDetailsModal"
      :item="selectedRow"
      @on-close="toggleIsShowDetailsModal"
    />
    <CampaignManagerReportHeader
      class="mb-6"
      title="Users who clicked the training link"
      subtitle="List of users who clicked the training URL"
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
      @downloadEvent="exportTrainingReportOpenedTrainingEmailTable"
      @refreshAction="callForData"
      @on-resend="handleOnResend"
      @on-details="handleOnDetail"
    />
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import TrainingReportClickedTrainingLinkDetails from '@/components/AwarenessEducator/TrainingReport/ClickedTrainingLink/TrainingReportClickedTrainingLinkDetails'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'TrainingReportClickedTrainingLink',
  components: {
    TrainingReportResendDialog,
    DataTable,
    CampaignManagerReportHeader,
    TrainingReportClickedTrainingLinkDetails
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      selectedRow: null,
      isShowResendDialog: false,
      isShowDetailsModal: false,
      isResendActionButtonDisabled: false,
      CONSTANTS: {
        id: 'training-report-opened-training-email-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'LastClicked' }),
      resendPayload: null,
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_CLICKED_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_CLICKED_TABLE,
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
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'lastClicked',
            align: 'left',
            editable: false,
            label: 'Last Clicked',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
          },
          {
            property: 'timesClicked',
            align: 'left',
            editable: false,
            label: 'Times Clicked',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'number'
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
            id: 'btn-interactions--row-actions-training-report-users',
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
      tableData: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.clickedTrainingReportEmails(this.axiosPayload, this.id)
        .then((response) => {
          debugger
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    exportTrainingReportOpenedTrainingEmailTable(downloadTypes) {
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
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [2],
        items: Array.isArray(items) ? items.map((item) => item.resourceId) : [items.resourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter: this.axiosPayload.filter
      }
      this.resendPayload = payload
      this.toggleIsShowResendDialog()
    },
    handleOnDetail(row) {
      this.selectedRow = row
      this.toggleIsShowDetailsModal()
    },
    confirmResend() {},
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
    },
    toggleIsShowDetailsModal() {
      if (this.isShowDetailsModal) {
        this.selectedRow = null
      }
      this.isShowDetailsModal = !this.isShowDetailsModal
    }
  }
}
</script>
