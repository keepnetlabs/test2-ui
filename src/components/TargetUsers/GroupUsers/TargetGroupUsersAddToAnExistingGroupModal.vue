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
        :getRowIsSelectable="handleRowIsSelectable"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @handleSelectionChange="handleSelectionChange"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @refreshAction="callForTargetGroups"
        @searchChangedEvent="handleSearchChange"
        @onEmptyBtnClicked="handleEmptyBtnClicked"
      >
        <template v-slot:datatable-custom-column="{ scope, col }">
          <div v-if="col.property === PROPERTY_STORE.NAME" class="d-flex align-center">
            <span>{{ scope.row.name }}</span>
            <VTooltip v-if="scope.row.isScimGroup" bottom>
              <template #activator="{ on }">
                <v-icon v-on="on" class="ml-1" style="font-size: 20px;" color="#757575"
                  >mdi-information</v-icon
                >
              </template>
              <span>This group is created via SCIM integration. Manual addition is disabled.</span>
            </VTooltip>
          </div>
        </template>
      </DataTable>
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
import { getStoreValue, LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import { searchTargetGroups, bulkImportTargetUsersToGroups } from '@/api/targetUsers'
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
    bulkImportPayload: {
      type: Object
    },
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      PROPERTY_STORE,
      axiosPayload: getDefaultAxiosPayload({ pageSize: 5 }),
      serverSideProps: new ServerSideProps(),
      confirmButtonDisabled: false,
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
            type: 'slot',
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
      return !this.selectedTargetGroups.length || this.confirmButtonDisabled
    },
    getTitle() {
      let text = 'User'
      text += this?.bulkImportPayload?.selectedRowCount > 1 ? 's' : ''
      return `Add ${this?.bulkImportPayload?.selectedRowCount || '1'} ${text} To User Groups`
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
    handleRowIsSelectable(row) {
      return !row?.isScimGroup
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
      this.confirmButtonDisabled = true
      const targetGroupResourceIds = this.selectedTargetGroups.map((group) => group.resourceId)
      const payload = {
        ...this.bulkImportPayload,
        targetGroupResourceIds
      }
      delete payload.selectedRowCount
      bulkImportTargetUsersToGroups(payload).finally(() => {
        this.confirmButtonDisabled = false
        this.$emit('closeOverlayWithUpdate')
      })
    },
    handleSelectionChange(selection = []) {
      this.selectedTargetGroups = selection
    },
    handleEmptyBtnClicked() {
      this.$emit('on-empty-target-group-route')
    }
  }
}
</script>
