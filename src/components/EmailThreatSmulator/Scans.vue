<template>
  <div id="Scans">
    <v-overlay
      id="add-new-quick-scan-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewScan
        ref="newScanModal"
        :status="modalStatus"
        :isDuplicate="isDuplicate"
        :scanDetails="scanDetails"
        @changeNewScanModalStatus="changeNewScanModalStatus"
      />
    </v-overlay>
    <DeleteScans
      :status="showDeleteModal"
      :selectedItem="selectedScan"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
    />
    <data-table
      v-if="getEtsQuickScanPermissionSearch"
      id="quick-scan-data-table"
      class="quick-scan"
      ref="refQuickScanList"
      is-server-side
      selectable
      filterable
      options
      :loading="isLoading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      row-key="quickScanResourceId"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewScanModalStatus(true)"
      @downloadEvent="exportTableData"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span
          v-if="scope.column.property === 'status'"
          :id="`text--send-attack-result-${scope.$index}`"
          class="datatable-link d-flex justify-center cursor-default"
        >
          <div class="qs-status py-1 cursor-default" :class="scope.row.status.toLowerCase()">
            {{ scope.row.status.replace('InProgress', 'In Progress') }}
          </div>
        </span>
      </template>
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :id="tableOptions.rowActions[0].id"
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
          @on-click="
            $router.push({
              path: `/email-threat-simulator/report/${scope.row.quickScanResourceId}`
            })
          "
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            :scope="scope"
            :id="tableOptions.rowActions[1].id"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            :checkIsOwnerProperty="false"
            @on-click="handleActionDelete(scope.row, true)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :id="tableOptions.rowActions[2].id"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleDuplicateScan(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewScan from './NewScan'
import DeleteScans from './DeleteScans'
import {
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getQuickScanList, getQuickScanById, exportQuickScan } from '@/api/emailThreatSimlator'
import { mapGetters } from 'vuex'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'

export default {
  name: 'Scans',
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable,
    DeleteScans,
    NewScan
  },
  mixins: [useLoading, useDefaultTableFunctions, useCallForLanguagesForTableFilter],
  data() {
    return {
      scanDetails: {},
      selectedRow: null,
      loading: true,
      isEdit: false,
      isDuplicate: false,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedScan: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ETS_QUICK_SCAN_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ETS_QUICK_SCAN_TABLE,
        columns: [
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: 'Date Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 180,
            overrideWidth: true
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            sortable: true,
            show: true,
            type: 'slot',
            filterableType: 'select',
            filterableItems: [
              { text: 'In Progress', value: 'InProgress' },
              'Completed',
              'Continuous'
            ],
            width: 180
          },
          {
            property: 'domain',
            align: 'left',
            editable: false,
            label: 'Domain',
            sortable: true,
            show: true,
            type: 'text',
            width: 240,
            filterableType: 'text'
          }
        ],
        rowActions: [
          {
            id: 'btn-view-report--row-actions-scan-list',
            name: 'View Report',
            icon: 'mdi mdi-text-box',
            action: 'View Report',
            disabled: !this.$store.getters['permissions/getEtsQuickScanReportPermissionStat']
          },
          {
            id: 'btn-delete--row-actions-scan-list',
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getEtsQuickScanPermissionDelete']
          },
          {
            id: 'btn-duplicate--row-actions-scan-list',
            name: 'Duplicate',
            icon: 'mdi-content-copy',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getEtsQuickScanPermissionUpdate']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getEtsQuickScanPermissionExport']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_SCAN,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--scan',
          disabled: !this.$store.getters['permissions/getEtsQuickScanPermissionCreate']
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Scan',
          id: 'btn-add--scan',
          disabled: !this.$store.getters['permissions/getEtsQuickScanPermissionCreate']
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getEtsQuickScanPermissionSearch: 'permissions/getEtsQuickScanPermissionSearch'
    })
  },
  methods: {
    toggleShowPreviewDialog() {
      if (this.isShowPreviewDialog) this.selectedScan = {}
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.axiosPayload = {
        ...this.axiosPayload,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.callForData()
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.callForData()
    },
    handleDelete(row) {
      this?.$refs?.refQuickScanList?.$refs?.elTableRef?.toggleRowSelection(row, false)
    },
    handleDuplicateScan(row) {
      getQuickScanById(row.quickScanResourceId).then((response) => {
        this.isDuplicate = true
        this.scanDetails = response.data.data
        this.modalStatus = true
      })
      this.selectedScan = row
    },
    checkIfCanCLoseNewModal() {
      if (this.$refs.newScanModal) {
        this.$refs.newScanModal.closeNewScanPopup()
      }
    },
    changeNewScanModalStatus(status, restart) {
      this.modalStatus = status
      this.isDuplicate = false
      this.scanDetails = {}
      if (restart) {
        this.selectedScan = {}
        this.callForData()
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
          filter: this.axiosPayload.filter
        }
        exportQuickScan(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Scans.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    callForData() {
      this.isLoading = true
      if (this.getEtsQuickScanPermissionSearch) {
        getQuickScanList(this.axiosPayload)
          .then((response) => {
            const {
              totalNumberOfRecords = 0,
              totalNumberOfPages = 1,
              pageNumber = 1,
              results = []
            } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            this.tableData = results
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.isLoading = false))
      } else {
        this.$router.push('/')
      }
    },
    handleActionDelete(row) {
      this.selectedScan = row
      this.showDeleteModal = true
    }
  },
  mounted() {
    this.callForLanguages('refQuickScanList')
    this.callForData()
  }
}
</script>
