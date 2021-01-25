<template>
  <AppDialog
    v-if="status"
    :status="status"
    icon="mdi-account-multiple-plus"
    :custom-size="'800'"
    maxHeightSize="630"
    :title="getTitle"
    subtitle="Select groups to add users to"
    @changeStatus="closeOverlay"
  >
    <template #app-dialog-body>
      <DataTable
        id="target-users-group-users-modal-data-table"
        :count-row="5"
        :refName="'refGroupsTable'"
        :loading="loading"
        :columns="tableOptions.columns"
        filterable
        :is-column-filter-active="tableOptions.isColumnFilterActive"
        :table="tableData"
        :is-settings-popup="false"
        :empty="tableOptions.iEmpty"
        options
        :downloadButton="tableOptions.downloadButton"
        selectable
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @handleSelectionChange="handleSelectionChange"
        @refreshAction="callForTargetGroups"
      />
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        @handleClose="closeOverlay"
        :confirmButtonDisabled="getConfirmButtonDisabled"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import { createTargetGroupUsers, searchTargetGroups } from '@/api/targetUsers'
export default {
  name: 'AddToAnExistingGroupModal',
  components: {
    AppDialogFooter,
    AppDialog,
    DataTable
  },
  emits: ['closeOverlay', 'closeOverlayWithUpdate'],
  props: {
    status: {
      type: Boolean
    },
    selectedRows: {
      type: Array
    }
  },
  data() {
    return {
      axiosPayload: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      confirmButtonDisabled: true,
      loading: false,
      tableData: [],
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: 'Group Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 240,
            isEditable: true,
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            isEditable: true,
            width: 170
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            isEditable: true,
            width: 300,
            overrideWidth: true
          }
        ],
        downloadButton: { show: false },
        isColumnFilterActive: false,
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_GROUPS_DEFINED,
          btn: 'ADD A GROUP',
          icon: 'mdi-plus'
        }
      },
      selectedTargetGroups: []
    }
  },
  computed: {
    getConfirmButtonDisabled() {
      return !this.selectedTargetGroups.length
    },
    getTitle() {
      let text = 'User'
      text += this.selectedRows.length > 1 ? 's' : ''
      return `Add ${this.selectedRows.length} ${text} To User Groups`
    }
  },
  created() {
    this.callForTargetGroups()
  },
  methods: {
    callForTargetGroups() {
      this.loading = true
      searchTargetGroups(this.axiosPayload)
        .then((response) => {
          let data = response.data.data
          this.tableData = data.results.length ? data.results : []
        })
        .finally(() => (this.loading = false))
    },
    closeOverlay() {
      this.$emit('closeOverlay')
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
      this.callForTargetGroups()
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
      this.callForTargetGroups()

      this.tableOptions.isColumnFilterActive =
        this.axiosPayload.filter.FilterGroups[0].FilterItems.length >= 1
    },
    handleConfirm() {
      const selectedRowsResourceIds = this.selectedRows.map((row) => row.resourceId)
      const promises = this.selectedTargetGroups.reduce((acc, group) => {
        const payload = { targetUserResourceIds: selectedRowsResourceIds }
        acc.push(createTargetGroupUsers(group.resourceId, payload, false))
        return acc
      }, [])
      Promise.all(promises)
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            message: `${selectedRowsResourceIds.length} target user(s) has been added to ${this.selectedTargetGroups.length} target group(s)`,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
        })
        .finally(() => {
          this.$emit('closeOverlayWithUpdate')
        })
    },
    handleSelectionChange(selection = []) {
      this.selectedTargetGroups = selection
    }
  }
}
</script>
<style lang="scss">
#target-users-group-users-modal-data-table.k-table__wrapper {
  padding-bottom: 0;
}
</style>
