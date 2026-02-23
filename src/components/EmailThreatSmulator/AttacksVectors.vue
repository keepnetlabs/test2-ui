<template>
  <div id="attack-vectors" class="attack-vectors">
    <v-overlay :value="modalStatus" :opacity="1" :z-index="99" color="white" v-if="modalStatus">
      <new-attack-vector
        ref="newAttackVectorModal"
        :status="modalStatus"
        :isEdit="isEdit"
        :attackVectorDetails="attackVectorDetails"
        @changeNewAttackVectorModalStatus="changeNewAttackVectorModalStatus"
      />
    </v-overlay>
    <delete-attack-vector
      :status="showDeleteModal"
      :selectedItem="selectedAttackVector"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleToggleRowSelection="handleToggleRowSelection($event)"
    />
    <change-status-attackVector
      :status="showStatusModal"
      :selectedItem="selectedAttackVector"
      @handleSuccessStatusAction="handleSuccessStatusAction"
      @handleCloseModal="showStatusModal = false"
      @handleToggleRowSelection="handleToggleRowSelection($event)"
    />
    <data-table
      v-if="getEtsAttackVectorPermissionSearch"
      id="attack-vectors-data-table"
      class="attacks-vector"
      ref="refAttacksVectorList"
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
      row-key="pluginResourceId"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewAttackVectorModalStatus(true)"
      @downloadEvent="exportTableData"
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
          v-if="scope.column.property === 'riskFactor'"
          :id="`text--send-attack-result-${scope.$index}`"
          class="datatable-link d-flex justify-center cursor-default"
        >
          <div
            class="av-risk-factor py-1 cursor-default"
            :style="setStatusColor(scope.row.riskFactor)"
          >
            {{ scope.row.riskFactor }}
          </div>
        </span>
        <span
          v-if="scope.column.property === 'status'"
          :id="`text--send-attack-result-${scope.$index}`"
          class="datatable-link d-flex justify-center cursor-default"
        >
          <div class="av-status py-1 cursor-default" :class="scope.row.status.toLowerCase()">
            {{ scope.row.status }}
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
          @on-click="handleEditAttackVector(scope.row)"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[1].id"
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="
              scope.row.status === 'Enabled' ? 'mdi-minus-circle-outline' : 'mdi-power-standby'
            "
            :text="scope.row.status === 'Enabled' ? 'Disable' : 'Enable'"
            :checkIsOwnerProperty="false"
            @on-click="handleActionStatus(scope.row, true)"
          />
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[2].id"
            :scope="scope"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleActionDelete(scope.row, true)"
          />
        </RowActionsMenu>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewAttackVector from './NewAttackVector'
import DeleteAttackVector from './DeleteAttackVector'
import ChangeStatusAttackVector from './ChangeStatusAttackVector'
import {
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  getAttackVectorList,
  getAttackVectorById,
  exportAttacksVector
} from '@/api/emailThreatSimlator'
import { mapGetters } from 'vuex'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import useCallForLanguagesForTableFilter from '@/hooks/useCallForLanguagesForTableFilter'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
export default {
  name: 'EmailTemplates',
  components: {
    DataTable,
    DeleteAttackVector,
    ChangeStatusAttackVector,
    NewAttackVector,
    DefaultButtonRowAction,
    DefaultMenuRowAction,
    RowActionsMenu
  },
  mixins: [useLoading, useCallForLanguagesForTableFilter, useDefaultTableFunctions],
  data() {
    return {
      languageFilterOptions: [],
      attackVectorDetails: {},
      selectedRow: null,
      isEdit: false,
      labels,
      tableData: [],
      showDeleteModal: false,
      showStatusModal: false,
      selectedAttackVector: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ETS_ATTACK_VECTOR_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ETS_ATTACK_VECTOR_TABLE,
        columns: [
          {
            property: 'pluginName',
            align: 'left',
            editable: false,
            label: 'Attack Vector Name',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 190
          },
          {
            property: 'categoryName',
            align: 'left',
            editable: false,
            label: 'Type',
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            filterableType: 'text'
          },
          {
            property: 'hash',
            align: 'left',
            editable: false,
            label: 'Hash',
            sortable: false,
            show: true,
            type: 'text',
            width: 250,
            filterableType: 'text'
          },
          {
            property: 'sha256',
            align: 'left',
            editable: false,
            label: 'SHA256',
            sortable: false,
            show: true,
            type: 'text',
            width: 250,
            filterableType: 'text'
          },
          {
            property: 'riskFactor',
            align: 'center',
            editable: false,
            label: 'Severity',
            sortable: true,
            show: true,
            type: 'slot',
            width: 150,
            filterableType: 'number'
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            sortable: false,
            show: true,
            type: 'slot',
            width: 150,
            filterableType: 'select',
            filterableItems: ['Enabled', 'Disabled']
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: 'Date Created',
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            width: 180,
            overrideWidth: true
          }
        ],
        rowActions: [
          {
            id: 'btn-edit--row-actions-attack-vectors-list',
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.$store.getters['permissions/getEtsAttackVectorPermissionUpdate']
          },
          {
            id: 'btn-disable--row-actions-attack-vectors-list',
            name: 'Disable',
            icon: 'mdi-delete',
            action: 'handleStatus',
            disabled: !this.$store.getters['permissions/getEtsAttackVectorPermissionEnableDisable']
          },
          {
            id: 'btn-delete--row-actions-attack-vectors-list',
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getEtsAttackVectorPermissionDelete']
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getEtsAttackVectorPermissionExport']
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_ATTACK_VECTOR,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--attack-vector',
          disabled: !this.$store.getters['permissions/getEtsAttackVectorPermissionCreate']
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add a Attack Vector',
          id: 'btn-add--attack-vector-empty',
          disabled: !this.$store.getters['permissions/getEtsAttackVectorPermissionCreate']
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getEtsAttackVectorPermissionSearch: 'permissions/getEtsAttackVectorPermissionSearch'
    })
  },
  mounted() {
    this.callForLanguages('refAttacksVectorList')
    this.callForData()
  },
  methods: {
    setStatusColor(riskFactor) {
      let color = '#1173C1'
      if (riskFactor == 5) {
        color = '#0198AC'
      } else if (riskFactor >= 6 && riskFactor <= 7) {
        color = '#B6791D'
      } else if (riskFactor >= 8) {
        color = '#B83A3A'
      }
      return `border-color: ${color};color: ${color};`
    },
    toggleShowPreviewDialog() {
      if (this.isShowPreviewDialog) this.selectedAttackVector = {}
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false
      this.callForData()
    },
    handleSuccessStatusAction() {
      this.showStatusModal = false
      this.callForData()
    },
    handleToggleRowSelection(row) {
      this?.$refs?.refAttacksVectorList?.$refs?.elTableRef?.toggleRowSelection(row, false)
    },
    handleEditAttackVector(row) {
      getAttackVectorById(row.pluginResourceId).then((response) => {
        this.isEdit = true
        this.attackVectorDetails = response.data.data
        this.modalStatus = true
      })
      this.selectedAttackVector = row
    },
    checkIfCanCLoseNewModal() {
      if (this.$refs.newAttackVectorModal) {
        this.$refs.newAttackVectorModal.closeAttackVectorPopup()
      }
    },
    changeNewAttackVectorModalStatus(status, restart) {
      this.modalStatus = status
      this.isEdit = false
      this.attackVectorDetails = {}
      if (restart) {
        this.selectedAttackVector = {}
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
        exportAttacksVector(payload).then((response) => {
          const { data } = response
          if (data && data instanceof Blob) {
            const link = document.createElement('a')
            link.href = globalThis.URL.createObjectURL(data)
            link.download = `AttacksVector.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
            link.click()
          }
        })
      })
    },
    callForData() {
      this.isLoading = true
      if (this.getEtsAttackVectorPermissionSearch) {
        getAttackVectorList(this.axiosPayload)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { results = [] } = data
            for (const row of results) {
              row.isActive = row.isActive ? 'Active' : 'Passive'
            }
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
      this.selectedAttackVector = row
      this.showDeleteModal = true
    },
    handleActionStatus(row) {
      this.selectedAttackVector = row
      this.showStatusModal = true
    }
  }
}
</script>
