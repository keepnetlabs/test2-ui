<template>
  <div class="saml-settings">
    <company-settings-header
      :title="labels.SamlSettings"
      :sub-title="labels.SamlSettingsSubHeader"
    />
    <delete-saml-settings
      v-if="isDeletePopupOpen"
      :status="isDeletePopupOpen"
      :selected-row="selectedRow"
      @on-close="toggleDeletePopupStatus"
      @on-delete="handleOnDelete"
    />
    <new-saml-settings
      v-if="isEditOrNewModalOpen"
      ref="newSamlSettings"
      :status="isEditOrNewModalOpen"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleNewSamlSettingsModalStatus(false)"
      @on-success="handleEditOrNewFormSuccess"
    />
    <div class="smtp-settings__container">
      <data-table
        id="company-settings-saml-settings-data-table"
        ref="refSamlSettings"
        refName="samlSettingsList"
        filterable
        options
        selectable
        is-server-side
        :loading="loading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :addButton="tableOptions.addButton"
        :select-event="tableOptions.selectEvent"
        :row-actions="tableOptions.rowActions"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        :axios-payload.sync="axiosPayload"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        @addNewSamlSetting="toggleNewSamlSettingsModalStatus(false)"
        @deleteAction="toggleDeletePopupStatus"
        @editAction="handleEditAction"
        @onEmptyBtnClicked="toggleNewSamlSettingsModalStatus(false)"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForData"
        @downloadEvent="exportSamlSettings"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
      >
      </data-table>
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
import labels from '@/model/constants/labels'
import { exportSamlSettings, searchSamlSettings } from '@/api/samlSettings'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { downloadExportedFile } from '@/utils/helperFunctions'
import DeleteSamlSettings from '@/components/Company Settings/SAML/DeleteSamlSettings'
import NewSamlSettings from '@/components/Company Settings/SAML/NewSamlSettings'
import { getDefaultAxiosPayload } from '@/utils/functions'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'SamlSettings',
  components: { NewSamlSettings, DeleteSamlSettings, CompanySettingsHeader, DataTable },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      axiosPayload: getDefaultAxiosPayload(),
      labels,
      isEditOrNewModalOpen: false,
      isEdit: false,
      isDeletePopupOpen: false,
      loading: false,
      selectedRow: null,
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: labels.SamlName,
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'text'
          },
          {
            property: 'statusName',
            align: 'center',
            editable: false,
            label: labels.SSOEnabled,
            fixed: false,
            sortable: true,
            show: true,
            width: 180,
            type: 'badge',
            filterableType: 'select',
            filterableItems: [
              { text: 'Inactive', value: 'Inactive' },
              { text: 'Active', value: 'Active' }
            ],
            filterableCustomFieldName: 'status'
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Added',
            width: 180,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date'
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SAMLSETTINGS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SAML_SETTINGS,
        addButton: {
          show: true,
          action: 'addNewSamlSetting',
          tooltip: labels.SamlAddButtonTooltip,
          id: 'btn-add--saml-settings',
          disabled: !this.$store.getters['permissions/getSAMLIntegrationCreatePermissions']
        },
        empty: {
          message: labels.EmptySamlTable,
          subMes: labels.EmptySamlTableSub,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--saml-settings',
          disabled: !this.$store.getters['permissions/getSAMLIntegrationCreatePermissions']
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--saml-settings-row-actions',
            disabled: !this.$store.getters['permissions/getSAMLIntegrationUpdatePermissions']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--saml-settings-row-actions',
            disabled: !this.$store.getters['permissions/getSAMLIntegrationDeletePermissions']
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.loading = true
      searchSamlSettings(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .finally(() => (this.loading = false))
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop.toLowerCase() === 'statusname' ? 'StatusId' : prop
      this.callForData()
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      filterItems.forEach((filter) => {
        if (filter.FieldName === 'StatusName') {
          filter.FieldName = 'Status'
        }
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
    },
    handleEditOrNewFormSuccess() {
      this.selectedRow = null
      this.isEdit = false
      this.callForData()
      this.toggleNewSamlSettingsModalStatus()
    },
    handleEditAction(row = {}) {
      this.selectedRow = row
      this.toggleNewSamlSettingsModalStatus(true)
    },
    checkIfCanCloseSamlSettingsModal() {
      if (this.$refs.newSamlSettings) this.$refs.newSamlSettings.closeOverlay()
    },
    toggleNewSamlSettingsModalStatus(isEdit = false) {
      this.isEdit = isEdit
      if (!this.isEdit) this.selectedRow = null
      this.isEditOrNewModalOpen = !this.isEditOrNewModalOpen
    },
    exportSamlSettings(downloadTypes = {}) {
      downloadTypes.exportTypes.forEach((exportType) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportSamlSettings(payload).then((response) => {
          const { data } = response
          downloadExportedFile(data, 'SAML Settings', exportType)
        })
      })
    },
    toggleDeletePopupStatus(row = null) {
      this.selectedRow = row
      this.isDeletePopupOpen = !this.isDeletePopupOpen
    },
    handleOnDelete(selectedRow = {}) {
      this.$refs.refSamlSettings.unSelectRow(selectedRow)
      this.callForData()
    }
  }
}
</script>
