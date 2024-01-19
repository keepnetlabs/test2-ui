<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    is-server-side-selection
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
    @downloadEvent="exportCampaignManagerReportClickedTable"
    @refreshAction="callForData"
    @on-resend="handleOnResend"
    @on-detail="handleOnDetail"
    @on-activity="handleActivity"
  >
    <template #datatable-custom-column="{ scope, col }">
      <CampaignManagerReportActivityColumn
        v-if="col.property === COLUMNS.ACTIVITY_TYPE.property"
        :scope="scope"
      />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import { getDefaultAxiosPayload } from '@/utils/functions'
import {
  exportCampaignJobUserEmailClicked,
  searchCampaignJobUserEmailClicked
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { columnFilterChanged, createCustomFieldColumns } from '@/utils/helperFunctions'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'
export default {
  name: 'CampaignManagerReportClickedTable',
  components: { CampaignManagerReportActivityColumn, DataTable },
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
      COLUMNS,
      CONSTANTS: {
        id: 'campaign-manager-clicked-data-table',
        ascending: 'ascending'
      },
      tableActionLabel: 'SHOW SANDBOX ACTIVITY',
      isLoading: false,
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'FirstName' }),
      serverSideProps: new ServerSideProps(),
      serverSideEvents: { pagination: true, search: true, sort: true },
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_CLICKED_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_CLICKED_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          COLUMNS.FIRST_NAME,
          COLUMNS.LAST_NAME,
          COLUMNS.EMAIL,
          COLUMNS.DEPARTMENT,
          COLUMNS.PHISHING_SCENARIO_NAME,
          COLUMNS.LAST_CLICKED,
          COLUMNS.TIMES_CLICKED,
          COLUMNS.ACTIVITY_TYPE
        ],
        addButton: {
          show: true,
          icon: null,
          label: 'SHOW SANDBOX ACTIVITY',
          action: 'on-activity',
          tooltip: 'SHOW SANDBOX ACTIVITY',
          type: 'secondary',
          id: 'btn-select--hide-sandbox-activity'
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportClicked
        },
        selectEvent: {
          resend: true
        },
        rowActions: [
          {
            name: labels.Resend,
            id: 'btn-resend--row-actions-campaign-manager-report-clicked',
            icon: '$custom-resend',
            action: 'on-resend'
          },
          {
            name: labels.Details,
            id: 'btn-details--row-actions-campaign-manager-report-clicked',
            icon: '$custom-details',
            action: 'on-detail',
            disabled: !this.$store.getters[
              'permissions/getCampaignReportsClickedDetailsPermissions'
            ]
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
    },
    tableActionLabel(val) {
      this.$set(this.tableOptions.addButton, 'label', val)
      this.$set(this.tableOptions.addButton, 'tooltip', val)
      this.axiosPayload.activityType = Number(this.isShowSandbox)
      this.callForData()
    }
  },
  methods: {
    callForData() {
      this.setLoading(true)
      if (!this.axiosPayload.activityType) this.axiosPayload.activityType = 0
      searchCampaignJobUserEmailClicked(this.axiosPayload, this.id, this.instanceGroup)
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
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'activityType'
      )
      if (index !== -1) {
        const value = this.axiosPayload.filter.FilterGroups[0].FilterItems[index].Value
        if (value === '0,1' || value === '1,0') {
          this.axiosPayload.activityType = 2
          this.isShowSandbox = true
        } else if (value === '1') {
          this.axiosPayload.activityType = 1
          this.isShowSandbox = true
        } else {
          this.axiosPayload.activityType = 0
          this.isShowSandbox = false
        }
        this.setTableActionLabel()
      }
      this.callForData()
    },
    exportCampaignManagerReportClickedTable(downloadTypes) {
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
        exportCampaignJobUserEmailClicked(payload, this.id, this.instanceGroup).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Campaign-Report-Clicked.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [2],
        items: Array.isArray(items) ? items.map((item) => item.resourceId) : [items.resourceId],
        excludedItems: excludedResourceIdList || [],
        selectAll: !!isSelectedAllEver,
        filter: this.axiosPayload.filter
      }
      this.$emit('on-resend', payload)
    },
    handleOnDetail(row) {
      this.$emit('on-detail', row)
    },
    handleActivity() {
      this.isShowSandbox = !this.isShowSandbox
      this.setTableActionLabel()
    },
    setTableActionLabel() {
      this.tableActionLabel = this.isShowSandbox ? `HIDE SANDBOX ACTIVITY` : `SHOW SANDBOX ACTIVITY`
    }
  }
}
</script>
