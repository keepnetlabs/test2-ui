<template>
  <div id="landingPageList">
    <NewLandingPage
      v-if="modalStatus"
      ref="newLandingPage"
      :status="modalStatus"
      :email-template-id="emailTemplateId"
      :is-edit="isEdit"
      :is-duplicate="isDuplicate"
      :landing-page-data="landingPageData"
      @changeNewEmailTemplateModalStatus="changeNewEmailTemplateModalStatus"
    />
    <CommonSimulatorEmailTemplateDeleteDialog
      v-if="showDeleteModal"
      :status="showDeleteModal"
      :selected-email-template="selectedLandingPageTemplate"
      :api-func="deleteLandingPage"
      :type="SCENARIO_DELETE_DIALOG_TYPES.LANDING_PAGE"
      @on-success="handleSuccessDeleteAction"
      @on-close="showDeleteModal = false"
    />
    <CommonSimulatorLandingPageTemplatesPreviewDialog
      v-if="isTemplateDetails"
      :status="isTemplateDetails"
      :selected-row="selectedLandingPageTemplate"
      @on-close="isTemplateDetails = false"
    />
    <data-table
      v-if="getLandingPageTemplatesSearchPermissions"
      id="landingPage-data-table"
      ref="refLandingPageList"
      is-server-side
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
      @handleMultipleDelete="handleActionDelete"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
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
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewLandingPage from './NewLandingPage'
import {
  getStoreValue,
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  getLandingPageFormDetails,
  getLandingPageList,
  exportLandingPage,
  deleteLandingPage
} from '@/api/landingPage'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton'
import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'
import { SCENARIO_DELETE_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'

export default {
  name: 'EmailTemplates',
  components: {
    CommonSimulatorLandingPageTemplatesPreviewDialog,
    CommonSimulatorEmailTemplateDeleteDialog,
    ScenariosRowActionsDeleteButton,
    ScenariosRowActionsEditButton,
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable,
    NewLandingPage
  },
  mixins: [useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      SCENARIO_DELETE_DIALOG_TYPES,
      landingPageData: null,
      loading: true,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null,
      landingPageParams: {},
      selectedLandingPageIndex: 0,
      landingPageTemplates: [],
      isPreviewLoading: false,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedLandingPageTemplate: {},
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
            type: 'text',
            fixed: false,
            width: 175,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'languageTypeResourceId'
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
            disabled: !this.$store.getters['permissions/getLandingPageTemplatesEditPermissions'],
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
            disabled: !this.$store.getters['permissions/getLandingPageTemplatesDeletePermissions'],
            id: 'btn-delete--landing-page-templates-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getLandingPageTemplatesExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
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
          disabled: !this.$store.getters['permissions/getLandingPageTemplatesCreatePermissions']
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isTemplateDetails: false,
      selectedTemplateHeader: null,
      templateHTML: null
    }
  },
  computed: {
    ...mapGetters({
      getLandingPageTemplatesSearchPermissions:
        'permissions/getLandingPageTemplatesSearchPermissions'
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
  methods: {
    deleteLandingPage,
    callForData() {
      this.loading = true
      if (this.getLandingPageTemplatesSearchPermissions) {
        getLandingPageList(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            this.tableData = results
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
      this.$refs.refLandingPageList.unSelectRow(row)
      this.showDeleteModal = false
      this.callForData()
    },
    handlePreview(row) {
      this.selectedLandingPageTemplate = row
      this.isTemplateDetails = true
    },
    handleEdit(row, isDuplicate) {
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
        exportLandingPage(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `LandingPageTemplate.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleActionDelete(row) {
      this.selectedLandingPageTemplate = row
      this.showDeleteModal = true
    },
    callForLookups() {
      getLandingPageFormDetails().then((response) => {
        this.$set(
          this.tableOptions.columns[1],
          'filterableItems',
          response.data.data.methodTypes.map((item) => item.text)
        )
        this.$set(
          this.tableOptions.columns[3],
          'filterableItems',
          response.data.data.difficultyTypes.map((item) => item.text)
        )
        this?.$refs?.refLandingPageList?.reRenderFilters()
        this.landingPageData = response.data.data
      })
    }
  }
}
</script>
