<template>
  <div>
  <div>
    <CommonReportViewTargetGroupsModal
      v-if="isGroupsDialogOpen"
      :status="isGroupsDialogOpen"
      title="Groups"
      subtitle="Groups the user has been added to"
      :target-groups="selectedGroups"
      @on-close="handleGroupsDialogClose"
    />
      <CampaignManagerReportBotActivityAlertBox
        v-if="!isLoading && botActivityCount > 0"
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
            campaignDurationExpired()
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
        <CampaignManagerReportActivityColumn
          v-if="col.property === COLUMNS.ACTIVITY_TYPE.property"
          :scope="scope"
        />
        <CampaignManagerReportTimeZoneColumn
          v-if="col.property === COLUMNS.LAST_CLICKED.property"
          :scope="scope"
          :timeKey="COLUMNS.LAST_CLICKED.property"
          localTimeKey="lastClickedTimeToLocalUser"
        />
        <CampaignManagerReportGroupsColumn
          v-if="col.property === COLUMNS.GROUPS.property"
          :value="(scope.row && scope.row.targetGroups)"
          @click="handleGroupsClick"
        />
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
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'
import { getDefaultAxiosPayload } from '@/utils/functions'
import {
  exportCampaignJobUserEmailClicked,
  searchCampaignJobUserEmailClicked
} from '@/api/phishingsimulator'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'
import CampaignManagerReportGroupsColumn from '@/components/CampaignManagerReport/CampaignManagerReportGroupsColumn.vue'
import CommonReportViewTargetGroupsModal from '@/components/Common/Report/CommonReportViewTargetGroupsModal.vue'
import CampaignManagerReportTimeZoneColumn from '@/components/CampaignManagerReport/CampaignManagerReportTimeZoneColumn.vue'
import useSandboxTableActionLabel from '@/hooks/useSandboxTableActionLabel'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import CampaignManagerReportBotActivityAlertBox from '@/components/CampaignManagerReport/CampaignManagerReportBotActivityAlertBox.vue'
export default {
  name: 'CampaignManagerReportClickedTable',
  components: {
    CampaignManagerReportActivityColumn,
    CampaignManagerReportGroupsColumn,
    CommonReportViewTargetGroupsModal,
    CampaignManagerReportTimeZoneColumn,
    DataTable,
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
    campaignDurationExpired: {
      type: Function
    }
  },
  data() {
    return {
      COLUMNS,
      CONSTANTS: {
        id: 'campaign-manager-clicked-data-table',
        ascending: 'ascending'
      },
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
          COLUMNS.GROUPS,
          COLUMNS.PREFERREDLANGUAGE,
          COLUMNS.PHISHING_SCENARIO_NAME,
          COLUMNS.EMAIL_TEMPLATE_LANGUAGE,
          COLUMNS.LAST_CLICKED,
          COLUMNS.TIMES_CLICKED,
          { ...COLUMNS.ACTIVITY_TYPE }
        ],
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
            action: 'on-resend',
            disabled: false
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
      },
      languageOptions: [],
      isGroupsDialogOpen: false,
      selectedGroups: []
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
        const groupIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === COLUMNS.GROUPS.property
        )
        const departmentIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === 'department'
        )
        const insertIndex = groupIndex === -1 ? departmentIndex : groupIndex
        if (insertIndex !== -1) {
          this.tableOptions.columns.splice(insertIndex + 1, 0, ...fields)
        }
      }
    },
    isShowSandbox(val) {
      this.$emit('update:is-show-sandbox-from-parent', val)
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
    handleGroupsClick(groups) {
      this.selectedGroups = (groups || []).map((name) => ({ name }))
      this.isGroupsDialogOpen = true
    },
    handleGroupsDialogClose() {
      this.isGroupsDialogOpen = false
      this.selectedGroups = []
    },
    callForData() {
      this.setLoading(true)
      if (this.axiosPayload.activityType === undefined) this.axiosPayload.activityType = 0
      searchCampaignJobUserEmailClicked(this.axiosPayload, this.id, this.instanceGroup)
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
            return {
              ...row,
              ...customFields,
              preferredLanguage:
                this.languageOptions.find(
                  (option) => option.languageTypeName === row.preferredLanguage
                )?.text || row.preferredLanguage
            }
          })
          this.botActivityCount = totalSandBoxActivityCount || 0
        })
        .finally(this.setLoading)
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
          filter: this.axiosPayload.filter,
          activityType: this.axiosPayload.activityType
        }
        exportCampaignJobUserEmailClicked(payload, this.id, this.instanceGroup).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
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
    }
  }
}
</script>
