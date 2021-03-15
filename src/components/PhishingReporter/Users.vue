<template>
  <div id="users" class="users">
    <app-dialog
      :status="isWantToDelete"
      icon="mdi-alert"
      title="Delete User"
      subtitle="Do you want to delete this user?"
      @changeStatus="isWantToDelete = false"
    >
      <template v-slot:app-dialog-body> {{ getUserName }} will be permanently deleted. </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          @handleClose="isWantToDelete = false"
          @handleConfirm="deleteUser"
          cancel-button-id="btn-cancel--phishing-reporter-users-popup"
          confirm-button-id="btn-delete--phishing-reporter-users-popup"
        />
      </template>
    </app-dialog>

    <data-table
      id="phishing-reporter-data-table"
      ref="refUsersList"
      is-server-side
      :loading="isLoading"
      :select-event="tableOptions.selectEvent"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :filterable="true"
      :options="true"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :pageSizes="tableOptions.pageSizes"
      :refName="'usersListTable'"
      :row-actions="tableOptions.rowActions"
      :selectable="true"
      :resizable="resizable"
      :sizeable="true"
      :table="tableOptions.table"
      @handleEdit="handleEdit"
      @deleteAction="handleDelete"
      @downloadEvent="exportPhishingReporterUserList"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForPhishingReporterUser"
      @set-default-search="handleSetDefaultSearch"
      @restore-default-search="handleRestoreDefaultSearch"
      @clear-filters="handleClearFilters"
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
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import {
  searchPhishingReporterUser,
  exportPhishingReporterUserList,
  deletePhishingReporterUser
} from '@/api/phishingReporter'
import labels from '@/model/constants/labels'
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { getDataTableFieldLabel, getBtnStatusColor } from '@/utils/functions'
import Badge from '@/components/Badge'
import QueryHelperForTable from '@/helper-classes/query-helper'
import ServerSideProps from '@/helper-classes/server-side-table-props'
export default {
  name: 'Users',
  components: {
    AppDialogFooter,
    DataTable,
    AppDialog,
    Badge
  },
  props: {
    resizable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      PROPERTY_STORE,
      isLoading: true,
      isRestoredOrClearedFilters: false,
      tableOptions: {
        isColumnFilterActive: false,
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
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'slot',
            width: 150,
            isEditable: false,
            props: {
              style: {
                maxWidth: '110px'
              }
            }
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
            width: 160
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
            width: 140,
            filterableType: 'text'
            //minWidth: 80
          }
        ],
        empty: {
          message: 'No Users',
          id: 'btn-empty--phishing-reporter-users'
        },
        rowActions: [
          {
            name: 'Delete',
            icon: 'mdi-delete',
            id: 'btn-delete--phishing-reporter-users-row-actions',
            action: 'deleteAction'
          }
        ],
        pageSizes: [5, 10, 25]
      },
      isWantToDelete: false,
      selectedRow: null,
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: false,
        download: false
      },
      requestBody: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'LastSeen',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      defaultRequestBody: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'LastSeen',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
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
      const { operatingSystemEdition, addInDisabledReason, addInDisabledLastDisabledTime } = row
      let text = ''
      const textOS = `OS version: ${operatingSystemEdition ? operatingSystemEdition : 'Unknown'}`

      switch (row[PROPERTY_STORE.ADDINSTATUSNAME]) {
        case 'Online':
          text = 'Add-in is installed and active\n'
          text += textOS
          break
        case 'Offline':
          text = 'Add-in is installed\n'
          text += 'User is offline\n'
          text += textOS
          break
        case 'Disabled':
          text = 'Add-in is installed but disabled\n'
          text += `Cause: ${addInDisabledReason ? addInDisabledReason : 'Unknown'}\n`
          text += `Disabled time: ${
            addInDisabledLastDisabledTime ? addInDisabledLastDisabledTime : 'Unknown'
          }\n`
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
    handleClearFilters() {
      this.isRestoredOrClearedFilters = true
      this.requestBody = JSON.parse(JSON.stringify(this.defaultRequestBody))
      this.$refs.refUsersList.filterValues = {}
      this.$refs.refUsersList.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      localStorage.removeItem(DEFAULT_SEARCH_CONTAINER_KEYS.PHISHING_REPORTER)
      this.callForPhishingReporterUser()
    },
    handleRestoreDefaultSearch() {
      this.isRestoredOrClearedFilters = true
      this.getDefaultFilterAndSearch()
    },
    handleDelete(row) {
      this.selectedRow = row
      this.isWantToDelete = true
    },
    handleSetDefaultSearch(search = '', filterValues = {}) {
      const copyOfFilter = JSON.parse(JSON.stringify(this.requestBody.filter))
      copyOfFilter.FilterGroups[1] = {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
      localStorage.setItem(
        DEFAULT_SEARCH_CONTAINER_KEYS.PHISHING_REPORTER,
        JSON.stringify({
          filter: copyOfFilter,
          filterValues
        })
      )
    },
    getDateValue(value) {
      value = typeof value == 'string' ? value : value.toString()
      return value.length === 1 ? `0${value}` : `${value}`
    },
    handleEdit(rows) {},
    handleAdd(row) {},
    callForPhishingReporterUser() {
      this.isLoading = true
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
              const { lastSeen, diagnosticToolStatus, diagnosticToolLastSeen } = item

              const newItem = {
                ...item,
                lastSeen: this.getUtcToNowDate(lastSeen),
                diagnosticToolStatus:
                  diagnosticToolStatus === 'NotInstalled'
                    ? labels.NotInstalled
                    : diagnosticToolStatus,
                diagnosticToolLastSeen: this.getUtcToNowDate(diagnosticToolLastSeen)
              }
              return newItem
            }) || []
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
        .finally(() => {
          if (this.isRestoredOrClearedFilters) {
            this.isRestoredOrClearedFilters = false
          }
        })
    },
    getUtcToNowDate(strDate) {
      if (strDate) {
        const lastSeenSplittedFormat = strDate.split(' ')
        const lastSeenDateSide = lastSeenSplittedFormat[0].split('-')
        const lastSeenTimeSide = lastSeenSplittedFormat[1].split(':')
        const dateOfLastSeen = new Date(
          lastSeenDateSide[0],
          lastSeenDateSide[1] - 1,
          lastSeenDateSide[2],
          lastSeenTimeSide[0],
          lastSeenTimeSide[1],
          lastSeenTimeSide[2]
        )
        const timeZoneOffset = Math.floor(new Date().getTimezoneOffset() / -60)
        const timezonedDate = new Date(
          dateOfLastSeen.setHours(dateOfLastSeen.getHours() + timeZoneOffset)
        )

        return `${timezonedDate.getFullYear()}-${this.getDateValue(
          timezonedDate.getMonth() + 1
        )}-${this.getDateValue(timezonedDate.getDate())} ${this.getDateValue(
          timezonedDate.getHours()
        )}:${this.getDateValue(timezonedDate.getMinutes())}:${this.getDateValue(
          timezonedDate.getSeconds()
        )}`
      }
    },
    exportPhishingReporterUserList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          orderBy: this.requestBody.orderBy,
          ascending: this.requestBody.ascending,
          pageNumber: pageNumber,
          pageSize: pageSize,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.requestBody.filter
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
          this.callForPhishingReporterUser()
          this.$emit('callForPhishingReporterSummary')
        })
        .catch(() => {})
    },
    deleteUser() {
      this.callForDeletePhishingReporterUser()
      this.isWantToDelete = false
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.requestBody.filter.FilterGroups[0].FilterItems
      this.resetPageNumber()
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        if (filter.FieldName === 'LastSeen') {
          const { Value: value } = filter
          const lastSeenDate = new Date(value)
          const utcLastSeen = `${lastSeenDate.getUTCFullYear()}-${this.getDateValue(
            lastSeenDate.getUTCMonth() + 1
          )}-${this.getDateValue(lastSeenDate.getUTCDate())} ${this.getDateValue(
            lastSeenDate.getUTCHours()
          )}:${this.getDateValue(lastSeenDate.getUTCMinutes())}:${this.getDateValue(
            lastSeenDate.getUTCSeconds()
          )}`
          filter.Value = utcLastSeen
        }

        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.requestBody.filter.FilterGroups[0].FilterItems = requestBody
      this.callForPhishingReporterUser()
    },
    columnFilterCleared(fieldName) {
      if (this.isRestoredOrClearedFilters) {
        return
      }
      let items = []
      let filterPayload = this.requestBody.filter.FilterGroups[0].FilterItems
      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })
      filterPayload = [...items]
      this.requestBody.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForPhishingReporterUser()

      this.tableOptions.isColumnFilterActive =
        this.requestBody.filter.FilterGroups[0].FilterItems.length >= 1
    },
    getDefaultFilterAndSearch() {
      const savedFilter = JSON.parse(
        localStorage.getItem(DEFAULT_SEARCH_CONTAINER_KEYS.PHISHING_REPORTER)
      )
      if (savedFilter) {
        this.requestBody.filter = savedFilter.filter
        this.tableOptions.isColumnFilterActive = true
        this.$nextTick(() => {
          this.$refs.refUsersList.filterValues = savedFilter.filterValues
          this.$refs.refUsersList.columnKey = `column-key${Math.random()
            .toString()
            .substring(0, 5)}`
        })
      }
      this.callForPhishingReporterUser()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.requestBody.pageNumber = pageNumber
      this.queryHelper.setRouterQuery('page', pageNumber)
      this.callForPhishingReporterUser()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.requestBody.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.queryHelper.setRouterQuery('size', pageSize)
      this.queryHelper.setRouterQuery('page', 1)
      this.callForPhishingReporterUser()
    },
    handleSearchChange(searchFilter = {}, columnFilterActive = false) {
      this.tableOptions.isColumnFilterActive = columnFilterActive
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.requestBody.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.tableOptions.isColumnFilterActive = columnFilterActive
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
      this.queryHelper.setRouterQuery('page', 1)
    }
  },
  created() {
    this.queryHelper = new QueryHelperForTable(this.$router, this.$route)
    this.queryHelper.controlRouteQuery()
    const { page, size } = this.queryHelper.returnQueryValues()
    this.requestBody.pageSize = size
    this.serverSideProps.pageSize = size
    this.requestBody.pageNumber = page
    this.getDefaultFilterAndSearch()
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
