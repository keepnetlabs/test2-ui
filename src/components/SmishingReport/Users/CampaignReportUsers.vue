<template>
  <div id="training-report-users" class="training-report-users">
    <CampaignManagerReportResendDialog
      v-if="isShowResendDialog"
      :status="isShowResendDialog"
      :is-action-button-disabled="isResendActionButtonDisabled"
      @on-close="toggleIsShowResendDialog"
      @on-confirm="resendItem"
    />
    <CampaignReportUserInteractionsModal
      v-if="isShowInteractionsModal"
      :status="isShowInteractionsModal"
      :item="selectedRow"
      @on-close="toggleIsShowInteractionsModal"
    />
    <ElTabs
      v-model="selectedUserTab"
      class="k-sub-tab campaign-manager-last-step__phishing-scenario-tab"
    >
      <ElTabPane name="included" label="Included">
        <CampaignManagerReportHeader
          class="mb-6"
          title="Included Users"
          subtitle="All users who are included in this campaign within the selected target groups."
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
          @on-interactions="handleInteractions"
          @on-resend="handleOnResend"
        >
          <template v-slot:datatable-custom-column="{ scope, col }">
            <div class="smishing-report-users__status-column">
              <v-btn style="display: none;" />
              <Badge v-bind="getStatusBadgeProps(scope.row.status)" :col="col" size="medium" />
            </div>
          </template>
          <template #datatable-row-actions="{ scope }">
            <DefaultButtonRowAction
              :scope="scope"
              :disabled="tableOptions.rowActions[1].disabled"
              :icon="tableOptions.rowActions[1].icon"
              :text="tableOptions.rowActions[1].name"
              :checkIsOwnerProperty="false"
              @on-click="handleResend(scope.row)"
            />
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
      </ElTabPane>
      <ElTabPane name="excluded" label="Exluded">
        <CampaignReportExcludedUsers />
      </ElTabPane>
    </ElTabs>
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
import Badge from '@/components/Badge'
import { getStatusBadgeProps } from '@/components/SmishingReport/Users/utils'
import CampaignReportUserInteractionsModal from '@/components/SmishingReport/Users/CampaignReportUserInteractionsModal'
import CampaignManagerReportHeader from '@/components/SmishingReport/CampaignManagerReportHeader'
import AwarenessEducatorService from '@/api/awarenessEducator'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { useSmishingResend } from '@/hooks/useSmishingResend'
import CampaignReportExcludedUsers from '@/components/SmishingReport/Users/CampaignReportExcludedUsers'
export default {
  name: 'TrainingReportUsers',
  components: {
    DataTable,
    DefaultButtonRowAction,
    Badge,
    CampaignReportUserInteractionsModal,
    CampaignManagerReportHeader,
    CampaignReportExcludedUsers
  },
  mixins: [useLoading, useDefaultTableFunctions, useSmishingResend],
  props: {
    id: {
      type: String
    },
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      selectedUserTab: 'included',
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
            width: 150
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
            width: 150
          },
          {
            property: 'phoneNumber',
            align: 'left',
            editable: false,
            label: 'Phone Number',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 180
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
            width: 180
          },
          {
            property: 'phishingScenarioName',
            align: 'left',
            label: labels.ScenarioName,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: false,
            filterableType: 'text'
          },
          {
            property: 'lastInteractionDate',
            align: 'left',
            editable: false,
            label: 'Last Interaction',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'date'
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'slot',
            width: 200,
            props: {
              style: {
                maxWidth: '110px !important'
              }
            },
            overrideWidth: true,
            filterableType: 'select',
            filterableItems: [
              'Submitted MFA Code',
              'Not Responded',
              'Clicked',
              'Submitted Data',
              'In Queue',
              'Sending Error',
              'Cancelled'
            ]
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: 'You do not have any users who are included in this campaign'
        },
        rowActions: [
          {
            name: labels.Details,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-details',
            action: 'on-interactions'
            // disabled: !this.$store.getters['permissions/getCampaignReportsResendPermissions']
          },
          {
            name: labels.ReSend,
            id: 'btn-interactions--row-actions-training-report-users',
            icon: '$custom-resend',
            action: 'on-resend'
            // disabled: !this.$store.getters['permissions/getCampaignReportsOpenedDetailsPermissions']
          }
        ]
      },
      tableData: [],
      excludedUsersTableData: []
    }
  },
  mounted() {
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
        AwarenessEducatorService.exportTrainingReportUsers(payload, this.id).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Training-Users.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleResend(row) {
      this.selectedRow = row
      this.toggleIsShowResendDialog()
    },
    handleInteractions(row) {
      this.selectedRow = row
      this.toggleIsShowInteractionsModal()
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [0],
        items: Array.isArray(items) ? items.map((item) => item.resourceId) : [items.resourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter: this.axiosPayload.filter
      }
      this.resendPayload = payload
      this.toggleIsShowResendDialog()
    },
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
