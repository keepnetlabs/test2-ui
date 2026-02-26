<template>
  <DataTable
    id="quishing-landing-page-data-table"
    ref="refLandingPageList"
    is-server-side
    is-server-side-selection
    selectable
    filterable
    options
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.empty"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :addButton="tableOptions.addButton"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :download-button="tableOptions.downloadButton"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @onEmptyBtnClicked="handleEmitLandingPageTemplateModal(null, false)"
    @addAction="handleEmitLandingPageTemplateModal(null, false)"
    @downloadEvent="exportLandingPageTemplates"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @refreshAction="callForData"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @handleMultipleDelete="handleMultipleDelete"
  >
    <template #datatable-custom-column="{ scope }">
      <LanguagesColumn
        v-if="scope.column.property === 'languageTypeName'"
        :value="scope.row.languageTypeName"
        :preferred-language-types="preferredLanguageTypes"
      />
      <span v-else-if="scope.column.property === 'isInvisibleCaptchaEnabled'">
        {{ scope.row.isInvisibleCaptchaEnabled ? 'Enabled' : 'Disabled' }}
      </span>
    </template>
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :id="tableOptions.rowActions[0].id"
        :icon="tableOptions.rowActions[0].icon"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled"
        :checkIsOwnerProperty="false"
        @on-click="handlePreview(scope.row)"
      />
      <RowActionsMenu>
        <ScenariosRowActionsEditButton
          :id="tableOptions.rowActions[1].id"
          :scope="scope"
          :name="tableOptions.rowActions[1].name"
          :disabled="tableOptions.rowActions[1].disabled"
          @on-click="handleEmitLandingPageTemplateModal(scope.row, false)"
        />
        <DefaultMenuRowAction
          :id="tableOptions.rowActions[2].id"
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[2].disabled"
          :icon="tableOptions.rowActions[2].icon"
          :text="tableOptions.rowActions[2].name"
          :checkIsOwnerProperty="false"
          @on-click="handleEmitLandingPageTemplateModal(scope.row, true)"
        />
        <ScenariosRowActionsDeleteButton
          :id="tableOptions.rowActions[3].id"
          :scope="scope"
          :name="tableOptions.rowActions[3].name"
          :disabled="tableOptions.rowActions[3].disabled"
          @on-click="handleDelete(scope.row)"
        />
      </RowActionsMenu>
    </template>
  </DataTable>
</template>

<script>
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import DataTable from '@/components/DataTable.vue'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton.vue'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'
import { useLoading } from '@/hooks/useLoading'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { COMMON_SIMULATOR_COLUMNS } from '@/components/Common/Simulator/utils'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QuishingService from '@/api/quishing'
import LanguagesColumn from '@/components/Common/Simulator/LanguagesColumn/LanguagesColumn.vue'

export default {
  name: 'QuishingLandingPageTemplatesTable',
  components: {
    LanguagesColumn,
    DefaultMenuRowAction,
    RowActionsMenu,
    ScenariosRowActionsEditButton,
    DataTable,
    DefaultButtonRowAction,
    ScenariosRowActionsDeleteButton
  },
  mixins: [useLoading, useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  props: {
    landingPageData: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.QUISHING_LANDING_PAGES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.QUISHING_LANDING_PAGES,
        columns: [
          COMMON_SIMULATOR_COLUMNS.TEMPLATE_NAME,
          COMMON_SIMULATOR_COLUMNS.QUISHING_METHOD,
          { ...COMMON_SIMULATOR_COLUMNS.LANGUAGES, type: 'slot' },
          COMMON_SIMULATOR_COLUMNS.TAGS,
          COMMON_SIMULATOR_COLUMNS.DIFFICULTY,
          COMMON_SIMULATOR_COLUMNS.CREATE_TIME,
          COMMON_SIMULATOR_COLUMNS.CREATED_BY,
          {
            property: 'isInvisibleCaptchaEnabled',
            align: 'left',
            editable: false,
            label: 'Stop Bot Activity',
            sortable: false,
            hideSort: true,
            show: true,
            type: 'slot',
            width: 175
          }
        ],
        rowActions: [
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            id: 'btn-preview--landing-page-templates-row-actions'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters[
              'permissions/getQuishingLandingPageTemplatesEditPermissions'
            ],
            id: 'btn-edit--landing-page-templates-row-actions'
          },
          {
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'duplicate',
            id: 'btn-duplicate--landing-page-templates-row-actions'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters[
              'permissions/getQuishingLandingPageTemplatesDeletePermissions'
            ],
            id: 'btn-delete--landing-page-templates-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters[
            'permissions/getQuishingLandingPageTemplatesExportPermissions'
          ]
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        empty: {
          message: 'You do not have any landing page template',
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--landingPage'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Template',
          id: 'btn-add--landingPage',
          disabled: !this.$store.getters[
            'permissions/getQuishingLandingPageTemplatesCreatePermissions'
          ]
        }
      },
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    preferredLanguageTypes() {
      return this.landingPageData?.preferredLanguageTypes || []
    }
  },
  watch: {
    landingPageData(val) {
      if (!val) return
      this.$set(
        this.tableOptions.columns[1],
        'filterableItems',
        (val.methodTypes || []).map((item) => item.text)
      )
      this.$set(
        this.tableOptions.columns[4],
        'filterableItems',
        (val.difficultyTypes || []).map((item) => item.text)
      )
      this?.$refs?.refLandingPageList?.reRenderFilters()
    }
  },
  mounted() {
    this.callForLanguages('refLandingPageList')
    this.callForData()
  },
  methods: {
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      const filterItemIndex = this.axiosPayload.filter.FilterGroups[1].FilterItems.findIndex(
        (col) => col.FieldName === 'isInvisibleCaptchaEnabled'
      )
      if (filterItemIndex !== -1) {
        this.axiosPayload.filter.FilterGroups[1].FilterItems.splice(filterItemIndex, 1)
      }
      this.resetPageNumber()
      this.callForData()
    },
    callForData() {
      this.setLoading(true)
      QuishingService.searchLandingPageList(this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } =
            response?.data?.data || {}
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          const { results = [] } = data
          this.tableData =
            results?.map((item) => ({
              ...item,
              languageTypeName:
                this.languageFilterOptions.find(
                  (lang) => lang.languageName === item.languageTypeName
                )?.text || item.languageTypeName
            })) || []
        })
        .finally(this.setLoading)
    },
    handleEmitLandingPageTemplateModal(row = {}, isDuplicate = false) {
      this.$emit('on-edit-or-new', row, isDuplicate)
    },
    handlePreview(row = {}) {
      this.$emit('on-preview', row)
    },
    handleDelete(row = {}) {
      this.$emit('on-delete', row)
    },
    handleMultipleDelete(selections, excludedItems, selectAll) {
      this.$emit('on-multiple-delete', {
        selections,
        excludedItems,
        selectAll,
        axiosPayload: this.axiosPayload,
        serverSideProps: this.serverSideProps
      })
    },
    exportLandingPageTemplates({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        QuishingService.exportLandingPageTemplates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Quishing-Landing-Page-Templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
