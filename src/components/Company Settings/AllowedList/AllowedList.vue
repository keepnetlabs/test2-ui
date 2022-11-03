<template>
  <div id="allow-list-list">
    <CompanySettingsHeader
      title="Domains"
      sub-title="Manage and verify your allowed list domain to use with our platform"
    />
    <v-overlay
      id="add-new-quick-domain-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <new-domaim
        ref="NewDomainModal"
        :status="modalStatus"
        :changeNewDomainPopupStatus="changeNewDomainPopupStatus"
      />
    </v-overlay>
    <delete-domain
      v-if="showDeleteModal"
      :status="showDeleteModal"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal=";(showDeleteModal = false), (selectedDeleteItems = [])"
      @handleDelete="handleDelete($event)"
      :selectedItems="selectedDeleteItems"
    />
    <verify-domain
      v-if="verifyPopupStatus"
      :selectedDomain="selectedDomain"
      :status="verifyPopupStatus"
      @handleCloseModal="verifyPopupStatus = false"
      @handleVerifyDomainPopup="handleVerifyDomainPopup"
      @getDatatableList="getDatatableList"
    />
    <domain-verified
      v-if="verifiedDomainStatus"
      :status="verifiedDomainStatus"
      @handleCloseModal="verifiedDomainStatus = false"
      :selectedDomain="selectedDomain.domain"
    />
    <data-table
      v-if="getAllowListPermissionsSearch"
      id="allow-list-data-table"
      class="allow-list-table"
      ref="refAllowList"
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
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="bodyData"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      row-key="allowListResourceId"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewDomainPopupStatus(true)"
      @downloadEvent="exportTableData"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @handleMultipleDelete="handleMultipleDelete"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span
          v-if="scope.column.property === 'status'"
          :id="`text-allow-list-status-${scope.$index}`"
          class="datatable-link"
        >
          <div class="allow-list-status py-1" :style="setStatusColor(scope.row.status)">
            {{ scope.row.status }}
          </div>
        </span>
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
          @on-click=";(selectedDomain = scope.row), (verifyPopupStatus = true)"
        />
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled"
          :checkIsOwnerProperty="false"
          @on-click="handleDelete(scope.row)"
        />
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../../DataTable'
import {
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getAllowListList, exportAllowList } from '@/api/allowList'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { mapGetters } from 'vuex'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DeleteDomain from '@/components/Company Settings/AllowedList/DeleteDomain'
import NewDomaim from '@/components/Company Settings/AllowedList/NewDomain'
import VerifyDomain from '@/components/Company Settings/AllowedList/VerifyDomain'
import DomainVerified from '@/components/Company Settings/AllowedList/DomainVerified'

export default {
  name: 'List',
  components: {
    DefaultButtonRowAction,
    DataTable,
    CompanySettingsHeader,
    DeleteDomain,
    NewDomaim,
    VerifyDomain,
    DomainVerified
  },
  mixins: [useCallForLanguagesForTableFilter],
  data() {
    return {
      selectedRow: null,
      loading: true,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedDeleteItems: [],
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ALLOW_LIST_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ALLOW_LIST_TABLE,
        columns: [
          {
            property: 'domain',
            align: 'left',
            editable: false,
            label: 'Domain',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 220
          },
          {
            property: 'status',
            align: 'left',
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'slot',
            filterableType: 'select',
            filterableItems: ['Unverified', 'Verified'],
            width: 150
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          },
          {
            property: 'lastCheckTime',
            align: 'left',
            editable: false,
            label: 'Last Check',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          },
          {
            property: 'verifyTime',
            align: 'left',
            editable: false,
            label: 'Date Verified',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 160
          }
        ],
        rowActions: [
          {
            name: 'Verify Domain',
            icon: 'mdi-checkbox-marked-circle',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getAllowListPermissionsVerify']
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getAllowListPermissionsDelete']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getAllowListPermissionsExport']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: this.$store.getters['permissions/getSMTPSettingsDeletePermissions'],
          download: false,
          disabledStatuses: {
            delete: false
          }
        },
        empty: {
          message: LABEL_STORE.NO_ALLOW_LIST,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--domain',
          disabled: !this.$store.getters['permissions/getAllowListPermissionsCreate']
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Domain',
          id: 'btn-add--domain',
          disabled: !this.$store.getters['permissions/getAllowListPermissionsCreate']
        }
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      verifyPopupStatus: false,
      selectedDomain: {},
      verifiedDomainStatus: false
    }
  },
  computed: {
    ...mapGetters({
      getAllowListPermissionsSearch: 'permissions/getAllowListPermissionsSearch'
    })
  },
  methods: {
    setStatusColor(status) {
      let color = '#B6791D'
      if (status == 'Verified') {
        color = '#217124'
      }
      return `border-color: ${color};color: ${color};`
    },
    handleMultipleDelete(selections) {
      this.selectedDeleteItems = selections
      this.showDeleteModal = true
    },
    handleDelete(row) {
      this.selectedDeleteItems.push(row)
      this.showDeleteModal = true
    },
    handleVerifyDomainPopup() {
      this.verifyPopupStatus = false
      this.verifiedDomainStatus = true
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
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
      this.bodyData = {
        ...this.bodyData,
        orderBy: prop,
        ascending: order === 'ascending'
      }
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
      this.selectedDeleteItems = []
      this.$refs.refAllowList.resetSelectableParams()
      this.getDatatableList()
    },
    checkIfCanCLoseNewModal() {
      if (this.$refs.NewDomainModal) {
        this.$refs.NewDomainModal.closeDomainPopup()
      }
    },
    changeNewDomainPopupStatus(status, isSave = false, resourceId = null) {
      this.modalStatus = status
      if (isSave && resourceId !== null) {
        this.getDatatableList(resourceId)
      }
    },
    exportTableData({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportAllowList(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Allow-List.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    getDatatableList(resourceId = null) {
      this.loading = true
      if (this.getAllowListPermissionsSearch) {
        getAllowListList(this.bodyData)
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
            if (resourceId !== null) {
              this.selectedDomain = results.find((x) => x.allowListResourceId === resourceId)
              this.verifyPopupStatus = true
            }
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
      this.selectedDeleteItems = row
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
    this.callForLanguages('refAllowList')
    this.getDatatableList()
  }
}
</script>

<style lang="scss">
.allow-list-table {
  .allow-list-status {
    border-radius: 4px;
    color: white;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    background-color: white;
    width: 77px;
    text-align: center;
    margin: auto;
    color: #00bcd4;
    border: 1px solid #00bcd4;
  }
}
</style>
