<template>
  <DataTable
    id="target-users-group-users-data-table"
    ref="refTargetGroupUsersTable"
    :refName="'groupsTable'"
    :loading="loading"
    :table="tableData"
    :columns="tableOptions.columns"
    :pageSizes="tableOptions.pageSizes"
    :empty="tableOptions.iEmpty"
    :filterable="false"
    :options="false"
    :add-button="tableOptions.addButton"
    :row-actions="tableOptions.rowActions"
    :select-event="tableOptions.selectEvent"
    :stored-table-settings="storedTableSettings"
    is-server-side
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :hideActionOptions="true"
    :showPagination="false"
  >
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'

import {
  exportTargetGroupUsers,
  getTargetUserCustomFieldsByCompanyId,
  searchTargetGroupUsers
} from '@/api/targetUsers'

import ServerSideProps from '@/helper-classes/server-side-table-props'

export default {
  name: 'CompanyGroupDetailsPreview',
  components: {
    DataTable
  },
  props: {
    excludeGroupUsers: {
      type: Boolean,
      default: false
    },
    groupId: {
      type: String
    },
    hasRowActions: {
      type: Boolean,
      default: true
    },
    hasAddButton: {
      type: Boolean,
      default: true
    },
    hasSelectionSlot: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'handleAddAction',
    'handleEditTargetUser',
    'handleAddToAnExistingGroup',
    'handleSelectionChange',
    'handleAddUsersSelectionClick',
    'handleRemoveToGroup',
    'handleRemoveUsersSelectionClick',
    'handleRouteBackToTargetUsers'
  ],
  data() {
    return {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 25,
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
        },
        excludeGroupUsers: this.excludeGroupUsers
      },
      defaultRequestBody: {
        pageNumber: 1,
        pageSize: 25,
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
        },
        excludeGroupUsers: this.excludeGroupUsers
      },
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
          dbName: 'firstName'
        },
        {
          property: PROPERTY_STORE.LASTNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.LASTNAME),
          sortable: true,
          show: true,
          type: 'text',
          dbName: 'lastName'
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
          dbName: 'email'
        },
        {
          property: PROPERTY_STORE.DEPARTMENT,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
          sortable: true,
          show: true,
          type: 'text',
          dbName: 'department'
        }
      ],
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
          fullWidth: true
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
          dbName: 'status'
        },
        {
          property: 'createTime',
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.CREATETIME),
          fixed: !this.hasRowActions && 'right',
          sortable: true,
          show: true,
          type: 'text',
          maxWidth: 300,
          minWidth: 160,
          overrideWidth: true,
          dbName: 'createTime'
        }
      ],
      loading: false,
      tableOptions: {
        pageSizes: [5, 10, 25],
        addButton: {
          show: this.hasAddButton,
          action: 'addAction',
          tooltip: 'Add Users'
        },
        columns: [],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_GROUPS_DEFINED,
          id: 'btn-empty--target-users-group',
          icon: 'mdi-plus'
        }
      },
      tableData: [],
      customFields: [],
      selections: [],
      storedTableSettings: null,
      serverSideProps: new ServerSideProps()
    }
  },
  watch: {
    customFields() {
      this.addCustomFieldColumns()
    }
  },

  created() {
    if (this.groupId) {
      this.getDefaultFilterAndSearch()
    }
  },

  methods: {
    handleSetRenderedColumns(tableSettings = {}) {
      this.storedTableSettings = tableSettings
    },
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.axiosPayload.pageNumber = pageNumber
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSideSizeChanged(pageSize = 25) {
      //generic
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    resetPageNumber() {
      //generic
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    getDefaultFilterAndSearch() {
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.axiosPayload = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refTargetGroupUsersTable.filterValues = {}
      this.$refs.refTargetGroupUsersTable.columnKey = `column-key${Math.random()
        .toString()
        .substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETGROUPUSERSTABLE)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.TARGETGROUPUSERSTABLE,
        JSON.stringify({
          filter: this.axiosPayload.filter,
          filterValues
        })
      )
    },
    addCustomFieldColumns() {
      const columnsOfCustomFields = this.customFields.map((field) => {
        const { name, fieldDataType } = field
        const filterableProps = {}

        return {
          property: name,
          type: 'text',
          sortable: false,
          filterable: true,
          hideSort: true,
          label: name,
          align: 'left',
          show: true,
          width: 80 + name.length * 7
        }
      })
      if (!columnsOfCustomFields.length) {
        const newColumns = [...this.defaultColumns, ...this.lastColumns]
        this.setStoredTableSettings(newColumns)
        this.tableOptions.columns = newColumns
      } else {
        const newColumns = [...this.defaultColumns, ...columnsOfCustomFields, ...this.lastColumns]
        this.setStoredTableSettings(newColumns)
        this.tableOptions.columns = newColumns
      }
    },
    setStoredTableSettings(newColumns = []) {
      if (this.storedTableSettings && this.storedTableSettings.renderedColumns.length) {
        newColumns.forEach((column) => {
          const item = this.storedTableSettings.renderedColumns.find(
            (renderedColumnProp) => renderedColumnProp === column.property
          )
          column.show = !!item
        })
      }
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
      this.loading = true
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
          this.addCustomFieldColumns()
        })
        .finally(() => this.callForSearchTargetGroupUsers())
    },
    callForSearchTargetGroupUsers(id = this.groupId) {
      this.loading = true
      searchTargetGroupUsers(id, this.axiosPayload)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          const { data: { data: { results = [] } } = {} } = response
          this.tableData = results.map((item) => {
            const { customFieldValues } = item
            for (let { name, value } of customFieldValues) {
              item[name] = value
            }
            return item
          })
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.$emit('handleRouteBackToTargetUsers')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleAddUsersSelectionClick() {
      this.$emit('handleAddUsersSelectionClick', this.selections)
    },
    handleEditTargetUsers(selectedRow = {}) {
      this.$emit('handleEditTargetUser', selectedRow)
    },
    handleAddAction() {
      this.$emit('handleAddAction')
    },
    handleAddToAnExistingGroup(selectedRow = {}) {
      this.$emit('handleAddToAnExistingGroup', selectedRow)
    },
    handleRemoveUsersSelectionClick() {
      this.$emit('handleRemoveUsersSelectionClick', this.selections)
    },
    handleSelectionChange(selection = []) {
      this.selections = selection
      this.$emit('handleSelectionChange', selection)
    },
    handleRemoveToGroup(selectedRow = {}) {
      this.$emit('handleRemoveToGroup', selectedRow)
    },
    toggleLoading() {
      this.loading = !this.loading
    }
  }
}
</script>
