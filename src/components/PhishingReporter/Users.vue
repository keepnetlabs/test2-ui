<template>
  <div id="users" class="users">
    <app-dialog
      icon="mdi-alert"
      title="Delete User"
      subtitle="Do you want to delete this user?"
      title-id="text--phishing-reporter-users-delete-popup-title"
      subtitle-id="text--phishing-reporter-users-delete-popup-subtitle"
      :status="isWantToDelete"
      @changeStatus="isWantToDelete = false"
    >
      <template v-slot:app-dialog-body> {{ getUserName }} will be permanently deleted. </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          type="delete"
          cancel-button-id="btn-cancel--phishing-reporter-users-popup"
          confirm-button-id="btn-delete--phishing-reporter-users-popup"
          @handleClose="isWantToDelete = false"
          @handleConfirm="deleteUser"
        />
      </template>
    </app-dialog>

    <data-table
      id="phishing-reporter-data-table"
      ref="refUsersList"
      is-server-side
      selectable
      filterable
      options
      :table="tableOptions.table"
      :loading="isLoading"
      :select-event="tableOptions.selectEvent"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :row-actions="tableOptions.rowActions"
      :axios-payload.sync="requestBody"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="handleDelete"
      @downloadEvent="exportPhishingReporterUserList"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForPhishingReporterUser"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @searchChangedEvent="handleSearchChange"
      @sortChangedEvent="sortChanged"
    >
      <template #datatable-custom-column="{ scope, col }">
        <v-btn style="display: none;" />
        <v-tooltip
          bottom
          content-class="users__tooltip"
          v-if="col.property === PROPERTY_STORE.ADDINSTATUSNAME"
        >
          <template #activator="{ on }">
            <badge
              :listeners="on"
              :color="getBtnStatusColor(scope.row[col.property])"
              :full-width="col.fullWidth"
              v-bind="col.props"
              :col="col"
              :text="getDataTableFieldLabel(scope.row[col.property])"
              v-if="scope.row && scope.row[col.property]"
            />
          </template>
          <span>{{ getStatusTooltipMessage(scope.row) }}</span>
        </v-tooltip>
        <template v-if="col.property === PROPERTY_STORE.DIAGNOSTICTOOL">
          <v-tooltip
            bottom
            content-class="users__tooltip"
            v-if="scope.row['diagnosticToolLastSeen']"
          >
            <template #activator="{ on }">
              <span v-on="on">{{ scope.row[col.property] }}</span>
            </template>
            <span>{{ getDiagnosticToolTooltipMessage(scope.row) }}</span>
          </v-tooltip>
          <span v-else>{{ scope.row[col.property] }}</span>
        </template>
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
  deletePhishingReporterUser
} from '@/api/phishingReporter'
import labels from '@/model/constants/labels'
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import {
  getDataTableFieldLabel,
  getBtnStatusColor,
  getDefaultAxiosPayload
} from '@/utils/functions'
import Badge from '@/components/Badge'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
export default {
  name: 'Users',
  components: {
    AppDialogFooter,
    DataTable,
    AppDialog,
    Badge
  },
  data() {
    return {
      PROPERTY_STORE,
      isLoading: true,
      isInit: true,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.PHISHING_REPORTER,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.PHISHINGREPORTER,
        table: [],
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          {
            property: PROPERTY_STORE.FIRSTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
            sortable: true,
            show: true,
            fixed: 'left',
            type: 'text',
            width: 150,
            isEditable: true,
            filterableType: 'text',
            editComponent: 'textfield'
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            width: 150,
            isEditable: true,
            editComponent: 'textfield'
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            isEditable: true,
            editComponent: 'textfield',
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
            isEditable: false,
            props: {
              style: {
                maxWidth: '110px'
              }
            },
            filterableType: 'select',
            filterableItems: [
              'Online',
              'Offline',
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
            isEditable: true,
            editComponent: 'textfield',
            width: 220,
            filterableType: 'date',
            filterableCustomFieldName: 'LastSeen'
            //minWidth: 80
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
            isEditable: true,
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
            isEditable: true,
            editComponent: 'textfield',
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
            isEditable: true,
            editComponent: 'textfield',
            width: 150,
            filterableType: 'text'
            //minWidth: 80
          }
        ],
        empty: {
          message: labels.EmptyPhishingReporter,
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
        delete: false,
        download: false
      },
      requestBody: getDefaultAxiosPayload({ orderBy: 'LastSeen' }),
      defaultRequestBody: getDefaultAxiosPayload({ orderBy: 'LastSeen' }),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    getUserName() {
      return this.selectedRow && (this.selectedRow.firstName || this.selectedRow.lastName)
        ? `${this.selectedRow.firstName} ${this.selectedRow.lastName}`
        : 'This user'
    }
  },
  created() {
    this.callForPhishingReporterUser()
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
        bootTime,
        outlookArchitecture,
        outlookVersion
      } = row
      let text = ''
      const textOS = `OS version: ${osVersion ? osVersion : 'Unknown'}`
      const textHKLM = `HKLM: ${hklmLoadBehaviorValue || 'N/A'}\n`
      const textBootTime = `Boot time: ${bootTime ? `${bootTime} ms` : 'N/A'}\n`
      const textOutlookVersion = `Outlook version: ${outlookVersion || 'N/A'}\n`
      const textOutlookArchitecture = `Outlook architecture: ${outlookArchitecture || 'N/A'}\n`

      switch (row[PROPERTY_STORE.ADDINSTATUSNAME]) {
        case 'Online':
          text = 'Add-in is installed and active\n'
          text += textHKLM
          text += textBootTime
          text += textOutlookVersion
          text += textOutlookArchitecture
          text += textOS
          break
        case 'Offline':
          text = 'Add-in is installed\n'
          text += 'User is offline\n'
          text += textHKLM
          text += textBootTime
          text += textOutlookVersion
          text += textOutlookArchitecture
          text += textOS
          break
        case 'Disabled':
          text = 'Add-in is installed but disabled\n'
          text += `Cause: ${addInDisabledReason ? addInDisabledReason : 'Unknown'}\n`
          text += `Disabled time: ${
            addInDisabledLastDisabledTime ? addInDisabledLastDisabledTime : 'Unknown'
          }\n`
          text += textHKLM
          text += textBootTime
          text += textOutlookVersion
          text += textOutlookArchitecture
          text += textOS
          break
        case 'NotInstalled':
          text = 'Add-in has not been installed'
          break
        case 'N/A':
          text = 'This user is not an active user in your active directory'
          break
        default:
          break
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
    callForPhishingReporterUser() {
      this.isLoading = true
      if (!this.isInit) {
        this.$emit('callForPhishingReporterSummary')
      }
      searchPhishingReporterUser(this.requestBody)
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
            results.map((item) => {
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
        const filter = JSON.parse(JSON.stringify(this.requestBody.filter))
        const payload = {
          orderBy: this.requestBody.orderBy,
          ascending: this.requestBody.ascending,
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
            Value: this.tableOptions.table.map((row) => row.resourceId).join(',')
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
          this.callForPhishingReporterUser()
        })
        .catch(() => {})
    },
    deleteUser() {
      this.callForDeletePhishingReporterUser()
      this.isWantToDelete = false
    },
    columnFilterChanged(filter) {
      this.requestBody.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.requestBody
      )
      this.resetPageNumber()
      this.callForPhishingReporterUser()
    },
    columnFilterCleared(fieldName) {
      this.requestBody.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.requestBody
      )
      this.callForPhishingReporterUser()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.requestBody.pageNumber = pageNumber
      this.callForPhishingReporterUser()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.requestBody.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForPhishingReporterUser()
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.requestBody.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForPhishingReporterUser()
    },
    sortChanged({ order, prop } = {}) {
      this.requestBody.ascending = order === 'ascending'
      this.requestBody.orderBy = prop
      this.callForPhishingReporterUser()
    },
    resetPageNumber() {
      this.requestBody.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    }
  }
}
</script>

<style lang="scss">
.users {
  padding-top: 24px;
  &__button {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
  }
  &__tooltip {
    white-space: pre-wrap;
  }
}
</style>
