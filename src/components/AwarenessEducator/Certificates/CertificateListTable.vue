<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    is-server-side-selection
    filterable
    options
    is-server-side
    row-key="id"
    :loading="isLoading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :select-event="tableOptions.selectEvent"
    :row-actions="tableOptions.rowActions"
    :add-button="tableOptions.addButton"
    :download-button="tableOptions.downloadButton"
    :axios-payload.sync="axiosPayload"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @refreshAction="callForData"
    @onEmptyBtnClicked="handleAdd"
    @add-training="handleAdd"
    @downloadEvent="exportCertificateList"
    @add-certificate="handleAdd"
  >
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :icon="tableOptions.rowActions[0].icon"
        :id="tableOptions.rowActions[0].id"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled || !scope.row.isEditable"
        @on-click="handleEdit(scope.row)"
      />
      <RowActionsMenu>
        <DefaultMenuRowAction
          :scope="scope"
          :check-is-owner-property="false"
          :id="tableOptions.rowActions[1].id"
          :disabled="tableOptions.rowActions[1].disabled || scope.row.isDefault"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          @on-click="handleMakeDefault(scope.row)"
        />
        <DefaultMenuRowAction
          :scope="scope"
          :check-is-owner-property="false"
          :id="tableOptions.rowActions[3].id"
          :disabled="tableOptions.rowActions[3].disabled"
          :icon="tableOptions.rowActions[3].icon"
          :text="tableOptions.rowActions[3].name"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
        />
        <DefaultMenuRowAction
          :scope="scope"
          :check-is-owner-property="false"
          :id="tableOptions.rowActions[4].id"
          :disabled="tableOptions.rowActions[4].disabled"
          :icon="tableOptions.rowActions[4].icon"
          :text="tableOptions.rowActions[4].name"
          :checkIsOwnerProperty="false"
          @on-click="handleDuplicate(scope.row)"
        />
        <DefaultMenuRowAction
          :scope="scope"
          :id="tableOptions.rowActions[2].id"
          :disabled="tableOptions.rowActions[2].disabled || !scope.row.isEditable"
          :icon="tableOptions.rowActions[2].icon"
          :text="tableOptions.rowActions[2].name"
          @on-click="handleActionDelete(scope.row)"
        />
      </RowActionsMenu>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import { EMITS, COLUMNS } from '../utils'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'CertificateListTable',
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-certificates-list-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.CERTIFICATES_LIST,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.CERTIFICATES_LIST,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.CERTIFICATE_NAME,
          COLUMNS.OWNER,
          COLUMNS.DISTRIBUTED,
          COLUMNS.CREATE_TIME
        ],
        iEmpty: {
          btn: labels.CreateNewCertificate,
          message: labels.EmptyCertificate,
          icon: 'mdi-plus',
          id: 'btn-empty--certificate-list',
          disabled: !this.$store.getters['permissions/getCreateCertificatePermission']
        },
        addButton: {
          show: true,
          action: 'add-certificate',
          tooltip: labels.AddCertificate,
          id: 'btn-add--certificate',
          disabled: !this.$store.getters['permissions/getCreateCertificatePermission']
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getExportCertificatePermission']
        },
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            id: 'btn-edit--row-actions-certificate-list',
            disabled: !this.$store.getters['permissions/getEditCertificatePermission']
          },
          {
            name: labels.MakeDefault,
            id: 'btn-make-default--row-actions-certificate-list',
            icon: 'mdi-star-circle'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            id: 'btn-delete--row-actions-certificate-list',
            disabled: !this.$store.getters['permissions/getDeleteCertificatePermission']
          },
          {
            name: labels.Preview,
            id: 'btn-preview--row-actions-certificate-list',
            icon: 'mdi-eye'
          },
          {
            name: labels.Duplicate,
            id: 'btn-duplicate--row-actions-certificate-list',
            icon: 'mdi-content-copy',
            action: 'on-duplicate'
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  mounted() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      AwarenessEducatorService.searchCertificate(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    handleMakeDefault(row) {
      AwarenessEducatorService.makeDefaultCertificate(row.id).then(() => {
        this.callForData()
      })
    },
    handleEdit(row) {
      this.$emit(EMITS.ON_EDIT, row)
    },
    handlePreview(row) {
      this.$emit(EMITS.ON_PREVIEW, row)
    },
    handleActionDelete(row) {
      this.$emit(EMITS.ON_ACTION_DELETE, row)
    },
    handleAdd() {
      this.$emit(EMITS.ON_ADD)
    },
    handleDuplicate(row) {
      this.$emit(EMITS.ON_DUPLICATE, row)
    },
    exportCertificateList(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === 'XLS' ? 'Excel' : item,
          filter: this.axiosPayload.filter
        }
        AwarenessEducatorService.exportCertificates(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Certificates-List.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
