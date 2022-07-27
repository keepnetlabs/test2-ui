<template>
  <div id="training-report-users" class="training-report-users">
    <TrainingReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="confirmResend"
    />
    <TrainingReportUserInteractionsModal
      v-if="isShowInteractionsModal"
      :status="isShowInteractionsModal"
      :item="selectedRow"
      @on-close="toggleIsShowInteractionsModal"
    />
    <CampaignManagerReportHeader
      class="mb-6"
      title="Target Users"
      subtitle="All users enrolled to this training"
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
      @downloadEvent="exportTrainingReportUsersTable"
      @refreshAction="callForData"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <div class="training-report-users__status-column">
          <v-btn style="display: none;" />
          <Badge v-bind="getStatusBadgeProps(scope.row.status)" size="medium" />
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
        <RowActionsMenu v-if="false">
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            @on-click="handleResend(scope.row)"
          />
          <DefaultMenuRowAction
            v-if="!scope.row.isExcluded"
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleExclude(scope.row)"
          />
          <DefaultMenuRowAction
            v-else
            :scope="scope"
            :disabled="tableOptions.rowActions[3].disabled"
            :icon="tableOptions.rowActions[3].icon"
            :text="tableOptions.rowActions[3].name"
            :checkIsOwnerProperty="false"
            @on-click="handleInclude(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </DataTable>
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
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import TrainingReportResendDialog from '@/components/AwarenessEducator/TrainingReport/TrainingReportResendDialog'
import Badge from '@/components/Badge'
import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'
import TrainingReportUserInteractionsModal from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUserInteractionsModal'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'TrainingReportUsers',
  components: {
    TrainingReportResendDialog,
    DataTable,
    DefaultButtonRowAction,
    DefaultMenuRowAction,
    RowActionsMenu,
    Badge,
    TrainingReportUserInteractionsModal,
    CampaignManagerReportHeader
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
      isShowInteractionsModal: false,
      isResendActionButtonDisabled: false,
      CONSTANTS: {
        id: 'training-report-users-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'email' }),
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TRAINING_REPORT_USERS_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TRAINING_REPORT_USERS_TABLE,
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
            property: 'status',
            align: 'left',
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'slot',
            width: 150,
            filterableType: 'select',
            filterableItems: [
              'Not Responded',
              'Opened Email',
              'Clicked Link',
              'In Progress',
              'Completed',
              'In Queue',
              'Sending Error',
              'Cancelled',
              'Excluded'
            ]
          },
          {
            property: 'lastInteraction',
            align: 'left',
            editable: false,
            label: 'Last Interaction',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            filterableCustomFieldName: 'lastInteraction'
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
            name: labels.Interactions,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-details',
            action: 'on-interactions'
            // disabled: !this.$store.getters['permissions/getCampaignReportsResendPermissions']
          }
          /*
          {
            name: labels.ReSend,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-resend',
            action: 'on-resend'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
          {
            name: labels.ExcludeFromThisReport,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: 'mdi-circle-off-outline',
            action: 'on-exclude'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          },
          {
            name: labels.IncludeToThisReport,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: 'mdi-plus-circle',
            action: 'on-include'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          }
           */
        ]
      },
      tableData: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.searchTrainingReportUsers(this.axiosPayload, this.id)
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

    exportTrainingReportUsersTable(downloadTypes) {
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
    handleInteractions(row) {
      this.selectedRow = row
      this.toggleIsShowInteractionsModal()
    },
    handleExclude(row) {},
    handleInclude(row) {},
    confirmResend() {},
    toggleIsShowResendDialog() {
      if (this.isShowResendDialog) {
        this.selectedRow = null
      }
      this.isShowResendDialog = !this.isShowResendDialog
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
