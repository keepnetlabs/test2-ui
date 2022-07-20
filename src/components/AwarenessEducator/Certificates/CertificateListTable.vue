<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    is-server-side-selection
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
  >
    <template #datatable-row-actions="{ scope }">
      <DefaultButtonRowAction
        :icon="tableOptions.rowActions[0].icon"
        :text="tableOptions.rowActions[0].name"
        :scope="scope"
        :disabled="tableOptions.rowActions[0].disabled"
        @on-click="handleEdit(scope.row)"
      />
      <RowActionsMenu>
        <DefaultMenuRowAction
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[1].disabled"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          @on-click="handleMakeDefault(scope.row)"
        />
        <DefaultMenuRowAction
          :scope="scope"
          :disabled="tableOptions.rowActions[2].disabled"
          :icon="tableOptions.rowActions[2].icon"
          :text="tableOptions.rowActions[2].name"
          @on-click="handleActionDelete(scope.row)"
        />
        <DefaultMenuRowAction
          :scope="scope"
          :check-is-owner-property="false"
          :disabled="tableOptions.rowActions[3].disabled"
          :icon="tableOptions.rowActions[3].icon"
          :text="tableOptions.rowActions[3].name"
          :checkIsOwnerProperty="false"
          @on-click="handlePreview(scope.row)"
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
          delete: true,
          download: false
        },
        columns: [COLUMNS.CERTIFICATE_NAME, COLUMNS.OWNER, COLUMNS.DISTRIBUTED, COLUMNS.CREATED_BY],
        iEmpty: {
          btn: labels.CreateNewCertificate,
          message: labels.EmptyCertificate,
          icon: 'mdi-plus',
          id: 'btn-empty--certificate-list'
        },
        addButton: {
          show: true,
          action: 'add-certificate',
          tooltip: labels.AddCertificate,
          id: 'btn-add--certificate'
        },
        downloadButton: {
          show: true
        },
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil'
          },
          {
            name: labels.MakeDefault,
            icon: 'mdi-star-circle'
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete'
          },
          {
            name: labels.Preview,
            icon: 'mdi-eye'
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  created() {
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
      AwarenessEducatorService.makeDefaultCertificate(row.resourceId)
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
    }
  }
}
</script>
