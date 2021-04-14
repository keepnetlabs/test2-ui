<template>
  <div class="people">
    <delete-user-modal
      v-if="isWantToShowDeleteUserModal"
      :is-show="isWantToShowDeleteUserModal"
      :selectedRow="selectedRow"
      :isMultiple="isMultipleDelete"
      @deleteAction="handleDeleteUser"
      @deleteMultiple="handleDeleteUsers"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <add-users-manually-modal
      :is-show="isWantToShowAddUsersManuallyModal"
      v-if="isWantToShowAddUsersManuallyModal"
      @changeModalStatus="changeAddUsersManuallyModalStatus"
    />
    <add-user-modal
      v-if="isWantToShowAddUsersModal"
      :status="isWantToShowAddUsersModal"
      @closeAddUserModal="closeAddUserModal"
      @closeAddUserModalWithUpdate="closeAddUserModalWithUpdate"
      :editData="selectedRow"
      :custom-fields="customFields"
      :company-license="companyLicense"
    />
    <custom-fields-modal
      :status="isWantToShowCustomFieldsModal"
      @closeCustomFieldsModal="toggleCustomFieldsModal"
      @closeCustomFieldsModalWithUpdate="closeCustomFieldsModalWithUpdate"
      v-if="isWantToShowCustomFieldsModal"
    />
    <target-user-import-from-a-file
      :status="isWantToImportFile"
      @closeAddUserModal="closeImportModal"
      @closeOverlay="isWantToImportFile = false"
      v-if="isWantToImportFile"
      :columns="tableOptions.columns"
      ref="targetUserFromAFile"
      :companyLicense="companyLicense"
    />
    <datatable
      ref="refPeopleTable"
      id="target-users-people-data-table"
      is-server-side
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'peopleTable'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :stored-table-settings="storedTableSettings"
      :selectable="true"
      :settingsPopupStyle="{ top: '-15px' }"
      :download-button="{ show: true, disabled: false }"
      :setClassName="setCellClassName"
      @addToGroup="handleAddToGroup"
      @createGroupWithUser="handleCreateGroupWithUser"
      @submenuItemClick="handleSubMenuItemClick"
      @syncUser="handleSyncUser"
      @deleteAction="handleDelete"
      @editTargetUsers="handleEditTargetUsers"
      @onEmptyBtnClicked="handleClickEmptyBtnClicked"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @handleMultipleDelete="handleMultipleDelete"
      @downloadEvent="exportTargetUserList"
      @refreshAction="callForGetTargetUserCustomFieldsByCompanyId"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @on-table-settings-change="handleSetRenderedColumns"
    >
      <template v-slot:addUsers>
        <v-menu :offset-y="true" bottom left>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  :disabled="!checkPermissions('target-users/search', 'POST')"
                  id="btn-add--target-users-people"
                  class="button-new"
                  style="margin-right: 10px;"
                  rounded
                  color="#2196f3"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <v-icon style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
                  <span class="button-new__text">NEW</span>
                </v-btn>
              </template>
              <span class="tooltip-span">{{ 'Add User' }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="item in addUsersItems"
              :key="item.id"
              :id="item.id"
              @click="handleAddUsers(item.text)"
            >
              <v-list-item-title class="add-users__title">{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:settings-popup-body>
        <div
          id="btn-edit--target-user-custom-fields"
          class="edit-fields"
          @click="handleEditFieldsClick"
        >
          EDIT FIELDS
        </div>
      </template>
      <template v-slot:empty-table-inline>
        <div class="people__no-data">
          <p class="people__no-data__header">
            You do not have any users added, yet
          </p>
          <p class="people__no-data__body">Starts now!</p>
          <div class="people__no-data__buttons">
            <v-menu offset-y transition="scale-transition" nudge-bottom="4">
              <template v-slot:activator="{ on }">
                <div class="people__no-data__buttons--button" v-on="on">
                  <v-icon color="#fff" class="mr-2">mdi-plus</v-icon> ADD USERS
                </div>
              </template>
              <div>
                <v-list dense flat class="people__no-data__buttons--button__list">
                  <v-list-item-group color="primary">
                    <v-list-item @click="handleClickEmptyBtnClicked">
                      <v-list-item-content>
                        <v-list-item-title> Add users manually</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="isWantToImportFile = true">
                      <v-list-item-content>
                        <v-list-item-title>Import from a file</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </v-menu>
          </div>
        </div>
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import DeleteUserModal from './DeleteUserModal'
import AddUsersManuallyModal from './AddUsersManuallyModal'
import AddUserModal from './AddUserModal'
import {
  deleteTargetUser,
  exportTargetUsers,
  getTargetUserCustomFieldsByCompanyId,
  getTargetUsers
} from '@/api/targetUsers'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CustomFieldsModal from './CustomFieldsModal'
import TargetUserImportFromAFile from './TargetUserImportFromAFile'
import { checkPermission } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'

export default {
  name: 'People',
  components: {
    CustomFieldsModal,
    DeleteUserModal,
    Datatable,
    AddUsersManuallyModal,
    AddUserModal,
    TargetUserImportFromAFile
  },
  props: {
    companyLicense: {
      type: Object
    }
  },
  emits: ['call-for-company-licenses'],
  data: () => ({
    payload: {
      pageNumber: 1,
      pageSize: 50000,
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
    storedTableSettings: null,
    defaultRequestBody: {
      pageNumber: 1,
      pageSize: 50000,
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
    isWantToImportFile: false,
    tableData: [],
    loading: true,
    isMultipleDelete: false,
    isWantToShowDeleteUserModal: false,
    selectedSyncIndex: null,
    isWantToShowAddUsersManuallyModal: false,
    selectedRow: null,
    customFields: [],
    isWantToShowAddUsersModal: false,
    showPopupModal: false,
    isWantToShowImportUsersFromFileModal: false,
    isWantToShowCustomFieldsModal: false,
    items: [
      { title: 'Click Me1' },
      { title: 'Click Me2' },
      { title: 'Click Me3' },
      { title: 'Click Me4' }
    ],
    tableOptions: {
      isColumnFilterActive: false,
      lastColumns: [
        {
          property: PROPERTY_STORE.PRIORITY,
          align: 'center',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.PRIORITY),
          sortable: true,
          show: true,
          type: 'priority',
          width: 150,
          fullWidth: true,
          filterableType: 'select',
          filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS,
          dbName: 'Priority'
        },
        {
          property: PROPERTY_STORE.STATUS,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.STATUS),
          fixed: false,
          sortable: true,
          show: true,
          type: 'status',
          width: 150,
          isEditable: true,
          hasTooltip: true,
          fullWidth: true,
          filterableType: 'select',
          filterableItems: COMMON_CONSTANTS.STATUS_ITEMS,
          dbName: 'Status'
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
          width: 180,
          filterableType: 'date',
          dbName: 'CreateTime'
        }
      ],
      columns: [],
      defaultColumns: [
        // Should be defined to show the table
        {
          property: PROPERTY_STORE.FIRSTNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'text',
          dbName: 'FirstName'
        },
        {
          property: PROPERTY_STORE.LASTNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LASTNAME),
          sortable: true,
          show: true,
          type: 'text',
          width: 150,
          filterableType: 'text',
          dbName: 'LastName'
        },
        {
          property: PROPERTY_STORE.EMAIL,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.EMAIL),
          sortable: true,
          show: true,
          type: 'text',
          width: 275,
          filterableType: 'text',
          dbName: 'Email'
        },
        {
          property: PROPERTY_STORE.DEPARTMENT,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
          sortable: true,
          show: true,
          type: 'text',
          width: 150,
          filterableType: 'text',
          dbName: 'Department'
        }
      ],
      pageSizes: [5, 10, 25],
      downloadButton: {
        show: true
      },
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: true,
        download: false
      },
      iEmpty: {
        message: LABEL_STORE.NO_TARGET_USER_ADDED,
        btn: 'ADD A USER',
        id: 'btn-empty--target-users-people',
        icon: 'mdi-account-plus'
      },
      addButton: {
        show: true,
        action: 'addButton',
        id: 'btn-add--target-users-people'
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          action: 'editTargetUsers',
          id: 'btn-edit--target-users-people-row-actions',
          isNotShow: true,
          disabled: !checkPermission('system-users/{resourceId}', 'PUT')
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'deleteAction',
          id: 'btn-delete--target-users-people-row-actions',
          disabled: !checkPermission('system-users/{resourceId}', 'DELETE')
        }
      ]
    },
    addUsersItems: [
      { text: 'Add users manually', id: 'btn-add-users-manually--target-users-people' },
      { text: 'Import from a file', id: 'btn-add-users-import-from-file--target-users-people' }
    ],
    serverSideProps: new ServerSideProps()
  }),
  methods: {
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERS)
      )
      if (savedFilter) {
        this.payload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refPeopleTable.filterValues = savedFilter.filterValues
          this.$refs.refPeopleTable.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.TARGET_USERS_PEOPLE, JSON.stringify(tableSettings))
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.tableOptions.isColumnFilterActive = false
      this.payload = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refPeopleTable.filterValues = {}
      this.$refs.refPeopleTable.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERS)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERS,
        JSON.stringify({
          filter: this.payload.filter,
          filterValues
        })
      )
    },
    setQueryValuesToPayload({ page, size }) {
      //generic
      const parsedPage = parseInt(page)
      this.payload.pageNumber = isNaN(parsedPage) ? 1 : parsedPage
      const parsedSize = parseInt(size)
      size = isNaN(parsedSize) ? 10 : parsedSize
      this.payload.pageSize = size
      this.serverSideProps.pageSize = size
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.payload.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    resetPageNumber() {
      //generic
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    columnFilterChanged(filter) {
      //generic
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.payload.filter.FilterGroups[0].FilterItems
      this.resetPageNumber()
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

      this.payload.filter.FilterGroups[0].FilterItems = requestBody
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    columnFilterCleared(fieldName) {
      //generic
      debugger
      let items = []
      let filterPayload = this.payload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.payload.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForGetTargetUserCustomFieldsByCompanyId()

      this.tableOptions.isColumnFilterActive =
        this.payload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    closeImportModal() {
      this.isWantToImportFile = false
    },
    toggleCustomFieldsModal() {
      this.isWantToShowCustomFieldsModal = !this.isWantToShowCustomFieldsModal
    },
    handleAddUsers(item) {
      switch (item) {
        case this.addUsersItems[0].text:
          this.selectedRow = null
          this.isWantToShowAddUsersModal = true
          break
        case this.addUsersItems[1].text:
          this.isWantToImportFile = true
          break
        default:
          break
      }
    },
    handleClickEmptyBtnClicked() {
      this.selectedRow = null
      this.isWantToShowAddUsersModal = true
    },
    closeCustomFieldsModalWithUpdate() {
      this.toggleCustomFieldsModal()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    closeAddUserModalWithUpdate(showMainModal = false) {
      this.isWantToShowAddUsersModal = false
      this.$emit('call-for-company-licenses', showMainModal)
      this.callForTargetUsers()
    },
    handleEditTargetUsers(selectedRow) {
      this.selectedRow = selectedRow
      this.isWantToShowAddUsersModal = true
    },
    handleEditFieldsClick() {
      if (this.$refs && this.$refs.refPeopleTable) {
        this.$refs.refPeopleTable.toggleIsSettingsOpened()
      }
      this.toggleCustomFieldsModal()
    },
    setCellClassName(obj) {
      if (obj.rowIndex === this.selectedSyncIndex && obj.columnIndex === 8) {
        return 'clock-wise'
      }
    },
    handleAddToGroup(row) {},
    handleCreateGroupWithUser(row) {},
    handleSubMenuItemClick(exportType) {},
    handleSyncUser(scope) {
      this.selectedSyncIndex = scope.$index
      this.tableOptions.rowActions = [
        {
          name: 'Sync User',
          icon: 'mdi-sync',
          action: 'syncUser'
        }
      ]
      setTimeout(() => {
        this.tableOptions.rowActions = [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'edit',
            isNotShow: true
          },
          {
            name: 'Add to a group',
            icon: 'mdi-account-multiple-plus',
            action: 'addToGroup'
          },
          {
            name: 'Create a group with user',
            icon: 'mdi-account-multiple',
            action: 'createGroupWithUser'
          },
          {
            name: 'Download',
            icon: 'mdi-download',
            action: 'download',
            subElements: ['PDF', 'CSV', 'XLS']
          },
          {
            name: 'Sync User',
            icon: 'mdi-sync',
            action: 'syncUser'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete'
          }
        ]
        this.selectedSyncIndex = null
      }, 5000)
    },
    handleMultipleDelete(selections = []) {
      this.isMultipleDelete = true
      this.changeDeleteModalStatus(true)
      this.selectedRow = selections
    },
    handleDelete(row) {
      this.isMultipleDelete = false
      this.changeDeleteModalStatus(true)
      this.selectedRow = row
    },
    closeAddUserModal() {
      this.isWantToShowAddUsersModal = false
    },
    changeDeleteModalStatus(status) {
      this.isWantToShowDeleteUserModal = status
    },
    changeAddUsersManuallyModalStatus(status) {
      this.isWantToShowAddUsersManuallyModal = status
    },
    handleDeleteUsers(selections) {
      selections.forEach((item) => this.handleDeleteUser(item))
    },
    handleDeleteUser(selectedUser) {
      deleteTargetUser(selectedUser.resourceId).then((response) => {
        if (response.data && response.data.message) {
          this.$refs.refPeopleTable.$refs.elTableRef.toggleRowSelection(selectedUser, false)
          this.$emit('call-for-company-licenses')
          this.callForTargetUsers()
        }
      })
    },
    callForTargetUsers() {
      this.loading = true
      console.trace('asasasa')
      getTargetUsers(this.payload)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data

          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = response.data.data.results.map((item) => {
            const { customFieldValues } = item
            for (let { name, value, dataType } of customFieldValues) {
              if (dataType === 'Boolean') {
                if (value === 'True') {
                  item[name] = 'Yes'
                } else if (value === 'False') {
                  item[name] = 'No'
                } else {
                  item[name] = 'No'
                }
              } else {
                item[name] = value !== null && value !== undefined ? value : ''
              }
            }
            return item
          })
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          const { data } = response
          this.customFields = data.data.filter((item) => {
            return item.isActive
          })
          const sortProp = 'sortOrder'
          this.customFields.sort((a, b) => {
            if (a[sortProp] > b[sortProp]) {
              return 1
            } else if (a[sortProp] === b[sortProp]) {
              return 0
            }
            return -1
          })

          const columnsOfCustomFields = this.customFields.map((field) => {
            const { name, fieldDataType } = field
            const filterableProps = {}
            switch (fieldDataType.toLowerCase()) {
              case 'string':
                filterableProps['filterableType'] = 'text'
                break
              case 'email':
                filterableProps['filterableType'] = 'text'
                break
              case 'number':
                filterableProps['filterableType'] = 'text'
                break
              case 'boolean':
                filterableProps['filterableType'] = 'select'
                filterableProps['filterableItems'] = [
                  { text: 'Yes', value: 1 },
                  { text: 'No', value: 0 }
                ]
                break
              case 'date':
                filterableProps['filterableType'] = 'date'
                break
              case 'datetime':
                filterableProps['filterableType'] = 'date'
                break
              default:
                break
            }
            return {
              property: name,
              type: 'text',
              sortable: false,
              filterable: true,
              hideSort: true,
              label: name,
              align: 'left',
              show: true,
              width: 80 + name.length * 7,
              ...filterableProps
            }
          })

          const newColumns = [
            ...this.tableOptions.defaultColumns,
            ...columnsOfCustomFields,
            ...this.tableOptions.lastColumns
          ]

          if (this.tableOptions.columns.length) {
            this.tableOptions.columns.forEach((column) => {
              const findedColumn = newColumns.find(
                (newColumn) => newColumn.property === column.property
              )
              if (!findedColumn) {
                return
              }
              findedColumn.show = column.show
            })
          }
          if (this.storedTableSettings && this.storedTableSettings.renderedColumns.length) {
            newColumns.forEach((column) => {
              const item = this.storedTableSettings.renderedColumns.find(
                (renderedColumnProp) => renderedColumnProp === column.property
              )
              column.show = !!item
            })
          }
          this.tableOptions.columns = newColumns
        })
        .catch(() => {
          this.tableOptions.columns = [
            ...this.tableOptions.defaultColumns,
            ...this.tableOptions.lastColumns
          ]
        })
        .finally(() => {
          console.log('iam invoked')
          this.callForTargetUsers()
        })
    },

    exportTargetUserList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: this.payload.orderBy,
          ascending: this.payload.ascending,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.payload.filter
        }
        exportTargetUsers(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Target Users.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.TARGET_USERS_PEOPLE)
    )
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    this.setQueryValuesToPayload(this.$route.query)
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss">
.people {
  &__no-data {
    &__header {
      font-size: 24px !important;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29 !important;
      letter-spacing: normal !important;
      color: rgba(0, 0, 0, 0.87);
      text-align: center;
    }
    &__body {
      font-size: 14px !important;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal !important;
      color: rgba(0, 0, 0, 0.87);
      text-align: center;
    }
    &__buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
      &--button {
        border-radius: 18px;
        box-shadow: 0 2px 5px 0 rgba(33, 150, 243, 0.3), 0 0 3px 0 rgba(0, 0, 0, 0.1);
        border: solid 1px #2196f3;
        background-color: #2196f3;
        align-items: center;
        justify-content: center;
        display: flex;
        padding: 6px 16px;
        cursor: pointer;
        color: white;
        font-size: 14px;
        &:last-child {
          margin-left: 16px;
        }
        img {
          margin-left: 8px;
          height: 24px;
        }
      }
    }
  }

  padding-top: 24px;
  .add-users__title {
    font-size: 14px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .edit-fields {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    margin-top: 10px;
    cursor: pointer;
    color: #2196f3;
  }
  .btn-add {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5);
    background-color: #2196f3;
    color: white;

    .v-icon {
      font-size: 18px !important;
      color: white;
    }
  }
}
.clock-wise {
  .cell {
    * {
      visibility: visible !important;
    }
  }
  i {
    animation: antiClockwiseSpin 1s infinite ease-in;
    animation-delay: 0s;
    color: #2196f3 !important;
  }
}
@keyframes antiClockwiseSpin {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
