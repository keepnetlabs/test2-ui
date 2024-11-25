<template>
  <div id="users" class="users">
    <app-dialog
      type="delete"
      icon="mdi-alert"
      title="Delete Phishing User(s)?"
      :subtitle="getSubTitle"
      title-id="text--phishing-reporter-users-delete-popup-title"
      subtitle-id="text--phishing-reporter-users-delete-popup-subtitle"
      :status="isWantToDelete"
      @changeStatus="isWantToDelete = false"
    >
      <template #app-dialog-body> {{ getUserName }} will be permanently deleted. </template>
      <template #app-dialog-footer>
        <app-dialog-footer
          type="delete"
          cancel-button-id="btn-cancel--phishing-reporter-users-popup"
          confirm-button-id="btn-delete--phishing-reporter-users-popup"
          :disabled="deleteButtonDisabled"
          @handleClose="isWantToDelete = false"
          @handleConfirm="deleteUser"
        />
      </template>
    </app-dialog>
    <data-table
      id="phishing-reporter-data-table"
      ref="refUsersList"
      is-server-side
      is-server-side-selection
      selectable
      filterable
      options
      :table="tableOptions.table"
      :loading="isLoading"
      :select-event="selectEvent"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :row-actions="tableOptions.rowActions"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      :page-sizes="tableOptions.pageSizes"
      @deleteAction="handleDelete"
      @downloadEvent="exportPhishingReporterUserList"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @searchChangedEvent="handleSearchChange"
      @sortChangedEvent="sortChanged"
      @handleMultipleDelete="handleMultipleDeleteOfPhishingUsers"
    >
      <template #datatable-custom-column="{ scope, col }">
        <v-btn class="d-none" />
        <v-tooltip
          v-if="col.property === PROPERTY_STORE.ADDINSTATUSNAME"
          bottom
          content-class="users__tooltip"
        >
          <template #activator="{ on }">
            <badge
              v-if="scope.row && scope.row[col.property]"
              v-bind="col.props"
              :listeners="on"
              :color="getBtnStatusColor(scope.row[col.property])"
              :full-width="col.fullWidth"
              :col="col"
              :text="getDataTableFieldLabel(scope.row[col.property])"
            />
          </template>
          <span>{{ getStatusTooltipMessage(scope.row) }}</span>
        </v-tooltip>
        <template v-if="col.property === PROPERTY_STORE.DIAGNOSTICTOOL">
          <v-tooltip
            v-if="scope.row['diagnosticToolLastSeen']"
            bottom
            content-class="users__tooltip"
          >
            <template #activator="{ on }">
              <span v-on="on">{{ scope.row[col.property] }}</span>
            </template>
            <span>{{ getDiagnosticToolTooltipMessage(scope.row) }}</span>
          </v-tooltip>
          <span v-else>{{ scope.row[col.property] }}</span>
        </template>
      </template>
      <template #empty-table-inline>
        <h2 class="empty-inline max-w-750 text-center">
          The users are only visible on this page when using the MSI Add-in; it does not work with
          other add-ins
        </h2>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import {
  searchPhishingReporterUser,
  exportPhishingReporterUserList,
  deletePhishingReporterUser,
  bulkDeletePhishingUsers
} from '@/api/phishingReporter'
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import {
  getDataTableFieldLabel,
  getBtnStatusColor,
  getDefaultAxiosPayload
} from '@/utils/functions'
import Badge from '@/components/Badge'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'Users',
  components: {
    AppDialogFooter,
    DataTable,
    AppDialog,
    Badge
  },
  mixins: [useDefaultTableFunctions],
  data() {
    return {
      PROPERTY_STORE,
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      multipleSystemUserPayload: {},
      deleteButtonDisabled: false,
      isLoading: true,
      isInit: true,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.PHISHING_REPORTER,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.PHISHINGREPORTER,
        table: [],
        pageSizes: [5, 10, 25, 50, 100],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            filterableType: 'text',
            filterableCustomFieldName: 'Email'
          },
          {
            property: PROPERTY_STORE.ADDINSTATUSNAME,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.ADDINSTATUSNAME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'slot',
            width: 180,
            props: {
              style: {
                maxWidth: '110px'
              }
            },
            filterableType: 'select',
            filterableItems: [
              'Online',
              'Offline',
              'Inactive',
              'Disabled',
              { text: 'Not Installed', value: 'NotInstalled' }
            ]
          },
          {
            property: PROPERTY_STORE.LASTSEEN,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTSEEN),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 220,
            filterableType: 'date',
            filterableCustomFieldName: 'LastSeen'
          },
          {
            property: PROPERTY_STORE.DIAGNOSTICTOOL,
            align: 'left',
            editable: false,
            label: 'Diagnostic Tool',
            fixed: false,
            sortable: true,
            show: true,
            type: 'slot',
            width: 165,
            filterableType: 'select',
            filterableItems: [
              { text: 'Not Installed', value: 'NotInstalled' },
              'Online',
              'Offline',
              'Error/Uninstalled'
            ]
          },
          {
            property: PROPERTY_STORE.HOSTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.HOSTNAME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'fiber',
            filterableType: 'text',
            width: 200
          },
          {
            property: PROPERTY_STORE.ADDINVERSION,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.ADDINVERSION),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            filterableType: 'text'
          }
        ],
        empty: {
          message:
            'The users are only visible on this page when using the MSI Add-in; it does not work with other add-ins',
          id: 'btn-empty--phishing-reporter-users'
        },
        rowActions: [
          {
            name: 'Delete',
            icon: 'mdi-delete',
            id: 'btn-delete--phishing-reporter-users-row-actions',
            action: 'deleteAction',
            disabled: !this.$store.getters['permissions/getPhishingReporterDeleteUserPermissions']
          }
        ]
      },
      isWantToDelete: false,
      selectedRow: null,
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: true,
        download: false
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'LastSeen' }),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getUserName() {
      if (this.selectedRow) {
        return this.selectedRow?.firstName || this.selectedRow?.lastName
          ? `${this.selectedRow?.firstName || ''} ${this.selectedRow?.lastName || ''}`
          : `This user`
      }

      if (this.isMultipleDelete) {
        return `${this.multipleDeletedUserCount} users`
      }

      return `This user`
    },
    getSubTitle() {
      return `${
        this.isMultiple ? `${this.userCount} user(s)` : 'The phishing user'
      } will be deleted permanently`
    }
  },
  watch: {
    isWantToDelete(val) {
      if (!val) {
        this.selectedRow = null
        this.isMultipleDelete = false
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    getDataTableFieldLabel(field) {
      return getDataTableFieldLabel(field)
    },
    getDiagnosticToolTooltipMessage(row = {}) {
      const { diagnosticToolLastSeen } = row
      return `Last seen: ${diagnosticToolLastSeen}`
    },
    getStatusTooltipMessage(row = {}) {
      const {
        osVersion,
        addInDisabledReason,
        addInDisabledLastDisabledTime,
        hklmLoadBehaviorValue,
        osAccountLoadBehaviorValue,
        bootTime,
        outlookArchitecture,
        outlookVersion
      } = row
      let text = ''
      const textOS = `OS version: ${osVersion ? osVersion : 'Unknown'}`
      const textHKLM = `HKLM: ${hklmLoadBehaviorValue || 'N/A'}\n`
      const textHKCU = `HKCU: ${osAccountLoadBehaviorValue || 'N/A'}\n`
      const bootTimeLeftExpression = `${bootTime} ms`
      const textBootTime = `Boot time: ${bootTime ? bootTimeLeftExpression : 'N/A'}\n`
      const textOutlookVersion = `Outlook version: ${outlookVersion || 'N/A'}\n`
      const textOutlookArchitecture = `Outlook architecture: ${outlookArchitecture || 'N/A'}\n`

      if (row[PROPERTY_STORE.ADDINSTATUSNAME] === 'Online') {
        text = 'Add-in is installed and active\n'
        text += textHKLM
        text += textHKCU
        text += textBootTime
        text += textOutlookVersion
        text += textOutlookArchitecture
        text += textOS
      }
      if (row[PROPERTY_STORE.ADDINSTATUSNAME] === 'Inactive') {
        text = 'Addin is inactivated by user\n'
        text += 'User is offline\n'
        text += textHKLM
        text += textHKCU
        text += textOutlookVersion
        text += textOutlookArchitecture
        text += textOS
      }
      if (row[PROPERTY_STORE.ADDINSTATUSNAME] === 'Offline') {
        text = 'Add-in is installed\n'
        text += 'User is offline\n'
        text += textHKLM
        text += textHKCU
        text += textBootTime
        text += textOutlookVersion
        text += textOutlookArchitecture
        text += textOS
      }
      if (row[PROPERTY_STORE.ADDINSTATUSNAME] === 'Disabled') {
        text = 'Add-in is installed but disabled\n'
        text += `Cause: ${addInDisabledReason ? addInDisabledReason : 'Unknown'}\n`
        text += `Disabled time: ${
          addInDisabledLastDisabledTime ? addInDisabledLastDisabledTime : 'Unknown'
        }\n`
        text += textHKLM
        text += textHKCU
        text += textBootTime
        text += textOutlookVersion
        text += textOutlookArchitecture
        text += textOS
      }
      if (row[PROPERTY_STORE.ADDINSTATUSNAME] === 'NotInstalled') {
        text = 'Add-in has not been installed'
      }
      if (row[PROPERTY_STORE.ADDINSTATUSNAME] === 'N/A') {
        text = 'This user is not an active user in your active directory'
      }
      return text
    },
    handleDelete(row) {
      this.selectedRow = row
      this.isWantToDelete = true
    },
    getDateValue(value) {
      value = typeof value == 'string' ? value : value.toString()
      return value.length === 1 ? `0${value}` : `${value}`
    },
    callForData() {
      this.isLoading = true
      if (!this.isInit) {
        this.$emit('callForPhishingReporterSummary')
      }
      searchPhishingReporterUser(this.axiosPayload)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableOptions.table =
            results?.map((item) => {
              const { diagnosticToolStatus } = item
              return {
                ...item,
                diagnosticToolStatus:
                  diagnosticToolStatus === 'NotInstalled'
                    ? labels.NotInstalled
                    : diagnosticToolStatus
              }
            }) || []
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
        .finally(() => {
          this.isInit = false
        })
    },
    exportPhishingReporterUserList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const filter = JSON.parse(JSON.stringify(this.axiosPayload.filter))
        const payload = {
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          pageNumber: pageNumber,
          pageSize: pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter
        }
        if (!reportAllPages) {
          payload.filter.FilterGroups[0].FilterItems.push({
            FieldName: 'ResourceId',
            Operator: 'Include',
            Value: this?.tableOptions?.table?.map((row) => row.resourceId).join(',')
          })
          payload.pageNumber = 1
        }
        exportPhishingReporterUserList(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Phishing Reporter Users.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
            link.click()
          })
          .catch(() => {})
      })
    },
    callForDeletePhishingReporterUser() {
      deletePhishingReporterUser(this.selectedRow.resourceId)
        .then(() => {
          this.$refs.refUsersList.unSelectRow(this.selectedRow)
          this.$refs.refUsersList.changeServerSideSelectionCount(-1)
          this.callForData()
        })
        .catch(() => {})
    },
    deleteUser() {
      if (this.isMultipleDelete) {
        this.callForMultipleDelete()
        return
      }
      this.callForDeletePhishingReporterUser()
      this.isWantToDelete = false
    },
    handleMultipleDeleteOfPhishingUsers(items, excludedItems, selectAll) {
      this.isMultipleDelete = true
      this.multipleDeletedUserCount = selectAll
        ? this.serverSideProps.totalNumberOfRecords
        : items.length
      this.multipleSystemUserPayload = {
        items: selectAll ? [] : items.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: this.axiosPayload.filter
      }
      this.isWantToDelete = true
    },
    callForMultipleDelete() {
      this.deleteButtonDisabled = true
      bulkDeletePhishingUsers(this.multipleSystemUserPayload)
        .then(() => {
          this?.$refs?.refUsersList?.resetSelectableParams()
          this.callForData()
          this.isWantToDelete = false
        })
        .finally(() => {
          this.deleteButtonDisabled = false
        })
    }
  }
}
</script>
