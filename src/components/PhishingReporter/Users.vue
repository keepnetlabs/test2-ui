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
        <app-dialog-footer @handleClose="isWantToDelete = false" @handleConfirm="deleteUser" />
      </template>
    </app-dialog>

    <data-table
      :loading="isLoading"
      :select-event="tableOptions.selectEvent"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :countRow="5"
      :empty="tableOptions.empty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'usersListTable'"
      :row-actions="tableOptions.rowActions"
      :selectable="true"
      :resizable="resizable"
      :sizeable="true"
      @deleteAction="handleDelete"
      :table="tableOptions.table"
      @handleEdit="handleEdit"
      @downloadEvent="exportPhishingReporterUserList"
      id="phishing-reporter-data-table"
      ref="refUsersList"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
    />
  </div>
</template>

<script>
import DataTable from '../DataTable'
import { COMMON_CONSTANTS, getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import {
  searchPhishingReporterUser,
  exportPhishingReporterUserList,
  deletePhishingReporterUser
} from '@/api/phishingReporter'

import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'Users',
  components: {
    AppDialogFooter,
    DataTable,
    AppDialog
  },
  props: {
    resizable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: true,
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
            editComponent: 'textfield'
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            type: 'text',
            width: 150,
            isEditable: true,
            editComponent: 'textfield'
            //minWidth: 80
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
            //minWidth: 80
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
            width: 200,
            filterableType: 'text',
            filterableCustomFieldName: 'HostName'
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
            width: 140
            //minWidth: 80
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
            width: 160,
            isEditable: false,
            hasTooltip: true,
            //minWidth: 80,
            fullWidth: true
          }
        ],
        empty: {
          message: 'No Users'
        },
        rowActions: [
          {
            name: 'Delete',
            icon: 'mdi-delete',
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
        pageSize: 5000,
        orderBy: 'LastSeen',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
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
    handleDelete(row) {
      this.selectedRow = row
      this.isWantToDelete = true
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
              data: { results }
            }
          } = response

          this.tableOptions.table =
            results.map((item) => {
              const { lastSeen } = item
              const lastSeenSplittedFormat = lastSeen.split(' ')
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

              const timezonedLastSeen = `${timezonedDate.getFullYear()}-${this.getDateValue(
                timezonedDate.getMonth() + 1
              )}-${this.getDateValue(timezonedDate.getDate())} ${this.getDateValue(
                timezonedDate.getHours()
              )}:${this.getDateValue(timezonedDate.getMinutes())}:${this.getDateValue(
                timezonedDate.getSeconds()
              )}`
              const newItem = { ...item, lastSeen: timezonedLastSeen }
              return newItem
            }) || []
          this.isLoading = false
        })
        .catch(() => {
          /*
            this.$store.dispatch('common/createSnackBar', {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: "Error when getting the user phishing reporter! "
            })
             */
          this.isLoading = false
        })
    },
    exportPhishingReporterUserList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'LastSeen',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.requestBody.filter
        }
        exportPhishingReporterUserList(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `users.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch(() => {})
      })
    },
    callForDeletePhishingReporterUser() {
      deletePhishingReporterUser(this.selectedRow.resourceId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            message: response.data.message,
            icon: 'mdi-check-circle',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
          })
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
      requestBody.map((x) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
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
    }
  },
  created() {
    this.callForPhishingReporterUser()
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
}
</style>
