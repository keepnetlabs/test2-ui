<template>
  <div>
    <v-overlay
      v-if="modalStatus"
      :value="modalStatus"
      id="add-new-community-overlay"
      color="white"
      :opacity="1"
      :z-index="99"
    >
      <new-integration
        v-if="modalStatus"
        ref="newIntegration"
        :showModal="modalStatus"
        :integrationId="integrationId"
        @closeOverlay="changeModalStatus"
      />
    </v-overlay>
    <delete-integration-modal
      :status="showDeleteModal"
      :selected-integration="selectedIntegration"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      @handleMultipleDelete="handleDeleteMultiple"
    />

    <data-table
      id="integrations-data-table"
      ref="refIntegrationsList"
      selectable
      filterable
      options
      is-server-side
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
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @disable="handleDisable"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeModalStatus(true)"
      @downloadEvent="exportIntegrationList"
      @handleMultipleDelete="handleActionDelete"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
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
        <RowActionsMenu>
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[1].id"
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="scope.row.status === labels.Active ? 'mdi-minus-circle-outline' : 'mdi-power'"
            :text="scope.row.status === labels.Active ? labels.Deactivate : labels.Activate"
            @on-click="
              scope.row.status === 'Active' ? handleDisable(scope.row) : handleEnable(scope.row)
            "
          />
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[2].id"
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            @on-click="handleActionDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewIntegration from './NewIntegration'
import DeleteIntegrationModal from './DeleteIntegrationModal'
import {
  deleteIntegration,
  disableIntegration,
  enableIntegration,
  exportReportedEmails,
  getIntegrationList
} from '@/api/integrations'
import {
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  INTEGRATION_TYPES,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'Integrations',
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable,
    NewIntegration,
    DeleteIntegrationModal
  },
  mixins: [useDefaultTableFunctions],
  props: {
    permissions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: true,
      integrationId: null,
      labels,
      tableData: [],
      showDeleteModal: false,
      selectedIntegration: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.INTEGRATIONS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.INTEGRATION,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: labels.IntegrationName,
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: PROPERTY_STORE.ANALYSISENGINENAME,
            align: 'left',
            editable: false,
            label: labels.IntegrationType,
            sortable: true,
            show: true,
            type: 'text',
            fixed: false,
            width: 240,
            filterableType: 'select',
            filterableCustomFieldName: 'analysisEngineTypeId',
            filterableItems: [
              INTEGRATION_TYPES.FORTINET,
              INTEGRATION_TYPES.VIRUSTOTAL,
              INTEGRATION_TYPES.VMRAY,
              INTEGRATION_TYPES.IBMXFORCE,
              INTEGRATION_TYPES.SPAMHOUSE,
              INTEGRATION_TYPES.CUSTOMINTEGRATION,
              INTEGRATION_TYPES.GOOGLESAFEBROWSER,
              INTEGRATION_TYPES.CyberXRay,
              INTEGRATION_TYPES.GOOGLEWEBRISK,
              INTEGRATION_TYPES.OPSWAT,
              INTEGRATION_TYPES.ANYRUN,
              INTEGRATION_TYPES.USTA
            ]
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            filterableCustomFieldName: 'Description'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 150,
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }]
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          }
        ],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            id: 'btn-edit--integrations-row-actions',
            disabled: !this.permissions.UPDATE.hasPermission
          },
          {
            name: labels.Disable,
            icon: 'mdi-minus-circle-outline',
            action: 'disable',
            id: 'btn-status-changer--integrations-row-actions',
            disabled: !this.permissions.DISABLE.hasPermission
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--integrations-row-actions',
            disabled: !this.permissions.DELETE.hasPermission
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.permissions.EXPORT.hasPermission
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        empty: {
          message: LABEL_STORE.NO_INTEGRATIONS,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--integrations'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add an integration',
          id: 'btn-add--integrations',
          disabled: !this.permissions.POST.hasPermission
        }
      },
      modalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  mounted() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      if (this.permissions.SEARCH.hasPermission) {
        getIntegrationList(this.axiosPayload)
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
        this.loading = false
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
    handleDeleteMultiple(selections) {
      selections.forEach((item) => {
        this.handleDelete(item)
      })
    },
    handleDelete(row) {
      this.$refs.refIntegrationsList.unSelectRow(row)
      deleteIntegration(row.resourceId).then(() => {
        this.callForData()
      })
    },
    handleEdit(row) {
      this.modalStatus = true
      this.integrationId = row.resourceId
    },
    checkIfCanCloseNewIntegrationModal() {
      if (this.modalStatus) this.modalStatus = false
    },
    handleDisable(row) {
      disableIntegration(row.resourceId).then(() => {
        this.callForData()
      })
    },
    handleEnable(row) {
      enableIntegration(row.resourceId).then(() => {
        this.callForData()
      })
    },
    changeModalStatus(status, restart) {
      this.integrationId = null
      this.modalStatus = status
      if (restart) this.callForData()
    },
    exportIntegrationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportReportedEmails(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Integrations.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleActionDelete(row) {
      this.selectedIntegration = row
      this.showDeleteModal = true
    }
  }
}
</script>
