<template>
  <div class="notification-templates">
    <company-settings-header
      title="Notification Templates"
      sub-title="Manage notification email templates"
    />
    <new-notification-template
      v-if="newNotificationTemplateStatus"
      :edit-items-disabled="editItemsDisabled"
      :selectedItem="selectedItem"
      :status="newNotificationTemplateStatus"
      @closeOverlay="toggleNewNotificationTemplate"
      @closeOverlayWithUpdate="closeNotificationTemplateWithUpdate"
    />
    <delete-notification-template-modal
      v-if="showDeleteNotificationTemplateModal"
      :selectedItem="selectedItem"
      :isDeleteButtonDisabled="isDeleteButtonDisabled"
      :status="showDeleteNotificationTemplateModal"
      @handleDelete="handleDeleteNotificationTemplate"
      @closeDialog="toggleDeleteNotificationTemplate"
    />
    <div class="notification-templates__container">
      <data-table
        ref="refNotificationList"
        id="company-settings-notification-templates-data-table"
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :columns="tableOptions.columns"
        :table="tableData"
        :empty="tableOptions.empty"
        :total-number-of-records="totalNumberOfRecords"
        :loading="loading"
        :filterable="true"
        :row-key="'resourceId'"
        :is-downloadable="false"
        :options="true"
        :addButton="tableOptions.addButton"
        :pageSizes="tableOptions.pageSizes"
        :refName="'notificationList'"
        :row-actions="tableOptions.rowActions"
        :stored-table-settings="storedTableSettings"
        :selectable="true"
        :show-all-records="showAllRecords"
        :select-event="tableOptions.selectEvent"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @downloadEvent="exportNotificationTemplate"
        @handleAddNotificationTemplates="toggleNewNotificationTemplate"
        @onEmptyBtnClicked="toggleNewNotificationTemplate"
        @on-all-records-button-click="handleAllRecordsClick"
        @set-default-search="handleSetDefaultSearch"
        @restore-default-search="handleRestoreDefaultSearch"
        @clear-filters="handleClearFilters"
        @refreshAction="callForDatas"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @on-table-settings-change="handleSetRenderedColumns"
        is-server-side
        :isServerSide="true"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
      >
        <template #datatable-row-actions="{scope}">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                @click.native="handleEdit(scope.row)"
                :disabled="getDisabledStatusOfEdit(scope.row)"
                class="btn-hover mr-1"
                icon
                :id="`${tableOptions.rowActions[0].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                v-on="on"
              >
                <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[0].name }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="getDisabledStatusOfDelete(scope.row)"
                @click.native="handleDelete(scope.row)"
                class="btn-hover"
                icon
                :id="`${tableOptions.rowActions[1].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                v-on="on"
              >
                <v-icon>{{ tableOptions.rowActions[1].icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ tableOptions.rowActions[1].name }}</span>
          </v-tooltip>
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import DeleteNotificationTemplateModal from '@/components/Company Settings/DeleteNotificationTemplateModal'
import NewNotificationTemplate from '@/components/Company Settings/NewNotificationTemplate'
import {
  deleteEmailTemplate,
  getCategories,
  searchEmailTemplate,
  exportEmailTemplate,
  getTemplateTypes
} from '@/api/company'
import labels from '@/model/constants/labels'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
export default {
  name: 'NotificationTemplates',
  components: {
    NewNotificationTemplate,
    DeleteNotificationTemplateModal,
    DataTable,
    CompanySettingsHeader
  },
  data() {
    return {
      categories: [],
      loading: false,
      storedTableSettings: null,
      tableData: [],
      showAllRecords: false,
      totalNumberOfRecords: 0,
      editItemsDisabled: false,
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: labels.TemplateName,
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 280,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CATEGORYNAME,
            align: 'left',
            label: labels.Category,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'CategoryResourceId'
          },
          {
            property: PROPERTY_STORE.TYPENAME,
            align: 'left',
            label: labels.TemplateType,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'select',
            filterableItems: [],
            filterableCustomFieldName: 'TypeResourceId'
          },
          {
            property: PROPERTY_STORE.SUBJECT,
            align: 'left',
            label: labels.EmailSubject,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: false,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            label: labels.CreateTime,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: true,
            filterableType: 'date'
          }
        ],
        addButton: {
          show: true,
          action: 'handleAddNotificationTemplates',
          tooltip: 'Add a Notification Template',
          id: 'btn-add--notification-template'
        },
        pageSizes: [5, 10, 25],
        isColumnFilterActive: false,
        empty: {
          message: LABEL_STORE.NO_NOTIFICATION_TEMPLATE_DEFINED,
          subMes: 'Create a new user directory integration',
          btn: 'Create Notification Template',
          id: 'btn-empty--notification-template',
          icon: 'mdi-plus'
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            id: 'btn-edit--notification-template-row-actions',
            action: 'handleEdit'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            id: 'btn-delete--notification-template-row-actions',
            action: 'handleDelete'
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      },
      isRestoredOrClearedFilters: false,
      isDeleteButtonDisabled: false,
      showDeleteNotificationTemplateModal: false,
      newNotificationTemplateStatus: false,
      selectedItem: null,
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      defaultAxiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      serverSideProps: new ServerSideProps()
    }
  },
  methods: {
    resetPageNumber() {
      //generic
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.NOTIFICATION_TEMPLATE, JSON.stringify(tableSettings))
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.callForDatas()
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.axiosPayload.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.axiosPayload.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.axiosPayload.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.callForDatas()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop
      this.callForDatas()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForDatas()
    },
    closeNotificationTemplateWithUpdate() {
      this.callForDatas()
      this.toggleNewNotificationTemplate()
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.axiosPayload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.axiosPayload.filter.FilterGroups[0].FilterItems = requestBody
      this.callForDatas()
    },
    columnFilterCleared(fieldName) {
      if (this.isRestoredOrClearedFilters) {
        return
      }
      let items = []
      let filterPayload = this.axiosPayload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.axiosPayload.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForDatas()

      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.NOTIFICATION_TEMPLATE,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.axiosPayload = JSON.parse(JSON.stringify(this.defaultAxiosPayload))
      this.$refs.refNotificationList.filterValues = {}
      this.$refs.refNotificationList.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.NOTIFICATION_TEMPLATE)
      this.callForDatas()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    exportNotificationTemplate({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.axiosPayload.filter)),
        this.$refs.refNotificationList,
        'CreateTime'
      )
      if (this.$refs.refNotificationList.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
      }
      if (
        this.$refs.refNotificationList.sortProps &&
        this.$refs.refNotificationList.sortProps.order
      ) {
        clientTableExportHelper.addSortItems()
      }

      const { filter, sortFilter } = clientTableExportHelper
      exportTypes.map((exportType) => {
        const payload = {
          ...sortFilter,
          pageNumber: pageNumber,
          pageSize: pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        exportEmailTemplate(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Notification Templates.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    getDisabledStatusOfEdit(row) {
      return false
    },
    getDisabledStatusOfDelete(row) {
      return !row.isOwner
    },
    handleDelete(row) {
      this.selectedItem = row
      this.toggleDeleteNotificationTemplate()
    },
    handleDeleteNotificationTemplate(resourceId) {
      this.isDeleteButtonDisabled = true
      deleteEmailTemplate(resourceId)
        .then(() => {
          this.toggleDeleteNotificationTemplate()
          this.callForDatas()
        })
        .finally(() => (this.isDeleteButtonDisabled = false))
    },
    toggleDeleteNotificationTemplate() {
      if (this.showDeleteNotificationTemplateModal) {
        this.selectedItem = null
      }
      this.showDeleteNotificationTemplateModal = !this.showDeleteNotificationTemplateModal
    },
    toggleNewNotificationTemplate() {
      if (this.newNotificationTemplateStatus) {
        this.selectedItem = null
        this.editItemsDisabled = false
      }
      this.newNotificationTemplateStatus = !this.newNotificationTemplateStatus
    },

    callForSearchEmailTemplate() {
      return searchEmailTemplate(this.axiosPayload)
    },
    callForCategories() {
      return getCategories()
    },
    callForTemplateTypes() {
      return getTemplateTypes()
    },
    callForDatas() {
      this.loading = true
      Promise.all([
        this.callForCategories(),
        this.callForSearchEmailTemplate(),
        this.callForTemplateTypes()
      ])
        .then((response) => {
          const [categories, emailTemplates, templateTypes] = response
          const {
            data: { data: templateData }
          } = emailTemplates
          const {
            data: { data: categoriesData }
          } = categories
          const {
            data: { data: templateTypesData }
          } = templateTypes

          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = templateData
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.totalNumberOfRecords = totalNumberOfRecords
          if (this.axiosPayload.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }
          if (totalNumberOfRecords <= 1000 && this.axiosPayload.pageSize === 1000) {
            this.showAllRecords = false
          }
          this.tableData = templateData.results
          this.categories = categoriesData.map((category) => {
            return { text: category.name, value: category.resourceId }
          })
          this.templateTypeItems = templateTypesData.map((type) => {
            return { text: type.name, value: type.resourceId }
          })
          this.$set(this.tableOptions.columns, 1, {
            ...this.tableOptions.columns[1],
            filterableItems: this.categories
          })
          this.$set(this.tableOptions.columns, 2, {
            ...this.tableOptions.columns[2],
            filterableItems: this.templateTypeItems
          })
        })
        .finally(() => {
          this.loading = false
          this.isRestoredOrClearedFilters = false
        })
    },
    handleAllRecordsClick() {
      this.axiosPayload.pageSize = 75000
      this.showAllRecords = false
      this.callForDatas()
    },
    handleEdit(row) {
      if (!row.isOwner) {
        this.editItemsDisabled = true
      }
      this.selectedItem = row
      this.toggleNewNotificationTemplate()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.NOTIFICATION_TEMPLATE)
      )
      if (savedFilter) {
        this.axiosPayload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refNotificationList.filterValues = savedFilter.filterValues
          this.$refs.refNotificationList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForDatas()
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.NOTIFICATION_TEMPLATE)
    )
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    this.setQueryValuesToPayload(this.$route.query)
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss"></style>
