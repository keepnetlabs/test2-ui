<template>
  <div>
    <DataTable
      id="quishing-email-templates-data-table"
      ref="refEmailTemplatesList"
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
      :download-button="tableOptions.downloadButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @onEmptyBtnClicked="handleEmitEmailTemplateModal(null, false)"
      @addAction="handleEmitEmailTemplateModal(null, false)"
      @downloadEvent="exportQuishingEmailTemplates"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @handleMultipleDelete="handleMultipleDelete"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :scope="scope"
          :id="tableOptions.rowActions[0].id"
          :icon="tableOptions.rowActions[0].icon"
          :disabled="tableOptions.rowActions[0].disabled"
          :text="tableOptions.rowActions[0].name"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
        />
        <RowActionsMenu>
          <ScenariosRowActionsEditButton
            :id="tableOptions.rowActions[1].id"
            :scope="scope"
            :name="tableOptions.rowActions[1].name"
            :disabled="tableOptions.rowActions[1].disabled"
            @on-click="handleEmitEmailTemplateModal(scope.row, false)"
          />
          <DefaultMenuRowAction
            v-if="checkIsQuishingTypePrintout(scope.row)"
            :scope="scope"
            :id="tableOptions.rowActions[4].id"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[4].disabled"
            :icon="tableOptions.rowActions[4].icon"
            :text="tableOptions.rowActions[4].name"
            :checkIsOwnerProperty="false"
            @on-click="handlePrintPreview(scope.row)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :id="tableOptions.rowActions[2].id"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleEmitEmailTemplateModal(scope.row, true)"
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
      <template #addUsers>
        <v-menu :offset-y="true" bottom left>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  v-on="{ ...tooltip, ...menu }"
                  :disabled="
                    !$store.getters['permissions/getQuishingEmailTemplatesCreatePermissions']
                  "
                  id="btn-add--quishing-template"
                  class="button-new"
                  style="margin-right: 10px;"
                  rounded
                  color="#2196f3"
                >
                  <v-icon style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
                  <span class="button-new__text">NEW</span>
                </v-btn>
              </template>
              <span class="tooltip-span">Add a Template</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="item in addQuishingItems"
              :key="item.id"
              :id="item.id"
              :disabled="item.disabled"
              @click="handleAddQuishingTemplate(item)"
            >
              <v-list-item-title class="add-users__title">{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </DataTable>
  </div>
</template>
<script>
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  LABEL_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { COMMON_SIMULATOR_COLUMNS } from '@/components/Common/Simulator/utils'
import { useLoading } from '@/hooks/useLoading'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import QuishingService from '@/api/quishing'
import DataTable from '@/components/DataTable.vue'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton.vue'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

export default {
  name: 'QuishingEmailTemplatesTable',
  components: {
    ScenariosRowActionsDeleteButton,
    DefaultButtonRowAction,
    DefaultMenuRowAction,
    ScenariosRowActionsEditButton,
    RowActionsMenu,
    DataTable
  },
  mixins: [useLoading, useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      QUISHING_EMAIL_TEMPLATE_TYPES,
      tableData: [],
      activeTemplateTypes: [
        QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
      ],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.QUISHING_EMAIL_TEMPLATES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.QUISHING_EMAIL_TEMPLATES,
        columns: [
          COMMON_SIMULATOR_COLUMNS.TEMPLATE_NAME,
          COMMON_SIMULATOR_COLUMNS.QUISHING_TYPE,
          COMMON_SIMULATOR_COLUMNS.QUISHING_CATEGORY_NAME,
          COMMON_SIMULATOR_COLUMNS.LANGUAGE,
          COMMON_SIMULATOR_COLUMNS.TAGS,
          COMMON_SIMULATOR_COLUMNS.DIFFICULTY_EMAIL_TEMPLATE,
          COMMON_SIMULATOR_COLUMNS.CREATE_TIME,
          COMMON_SIMULATOR_COLUMNS.CREATED_BY
        ],
        rowActions: [
          {
            name: labels.Preview,
            icon: 'mdi-eye',
            action: 'handlePreview',
            id: 'btn-preview--email-templates-row-actions'
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getQuishingEmailTemplatesEditPermissions'],
            id: 'btn-edit--email-templates-row-actions'
          },
          {
            name: labels.Duplicate,
            icon: 'mdi-content-copy',
            action: 'disable',
            id: 'btn-duplicate--email-templates-row-actions'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters[
              'permissions/getQuishingEmailTemplatesDeletePermissions'
            ],
            id: 'btn-delete--email-templates-row-actions'
          },
          {
            name: labels.PrintPreview,
            icon: 'mdi-file-eye',
            action: 'printPreviewAction',
            id: 'btn-preview--email-templates-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getQuishingEmailTemplatesExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_EMAIL_TEMPLATES,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--emailTemplates'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Template',
          id: 'btn-add--emailTemplates',
          disabled: !this.$store.getters['permissions/getQuishingEmailTemplatesCreatePermissions']
        }
      },
      addQuishingItems: [
        { text: 'Email Template', id: 'btn-add-quishing-template' },
        {
          text: 'Individual Printout Template',
          id: 'btn-add-individual-printout-template'
        }
      ],
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  mounted() {
    this.callForLanguages('refEmailTemplatesList')
    this.callForData()
  },
  methods: {
    checkIsQuishingTypePrintout(row) {
      if (!row) return false
      return row.quishingType.toLowerCase() === QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    },
    callForData() {
      this.setLoading(true)
      this.axiosPayload.templateTypes = this.activeTemplateTypes
      QuishingService.searchQuishingEmailTemplates(this.axiosPayload)
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
          this.tableData = results
        })
        .finally(this.setLoading)
    },
    handleEmitEmailTemplateModal(row = {}, isDuplicate = false) {
      if (this.checkIsQuishingTypePrintout(row)) {
        this.$emit('on-add-individual-printout-template', row, isDuplicate)
      } else {
        this.$emit('on-edit-or-new', row, isDuplicate)
      }
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
    handleAddQuishingTemplate(item = { text: '' }) {
      if (item.text === this.addQuishingItems[0].text) {
        this.handleEmitEmailTemplateModal(null, false)
      }
      if (item.text === this.addQuishingItems[1].text) {
        this.$emit('on-add-individual-printout-template', null, false)
      }
    },
    exportQuishingEmailTemplates({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter,
          templateTypes: this.activeTemplateTypes
        }
        QuishingService.exportQuishingEmailTemplates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Quishing-Templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handlePrintPreview(row = {}) {
      QuishingService.getQuishingPdfPreviewContent(row.resourceId).then((response) => {
        const file = new File([response.data], 'Quishing PDF Preview', {
          type: 'application/pdf'
        })
        const fileURL = URL.createObjectURL(file)
        const newWindow = window.open(fileURL)
        newWindow.onload = function () {
          setTimeout(() => {
            newWindow.document.title = 'Quishing PDF Preview'
          }, 250)
        }
      })
    },
    columnFilterChanged(filter) {
      if (filter.FieldName === 'quishingType') {
        if (!filter.Value)
          this.activeTemplateTypes = [
            QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
            QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
          ]
        else {
          this.activeTemplateTypes = filter.Value.split(',')
        }
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
          filter,
          this.axiosPayload
        )
      }
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      if (fieldName === 'quishingType') {
        this.activeTemplateTypes = [
          QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
          QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
        ]
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
          fieldName,
          this.axiosPayload
        )
      }
      this.callForData()
    }
  }
}
</script>
