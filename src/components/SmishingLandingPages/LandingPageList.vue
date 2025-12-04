<template>
  <div id="landingPageList">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewLandingPage
        ref="newLandingPage"
        :status="modalStatus"
        :emailTemplateId="emailTemplateId"
        :isEdit="isEdit"
        :isDuplicate="isDuplicate"
        :editableFormValues="editableFormValues"
        :landingPageData="landingPageData"
        @changeNewEmailTemplateModalStatus="changeNewEmailTemplateModalStatus"
      />
    </v-overlay>
    <CommonSimulatorEmailTemplateDeleteDialog
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selected-email-template="selectedEmailTemplate"
      :api-func="deleteLandingPageTemplate"
      :templateCount="multipleDeletedTemplatesCount"
      :multipleDeleteApiFunc="bulkDeleteLandingPageTemplates"
      :multipleDeletePayload="multipleTemplatesPayload"
      :isMultiple="isMultipleDelete"
      :type="SCENARIO_DELETE_DIALOG_TYPES.LANDING_PAGE"
      @on-success="handleSuccessDeleteAction"
      @on-success-multiple="handleSuccessMultipleDeleteAction"
      @on-close="showDeleteModal = false"
    />
    <app-dialog
      v-if="isTemplateDetails"
      custom-size="1600"
      max-height
      max-height-size="900"
      :status="isTemplateDetails"
      @changeStatus="isTemplateDetails = false"
      icon="mdi-eye"
      :title="selectedTemplateHeader"
      :subtitle="'Landing Page Template Preview'"
      :size="'ultraMaximum'"
    >
      <template #app-dialog-body>
        <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
        <LandingPageTemplateModalPreview
          v-show="!isPreviewLoading"
          :templateName="landingPageParams.name"
          :landingPageTemplates="landingPageTemplates"
          :phishingUrl="landingPageParams.urlTemplate"
        />
      </template>
      <template #app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            id="btn-close--landing-page-preview-popup"
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isTemplateDetails = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>
    <DataTable
      v-if="getSmishingLandingPageTemplatesSearchPermissions"
      id="landingPage-data-table"
      ref="refLandingPageList"
      is-server-side
      is-server-side-selection
      selectable
      filterable
      options
      :loading="loading"
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
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewEmailTemplateModalStatus(true)"
      @downloadEvent="exportLandingPage"
      @handleMultipleDelete="handleMultipleDelete"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
      <template #datatable-custom-column="{ scope }">
        <span v-if="scope.column.property === 'isInvisibleCaptchaEnabled'">
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
            @on-click="handleEdit(scope.row, false)"
          />
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[2].id"
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleEdit(scope.row, true)"
          />
          <ScenariosRowActionsDeleteButton
            :id="tableOptions.rowActions[3].id"
            :scope="scope"
            :name="tableOptions.rowActions[3].name"
            :disabled="tableOptions.rowActions[3].disabled"
            @on-click="handleActionDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import NewLandingPage from '@/components/SmishingLandingPages/NewLandingPage'
import AppDialog from '@/components/AppDialog'
import {
  getStoreValue,
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import SmishingService from '@/api/smishing'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import LandingPageTemplateModalPreview from '@/components/SmishingLandingPages/LandingPageTemplateModalPreview'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'
import { SCENARIO_DELETE_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

export default {
  name: 'EmailTemplates',
  components: {
    CommonSimulatorEmailTemplateDeleteDialog,
    ScenariosRowActionsDeleteButton,
    ScenariosRowActionsEditButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DatatableLoading,
    DataTable,
    NewLandingPage,
    AppDialog,
    LandingPageTemplateModalPreview
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      SCENARIO_DELETE_DIALOG_TYPES,
      landingPageData: null,
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      isMultipleDelete: false,
      multipleDeletedTemplatesCount: 0,
      multipleTemplatesPayload: {},
      emailTemplateId: null,
      landingPageParams: {},
      selectedLandingPageIndex: 0,
      landingPageTemplates: [],
      isPreviewLoading: false,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedEmailTemplate: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.LANDINGPAGES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.LANDINGPAGES,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: labels.TemplateName,
            sortable: true,
            show: true,
            type: 'text',
            // type: "slot",
            fixed: 'left',
            width: 240,
            filterableType: 'text'
          },
          {
            property: 'method',
            align: 'left',
            editable: false,
            label: labels.Method,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240,
            filterableType: 'select'
          },
          {
            property: PROPERTY_STORE.LANGUAGE,
            align: 'left',
            editable: false,
            label: labels.LANGUAGE,
            sortable: true,
            show: true,
            type: 'multiText',
            fixed: false,
            width: 175,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'languageTypeResourceId'
          },
          {
            property: PROPERTY_STORE.TAGS,
            align: 'left',
            editable: false,
            label: 'Tags',
            fixed: false,
            sortable: true,
            show: true,
            type: 'smallBadge',
            width: 150,
            hasTooltip: true,
            filterableType: 'text'
          },
          {
            property: 'difficulty',
            align: 'center',
            editable: false,
            label: labels.DIFFICULTY,
            sortable: true,
            show: true,
            type: 'status',
            filterableType: 'select',
            width: 180
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          },
          {
            property: PROPERTY_STORE.CREATEDBY,
            align: 'left',
            editable: false,
            label: 'Created By',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 180,
            filterableCustomFieldName: PROPERTY_STORE.CREATEDBY
          },
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
              'permissions/getSmishingLandingPageTemplatesEditPermissions'
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
              'permissions/getSmishingLandingPageTemplatesDeletePermissions'
            ],
            id: 'btn-delete--landing-page-templates-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters[
            'permissions/getSmishingLandingPageTemplatesExportPermissions'
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
            'permissions/getSmishingLandingPageTemplatesCreatePermissions'
          ]
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isTemplateDetails: false,
      selectedTemplateHeader: null,
      templateHTML: null,
      timeoutId: ''
    }
  },
  computed: {
    ...mapGetters({
      getSmishingLandingPageTemplatesSearchPermissions:
        'permissions/getSmishingLandingPageTemplatesSearchPermissions'
    }),
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates[this.selectedLandingPageIndex]?.content
    }
  },
  mounted() {
    this.callForLanguages('refLandingPageList')
    this.callForLookups()
    this.callForData()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    deleteLandingPageTemplate: SmishingService.deleteLandingPageTemplate,
    bulkDeleteLandingPageTemplates: SmishingService.bulkDeleteLandingPageTemplates,
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
      this.loading = true
      if (this.getSmishingLandingPageTemplatesSearchPermissions) {
        SmishingService.searchLandingPageTemplates(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            this.tableData = results.map((item) => {
              const language = this.languageFilterOptions.find(
                (lang) => lang.languageName === item.languageTypeName
              )
              return {
                ...item,
                languageTypeName: language?.text || item.languageTypeName
              }
            })
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      }
    },
    handlePreviousTemplate() {
      this.selectedLandingPageIndex--
    },
    handleNextTemplate() {
      this.selectedLandingPageIndex++
    },
    handleSuccessDeleteAction(row) {
      this.$refs.refLandingPageList.resetSelectableParams()
      this.showDeleteModal = false
      this.callForData()
    },
    handleSuccessMultipleDeleteAction() {
      this?.$refs?.refLandingPageList?.resetSelectableParams()
      this.showDeleteModal = false
      this.callForData()
    },
    handlePreview(row) {
      const id = row.resourceId
      this.isTemplateDetails = true
      this.isPreviewLoading = true
      SmishingService.getLandingPageTemplate(id)
        .then((response) => {
          const data = response.data.data
          this.landingPageParams.urlTemplate = data.urlTemplate
          this.landingPageParams.name = data.name
          this.landingPageTemplates = data.landingPages
          this.selectedTemplateHeader = data.name
          this.templateHTML = data.landingPages?.length
            ? data.landingPages[0]?.content || null
            : null
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.isPreviewLoading = false
          }, 500)
        })
    },
    handleEdit(row, isDuplicate) {
      this.editableFormValues = row
      this.modalStatus = true
      this.isEdit = true
      this.isDuplicate = isDuplicate
      this.emailTemplateId = row.resourceId
    },
    checkIfCanCloseGrapesJSModal() {
      if (this.$refs.newLandingPage) {
        if (this.$refs.newLandingPage.$refs.refEmailTemplate)
          this.$refs.newLandingPage.$refs.refEmailTemplate.toggleShowGrapesModal()
      }
    },
    checkIfCanCloseNewLandingPage() {
      if (this.$refs.newLandingPage) {
        this.$refs.newLandingPage.changeNewEmailTemplateModalStatus()
      }
    },
    changeNewEmailTemplateModalStatus(status, restart) {
      this.modalStatus = status
      this.emailTemplateId = null
      this.isEdit = false
      this.isDuplicate = false
      if (restart) {
        this.editableFormValues = {}
        this.emailTemplateId = null
        this.isEdit = false
        this.isDuplicate = false
        this.callForData()
      }
    },
    exportLandingPage({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        SmishingService.exportLandingPageTemplates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `smishing-landing-page-templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleMultipleDelete(selections, excludedItems, selectAll) {
      this.isMultipleDelete = true
      this.multipleDeletedTemplatesCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : selections.length
      this.multipleTemplatesPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.axiosPayload.filter
      }
      this.showDeleteModal = true
    },
    handleActionDelete(row) {
      this.isMultipleDelete = false
      this.selectedEmailTemplate = row
      this.showDeleteModal = true
    },
    callForLookups() {
      SmishingService.getLandingPageTemplateFormDetails().then((response) => {
        this.$set(
          this.tableOptions.columns[1],
          'filterableItems',
          response.data.data.methodTypes.map((item) => item.text)
        )
        this.$set(
          this.tableOptions.columns[4],
          'filterableItems',
          response.data.data.difficultyTypes.map((item) => item.text)
        )
        this?.$refs?.refLandingPageList?.reRenderFilters()
        const domainRecords = response?.data?.data?.domainRecords?.map((item) => {
          return {
            text: item.domain,
            value: item.id.toString(),
            extraDatas: [
              {
                text: item.urlSchemaType,
                value: item.urlSchemaTypeId.toString()
              },
              { text: item.isStopBotActivity, value: item.isStopBotActivity }
            ]
          }
        })
        this.landingPageData = { ...response.data.data, domainRecords }
      })
    }
  }
}
</script>
