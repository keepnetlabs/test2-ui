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
        options
        selectable
        is-server-side
        filterable
        no-padding-bottom
        :count-row="5"
        :loading="loading"
        :columns="tableOptions.columns"
        :table="tableData"
        :is-settings-popup="false"
        :show-filter-options="false"
        :empty="tableOptions.iEmpty"
        :downloadButton="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @handleSelectionChange="handleSelectionChange"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @refreshAction="callForTargetGroups"
        @searchChangedEvent="handleSearchChange"
      />
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--target-users-add-to-an-existing-group-dialog-popup"
        confirm-button-id="btn-confirm--target-users-add-to-an-existing-group-dialog-popup"
        :confirmButtonDisabled="getConfirmButtonDisabled"
        @handleClose="closeOverlay"
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
import { getDefaultAxiosPayload } from '@/utils/functions'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
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
      axiosPayload: getDefaultAxiosPayload({ pageSize: 5 }),
      serverSideProps: new ServerSideProps(),
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
            show: true,
            type: 'text',
            width: 200,
            filterableType: 'text'
          },
          // {
          //   property: 'userCount',
          //   align: 'left',
          //   label: 'Users',
          //   sortable: true,
          //   show: true,
          //   width: 120,
          //   type: 'text',
          //   filterableType: 'number'
          // },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            width: 170,
            filterableType: 'select',
            filterableItems: ['Very Low', 'Low', 'Medium', 'High', 'Very High']
          },
          {
            property: 'companyName',
            align: 'left',
            label: 'Company',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text'
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
            overrideWidth: true,
            filterableType: 'date'
          }
        ],
        downloadButton: { show: false },
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
    this.serverSideProps.pageSize = 5
    this.callForTargetGroups()
  },
  methods: {
    callForTargetGroups() {
      this.loading = true
      searchTargetGroups(this.axiosPayload)
        .then((response) => {
          const {
            totalNumberOfRecords,
            totalNumberOfPages,
            pageNumber,
            results
          } = response.data.data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results?.length ? results : []
        })
        .finally(() => (this.loading = false))
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.callForTargetGroups()
    },
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.resetPageNumber()
      this.callForTargetGroups()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.resetPageNumber()
      this.callForTargetGroups()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForTargetGroups()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForTargetGroups()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop
      this.callForTargetGroups()
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
