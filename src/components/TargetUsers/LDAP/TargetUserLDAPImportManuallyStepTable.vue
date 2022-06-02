<template>
  <DataTable
    :id="CONSTANTS.id"
    ref="refTable"
    selectable
    filterable
    options
    is-server-side
    :loading="isLoading"
    :show-filter-options="false"
    :is-settings-popup="false"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
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
    @handleSelectionChange="handleSelectionChange"
  >
    <template #table-notification>
      <div class="target-user-import-file__header-detail">
        <v-btn
          class="target-user-import-file__button target-user-import-file__button--table-notification"
          outlined
          rounded
          @click="handleValidityButton"
        >
          {{ getValidityButtonText }}
        </v-btn>
      </div>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import LDAPService from '@/api/ldap'
export default {
  name: 'TargetUserLDAPImportManuallyStepTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  inject: ['getTransactionId', 'getMappingObject', 'setTotalNumberOfRecords', 'setSelectedUsers'],
  data() {
    return {
      CONSTANTS: {
        id: 'target-user-ldap-import-manually-data-table'
      },
      isShowInvalid: false,
      axiosPayload: getDefaultAxiosPayload({
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'Status',
                  Operator: 'Include',
                  Value: 'New,Exists,Error'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }),
      tableData: [],
      customFields: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        columns: [
          {
            property: PROPERTY_STORE.FIRSTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            dbName: 'FirstName',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.LASTNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.LASTNAME),
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'text',
            dbName: 'LastName',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.EMAIL,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.EMAIL),
            sortable: true,
            show: true,
            type: 'text',
            width: 275,
            filterableType: 'text',
            dbName: 'Email',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.DEPARTMENT,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            filterableType: 'text',
            dbName: 'Department',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            width: 180,
            fullWidth: true,
            dbName: 'Priority',
            emptyText: 'No Data'
          },
          {
            property: 'createTime',
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            minWidth: 200,
            overrideWidth: true,
            dbName: 'CreateTime',
            emptyText: 'No Data'
          }
        ],
        statusColumn: {
          property: PROPERTY_STORE.STATUS,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.STATUS),
          fixed: 'right',
          sortable: true,
          show: true,
          type: 'status',
          isEditable: true,
          hasTooltip: true,
          fullWidth: true,
          dbName: 'Status',
          minWidth: 170,
          emptyText: 'No Data'
        },
        iEmpty: {
          message: labels.EmptyTargetUsersPeople
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: false
        },
        rowActions: [],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  computed: {
    getValidityButtonText() {
      return !this.isShowInvalid
        ? `ONLY SHOW INVALID (${this.getMappingObject()?.invalidUserCount})`
        : `SHOW ALL (${this.serverSideProps.totalNumberOfRecords})`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      LDAPService.searchTmpTargetUsersForLdap(this.axiosPayload, this.getTransactionId())
        .then((response) => {
          const {
            data: {
              data: {
                items: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
              }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.setTotalNumberOfRecords(totalNumberOfRecords)
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          if (!this.customFields.length && results?.length) {
            this.createCustomFields(results)
          }
          this.setTableData(results)
        })
        .finally(this.setLoading)
    },
    createCustomFields(tableData) {
      this.customFields = tableData[0].customFields.map((item) => {
        const filterableProps = {}
        const { dataType, name } = item
        switch (dataType.toLowerCase()) {
          case 'string':
            filterableProps['filterableType'] = 'text'
            break
          case 'email':
            filterableProps['filterableType'] = 'text'
            break
          case 'number':
            filterableProps['filterableType'] = 'text'
            break
          case 'boolean':
            filterableProps['filterableType'] = 'select'
            filterableProps['filterableItems'] = [
              { text: 'Yes', value: 1 },
              { text: 'No', value: 0 }
            ]
            break
          case 'date':
            filterableProps['filterableType'] = 'dateOnly'
            break
          case 'datetime':
            filterableProps['filterableType'] = 'date'
            break
          default:
            break
        }
        return {
          property: name,
          align: 'left',
          label: name,
          fixed: false,
          show: true,
          type: 'text',
          width: 250,
          emptyText: 'No Data',
          sortable: false,
          hideSort: true,
          filterable: true,
          customFieldName: name,
          isCustomField: true,
          ...filterableProps
        }
      })
      this.tableOptions.columns.push(...this.customFields)
      this.tableOptions.columns.push(this.tableOptions.statusColumn)
    },
    setTableData(tableData) {
      this.tableData = tableData.map((item) => {
        let fieldObj = item.customFields.map((i) => {
          return { [i.name]: i.value }
        })
        fieldObj.map((iItem) => {
          for (let key in iItem) {
            if (iItem.hasOwnProperty(key)) {
              item[key] = iItem[key]
            }
          }
        })
        return item
      })
    },
    handleValidityButton() {
      this.isShowInvalid = !this.isShowInvalid
      this.axiosPayload.filter.FilterGroups[0]['FilterItems'].find(
        (item) => item.FieldName === 'Status'
      ).Value = this.isShowInvalid ? 'Error' : 'New,Exists,Error'
      this.callForData()
    },
    handleSelectionChange(selection) {
      this.setSelectedUsers(selection)
    }
  }
}
</script>
