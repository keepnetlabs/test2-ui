<template>
  <AppDialog
    title-id="text--target-user-to-add-to-group-title"
    subtitle-id="text--target-user-to-add-to-group-subtitle"
    title="Add User To User Groups"
    subtitle="Select groups to add users to"
    maxHeightSize="665"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        is-server-side
        selectable
        filterable
        options
        no-padding-bottom
        :loading="isLoading"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        :show-filter-options="false"
        :is-settings-popup="false"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        :count-row="5"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @refreshAction="callForData"
        @handleSelectionChange="handleSelection"
      />
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--target-user-add-to-group-popup"
        confirm-button-id="btn-confirm--target-user-add-to-group-popup"
        actionButtonText="CONFIRM"
        :confirm-button-disabled="confirmButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { searchTargetGroups } from '@/api/targetUsers'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

export default {
  name: 'TrainingReportUserInteractionsModal',
  components: { DataTable, AppDialog, AppDialogFooter },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    },
    user: {
      type: Object
    }
  },
  data() {
    const columns = [
      {
        property: PROPERTY_STORE.NAME,
        align: 'left',
        editable: false,
        label: 'Group Name',
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        width: 260,
        isEditable: true,
        filterableType: 'text'
      },
      {
        property: 'userCount',
        align: 'left',
        editable: false,
        label: 'Users',
        sortable: true,
        show: true,
        type: 'text',
        width: 150,
        isEditable: true,
        filterableType: 'number'
      },
      {
        property: 'companyName',
        align: 'left',
        editable: false,
        label: 'Company',
        sortable: true,
        show: true,
        type: 'text',
        width: 200,
        isEditable: true,
        filterableType: 'text'
      },
      {
        property: PROPERTY_STORE.CREATETIME,
        align: 'left',
        fixed: 'right',
        editable: false,
        label: getStoreValue(PROPERTY_STORE.CREATETIME),
        sortable: true,
        show: true,
        type: 'text',
        filterableType: 'date',
        isEditable: true,
        width: 200
      }
    ]
    return {
      CONSTANTS: {
        icon: 'mdi-account-multiple-plus',
        id: 'target-user-to-add-to-group-data-table',
        ascending: 'ascending'
      },
      selectedRows: [],
      confirmButtonDisabled: true,
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns,
        addButton: {
          show: false
        },
        iEmpty: {
          message: 'No user groups found.'
        },
        rowActions: [],
        downloadButton: {
          show: false
        }
      },
      tableData: []
    }
  },
  created() {
    this.axiosPayload.pageNumber = 1
    this.serverSideProps.pageNumber = 1
    this.axiosPayload.pageSize = 5
    this.serverSideProps.pageSize = 5
    this.callForData()
  },
  watch: {
    selectedRows: {
      deep: true,
      immediate: true,
      handler(val) {
        this.confirmButtonDisabled = val.length === 0
      }
    }
  },
  methods: {
    callForData() {
      this.isLoading = true
      searchTargetGroups(this.axiosPayload)
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
        .finally(() => (this.isLoading = false))
    },
    handleSelection(selection) {
      this.selectedRows = JSON.parse(JSON.stringify(selection))
    },
    handleClose() {
      this.$emit('onClose')
    },
    handleConfirm() {
      this.$emit('onConfirm')
    }
  }
}
</script>
