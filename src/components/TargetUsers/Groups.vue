<template>
  <div class="target-users-groups">
    <TargetGroupUsersAddUsersModal
      v-if="showAddUsersModal"
      :status="showAddUsersModal"
      :group-name="getGroupName"
      :resource-id="getResourceId"
      @closeOverlay="toggleAddUserModal"
      @closeOverlayWithUpdate="closeAddOverlayWithUpdate"
    />
    <create-new-user-group-modal
      v-if="showNewUserGroupModal"
      :status="showNewUserGroupModal"
      :is-create-button-disabled="isCreateButtonDisabled"
      @changeNewUserGroupStatus="changeNewUserGroupStatus"
      @handleSave="callForCreateNewUserGroup"
    />
    <delete-group-modal
      :status="showDeleteGroupModal"
      :selected-row="selectedRow"
      @changeDeleteGroupModalStatus="changeDeleteGroupModalStatus"
      @handleDelete="handleDeleteGroup"
      @handleMultipleDelete="handleDeleteGroupMultiple"
    />

    <datatable
      v-bind="tableState"
      ref="refGroupsTable"
      :refName="'groupsTable'"
      id="target-users-group-data-table"
      is-server-side
      filterable
      options
      selectable
      disable-extended-view-transition
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :stored-table-settings="storedTableSettings"
      :rowActions="tableOptions.rowActions"
      :extended-view-options="tableOptions.extendedViewOptions"
      :extendedViewValue="extendedViewValue"
      :extendedViewLoading="extendedViewLoading"
      :selectEvent="tableOptions.selectEvent"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      @downloadEvent="exportTargetGroupsList"
      @handleMultipleDelete="handleMultipleDelete"
      @syncWithLDAP="handleSyncWithLDAP"
      @handleEdit="handleEdit"
      @onEditClick="onEditClick"
      @delete="handleDelete"
      @onEmptyBtnClicked="showNewUserGroupModal = true"
      @add-group="handleAddGroup"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForTargetGroups"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-table-settings-change="handleSetRenderedColumns"
    >
      <template v-slot:addUsers>
        <v-tooltip bottom opacity="1">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="btn-new"
              id="btn-add--target-users-group"
              rounded
              color="#2196f3"
              style="margin-right: 10px;"
              v-on="{ ...tooltip }"
              @click.native="showNewUserGroupModal = true"
              :disabled="!checkPermissions('target-groups', 'POST')"
            >
              <v-icon color="white" style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
              <span class="button-new__text">NEW</span>
            </v-btn>
          </template>
          <span class="tooltip-span">{{ 'Add Group' }}</span>
        </v-tooltip>
      </template>
      <template v-slot:datatable-custom-column="{ scope, col }">
        <span @click="handleGroupNameClick(scope.row)" class="popup-link">
          {{ scope.row[col.property] }}
        </span>
      </template>
      <template #datatable-row-actions="{scope}">
        <TargetUserRowActionsEditButton
          type="groups"
          :scope="scope"
          @on-edit="handleEditBtnClick"
        />
        <v-menu bottom left offset-y transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              style="margin-top: -18px;"
              :id="`btn-dots--row-actions-list-${scope.$index}`"
              class="btn-hover ml-1"
              icon
            >
              <v-icon @click.native="selectedMenuIndex = scope.$index">mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              :id="`${tableOptions.rowActions[1].id}-${scope.$index}`"
              @click="handleAddGroup(scope.row)"
            >
              <v-list-item-title>
                <v-icon class="pr-3">{{ tableOptions.rowActions[1].icon }}</v-icon>
                <span>{{ tableOptions.rowActions[1].name }}</span>
              </v-list-item-title>
            </v-list-item>
            <TargetGroupRowActionsDeleteButton :scope="scope" @on-delete="handleDelete" />
          </v-list>
        </v-menu>
      </template>
    </datatable>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  createTargetGroup,
  updateTargetGroup,
  deleteTargetGroup,
  searchTargetGroups,
  exportTargetGroups
} from '@/api/targetUsers'
import CreateNewUserGroupModal from './CreateNewUserGroupModal'
import DeleteGroupModal from './DeleteGroupModal'
import TargetGroupUsersAddUsersModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddUsersModal'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { required, maxLength } from '@/utils/validations'
import { checkPermission, getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  columnFilterChanged,
  columnFilterCleared,
  isColumnFilterActive
} from '@/utils/helperFunctions'
import TargetUserRowActionsEditButton from '@/components/SmallComponents/TargetUserRowActionsEditButton'
import TargetGroupRowActionsDeleteButton from '@/components/SmallComponents/TargetGroupRowActionsDeleteButton'
export default {
  name: 'Groups',
  components: {
    TargetGroupRowActionsDeleteButton,
    TargetUserRowActionsEditButton,
    DeleteGroupModal,
    CreateNewUserGroupModal,
    TargetGroupUsersAddUsersModal,
    datatable: DataTable
  },
  props: {
    isLoadState: {
      type: Boolean
    }
  },
  data() {
    return {
      showAddUsersModal: false,
      isCreateButtonDisabled: false,
      loading: false,
      storedTableSettings: null,
      tableData: [],
      selectedGroup: {},
      extendedViewLoading: true,
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'slot',
            width: 260,
            isEditable: true,
            filterableType: 'text',
            editOptions: {
              component: 'textfield',
              props: {
                rules: [(v) => required(v, 'Required')]
              }
            }
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            isEditable: true,
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS,
            editOptions: {
              component: 'select',
              props: {
                items: [
                  { text: 'Very Low', value: 'VeryLow' },
                  'Low',
                  'Medium',
                  'High',
                  { text: 'Very High', value: 'VeryHigh' }
                ]
              }
            },
            width: 150
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            isEditable: true,
            width: 180
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: true,
          delete: true,
          download: false
        },
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_GROUPS_DEFINED,
          btn: 'New',
          id: 'btn-empty--target-users-group',
          icon: 'mdi-plus'
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            id: 'btn-edit--target-users-group-row-actions',
            action: 'edit',
            isNotShow: true,
            checkDisability(row) {
              return !row.isEditable || !checkPermission('target-groups/{resourceId}', 'PUT')
            }
          },
          {
            name: 'Add users to group',
            id: 'btn-add-users-to-group--target-users-group-row-actions',
            icon: 'mdi-account-multiple-plus',
            action: 'add-group'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            id: 'btn-delete--target-users-people-row-actions',
            disabled(row) {
              return !checkPermission('target-groups/{resourceId}', 'DELETE') || !row.isEditable
            }
          }
        ],
        extendedViewOptions: {
          titleKey: 'name',
          footer: [
            {
              label: 'Date Created',
              key: 'createTime'
            },
            {
              label: 'Last update',
              key: 'lastUpdateDate'
            }
          ],
          col: [
            {
              property: PROPERTY_STORE.NAME,
              label: 'Group Name',
              isEditable: true,
              type: 'text',
              editOptions: {
                component: 'textfield',
                getDisabledValue(row) {
                  return row.length > 1
                },
                props: {
                  rules: [
                    (v) => required(v, 'Required'),
                    (v) => maxLength(v, 64, labels.getMaxLengthMessage('Group name'))
                  ]
                }
              }
            },
            {
              property: PROPERTY_STORE.PRIORITY,
              label: getStoreValue(PROPERTY_STORE.PRIORITY),
              type: 'priority',
              isEditable: true,
              editOptions: {
                component: 'select',
                props: {
                  items: [
                    { text: 'Very Low', value: 'VeryLow' },
                    'Low',
                    'Medium',
                    'High',
                    { text: 'Very High', value: 'VeryHigh' }
                  ]
                }
              }
            }
          ]
        }
      },
      addGroupsItems: ['Create User Group', 'Create Smart Group'],
      showNewUserGroupModal: false,
      showDeleteGroupModal: false,
      selectedRow: {},
      extendedViewValue: [],
      tableCredientials: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      tableState: null,
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getGroupName() {
      return this.selectedGroup.name || localStorage.getItem('lastTargetGroupUsers')
    },
    getResourceId() {
      return this.selectedGroup.resourceId
    }
  },
  methods: {
    handleEditBtnClick(row, scope) {
      this.$refs.refGroupsTable.handleEdit(row, scope.$index)
    },
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(TABLE_SETTINGS_KEYS.TARGET_USERS_GROUPS, JSON.stringify(tableSettings))
    },
    resetPageNumber() {
      //generic
      this.tableCredientials.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.tableCredientials.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.calculateIsFilterColumnActive()
      this.callForTargetGroups()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.tableCredientials.pageNumber = pageNumber
      this.callForTargetGroups()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.tableCredientials.ascending = order === 'ascending'
      this.tableCredientials.orderBy = prop
      this.callForTargetGroups()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.tableCredientials.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForTargetGroups()
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSGROUP)
      )
      if (savedFilter) {
        this.tableCredientials.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refGroupsTable.filterValues = savedFilter.filterValues
          this.$refs.refGroupsTable.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForTargetGroups()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.tableCredientials = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refGroupsTable.filterValues = {}
      this.$refs.refGroupsTable.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      this.callForTargetGroups()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSGROUP,
        JSON.stringify({
          filter: this.tableCredientials.filter,
          filterValues
        })
      )
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    handleSyncWithLDAP(row) {},
    handleAddGroup(row = {}) {
      this.selectedGroup = row
      this.toggleAddUserModal()
    },
    toggleAddUserModal() {
      this.showAddUsersModal = !this.showAddUsersModal
    },
    closeAddOverlayWithUpdate() {
      this.toggleAddUserModal()
      this.callForTargetGroups()
    },
    handleGroupNameClick(row) {
      this.$router.push({
        name: 'Target Group Users',
        params: { id: row.resourceId, label: row.name }
      })
    },
    handleMultipleDelete(selection) {
      this.selectedRow = selection
      this.changeDeleteGroupModalStatus(true)
    },
    callForCreateNewUserGroup(group) {
      this.isCreateButtonDisabled = true
      createTargetGroup(group)
        .then(() => {
          this.changeNewUserGroupStatus(false)
          this.callForTargetGroups()
        })
        .finally(() => (this.isCreateButtonDisabled = false))
    },
    changeNewUserGroupStatus(status) {
      this.showNewUserGroupModal = status
    },
    changeDeleteGroupModalStatus(status) {
      this.showDeleteGroupModal = status
    },
    handleEdit(rows) {
      rows.map((item) => {
        this.callForUpdateTargetGroup(item)
      })
    },
    callForTargetGroups() {
      this.loading = true
      searchTargetGroups(this.tableCredientials)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = data.results.length ? data.results : []
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    callForUpdateTargetGroup(payload) {
      updateTargetGroup(payload).then(() => {
        this.callForTargetGroups()
      })
    },
    handleDelete(selectedRow) {
      this.changeDeleteGroupModalStatus(true)
      this.selectedRow = selectedRow
    },
    exportTargetGroupsList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.tableCredientials.filter
        }
        exportTargetGroups(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Target Groups.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    onEditClick({ selected: selections, isEditPopupOpen }) {
      if (isEditPopupOpen) {
        this.extendedViewLoading = false
        this.extendedViewValue = [...selections]
      }
    },
    handleDeleteGroupMultiple(selection) {
      selection.forEach((item) => this.handleDeleteGroup(item))
    },
    handleDeleteGroup(selectedRow) {
      deleteTargetGroup(selectedRow.resourceId).then(() => {
        this.$refs.refGroupsTable.unSelectRow(selectedRow)
        this.callForTargetGroups()
      })
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      this.tableCredientials.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.tableCredientials
      )
      this.callForTargetGroups()
    },
    columnFilterCleared(fieldName) {
      this.tableCredientials.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.tableCredientials
      )
      this.calculateIsFilterColumnActive()
      this.callForTargetGroups()
    },
    calculateIsFilterColumnActive() {
      this.tableOptions.isColumnFilterActive = isColumnFilterActive(this.tableCredientials)
    }
  },

  created() {
    const storeOfGroupTable = this?.$store?.state['datatable']?.tables['Groups']
    const tableState = storeOfGroupTable && storeOfGroupTable.tableState
    if (this.isLoadState && tableState) {
      if (tableState) {
        this.serverSideProps = tableState.serverSideProps
        const { filterValues = {} } = tableState
        if (Object.keys(filterValues).length) {
          this.tableOptions.isColumnFilterActive = true
          for (const [key, value] of Object.entries(filterValues)) {
            if (value.selectValue === 'between') {
              this.tableCredientials.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue[0],
                FieldName: key,
                Operator: '>='
              })
              this.tableCredientials.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue[1],
                FieldName: key,
                Operator: '<='
              })
            } else {
              this.tableCredientials.filter.FilterGroups[0].FilterItems.push({
                Value: value.textValue,
                FieldName: key,
                Operator: value.selectValue
              })
            }
          }
        }
        this.tableState = { persistentState: tableState }
      }
    } else {
      this.storedTableSettings = JSON.parse(
        localStorage.getItem(TABLE_SETTINGS_KEYS.TARGET_USERS_GROUPS)
      )
    }
    if (!this.isLoadState || !tableState) {
      this.getDefaultFilterAndSearch()
    }
  },
  beforeDestroy() {
    const tableState = {
      ...this.$refs.refGroupsTable.getState(),
      serverSideProps: this.serverSideProps
    }
    this.$store.dispatch('datatable/setTable', {
      key: 'Groups',
      tableState
    })
  }
}
</script>
