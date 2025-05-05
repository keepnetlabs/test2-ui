<template>
  <div>
    <div>
      <CampaignManagerReportBotActivityAlertBox
        v-if="!isLoading"
        :bot-activity-count="botActivityCount"
        :is-show-sandbox="isShowSandbox"
        @on-activity-change="handleActivity"
      />
    </div>
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
      @on-activity="handleActivity"
      @on-selection-text-change="handleSelectionChange"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          v-if="!getQuishingTypePrintOut()"
          :icon="tableOptions.rowActions[1].icon"
          :id="tableOptions.rowActions[1].id"
          :text="tableOptions.rowActions[1].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled || campaignDurationExpired()"
          :disabledTooltipText="
            campaignDurationExpired()
              ? 'You cannot resend this campaign because its lifetime has expired'
              : 'Resend'
          "
          @on-click="handleOnResend(scope.row)"
        />
        <DefaultButtonRowAction
          v-if="!getQuishingTypePrintOut()"
          :icon="tableOptions.rowActions[0].icon"
          :id="tableOptions.rowActions[0].id"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          @on-click="handleOnDetail(scope.row)"
        />
      </template>
      <template #datatable-custom-column="{ scope, col }">
        <CampaignManagerReportActivityColumn
          v-if="col.property === COLUMNS.ACTIVITY_TYPE.property"
          :scope="scope"
        />
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { COLUMNS } from './utils'
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
import QuishingService from '@/api/quishing'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'
import useSandboxTableActionLabel from '@/hooks/useSandboxTableActionLabel'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import CampaignManagerReportBotActivityAlertBox from '@/components/CampaignManagerReport/CampaignManagerReportBotActivityAlertBox.vue'
export default {
  name: 'CampaignManagerReportOpenedTable',
  components: {
    DataTable,
    CampaignManagerReportActivityColumn,
    DefaultButtonRowAction,
    CampaignManagerReportBotActivityAlertBox
  },
  mixins: [useLoading, useDefaultTableFunctions, useSandboxTableActionLabel],
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
    },
    isShowSandboxFromParent: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    getQuishingTypePrintOut: {
      type: Function
    },
    campaignDurationExpired: {
      type: Function
    }
  },
  data() {
    const isQuishingTypePrintout = this.getQuishingTypePrintOut()
    const rowActions = []
    const columns = [
      COLUMNS.FIRST_NAME,
      COLUMNS.LAST_NAME,
      COLUMNS.EMAIL,
      COLUMNS.DEPARTMENT,
      COLUMNS.PHISHING_SCENARIO_NAME,
      COLUMNS.LAST_OPENED
    ]
    if (isQuishingTypePrintout) {
      columns.push(COLUMNS.TIMES_OPENED_PRINTOUT)
    } else {
      columns.push(COLUMNS.TIMES_OPENED)
      rowActions.push(
        {
          name: labels.Details,
          id: 'btn-details--row-actions-campaign-manager-report-opened',
          icon: '$custom-details',
          action: 'on-detail',
          disabled: !this.$store.getters[
            'permissions/getQuishingCampaignReportsOpenedDetailsPermissions'
          ]
        },
        {
          name: labels.Resend,
          id: 'btn-resend--row-actions-campaign-manager-report-opened',
          icon: '$custom-resend',
          action: 'on-resend',
          disabled: false
        }
      )
    }
    columns.push({ ...COLUMNS.ACTIVITY_TYPE })
    return {
      COLUMNS,
      CONSTANTS: {
        id: 'campaign-manager-opened-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'FirstName' }),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.QUISHING_CAMPAIGN_MANAGER_REPORT_OPENED_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.QUISHING_CAMPAIGN_MANAGER_REPORT_OPENED_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: !isQuishingTypePrintout
        },
        columns,
        addButton: {
          show: false,
          icon: null,
          label: 'SHOW BOT ACTIVITY',
          action: 'on-activity',
          hideTooltip: true,
          type: 'outlined',
          id: 'btn-select--hide-sandbox-activity'
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportOpened
        },
        rowActions
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
    isShowSandbox(val) {
      this.$emit('update:is-show-sandbox-from-parent', val)
    }
  },
  methods: {
    handleSelectionChange(selectionCount) {
      this.$emit('on-selection-text-change', selectionCount)
    },
    callForData() {
      this.setLoading(true)
      if (typeof this.axiosPayload.activityType === 'undefined') this.axiosPayload.activityType = 0
      QuishingService.searchCampaignJobUserEmailOpened(
        this.axiosPayload,
        this.id,
        this.instanceGroup
      )
        .then((response) => {
          const {
            data: {
              data: {
                results,
                totalNumberOfRecords,
                totalNumberOfPages,
                pageNumber,
                totalSandBoxActivityCount
              }
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
          this.botActivityCount = totalSandBoxActivityCount || 0
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
          filter: this.axiosPayload.filter,
          activityType: this.axiosPayload.activityType
        }
        QuishingService.exportCampaignJobUserEmailOpened(payload, this.id, this.instanceGroup).then(
          (response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Quishing-Campaign-Report-Opened.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        )
      })
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [1],
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
