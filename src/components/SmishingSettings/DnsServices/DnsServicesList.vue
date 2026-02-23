<template>
  <div id="dnsServiceList">
    <NewEditDnsService
      v-if="modalStatus"
      ref="newEditDnsServiceModal"
      :status="modalStatus"
      :resource-id="resourceId"
      :is-edit="isEdit"
      @changeStatus="changeStatus"
    />
    <CantDeleteDnsServiceDialog
      v-if="isShowCantDeleteDialog"
      :status="isShowCantDeleteDialog"
      :selected-row="selectedDnsService"
      @on-close="toggleCantDeleteDialog"
    />
    <DeleteServiceModal
      :status="showDeleteModal"
      :selected-dns-service="selectedDnsService"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
    />
    <DataTable
      id="dnsServiceList-data-table"
      ref="refDnsServiceListList"
      is-server-side
      selectable
      filterable
      options
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :download-button="tableOptions.downloadButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="handleActionDelete"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @downloadEvent="exportDnsService"
      @delete="handleActionDelete"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @addAction="handleAdd"
    >
      <template #datatable-row-actions="{scope}">
        <DefaultButtonRowAction
          :id="tableOptions.rowActions[0].id"
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          @on-click="handleEdit(scope.row)"
        />
        <DefaultButtonRowAction
          :id="tableOptions.rowActions[1].id"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled"
          @on-click="handleActionDelete(scope.row)"
        />
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import {
  PROPERTY_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS,
  getStoreValue
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import SmishingService from '@/api/smishing'
import DeleteServiceModal from '@/components/SmishingSettings/DnsServices/DeleteServiceModal'
import NewEditDnsService from '@/components/SmishingSettings/DnsServices/NewEditDnsService'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import CantDeleteDnsServiceDialog from '@/components/SmishingSettings/DnsServices/CantDeleteDnsServiceDialog'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'DnsServiceList',
  components: {
    CantDeleteDnsServiceDialog,
    DefaultButtonRowAction,
    NewEditDnsService,
    DataTable,
    DeleteServiceModal
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      isShowCantDeleteDialog: false,
      resourceId: null,
      editableFormValues: {},
      loading: true,
      isEdit: false,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedDnsService: null,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.DNSSERVICELIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.DNSSERVICELIST,
        columns: [
          {
            property: 'dnsServiceProviderName',
            align: 'left',
            editable: false,
            label: 'DNS Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            filterableType: 'text',
            width: 180
          },
          {
            property: 'dnsServiceProviderType',
            align: 'left',
            editable: false,
            label: 'Service Type',
            fixed: false,
            sortable: true,
            show: true,
            width: 240,
            hasTooltip: true,
            type: 'text',
            filterableType: 'select',
            filterableItems: [{ text: 'Cloudflare', value: '1' }]
          },
          {
            property: 'healthStatus',
            align: 'center',
            editable: false,
            label: getStoreValue('status'),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            isEditable: true,
            tooltipKey: 'healthStatusMessage',
            filterableCustomFieldName: 'Status',
            filterableType: 'select',
            filterableItems: [
              { text: 'Failed', value: 1 },
              { text: 'Success', value: 0 }
            ],
            width: 150
          },
          {
            property: 'createdBy',
            align: 'left',
            editable: false,
            label: labels.CreatedBy,
            sortable: true,
            show: true,
            fixed: false,
            width: 240,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: labels.CreateTime,
            sortable: true,
            show: true,
            type: 'date',
            filterableType: 'date',
            width: 180,
            filterableCustomFieldName: PROPERTY_STORE.CREATEDBY
          }
        ],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getSmishingDnsUpdatePermissions'],
            id: 'btn-edit--dns-services-list-row-actions'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getSmishingDnsDeletePermissions'],
            id: 'btn-delete--dns-services-list-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getSmishingDnsExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: 'You do not have any DNS Services',
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--DnsServiceList'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a DNS Service',
          id: 'btn-add--DnsServiceList',
          disabled: !this.$store.getters['permissions/getDnsCreatePermissions']
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      isTemplateDetails: false,
      templateHTML: null
    }
  },
  computed: {
    ...mapGetters({
      getSmishingDnsSearchPermissions: 'permissions/getSmishingDnsSearchPermissions',
      getSmishingDnsUpdatePermissions: 'permissions/getSmishingDnsUpdatePermissions',
      getSmishingDnsDeletePermissions: 'permissions/getSmishingDnsDeletePermissions'
    })
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      if (this.getSmishingDnsSearchPermissions) {
        SmishingService.getDnsServiceList(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            this.tableData = results
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      }
    },
    toggleCantDeleteDialog(isOpenNewServiceModal = false) {
      if (isOpenNewServiceModal) this.handleAdd()
      this.isShowCantDeleteDialog = !this.isShowCantDeleteDialog
    },
    checkIfCanCloseDnsServiceModal() {
      if (this.$refs.newEditDnsServiceModal) {
        this.$refs.newEditDnsServiceModal.cancelDns()
      }
    },
    changeStatus(value, restart) {
      this.modalStatus = !this.modalStatus
      if (!value) this.resourceId = ''
      if (restart) {
        this.callForData()
      }
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.callForData()
    },
    handleDelete(row) {
      SmishingService.deleteEmailTemplate(row.resourceId).then(() => {
        this.$refs.refDnsServiceListList.unSelectRow(row)
        this.callForData()
      })
    },
    handleEdit(row) {
      this.resourceId = row.resourceId
      this.isEdit = true
      this.modalStatus = true
    },
    handleAdd() {
      this.isEdit = false
      this.modalStatus = true
    },
    exportDnsService({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        SmishingService.exportDnsService(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `DnsServices.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleActionDelete(row) {
      this.selectedDnsService = row
      if (this.serverSideProps.totalNumberOfRecords === 1) this.toggleCantDeleteDialog()
      else this.showDeleteModal = true
    }
  }
}
</script>
