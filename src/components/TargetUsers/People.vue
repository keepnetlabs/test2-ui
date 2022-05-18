<template>
  <div class="people">
    <default-error-dialog
      v-if="!!bulkDeleteErrorMessage"
      :status="!!bulkDeleteErrorMessage"
      :error-message="bulkDeleteErrorMessage"
      @on-close="bulkDeleteErrorMessage = ''"
    />
    <delete-user-modal
      v-if="isWantToShowDeleteUserModal"
      :is-show="isWantToShowDeleteUserModal"
      :selectedRow="selectedRow"
      :isMultiple="isMultipleDelete"
      :user-count="multipleDeletedUserCount"
      :confirmButtonDisabled="deleteButtonDisabled"
      @deleteAction="handleDeleteUser"
      @deleteMultiple="handleDeleteUsers"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <add-user-modal
      v-if="isWantToShowAddUsersModal"
      ref="addUserModal"
      :status="isWantToShowAddUsersModal"
      :editData="selectedRow"
      :custom-fields="customFields"
      :company-license="companyLicense"
      @closeAddUserModal="closeAddUserModal"
      @closeAddUserModalWithUpdate="closeAddUserModalWithUpdate"
    />
    <custom-fields-modal
      v-if="isWantToShowCustomFieldsModal"
      :status="isWantToShowCustomFieldsModal"
      :bulk-delete-error-message.sync="bulkDeleteErrorMessage"
      @closeCustomFieldsModal="toggleCustomFieldsModal"
      @closeCustomFieldsModalWithUpdate="closeCustomFieldsModalWithUpdate"
    />
    <target-user-import-from-a-file
      v-if="isWantToImportFile"
      ref="targetUserFromAFile"
      :status="isWantToImportFile"
      :columns="tableOptions.columns"
      :companyLicense="companyLicense"
      @closeAddUserModal="closeImportModal"
      @closeOverlay="isWantToImportFile = false"
    />
    <TargetUsersViewTargetUserGroups
      v-if="isShowingTargetUserViewTargetGroups"
      :item="selectedUserToViewGroups"
      :status="isShowingTargetUserViewTargetGroups"
      @on-close="toggleShowingTargetUserViewTargetGroups"
    />
    <datatable
      ref="refPeopleTable"
      id="target-users-people-data-table"
      is-server-side
      is-server-side-selection
      filterable
      options
      selectable
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :refName="'peopleTable'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :stored-table-settings="storedTableSettings"
      :settingsPopupStyle="{ top: '-15px' }"
      :download-button="{ show: true, disabled: false }"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
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
      @viewUserGroups="handleViewUserGroups"
    >
      <template v-slot:addUsers>
        <v-menu :offset-y="true" bottom left>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  :disabled="!getTargetUsersCreatePermissions"
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
          <p id="text--empty-table-title" class="people__no-data__header">
            {{ labels.EmptyTargetUsersPeople }}
          </p>
          <p id="text--empty-table-subtitle" class="people__no-data__body">
            {{ labels.EmptyTargetUsersPeopleSub }}
          </p>
          <div class="people__no-data__buttons">
            <v-menu offset-y transition="scale-transition" nudge-bottom="4">
              <template v-slot:activator="{ on }">
                <div
                  class="people__no-data__buttons--button"
                  v-on="on"
                  id="btn-empty--target-users-people"
                >
                  <v-icon color="#fff" style="margin-top: 1px;" class="mr-1">mdi-plus</v-icon>
                  <span style="font-weight: 600;">NEW</span>
                </div>
              </template>
              <div>
                <v-list dense flat class="people__no-data__buttons--button__list">
                  <v-list-item-group color="primary">
                    <v-list-item @click="handleClickEmptyBtnClicked">
                      <v-list-item-content>
                        <v-list-item-title id="item--target-user-empty-add-users-manually">
                          Add users manually</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="isWantToImportFile = true">
                      <v-list-item-content>
                        <v-list-item-title id="item--target-user-empty-import-from-file"
                          >Import from a file</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </v-menu>
          </div>
        </div>
      </template>
      <template #datatable-row-actions="{scope}">
        <TargetUserRowActionsEditButton :scope="scope" @on-edit="handleEditTargetUsers" />
        <TargetUserRowActionsDeleteButton :scope="scope" @on-delete="handleDelete" />
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import DeleteUserModal from './DeleteUserModal'
import AddUserModal from './AddUserModal'
import labels from '@/model/constants/labels'
import {
  bulkDeleteTargetUsers,
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
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import TargetUsersViewTargetUserGroups from '@/components/TargetUsers/TargetUsersViewTargetUserGroups'
import {
  columnFilterChanged,
  columnFilterCleared,
  createCustomFieldColumns,
  isColumnFilterActive
} from '@/utils/helperFunctions'
import TargetUserRowActionsEditButton from '@/components/SmallComponents/TargetUserRowActionsEditButton'
import TargetUserRowActionsDeleteButton from '@/components/SmallComponents/TargetUserRowActionsDeleteButton'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog'
import { mapGetters } from 'vuex'

export default {
  name: 'People',
  components: {
    DefaultErrorDialog,
    TargetUserRowActionsDeleteButton,
    TargetUserRowActionsEditButton,
    TargetUsersViewTargetUserGroups,
    CustomFieldsModal,
    DeleteUserModal,
    Datatable,
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
    labels,
    isInitial: true,
    selectedUserToViewGroups: null,
    payload: getDefaultAxiosPayload(),
    storedTableSettings: null,
    defaultRequestBody: getDefaultAxiosPayload(),
    isWantToImportFile: false,
    isShowingTargetUserViewTargetGroups: false,
    tableData: [],
    loading: true,
    bulkDeleteErrorMessage: '',
    isMultipleDelete: false,
    multipleDeletedUserCount: 0,
    multipleTargetUserPayload: {},
    isWantToShowDeleteUserModal: false,
    selectedRow: null,
    customFields: [],
    isWantToShowAddUsersModal: false,
    showPopupModal: false,
    isWantToShowImportUsersFromFileModal: false,
    isWantToShowCustomFieldsModal: false,
    deleteButtonDisabled: false,
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
          width: 140,
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
          width: 160,
          filterableType: 'text',
          dbName: 'Department'
        }
      ],
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
          disabled: !this.$store.getters['permissions/getTargetUsersEditPermissions']
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'deleteAction',
          id: 'btn-delete--target-users-people-row-actions',
          disabled: !this.$store.getters['permissions/getTargetUsersDeletePermissions']
        },
        {
          name: 'View user’s groups',
          icon: 'mdi-account-supervisor-outline',
          action: 'viewUserGroups',
          id: 'btn-view--target-users-people-row-actions'
        }
      ]
    },
    addUsersItems: [
      { text: 'Add users manually', id: 'btn-add-users-manually--target-users-people' },
      { text: 'Import from a file', id: 'btn-add-users-import-from-file--target-users-people' }
    ],
    serverSideProps: new ServerSideProps()
  }),
  computed: {
    ...mapGetters({
      getTargetUsersCreatePermissions: 'permissions/getTargetUsersCreatePermissions'
    })
  },
  methods: {
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERS)
      )
      if (savedFilter) {
        this.payload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          if (this?.$refs?.refPeopleTable) {
            this.$refs.refPeopleTable.search =
              savedFilter?.filter?.FilterGroups[1]?.FilterItems[0]?.Value
            this.$refs.refPeopleTable.filterValues = savedFilter.filterValues
            this.$refs.refPeopleTable.columnKey = `column-key${Math.random()
              .toString()
              .substring(0, 5)}`
          }
        })
      }
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    handleViewUserGroups(selectedRow = {}) {
      this.selectedUserToViewGroups = selectedRow
      this.toggleShowingTargetUserViewTargetGroups()
    },
    toggleShowingTargetUserViewTargetGroups() {
      this.isShowingTargetUserViewTargetGroups = !this.isShowingTargetUserViewTargetGroups
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
    serverSidePageNumberChanged(pageNumber = 1) {
      this.payload.pageNumber = pageNumber
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    sortChanged({ order, prop } = {}) {
      this.payload.ascending = order === 'ascending'
      this.payload.orderBy = prop
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.payload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    resetPageNumber() {
      this.payload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.resetPageNumber()
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.payload)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    columnFilterCleared(fieldName) {
      this.payload.filter.FilterGroups[0].FilterItems = columnFilterCleared(fieldName, this.payload)
      this.calculateIsFilterColumnActive()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    handleSearchChange(searchFilter = {}) {
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.calculateIsFilterColumnActive()
      this.callForGetTargetUserCustomFieldsByCompanyId()
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
      this.callForGetTargetUserCustomFieldsByCompanyId(true)
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
    handleMultipleDelete(selections, excludedItems, selectAll) {
      this.isMultipleDelete = true
      this.multipleDeletedUserCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : selections.length
      this.multipleTargetUserPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.payload.filter
      }
      this.changeDeleteModalStatus(true)
    },
    handleDelete(row) {
      this.isMultipleDelete = false
      this.changeDeleteModalStatus(true)
      this.selectedRow = row
    },
    checkIfCanCloseAddUserModal() {
      if (this.$refs.addUserModal) {
        this.$refs.addUserModal.closeOverlay()
      }
    },
    closeAddUserModal() {
      this.isWantToShowAddUsersModal = false
    },
    changeDeleteModalStatus(status) {
      this.isWantToShowDeleteUserModal = status
      if (!status) {
        this.selectedRow = null
        this.multipleTargetUserPayload = {}
        this.isMultipleDelete = false
        this.multipleDeletedUserCount = 0
      }
    },
    handleDeleteUsers() {
      this.callForMultipleDelete()
    },
    callForMultipleDelete() {
      this.deleteButtonDisabled = true
      this.loading = true
      bulkDeleteTargetUsers(this.multipleTargetUserPayload)
        .then(() => {
          this.$refs.refPeopleTable.resetSelectableParams()
          this.callForTargetUsers()
          this.changeDeleteModalStatus(false)
        })
        .catch((error) => {
          this.bulkDeleteErrorMessage = error?.response?.data?.message
        })
        .finally(() => {
          this.loading = false
          this.deleteButtonDisabled = false
        })
    },
    handleDeleteUser(selectedUser, selections) {
      this.loading = true
      deleteTargetUser(selectedUser.resourceId).then((response) => {
        if (response.data && response.data.message) {
          if (
            this.$refs.refPeopleTable.multipleSelection.find(
              (item) => item.resourceId === selectedUser.resourceId
            )
          ) {
            this.$refs.refPeopleTable.$refs.elTableRef.toggleRowSelection(selectedUser, false)
            this.$refs.refPeopleTable.serverSideSelectionCount -= 1
          }
          if (selections?.[selections.length - 1]?.resourceId === selectedUser?.resourceId) {
            this.$emit('call-for-company-licenses')
            this.callForTargetUsers()
          }
          this.callForTargetUsers()
        }
      })
    },
    callForTargetUsers() {
      this.loading = true
      this.payload.filter.FilterGroups[1].FilterItems = [
        ...this.payload.filter.FilterGroups[1].FilterItems.filter(
          (item) =>
            !this.customFields.some((cf) => {
              return cf.name === item.FieldName
            })
        )
      ]
      this.payload.newVersion = true
      getTargetUsers(this.payload)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = response.data.data.results
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    callForGetTargetUserCustomFieldsByCompanyId(forceUpdate = false) {
      this.loading = true
      if (!this.isInitial && !this.customFields.length && !forceUpdate) {
        return this.callForTargetUsers()
      }
      this.isInitial = false
      if (this.customFields.length && !forceUpdate) {
        this.callForTargetUsers()
      } else {
        getTargetUserCustomFieldsByCompanyId()
          .then((response) => {
            this.payload = getDefaultAxiosPayload()
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

            const columnsOfCustomFields = createCustomFieldColumns(this.customFields)

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
            this.callForTargetUsers()
          })
      }
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
    },
    calculateIsFilterColumnActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.payload)
    }
  },
  created() {
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.TARGET_USERS_PEOPLE)
    )
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
</style>
