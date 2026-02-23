<template>
  <div class="proxy-settings">
    <company-settings-header title="Proxy Settings" sub-title="Configure proxy" />
    <new-proxy-settings
      v-if="newProxyModalStatus"
      ref="newProxySettings"
      :status="newProxyModalStatus"
      :resourceId="selectedEditProxySettings"
      :isEdit="isEdit"
      @closeOverlay="toggleProxyModalStatus"
      @handleDelete="handleDeleteProxySettings"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
    />
    <delete-proxy-settings
      :status="deleteProxyModalStatus"
      :data="selectedDeleteProxySettings"
      @closeOverlay="toggleDeleteProxyModalStatus"
      @handleDelete="handleDeleteProxySettings"
    />
    <div class="proxy-settings__container">
      <data-table
        id="company-settings-proxy-settings-data-table"
        ref="refProxySettingsList"
        selectable
        filterable
        options
        is-server-side
        :loading="loading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.empty"
        :download-button="tableOptions.downloadButton"
        :addButton="tableOptions.addButton"
        :select-event="tableOptions.selectEvent"
        :row-actions="tableOptions.rowActions"
        :server-side-props="serverSideProps"
        :server-side-events="{ pagination: true, search: true, sort: true }"
        :axios-payload.sync="axiosPayload"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        @addNewProxySetting="toggleProxyModalStatus"
        @onEmptyBtnClicked="toggleProxyModalStatus"
        @handleMultipleDelete="handleMultipleDelete"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForData"
        @downloadEvent="exportProxySettingsList"
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
            @on-click="handleEditAction(scope.row)"
          />
          <DefaultButtonRowAction
            :id="tableOptions.rowActions[1].id"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            @on-click="handleDeleteAction(scope.row)"
          />
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import DataTable from '@/components/DataTable'
import NewProxySettings from '@/components/Company Settings/ProxySettings/NewProxySettings'
import { deleteProxySettings, exportProxySettings, searchProxySettings } from '@/api/proxySettings'
import DeleteProxySettings from '@/components/Company Settings/ProxySettings/DeleteProxySettings'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'PROXYSettings',
  components: {
    DefaultButtonRowAction,
    CompanySettingsHeader,
    DataTable,
    NewProxySettings,
    DeleteProxySettings
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      tableData: [],
      loading: false,
      selectedDeleteProxySettings: null,
      selectedEditProxySettings: null,
      isEdit: false,
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Proxy Name',
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.ADDRESS,
            align: 'left',
            editable: false,
            label: 'IP Address',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 180
          },
          {
            property: PROPERTY_STORE.PORT,
            align: 'left',
            editable: false,
            label: 'Port',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'text',
            width: 150
          },
          {
            property: PROPERTY_STORE.AuthenticationTypeName,
            align: 'left',
            editable: false,
            label: 'Authentication',
            sortable: true,
            show: true,
            fixed: false,
            type: 'text',
            filterableType: 'select',
            filterableCustomFieldName: 'AuthenticationType',
            filterableItems: [
              { text: 'Basic', value: '1' },
              { text: 'Transparent', value: '0' }
            ],
            width: 180
          },
          {
            property: PROPERTY_STORE.ISDEFAULT,
            align: 'center',
            editable: false,
            label: 'Is Default?',
            sortable: true,
            show: true,
            fixed: false,
            type: 'badge',
            filterableType: 'select',
            filterableItems: [
              { text: 'Yes', value: 'Yes' },
              { text: 'No', value: 'No' }
            ],
            width: 165
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: 'Date Created',
            fixed: 'right',
            sortable: true,
            show: true,
            filterableType: 'date',
            type: 'text',
            width: 180
          }
        ],
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.PROXY_SETTINGS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.PROXY_SETTINGS,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        downloadButton: {
          show: true,
          disabled: false
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--proxy-settings-row-actions',
            disabled: !this.$store.getters['permissions/getProxySettingsUpdatePermissions']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--proxy-settings-row-actions',
            disabled: !this.$store.getters['permissions/getProxySettingsDeletePermissions']
          }
        ],
        empty: {
          message: labels.EmptyProxy,
          btn: labels.New,
          icon: 'mdi-plus',
          id: 'btn-empty--proxy-settings',
          disabled: !this.$store.getters['permissions/getProxySettingsCreatePermissions']
        },
        addButton: {
          show: true,
          action: 'addNewProxySetting',
          tooltip: 'Add Proxy Setting',
          id: 'btn-add--proxy-settings',
          disabled: !this.$store.getters['permissions/getProxySettingsCreatePermissions']
        }
      },
      newProxyModalStatus: false,
      deleteProxyModalStatus: false,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getProxySettingsSearchPermissions: 'permissions/getProxySettingsSearchPermissions'
    })
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (!this.getProxySettingsSearchPermissions) return
      this.loading = true
      searchProxySettings(this.axiosPayload)
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
        .finally(() => {
          this.loading = false
        })
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.axiosPayload.filter.FilterGroups[1].FilterItems = this.axiosPayload.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'AuthenticationTypeName') {
            item.FieldName = 'AuthenticationType'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForData()
    },
    checkIfCanCloseProxyModal() {
      if (this.$refs.newProxySettings) this.$refs.newProxySettings.closeOverlay()
    },
    toggleProxyModalStatus() {
      if (this.newProxyModalStatus) {
        this.resourceId = null
        this.isEdit = false
      }
      this.newProxyModalStatus = !this.newProxyModalStatus
    },
    exportProxySettingsList(downloadTypes) {
      downloadTypes.exportTypes.map((exportType) => {
        const payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportProxySettings(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `Proxy Settings.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    toggleDeleteProxyModalStatus() {
      this.deleteProxyModalStatus = !this.deleteProxyModalStatus
    },
    handleEditAction({ resourceId } = {}) {
      this.isEdit = true
      this.selectedEditProxySettings = resourceId
      this.toggleProxyModalStatus()
    },
    closeOverlayWithUpdate() {
      this.toggleProxyModalStatus()
      this.callForData()
    },
    callForDeleteProxySettings(resourceId) {
      deleteProxySettings(resourceId)
        .then(() => {
          this.callForData()
        })
        .finally(() => {
          this.selectedDeleteProxySettings = null
        })
    },
    handleDeleteProxySettings(row) {
      const { resourceId } = row
      this.$refs.refProxySettingsList.unSelectRow(row)
      this.callForDeleteProxySettings(resourceId)
    },
    handleDeleteAction(selectedRow) {
      this.selectedDeleteProxySettings = selectedRow
      this.toggleDeleteProxyModalStatus()
    },
    handleMultipleDelete(selections) {
      this.selectedDeleteProxySettings = selections
      this.toggleDeleteProxyModalStatus()
    }
  }
}
</script>
