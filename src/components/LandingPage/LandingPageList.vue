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
    <DeleteEmailTemplates
      :status="showDeleteModal"
      :selectedEmailTemplate="selectedEmailTemplate"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      @handleMultipleDelete="handleDeleteMultiple"
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
      <template v-slot:app-dialog-body>
        <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
        <div v-show="!isPreviewLoading" class="template-preview">
          <div class="template-preview__text" v-if="!!templateHTML">
            <div>
              <span class="template-preview__text--title">Phishing URL: </span>
              <span class="template-preview__text--body">{{ landingPageParams.urlTemplate }}</span>
            </div>
          </div>
          <hr class="mt-2" v-if="!!templateHTML" />
          <KEmailPreview v-if="!!templateHTML" ref="refPreview" :html="templateHTML" />
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="isTemplateDetails = false"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>

    <data-table
      v-if="checkPermissions('phishing-simulator/landing-page-template', 'POST')"
      id="landingPage-data-table"
      ref="refLandingPageList"
      is-server-side
      selectable
      filterable
      options
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :stored-table-settings="storedTableSettings"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :download-button="tableOptions.downloadButton"
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @disable="handleDisable"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewEmailTemplateModalStatus(true)"
      @downloadEvent="exportLandingPage"
      @handleMultipleDelete="handleActionDelete"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-table-settings-change="handleSetRenderedColumns"
    >
      <!-- <template v-slot:datatable-custom-column="{ scope }">
        <div>
          <span>{{ scope.row.name }}</span>
          <v-icon v-if="scope.row.isDefault" color="#1173C1" class="pl-2"
            >mdi-star-circle</v-icon
          >
        </div>
      </template> -->
      <template v-slot:datatable-row-actions="{ scope }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="handlePreview(scope.row)"
              :id="`btn-edit--landingPage-row-action-${
                scope.$index
              }-${Math.random().toString().substring(2)}`"
              class="btn-hover"
              icon
              v-on="on"
              :disabled="tableOptions.rowActions[0].disabled"
            >
              <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ tableOptions.rowActions[0].name }}</span>
        </v-tooltip>
        <v-menu bottom left offset-y transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn class="btn-hover" icon v-on="on">
              <v-icon @click.native="selectedMenuIndex = scope.$index">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="v-cart-dropdown-list el-table__action-buttons emailTemplates__row-actions">
            <v-list-item
              :id="`btn-status--landingPage-row-action-${
                scope.$index
              }-0-${Math.random().toString().substring(2)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[1].disabled"
              @click="handleEdit(scope.row, false)"
            >
              <v-list-item-title @click="() => {}">
                <v-icon class="pr-3">{{ 'mdi-pencil' }}</v-icon>
                <span>Edit</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :id="`btn-duplicate--landingPage-row-action-${
                scope.$index
              }-1-${Math.random().toString().substring(2)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[2].disabled"
            >
              <v-list-item-title @click="handleEdit(scope.row, true)">
                <v-icon class="pr-3">mdi-content-copy</v-icon>
                <span>Duplicate</span>
              </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item
              :id="`btn-make-default--landingPage-row-action-${
                scope.$index
              }-1-${Math.random().toString().substring(3)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[4].disabled"
            >
              <v-list-item-title>
                <v-icon class="pr-3">{{
                  tableOptions.rowActions[4].icon
                }}</v-icon>
                <span>{{ labels.MakeDefault }}</span>
              </v-list-item-title>
            </v-list-item> -->
            <v-list-item
              :id="`btn-delete--landingPage-row-action-${
                scope.$index
              }-1-${Math.random().toString().substring(3)}`"
              class="sub-menu-el"
              :disabled="tableOptions.rowActions[3].disabled"
            >
              <v-list-item-title @click="handleActionDelete(scope.row)">
                <v-icon class="pr-3">mdi-delete</v-icon>
                <span>{{ labels.Delete }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </data-table>
  </div>
</template>

<script>
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import DataTable from '../DataTable'
import DeleteEmailTemplates from './DeleteLandingPage'
import NewLandingPage from './NewLandingPage'
import AppDialog from '../AppDialog'
import { disableIntegration, enableIntegration } from '@/api/integrations'
import {
  getStoreValue,
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { checkPermission, getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  getLandingPageFormDetails,
  getLandingPageList,
  getLandingPageTemplatePreviewContent,
  exportLandingPage,
  deleteLandingPage
} from '@/api/landingPage'
import KEmailPreview from '@/components/KEmailPreview'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
export default {
  name: 'EmailTemplates',
  components: {
    DatatableLoading,
    KEmailPreview,
    DataTable,
    DeleteEmailTemplates,
    NewLandingPage,
    AppDialog
  },
  data() {
    return {
      landingPageData: null,
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null,
      landingPageParams: {},
      isPreviewLoading: false,
      labels,
      tableData: [],
      showDeleteModal: false,
      storedTableSettings: null,
      selectedEmailTemplate: {},
      tableOptions: {
        isColumnFilterActive: false,
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
            label: 'Method',
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
            type: 'textArray',
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
            disabled: !this.checkPermissions(
              'phishing-simulator/landing-page-template/{resourceId}',
              'GET'
            )
          },
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.checkPermissions(
              'phishing-simulator/landing-page-template/{resourceId}',
              'PUT'
            )
          },
          {
            name: labels.Disable,
            icon: 'mdi-content-copy',
            action: 'disable',
            disabled: !this.checkPermissions(
              'phishing-simulator/landing-page-template/{resourceId}',
              'PUT'
            )
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.checkPermissions(
              'phishing-simulator/landing-page-template/{resourceId}',
              'DELETE'
            )
          }
          // {
          //   name: labels.MakeDefault,
          //   icon: "mdi-star-circle",
          //   action: "makeDefaultAction",
          //   disabled: !this.checkPermissions(
          //     "phishing-simulator/landing-page-template/{resourceId}",
          //     "PUT"
          //   ),
          // },
        ],
        downloadButton: {
          show: true,
          disabled: !this.checkPermissions(
            'phishing-simulator/landing-page-template/search/export',
            'POST'
          )
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        pageSizes: [5, 10, 25],
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
          disabled: !this.checkPermissions('phishing-simulator/landing-page-template', 'POST')
        }
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isTemplateDetails: false,
      selectedTemplateHeader: null,
      templateHTML: null,
      timeoutId: ''
    }
  },
  methods: {
    callForLanguages() {
      const languageColumnIndex = this.tableOptions.columns.findIndex(
        (column) => column.property === PROPERTY_STORE.LANGUAGE
      )
      if (languageColumnIndex !== -1) {
        LookupLocalStorage.getSingle(23).then((response) => {
          this.languageFilterOptions =
            response?.map((language) => ({ text: language.name, value: language.resourceId })) || []
          this.$set(this.tableOptions.columns, languageColumnIndex, {
            ...this.tableOptions.columns[languageColumnIndex],
            filterableItems: this.languageFilterOptions
          })
          this.$nextTick(() => {
            this.$refs.refLandingPageList.reRenderColumns()
          })
        })
      }
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.LANDINGPAGES, JSON.stringify(tableSettings))
    },
    resetPageNumber() {
      //generic
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      //generic
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyData.filter.FilterGroups[1].FilterItems = this.bodyData.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AnalysisEngineName') {
            item.FieldName = 'analysisEngineTypeId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.calculateIsFilterColumnActive()
      this.getDatatableList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.bodyData.pageNumber = pageNumber
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getDatatableList()
    },
    getDefaultFilterAndSearch(callLookup = false) {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.LANDINGPAGES)
      )
      if (savedFilter) {
        this.bodyData.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          if (!callLookup && this.$refs.refLandingPageList) {
            this.$refs.refLandingPageList.reRenderColumns(savedFilter.filterValues)
          }
        })
      }
      if (callLookup) {
        this.callForLanguages()
        this.callForLookups(savedFilter?.filterValues)
      }
      this.getDatatableList()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.bodyData = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refLandingPageList.filterValues = {}
      this.$refs.refLandingPageList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      this.getDatatableList()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      if (Object.keys(filterValues).length) {
        localStorage.setItem(
          DEFAULT_SEARCH_CONTAINER_KEYS.LANDINGPAGES,
          JSON.stringify({
            filter: this.bodyData.filter,
            filterValues
          })
        )
      } else {
        localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.LANDINGPAGES)
      }
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = {
        ...this.bodyData,
        orderBy: prop,
        ascending: order === 'ascending'
      }
      this.getDatatableList()
    },
    handleDeleteMultiple(selections) {
      selections.forEach((item) => {
        this.handleDelete(item)
      })
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.getDatatableList()
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      this.getDatatableList()
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.getDatatableList()
    },
    handleDelete(row) {
      this.$refs.refLandingPageList.$refs.elTableRef.toggleRowSelection(row, false)
      deleteLandingPage(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handlePreview(row) {
      const id = row.resourceId
      this.isTemplateDetails = true
      this.isPreviewLoading = true
      getLandingPageTemplatePreviewContent(id)
        .then((response) => {
          const data = response.data.data
          this.landingPageParams.urlTemplate = data.urlTemplate
          this.selectedTemplateHeader = data.name
          this.templateHTML = data.landingPages[0].content
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
    handleDisable(row) {
      disableIntegration(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleEnable(row) {
      enableIntegration(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleAdd() {},
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
        this.getDatatableList()
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
          filter: this.bodyData.filter
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
    getDatatableList() {
      this.loading = true
      if (this.checkPermissions('phishing-simulator/landing-page-template', 'POST')) {
        getLandingPageList(this.bodyData)
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
      } else {
        this.$router.push('/')
      }
    },
    handleActionDelete(row) {
      this.selectedEmailTemplate = row
      this.showDeleteModal = true
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.calculateIsFilterColumnActive()
      this.getDatatableList()
    },
    calculateIsFilterColumnActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.bodyData)
    },
    callForLookups(filterValues) {
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
        // this.$set(
        //   this.tableOptions.columns[6],
        //   'filterableItems',
        //   response.data.data.languages.map((item) => item.text)
        // )
        this.$refs.refLandingPageList?.reRenderColumns(filterValues || {})
        this.landingPageData = response.data.data
      })
    }
  },
  created() {
    this.getDefaultFilterAndSearch(true)
    this.storedTableSettings = JSON.parse(localStorage.getItem(TABLE_SETTINGS_KEYS.LANDINGPAGES))
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  }
}
</script>

<style lang="scss">
.emailTemplates {
  min-height: 90vh;
}
.emailTemplates__row-actions {
  .v-list-item__title {
    display: flex;
    align-items: center;
  }
}
</style>
