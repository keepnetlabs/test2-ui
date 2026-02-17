<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
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
    @downloadEvent="exportDirectEmailCreationList"
  >
    <template #datatable-custom-column="{ scope, col }">
      <span class="direct-email-creation__name-column">
        <span>{{ scope.row.name }}</span>
        <v-tooltip v-if="scope.row.isDefault" bottom>
          <template #activator="{ on }">
            <v-icon v-on="on" size="20" color="#1173C1" class="pl-2">mdi-star-circle</v-icon>
          </template>
          <span>Default Setting</span>
        </v-tooltip>
      </span>
    </template>
    <template #addUsers>
      <v-menu :offset-y="true" bottom left nudge-right="32" nudge-bottom="4">
        <template #activator="{ on: menu }">
          <v-tooltip bottom opacity="1">
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                v-on="{ ...tooltip, ...menu }"
                :disabled="!$store.getters['permissions/getDirectEmailCreatePermissions']"
                id="btn-add--dec-configuration"
                class="button-new"
                style="margin-right: 10px;"
                rounded
                color="#2196f3"
              >
                <v-icon style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
                <span class="button-new__text">NEW</span>
              </v-btn>
            </template>
            <span class="tooltip-span">Create New DEC Configuration</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-for="item in addConfigurationItems"
            :key="item.id"
            :id="item.id"
            :disabled="item.disabled"
            @click="handleAddConfiguration(item)"
          >
            <v-list-item-title class="add-users__title">{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template #datatable-row-actions="{ scope }">
      <template v-if="scope.row.status === 'Running'">
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
            :icon="tableOptions.rowActions[1].icon"
            :text="scope.row.isDefault ? 'Remove Default' : tableOptions.rowActions[1].name"
            @on-click="handleMakeDefault(scope.row)"
          />
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[2].id"
            :scope="scope"
            :disabled="tableOptions.rowActions[2].disabled || scope.row.isDefault"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :showTooltip="tableOptions.rowActions[2].disabled || scope.row.isDefault"
            :disabledTooltipText="
              scope.row.isDefault
                ? 'This setting is currently the default and cannot be deleted. Remove it as the default first.'
                : 'Delete'
            "
            @on-click="handleActionDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
      <template v-else>
        <DefaultButtonRowAction
          :id="tableOptions.rowActions[0].id"
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          @on-click="handleEdit(scope.row)"
        />
        <DefaultButtonRowAction
          :id="tableOptions.rowActions[2].id"
          :icon="tableOptions.rowActions[2].icon"
          :text="tableOptions.rowActions[2].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[2].disabled || scope.row.isDefault"
          :disabledTooltipText="
            scope.row.isDefault
              ? 'This setting is currently the default and cannot be deleted. Remove it as the default first.'
              : 'Delete'
          "
          @on-click="handleActionDelete(scope.row)"
        />
      </template>
    </template>
  </DataTable>
</template>

<script>
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { COLUMNS, EMITS } from './utils'
import DataTable from '@/components/DataTable'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import DirectCreationService from '@/api/direct-creation'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
export default {
  name: 'DirectEmailCreationTable',
  components: {
    DefaultButtonRowAction,
    DataTable,
    DefaultMenuRowAction,
    RowActionsMenu
  },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'awareness-educator-training-list-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      addConfigurationItems: [
        {
          text: 'Google Workspace',
          id: 'btn-add-google-workspace-configuration'
        },
        { text: 'Microsoft 365', id: 'btn-add-microsoft-365-configuration' }
      ],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.DIRECT_EMAIL_CREATION,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.DIRECT_EMAIL_CREATION,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [COLUMNS.NAME, COLUMNS.PLATFORM, COLUMNS.STATUS, COLUMNS.CREATE_TIME],
        iEmpty: {
          message: `You do not have any Direct Email Creation (DEC) configuration, yet`,
          subMes: `Click the New button to start creating a new configuration`,
          icon: 'mdi-plus',
          id: 'btn-empty--direct-email-creation-list',
          disabled: !this.$store.getters['permissions/getDirectEmailCreatePermissions']
        },
        addButton: {
          show: true,
          action: 'add-item',
          tooltip: labels.CreateDirectEmailCreation,
          id: 'btn-add--direct-email-creation',
          disabled: !this.$store.getters['permissions/getDirectEmailCreatePermissions']
        },
        downloadButton: {
          show: true,
          disabled: !this.$store.getters['permissions/getDirectEmailExportPermissions']
        },
        rowActions: [
          {
            id: 'btn-edit--row-actions-direct-email-creation-list',
            name: labels.Edit,
            icon: 'mdi-pencil',
            disabled: !this.$store.getters['permissions/getDirectEmailUpdatePermissions']
          },
          {
            id: 'btn-make-default--row-actions-direct-email-creation-list',
            name: 'Make Default',
            icon: 'mdi-star-circle',
            disabled: !this.$store.getters['permissions/getDirectEmailUpdatePermissions']
          },
          {
            id: 'btn-delete--row-actions-direct-email-creation-list',
            name: labels.Delete,
            icon: 'mdi-delete',
            disabled: !this.$store.getters['permissions/getDirectEmailDeletePermissions']
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
      DirectCreationService.searchEmailCreations(this.axiosPayload)
        .then((response) => {
          const {
            data: { data = {} }
          } = response
          const {
            results = [],
            totalNumberOfRecords = 0,
            totalNumberOfPages = 0,
            pageNumber = 1
          } = data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
        })
        .finally(this.setLoading)
    },
    handleEdit(row) {
      this.$emit(EMITS.ON_EDIT, row)
    },
    handleActionDelete(row) {
      this.$emit(EMITS.ON_ACTION_DELETE, row)
    },
    handleMakeDefault(row) {
      if (row.isDefault) {
        this.setLoading(true)
        DirectCreationService.removeDefault(row.resourceId)
          .then(() => {
            this.$refs?.refTable?.resetSelectableParams?.()
            this.callForData()
          })
          .finally(this.setLoading)
      } else {
        this.setLoading(true)
        DirectCreationService.makeDefault(row.resourceId)
          .then(() => {
            this.$refs?.refTable?.resetSelectableParams?.()
            this.callForData()
          })
          .finally(this.setLoading)
      }
    },
    exportDirectEmailCreationList(downloadTypes) {
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
        DirectCreationService.exportDirectEmailCreation(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Direct-Email-Creations.${
            item.toLocaleLowerCase() === 'xls' ? 'xlsx' : item.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    handleAddConfiguration(item) {
      const config = item ?? { text: '' }
      if (config.text === this.addConfigurationItems[0].text) {
        this.$emit(EMITS.ON_ADD_GOOGLE_WORKSPACE)
      }
      if (config.text === this.addConfigurationItems[1].text) {
        this.$emit(EMITS.ON_ADD_MICROSOFT_365)
      }
    }
  }
}
</script>
