<template>
  <DataTable
    id="target-users-group-users-data-table"
    :refName="'groupsTable'"
    :loading="loading"
    :is-column-filter-active="tableOptions.isColumnFilterActive"
    :table="tableData"
    :columns="tableOptions.columns"
    :count-row="5"
    :empty="tableOptions.iEmpty"
    :filterable="true"
    :options="true"
    :add-button="tableOptions.addButton"
    selectable
    :row-actions="tableOptions.rowActions"
    :select-event="tableOptions.selectEvent"
    @downloadEvent="exportTargetGroupsUserList"
    @handleEditTargetUsers="handleEditTargetUsers"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { exportTargetGroupUsers } from '@/api/targetUsers'
export default {
  name: 'TargetGroupUsersTable',
  components: {
    DataTable
  },
  props: {
    resourceId: {
      type: String
    },
    customFields: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    tableData: {
      type: Array
    }
  },
  emits: ['handleSelectedRow', 'callForSearchTargetGroupUsers'],
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
        excludeGroupUsers: false
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
          width: 150,
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
          width: 150,
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
          filterableItems: [
            { text: labels.VeryLow, value: 'VeryLow' },
            labels.Low,
            labels.Medium,
            labels.High,
            { text: labels.VeryHigh, value: 'Very High' }
          ]
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
          filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }]
        },
        {
          property: 'createTime',
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.CREATETIME),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          width: 180,
          filterableType: 'date',
          dbName: 'createTime'
        }
      ],
      tableOptions: {
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add Users'
        },
        columns: [],
        iEmpty: {
          message: labels.NoTargetGroupUserAdded,
          btn: 'Add Users',
          icon: 'mdi-plus'
        },
        isColumnFilterActive: false,
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'handleEditTargetUsers',
            isNotShow: true
          },
          {
            name: 'Add to an existing group',
            icon: 'mdi-account-multiple-plus',
            action: 'addToAnExistingGroup'
          },
          {
            name: 'Remove from group',
            icon: 'mdi-minus-circle',
            action: 'removeToGroup'
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      }
    }
  },
  watch: {
    customFields(newVal) {
      const columnsOfCustomFields = newVal.map((field) => {
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
      this.tableOptions.columns = [
        ...this.defaultColumns,
        ...columnsOfCustomFields,
        ...this.lastColumns
      ]
    }
  },

  methods: {
    callForSearchTargetGroupUsers() {
      this.$emit('callForSearchTargetGroupUsers', this.resourceId, this.axiosPayload)
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
    handleEditTargetUsers(selectedRow = {}) {
      this.$emit('handleSelectedRow', selectedRow)
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
          link.download = `target-group-users.${exportType.toLocaleLowerCase()}`
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
