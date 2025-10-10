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
    @downloadEvent="exportCampaignManagerReportRepliedTable"
    @refreshAction="callForData"
    @on-selection-text-change="handleSelectionChange"
  >
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :icon="tableOptions.rowActions[0].icon"
        :id="tableOptions.rowActions[0].id"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled || !scope.row.isTrackingReplyContentEnabled"
        disabled-tooltip-text="Save reply email content for review is off."
        @on-click="handleDetail(scope.row)"
      />
    </template>
    <template #datatable-custom-column="{ scope, col }">
      <CampaignManagerReportTimeZoneColumn
        v-if="col.property === COLUMNS.REPLY_SENT.property"
        :scope="scope"
        time-key="replySent"
        local-time-key="replySentToLocalUser"
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
import { exportCampaignJobUserReplied, searchCampaignJobUserReplied } from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import CampaignManagerReportTimeZoneColumn from '@/components/CampaignManagerReport/CampaignManagerReportTimeZoneColumn.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

export default {
  name: 'CampaignManagerReportRepliedTable',
  components: {
    DataTable,
    CampaignManagerReportTimeZoneColumn,
    DefaultButtonRowAction
  },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    id: {
      type: String
    },
    instanceGroup: {
      type: [String, Number]
    },
    passwordComplexities: {
      type: Array
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  inject: {
    campaignDurationExpired: {
      type: Function
    }
  },
  data() {
    return {
      COLUMNS,
      CONSTANTS: {
        id: 'campaign-manager-submitted-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'FirstName' }),
      isLoading: false,
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_SUBMITTED_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_SUBMITTED_TABLE,
        serverSideEvents: { pagination: true, search: true, sort: true },
        selectEvent: {
          resend: true
        },
        columns: [
          COLUMNS.FIRST_NAME,
          COLUMNS.LAST_NAME,
          COLUMNS.EMAIL,
          COLUMNS.DEPARTMENT,
          COLUMNS.PREFERREDLANGUAGE,
          COLUMNS.PHISHING_SCENARIO_NAME,
          COLUMNS.REPLY_TYPE,
          COLUMNS.REPLY_SENT
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportReplied
        },
        rowActions: [
          {
            name: labels.Preview,
            id: 'btn-preview--row-actions-campaign-manager-report-replied-data',
            icon: 'mdi-eye',
            action: 'on-preview',
            disabled: false
          }
        ]
      },
      languageOptions: []
    }
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
        if (departmentIndex) this.tableOptions.columns.splice(departmentIndex + 1, 0, ...fields)
      }
    }
  },
  created() {
    this.callForData()
    this.callForLanguages()
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            languageTypeName: language.name,
            value: language.resourceId
          })) || []
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'preferredLanguage'),
          'filterableItems',
          this.languageOptions || []
        )
        this?.$refs?.refTable?.reRenderFilters()
      })
    },
    handleSelectionChange(selectionCount) {
      this.$emit('on-selection-text-change', selectionCount)
    },
    callForData() {
      this.setLoading(true)
      searchCampaignJobUserReplied(this.axiosPayload, this.id, this.instanceGroup)
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
            return {
              ...row,
              ...customFields,
              preferredLanguage:
                this.languageOptions.find(
                  (option) => option.languageTypeName === row.preferredLanguage
                )?.text || row.preferredLanguage
            }
          })
        })
        .finally(this.setLoading)
    },
    exportCampaignManagerReportRepliedTable(downloadTypes) {
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
        exportCampaignJobUserReplied(payload, this.id, this.instanceGroup).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Campaign-Report-Replied-Data.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleDetail(row) {
      this.$emit('on-detail', row)
    }
  }
}
</script>
