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
    @on-selection-text-change="handleSelectionChange"
  >
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :icon="tableOptions.rowActions[0].icon"
        :id="tableOptions.rowActions[0].id"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled || campaignDurationExpired()"
        :disabledTooltipText="
          campaignDurationExpired
            ? 'You cannot resend this campaign because its lifetime has expired'
            : 'Resend'
        "
        @on-click="handleOnResend(scope.row)"
      />
      <DefaultButtonRowAction
        :icon="tableOptions.rowActions[1].icon"
        :id="tableOptions.rowActions[1].id"
        :text="tableOptions.rowActions[1].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[1].disabled"
        @on-click="handleOnDetail(scope.row)"
      />
    </template>
    <template #datatable-custom-column="{ scope, col }">
      <CampaignManagerReportTimeZoneColumn
        v-if="col.property === COLUMNS.LAST_REPORTED.property"
        :scope="scope"
        :timeKey="COLUMNS.LAST_REPORTED.property"
        localTimeKey="lastReportedTimeToLocalUser"
      />
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import labels from '@/model/constants/labels'
import {
  exportCampaignJobUserPhishingReport,
  searchCampaignJobUserPhishingReport
} from '@/api/phishingsimulator'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import CampaignManagerReportTimeZoneColumn from '@/components/CampaignManagerReport/CampaignManagerReportTimeZoneColumn.vue'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

export default {
  name: 'CampaignManagerReportPhishingReportTable',
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
        id: 'campaign-manager-phishing-reporter-data-table',
        ascending: 'ascending'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'FirstName' }),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_REPORT_PHISHING_REPORTER_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_REPORT_PHISHING_REPORTER_TABLE,
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
          COLUMNS.EMAIL_TEMPLATE_LANGUAGE,
          COLUMNS.LAST_REPORTED,
          COLUMNS.TIMES_REPORTED
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportPhishingReporter
        },
        rowActions: [
          {
            name: labels.Resend,
            id: 'btn-resend--row-actions-campaign-manager-report-phishing-reporter',
            icon: '$custom-resend',
            action: 'on-resend',
            disabled: false
          },
          {
            name: labels.Details,
            id: 'btn-details--row-actions-campaign-manager-report-phishing-reporter',
            icon: '$custom-details',
            action: 'on-detail',
            disabled: !this.$store.getters[
              'permissions/getCampaignReportsPhishingReporterDetailsPermissions'
            ]
          }
        ]
      },
      languageOptions: []
    }
  },
  created() {
    this.callForLanguages()
  },
  mounted() {
    // DataTable component'i mount edildikten sonra filtreler localStorage'dan okunup axiosPayload'a uygulanır
    this.$nextTick(() => {
      this.callForData()
    })
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
        this.$set(
          this.tableOptions.columns.find((col) => col.property === 'emailTemplateLanguage'),
          'filterableItems',
          this.languageOptions.map((option) => ({ text: option.text, value: option.text })) || []
        )
        this?.$refs?.refTable?.reRenderFilters()
      })
    },
    handleSelectionChange(selectionCount) {
      this.$emit('on-selection-text-change', selectionCount)
    },
    callForData() {
      this.setLoading(true)
      searchCampaignJobUserPhishingReport(this.axiosPayload, this.id, this.instanceGroup)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results?.map((row) => {
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
        exportCampaignJobUserPhishingReport(payload, this.id, this.instanceGroup).then(
          (response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Campaign-Report-Phishing-Reporter.${
              item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
            }`
            link.click()
          }
        )
      })
    },
    handleOnResend(items, excludedResourceIdList, isSelectedAllEver) {
      const payload = {
        Types: [6],
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
