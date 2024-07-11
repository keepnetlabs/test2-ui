<template>
  <div id="domains">
    <NewEditDomain
      ref="newEditDomainModal"
      v-if="modalStatus"
      :status="modalStatus"
      :resourceId="resourceId"
      :isEdit="isEdit"
      :domainData="domainData"
      @changeStatus="changeStatus"
    />
    <DeleteServiceModal
      :status="showDeleteModal"
      :selectedDomain="selectedDomain"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
    />
    <DataTable
      id="domains-data-table"
      ref="refDomainsListList"
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
      :server-side-props="serverSideProps"
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      @deleteAction="handleActionDelete"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @downloadEvent="exportDomains"
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
      <template #datatable-row-actions="{ scope }">
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
import { getDomainsList, deleteEmailTemplate, exportDnsService, getDomainData } from '@/api/domains'
import DeleteServiceModal from '@/components/Settings/Domains/DeleteServiceModal'
import NewEditDomain from '@/components/Settings/Domains/NewEditDomain'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'DomainList',
  components: {
    DefaultButtonRowAction,
    NewEditDomain,
    DataTable,
    DeleteServiceModal
  },
  mixins: [useDefaultTableFunctions],
  props: {
    PERMISSIONS: {
      type: Object
    }
  },
  data() {
    return {
      domainData: null,
      resourceId: null,
      methodItems: [],
      difficultyItems: [],
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedDomain: null,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.DOMAINS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.DOMAINS,
        columns: [
          {
            property: 'domain',
            align: 'left',
            editable: false,
            label: 'Domain',
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            filterableType: 'text',
            width: 180
          },
          {
            property: 'dnsServiceProviderName',
            align: 'left',
            editable: false,
            label: 'DNS Name',
            fixed: false,
            sortable: true,
            show: true,
            width: 240,
            hasTooltip: true,
            type: 'text',
            filterableType: 'text'
          },
          {
            property: 'dnsRecord',
            align: 'left',
            editable: false,
            label: 'DNS Record',
            sortable: true,
            show: true,
            fixed: false,
            width: 240,
            type: 'text',
            filterableType: 'text'
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
            width: 180
          }
        ],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getDomainUpdatePermissions'],
            id: 'btn-edit--domain-lists-row-actions'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getDomainDeletePermissions'],
            id: 'btn-delete--domain-lists-row-actions'
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getDomainExportPermissions']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: 'You do not have any domains',
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--domainList',
          disabled: !this.$store.getters['permissions/getDomainCreatePermissions']
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Domain',
          id: 'btn-add--DomainList',
          disabled: !this.$store.getters['permissions/getDomainCreatePermissions']
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
      getDomainUpdatePermissions: 'permissions/getDomainUpdatePermissions',
      getDomainDeletePermissions: 'permissions/getDomainDeletePermissions',
      getDomainSearchPermissions: 'permissions/getDomainSearchPermissions',
      getDomainFormDetailsPermissions: 'permissions/getDomainFormDetailsPermissions'
    })
  },
  created() {
    if (this.getDomainFormDetailsPermissions)
      getDomainData().then((response) => {
        this.domainData = response.data.data
        this.callForData()
      })
  },
  methods: {
    callForData() {
      this.loading = true
      if (this.getDomainSearchPermissions) {
        getDomainsList(this.axiosPayload)
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
    checkIfCanCloseDomainModal() {
      if (this.$refs.newEditDomainModal) {
        this.$refs.newEditDomainModal.cancelDomain()
      }
    },
    changeStatus(value, restart) {
      this.modalStatus = !this.modalStatus
      if (!value) this.resourceId = ''
      if (restart) {
        this.callForData()
      }
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.axiosPayload.filter.FilterGroups[1].FilterItems = this.axiosPayload.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AnalysisEngineName') {
            item.FieldName = 'analysisEngineTypeId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForData()
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.callForData()
    },
    handleDelete(row) {
      deleteEmailTemplate(row.resourceId).then(() => {
        this.$refs.refDomainsListList.unSelectRow(row)
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
    exportDomains({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportDnsService(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Domains.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleActionDelete(row) {
      this.selectedDomain = row
      this.showDeleteModal = true
    }
  }
}
</script>
