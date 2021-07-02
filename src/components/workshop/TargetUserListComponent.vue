<template>
  <div class="target-users-groups">
    <datatable
      v-bind="tableState"
      ref="refGroupsTable"
      :refName="'groupsTable'"
      id="target-users-group-data-table"
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      titleKey="name"
      :columns="tableOptions.columns"
      :show-all-records="showAllRecords"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :options="true"
      :total-number-of-records="totalNumberOfRecords"
      :pageSizes="tableOptions.pageSizes"
      :stored-table-settings="storedTableSettings"
      :rowActions="tableOptions.rowActions"
      :extended-view-options="tableOptions.extendedViewOptions"
      :disableExtendedViewTransition="true"
      :extendedViewValue="extendedViewValue"
      :extendedViewLoading="extendedViewLoading"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
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
      @on-all-records-button-click="handleAllRecordsClick"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-table-settings-change="handleSetRenderedColumns"
      :isServerSide="true"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :hideActionOptions="true"
      :show-page-size="false"
      ><template v-slot:datatable-custom-column="{ scope, col }">
        <span @click="handleGroupNameClick(scope.row)" class="popup-link">
          {{ scope.row[col.property] }}
        </span>
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
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { required, maxLength } from '@/utils/validations'
import { checkPermission } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'
export default {
  name: 'TargetUserListComponent',
  components: {
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
      showAllRecords: false,
      totalNumberOfRecords: 0,
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
            fixed: 'right',
            minWidth: 220
          }
        ],
        pageSizes: [10],
        selectEvent: {
          clipboard: true,
          edit: true,
          delete: true,
          download: false
        },
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_GROUPS_DEFINED,
          btn: 'ADD A GROUP',
          id: 'btn-empty--target-users-group',
          icon: 'mdi-plus'
        }
      },
      addGroupsItems: ['Create User Group', 'Create Smart Group'],
      showNewUserGroupModal: false,
      showDeleteGroupModal: false,
      selectedRow: {},
      extendedViewValue: [],
      tableCredientials: {
        pageNumber: 1,
        pageSize: 75000,
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
      defaultRequestBody: {
        pageNumber: 1,
        pageSize: 75000,
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
      this.tableOptions.isColumnFilterActive = filterActive
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
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSGROUP)
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
    handleAllRecordsClick() {
      this.tableCredientials.pageSize = 75000
      this.showAllRecords = false
      this.callForTargetGroups()
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
      this.$emit('get-group-details', row.resourceId)
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
        .catch(() => {
          //this.showNewUserGroupModal = false
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
          this.totalNumberOfRecords = totalNumberOfRecords
          if (this.tableCredientials.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }
          if (totalNumberOfRecords <= 1000 && this.tableCredientials.pageSize === 1000) {
            this.showAllRecords = false
          }

          this.tableData = data.results.length ? data.results : []
          for (let i = 0; i < 5; i++) {
            //this.tableData.push(this.tableData[i])
          }
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
      this.getDefaultFilterAndSearch()
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
      let items = []
      let requestBody = this.tableCredientials.filter.FilterGroups[0].FilterItems
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

      this.tableCredientials.filter.FilterGroups[0].FilterItems = requestBody
      this.callForTargetGroups()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.tableCredientials.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.tableCredientials.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForTargetGroups()

      this.tableOptions.isColumnFilterActive =
        this.tableCredientials.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },

  created() {
    this.getDefaultFilterAndSearch()
  }
}
</script>

<style lang="scss">
.target-users-groups {
  padding-top: 24px;
}
</style>
