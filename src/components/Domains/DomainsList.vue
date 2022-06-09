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
    <data-table
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
      :axios-payload.sync="bodyData"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      @deleteAction="handleActionDelete"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @downloadEvent="exportDomains"
      @delete="handleActionDelete"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @addAction="handleAdd"
    >
      <template #datatable-row-actions="{scope}">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          @on-click="handleEdit(scope.row)"
        />
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled"
          @on-click="handleActionDelete(scope.row)"
        />
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
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
import DeleteServiceModal from '@/components/Domains/DeleteServiceModal'
import NewEditDomain from '@/components/Domains/NewEditDomain'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'

export default {
  name: 'DomainList',
  components: {
    DefaultButtonRowAction,
    NewEditDomain,
    DataTable,
    DeleteServiceModal
  },
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
            disabled: !this.$store.getters['permissions/getDomainUpdatePermissions']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getDomainDeletePermissions']
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
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
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
  methods: {
    checkIfCanCloseDomainModal() {
      if (this.$refs.newEditDomainModal) {
        this.$refs.newEditDomainModal.cancelDomain()
      }
    },
    changeStatus(value, restart) {
      this.modalStatus = !this.modalStatus
      if (!value) this.resourceId = ''
      if (restart) {
        this.getDatatableList()
      }
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyData.filter.FilterGroups[1].FilterItems = this.bodyData.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AnalysisEngineName') {
            item.FieldName = 'analysisEngineTypeId'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.getDatatableList()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber
      this.getDatatableList()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === 'ascending'
      this.bodyData.orderBy = prop
      this.getDatatableList()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.getDatatableList()
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      this.getDatatableList()
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.getDatatableList()
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      this.getDatatableList()
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.getDatatableList()
    },
    handleDelete(row) {
      deleteEmailTemplate(row.resourceId).then(() => {
        this.$refs.refDomainsListList.unSelectRow(row)
        this.getDatatableList()
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
          filter: this.bodyData.filter
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
    getDatatableList() {
      this.loading = true
      if (this.getDomainSearchPermissions) {
        getDomainsList(this.bodyData)
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
      } else {
        this.$router.push('/')
      }
    },
    handleActionDelete(row) {
      this.selectedDomain = row
      this.showDeleteModal = true
    },
    columnFilterChanged(filter) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData)
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      )
      this.getDatatableList()
    }
  },
  created() {
    if (this.getDomainFormDetailsPermissions)
      getDomainData().then((response) => {
        this.domainData = response.data.data
        this.getDatatableList()
      })
  }
}
</script>
