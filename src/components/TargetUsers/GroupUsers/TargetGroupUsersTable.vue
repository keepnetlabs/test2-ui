<template>
  <DataTable
    id="target-users-group-users-data-table"
    selectable
    :refName="'groupsTable'"
    :loading="loading"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :filterable="true"
    :options="true"
    :add-button="tableOptions.addButton"
    :row-actions="tableOptions.rowActions"
    :select-event="tableOptions.selectEvent"
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
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import {
  exportTargetGroupUsers,
  getTargetUserCustomFieldsByCompanyId,
  searchTargetGroupUsers
} from '@/api/targetUsers'
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
      selections: []
    }
  },
  watch: {
    customFields() {
      this.addCustomFieldColumns()
    }
  },

  created() {
    if (this.resourceId) {
      this.callForGetTargetUserCustomFieldsByCompanyId()
    }
  },

  methods: {
    addCustomFieldColumns() {
      const columnsOfCustomFields = this.customFields.map((field) => {
        return {
          property: field.name,
          type: 'text',
          sortable: true,
          filterable: true,
          label: field.name,
          align: 'left',
          show: true,
          width: 80 + field.name.length * 7
        }
      })

      if (!columnsOfCustomFields.length) {
        this.tableOptions.columns = [...this.defaultColumns, ...this.lastColumns]
      } else {
        this.tableOptions.columns = [
          ...this.defaultColumns,
          ...columnsOfCustomFields,
          ...this.lastColumns
        ]
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
        exportTargetGroupUsers(this.resourceId, payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Target Group Details.${exportType.toLocaleLowerCase()}`
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
