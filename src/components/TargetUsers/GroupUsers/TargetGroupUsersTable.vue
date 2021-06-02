<template>
  <DataTable
    id="target-users-group-users-data-table"
    ref="refTargetGroupUsersTable"
    selectable
    :refName="'groupsTable'"
    :loading="loading"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :pageSizes="tableOptions.pageSizes"
    :empty="tableOptions.iEmpty"
    :filterable="true"
    :options="true"
    :add-button="tableOptions.addButton"
    :row-actions="tableOptions.rowActions"
    :select-event="tableOptions.selectEvent"
    :stored-table-settings="storedTableSettings"
    is-server-side
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    @addAction="handleAddAction"
    @downloadEvent="exportTargetGroupsUserList"
    @onEmptyBtnClicked="handleAddAction"
    @handleEditTargetUsers="handleEditTargetUsers"
    @handleAddToAnExistingGroup="handleAddToAnExistingGroup"
    @handleSelectionChange="handleSelectionChange"
    @handleRemoveToGroup="handleRemoveToGroup"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
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
    <template #selection-all-slot v-if="hasSelectionSlot">
      <v-tooltip bottom opacity="1">
        <template v-slot:activator="{ on }">
          <v-btn
            class="btn-selected-hover mr-1"
            icon
            v-on="on"
            @click="handleAddUsersSelectionClick"
          >
            <v-icon class="selection-icons" color="white">mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-span">Add Users</span>
      </v-tooltip>
      <v-tooltip bottom opacity="1">
        <template v-slot:activator="{ on }">
          <v-btn
            class="btn-selected-hover mr-1"
            icon
            v-on="on"
            @click="handleRemoveUsersSelectionClick"
          >
            <v-icon class="selection-icons" color="white">mdi-minus-circle</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-span">Remove Users</span>
      </v-tooltip>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import {
  exportTargetGroupUsers,
  getTargetUserCustomFieldsByCompanyId,
  searchTargetGroupUsers
} from '@/api/targetUsers'
import ClientTableExportHelper from '@/helper-classes/client-table-export-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import QueryHelperForTable from '@/helper-classes/query-helper'

export default {
  name: 'TargetGroupUsersTable',
  components: {
    DataTable
  },
  props: {
    iEmpty: {
      type: Object,
      default: () => ({
        message: labels.NoTargetGroupUserAdded,
        btn: 'Add Users',
        icon: 'mdi-plus'
      })
    },
    excludeGroupUsers: {
      type: Boolean,
      default: false
    },
    resourceId: {
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
        pageSize: 1000000,
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
        pageSize: 1000000,
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
          filterableType: 'text',
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
          filterableType: 'text',
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
          filterableType: 'text',
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
          filterableType: 'text',
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
          fullWidth: true,
          filterableType: 'select',
          filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS
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
          dbName: 'status',
          filterableType: 'select',
          filterableItems: COMMON_CONSTANTS.STATUS_ITEMS
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
          filterableType: 'date',
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
        iEmpty: this.iEmpty,
        isColumnFilterActive: false,
        rowActions: this.getRowActions(),
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
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
    this.storedTableSettings = JSON.parse(
      localStorage.getItem(TABLE_SETTINGS_KEYS.TARGET_USERS_GROUP_USERS)
    )
    if (this.resourceId) {
      this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
      this.queryHelper.controlRouteQuery()
      this.setQueryValuesToPayload(this.$route.query)
      this.getDefaultFilterAndSearch()
    }
  },

  methods: {
    handleSetRenderedColumns(tableSettings = {}) {
      localStorage.setItem(
        TABLE_SETTINGS_KEYS.TARGET_USERS_GROUP_USERS,
        JSON.stringify(tableSettings)
      )
      this.storedTableSettings = tableSettings
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
    handleSearchChange(searchFilter = {}, filterActive = false) {
      //generic
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = filterActive
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      //generic
      this.axiosPayload.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    sortChanged({ order, prop } = {}) {
      //generic
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSideSizeChanged(pageSize = 10) {
      //generic
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    resetPageNumber() {
      //generic
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.TARGETGROUPUSERSTABLE)
      )
      if (savedFilter) {
        this.axiosPayload.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refTargetGroupUsersTable.filterValues = savedFilter.filterValues
          this.$refs.refTargetGroupUsersTable.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
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
    callForSearchTargetGroupUsers(id = this.resourceId) {
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
            for (let { name, value, dataType, timestampValue } of customFieldValues) {
              if (dataType === 'Boolean') {
                if (value === 'True') {
                  item[name] = 'Yes'
                } else if (value === 'False') {
                  item[name] = 'No'
                } else {
                  item[name] = 'No'
                }
              } else if (['Date', 'DateTime'].includes(dataType)) {
                item[name] = timestampValue
              } else {
                item[name] = value !== null && value !== undefined ? value : ''
              }
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

    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.axiosPayload.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
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
      this.callForSearchTargetGroupUsers()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.axiosPayload.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.axiosPayload.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForSearchTargetGroupUsers()

      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    getRowActions() {
      return this.hasRowActions
        ? [
            {
              name: 'Edit this row',
              icon: 'mdi-pencil',
              action: 'handleEditTargetUsers',
              isNotShow: true
            },
            {
              name: 'Add to an existing group',
              icon: 'mdi-account-multiple-plus',
              action: 'handleAddToAnExistingGroup'
            },
            {
              name: 'Remove from group',
              icon: 'mdi-minus-circle',
              action: 'handleRemoveToGroup'
            }
          ]
        : []
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
    exportTargetGroupsUserList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      const clientTableExportHelper = new ClientTableExportHelper(
        JSON.parse(JSON.stringify(this.axiosPayload.filter)),
        this.$refs.refTargetGroupUsersTable,
        'CreateTime'
      )
      if (this.$refs.refTargetGroupUsersTable.search) {
        clientTableExportHelper.addSearchItems(this.tableOptions.columns)
      }
      if (
        this.$refs.refTargetGroupUsersTable.sortProps &&
        this.$refs.refTargetGroupUsersTable.sortProps.order
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
          filter,
          excludeGroupUsers: this.excludeGroupUsers
        }

        exportTargetGroupUsers(this.resourceId, payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Target Group Details.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    toggleLoading() {
      this.loading = !this.loading
    }
  }
}
</script>
