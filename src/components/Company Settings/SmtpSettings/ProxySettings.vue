<template>
  <div class="proxy-settings">
    <company-settings-header title="Proxy Settings" sub-title="Configure proxy" />
    <new-proxy-settings
      ref="newProxySettings"
      :status="newProxyModalStatus"
      @closeOverlay="toggleProxyModalStatus"
      @handleDelete="handleDeleteProxySettings"
      @closeOverlayWithUpdate="closeOverlayWithUpdate"
      :resourceId="selectedEditProxySettings"
      :isEdit="isEdit"
      v-if="newProxyModalStatus"
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
        :axios-payload.sync="bodyOptions"
        :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
        :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
        @addNewProxySetting="toggleProxyModalStatus"
        @onEmptyBtnClicked="toggleProxyModalStatus"
        @handleMultipleDelete="handleMultipleDelete"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @refreshAction="callForSearchProxySettings"
        @downloadEvent="exportProxySettingsList"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
      >
        <!-- <template v-slot:datatable-custom-column="{ scope }">
          <div>
            <span>{{ scope.row.name }}</span>
            <v-icon v-if="scope.row.isDefault === 'Yes'" color="#1173C1"
            class="pl-2"
              >mdi-star-circle</v-icon
            >
          </div>
        </template> -->
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
          <!-- <v-menu bottom left offset-y transition="scale-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="btn-hover" icon v-on="on">
                <v-icon @click.native="selectedMenuIndex = scope.$index"
                  >mdi-dots-vertical</v-icon
                >
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                class="sub-menu-el"
                :disabled="getDisabledStatusOfDelete(scope.row)"
                :id="`${tableOptions.rowActions[1].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                @click="handleDeleteAction(scope.row)"
              >
                <v-list-item-title class="sub-menu-el__title">
                  <v-icon
                    class="proxy-settings__row-actions__overflow-menu__icon"
                    >{{ tableOptions.rowActions[1].icon }}</v-icon
                  >
                  <span>{{ tableOptions.rowActions[1].name }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="sub-menu-el"
                :disabled="getDisabledStatusOfEdit(scope.row)"
                :id="`${tableOptions.rowActions[2].id}-${
                  scope.$index
                }-${Math.random().toString().substring(2)}`"
                @click="handleMakeDefault(scope.row)"
              >
                <v-list-item-title @click="() => {}" class="sub-menu-el__title">
                  <v-icon
                    class="proxy-settings__row-actions__overflow-menu__icon"
                    >{{ tableOptions.rowActions[2].icon }}</v-icon
                  >
                  <span>{{ tableOptions.rowActions[2].name }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
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
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
export default {
  name: 'PROXYSettings',
  components: {
    DefaultButtonRowAction,
    CompanySettingsHeader,
    DataTable,
    NewProxySettings,
    DeleteProxySettings
  },
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
            // type: "slot",
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
          // {
          //   name: "Make Default",
          //   icon: "mdi-star-circle",
          //   action: "makeDefaultAction",
          //   id: "btn-make-default--proxy-settings-row-actions",
          //   disabled: !this.$store.getters['permissions/getProxySettingsUpdatePermissions']
          //   disabled: !this.PERMISSIONS.UPDATE.hasPermission,
          // },
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
      bodyOptions: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getProxySettingsSearchPermissions: 'permissions/getProxySettingsSearchPermissions'
    })
  },
  methods: {
    handleSearchChange(searchFilter = {}) {
      this.bodyOptions.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.bodyOptions.filter.FilterGroups[1].FilterItems = this.bodyOptions.filter.FilterGroups[1].FilterItems.map(
        (item) => {
          if (item.FieldName === 'StatusName') {
            item.FieldName = 'Status'
          }
          if (item.FieldName === 'AuthenticationTypeName') {
            item.FieldName = 'AuthenticationType'
          }
          return item
        }
      )
      this.resetPageNumber()
      this.callForSearchProxySettings()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyOptions.pageNumber = pageNumber
      this.callForSearchProxySettings()
    },
    sortChanged({ order, prop } = {}) {
      this.bodyOptions.ascending = order === 'ascending'
      this.bodyOptions.orderBy = prop === 'statusName' ? 'Status' : prop
      this.callForSearchProxySettings()
    },
    resetPageNumber() {
      this.bodyOptions.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyOptions.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForSearchProxySettings()
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
          orderBy: this.bodyOptions.orderBy,
          ascending: this.bodyOptions.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyOptions.filter
        }
        exportProxySettings(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
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
    callForSearchProxySettings() {
      if (!this.getProxySettingsSearchPermissions) return
      this.loading = true
      searchProxySettings(this.bodyOptions)
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
    handleEditAction({ resourceId } = {}) {
      this.isEdit = true
      this.selectedEditProxySettings = resourceId
      this.toggleProxyModalStatus()
    },
    closeOverlayWithUpdate() {
      this.toggleProxyModalStatus()
      this.callForSearchProxySettings()
    },
    callForDeleteProxySettings(resourceId) {
      deleteProxySettings(resourceId)
        .then(() => {
          this.callForSearchProxySettings()
        })
        .finally(() => {
          this.selectedDeleteProxySettings = null
        })
    },
    handleMakeDefault(row) {},
    handleDeleteProxySettings(row) {
      const { resourceId } = row
      this.$refs.refProxySettingsList.unSelectRow(row)
      this.callForDeleteProxySettings(resourceId)
    },
    handleDeleteAction(selectedRow) {
      this.selectedDeleteProxySettings = selectedRow
      this.toggleDeleteProxyModalStatus()
    },
    columnFilterChanged(filter) {
      this.bodyOptions.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.bodyOptions
      )
      this.callForSearchProxySettings()
    },
    columnFilterCleared(fieldName) {
      this.bodyOptions.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyOptions
      )
      this.callForSearchProxySettings()
    },
    handleMultipleDelete(selections) {
      this.selectedDeleteProxySettings = selections
      this.toggleDeleteProxyModalStatus()
    }
  },
  created() {
    this.callForSearchProxySettings()
  }
}
</script>
