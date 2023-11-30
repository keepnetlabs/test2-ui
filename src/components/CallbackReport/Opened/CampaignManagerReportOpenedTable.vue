<template>
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
    @downloadEvent="exportCampaignManagerReportOpenedTable"
    @refreshAction="callForData"
    @on-resend="handleOnResend"
    @on-detail="handleOnDetail"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import { COLUMNS, REPORT_TABS } from '@/components/CallbackReport/Opened/utils'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import CallbackService from '@/api/callback'

export default {
  name: 'CampaignManagerReportOpenedTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    instanceGroup: {
      type: [String, Number]
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'campaign-manager-opened-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'FirstName' }),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_OPENED_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_OPENED_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true
        },
        columns: [
          COLUMNS.FIRST_NAME,
          COLUMNS.LAST_NAME,
          COLUMNS.EMAIL,
          COLUMNS.DEPARTMENT,
          COLUMNS.PHISHING_SCENARIO_NAME,
          COLUMNS.LAST_OPENED,
          COLUMNS.TIMES_OPENED,
          COLUMNS.ACTIVITY_TYPE
        ],
        addButton: {
          show: false
          // icon: null,
          // label: 'Show Sandbox Activity',
          // action: 'handleShowSandboxActivity',
          // tooltip: 'Show Sandbox Activity',
          // type: 'secondary',
          // id: 'btn-select--show-sandbox-activity'
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportOpened
        },
        rowActions: [
          {
            name: labels.Resend,
            id: 'btn-resend--row-actions-campaign-manager-report-opened',
            icon: '$custom-resend',
            action: 'on-resend'
          },
          {
            name: labels.Details,
            id: 'btn-details--row-actions-campaign-manager-report-opened',
            icon: '$custom-details',
            action: 'on-detail',
            disabled: !this.$store.getters['permissions/getCallbackReportOpenedDetailsPermissions']
          }
        ]
      }
    }
  },
  created() {
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
      this.setLoading(true)
      CallbackService.getCampaignTabUsers(
        REPORT_TABS.OPENED,
        this.id,
        this.instanceGroup,
        this.axiosPayload
      )
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results.map((row) => {
            let customFields = {}
            row.customFieldValues.forEach((field) => {
              customFields[`${field.name}`] = field?.value
            })
            return { ...row, ...customFields }
          })
        })
        .finally(this.setLoading)
    },
    exportCampaignManagerReportOpenedTable(downloadTypes) {
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
        CallbackService.exportCampaignTabUsers(
          REPORT_TABS.OPENED,
          this.id,
          this.instanceGroup,
          payload
        ).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Callback-Report-Opened.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [REPORT_TABS.OPENED],
        items: Array.isArray(items) ? items.map((item) => item.resourceId) : [items.resourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter: this.axiosPayload.filter
      }
      this.$emit('on-resend', payload)
    },
    handleOnDetail(row) {
      this.$emit('on-detail', row)
    }
  }
}
</script>
