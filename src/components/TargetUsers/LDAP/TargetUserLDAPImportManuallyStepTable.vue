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
    :count-row="hideFilter ? 5 : 10"
    :axios-payload.sync="axiosPayload"
    :no-padding-bottom="hideFilter"
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
          :style="!getInvalidUserCount && { opacity: '.5', pointerEvents: 'none' }"
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
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import LDAPService from '@/api/ldap'
import { mapGetters } from 'vuex'
import { getAxiosPayloadOfManuallyTable } from '@/components/TargetUsers/LDAP/utils'
export default {
  name: 'TargetUserLDAPImportManuallyStepTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    hideFilter: {
      type: Boolean
    },
    totalNumberOfRecords: {
      type: Number,
      default: 0
    }
  },
  inject: {
    getTransactionId: {
      type: Function
    },
    getMappingObject: {
      type: Function
    },
    setTotalNumberOfRecords: {
      type: Function
    },
    setSelectedUsers: {
      type: Function
    },
    viewUsersTableFilterParams: {
      default: () => null
    }
  },
  data() {
    return {
      CONSTANTS: {
        id: 'target-user-ldap-import-manually-data-table'
      },
      isShowInvalid: false,
      axiosPayload: getAxiosPayloadOfManuallyTable(
        this.hideFilter,
        this.viewUsersTableFilterParams
      ),
      tableData: [],
      customFields: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
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
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: this.hideFilter ? null : 'text',
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
            filterableType: this.hideFilter ? null : 'text',
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
            filterableType: this.hideFilter ? null : 'text',
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
            filterableType: this.hideFilter ? null : 'text',
            dbName: 'Department',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.PHONENUMBER,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PHONENUMBER),
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            filterableType: this.hideFilter ? null : 'text',
            dbName: 'Department',
            emptyText: 'No Data'
          },
          {
            property: PROPERTY_STORE.TIME_ZONE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.TIME_ZONE),
            sortable: false,
            hideSort: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'select',
            filterableItems: [],
            dbName: 'TimeZone',
            filterableCustomFieldName: 'TimeZoneId'
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
    ...mapGetters({
      getTimezones: 'common/getTimezones'
    }),
    getValidityButtonText() {
      return !this.isShowInvalid ? `ONLY SHOW INVALID (${this.getInvalidUserCount})` : `SHOW ALL`
    },
    getInvalidUserCount() {
      return this.getMappingObject()?.invalidUserCount
    }
  },
  created() {
    if (this.hideFilter) {
      this.serverSideProps.pageSize = 5
    }
    this.callForGetTimeZones()
    this.callForData()
  },
  watch: {
    getTimezones: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val?.timeZoneList?.length) this.setTimeZoneFilterableItems()
      }
    }
  },
  methods: {
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    },
    setTimeZoneFilterableItems() {
      const filterableItems = this.getTimezones?.timeZoneList?.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
      filterableItems.unshift({ text: 'Blank', value: 'Blank' })
      this.$set(
        this.tableOptions.columns.find((col) => col.property === PROPERTY_STORE.TIME_ZONE),
        'filterableItems',
        filterableItems
      )
      this?.$refs?.refPeopleTable?.reRenderFilters()
    },
    callForData() {
      this.setLoading(true)
      const transactionId = this.getTransactionId()
      if (!transactionId) return
      LDAPService.searchTmpTargetUsersForLdap(this.axiosPayload, transactionId)
        .then((response) => {
          const {
            data: {
              data: {
                items: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
              }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          if (!this.hideFilter) this.setTotalNumberOfRecords(totalNumberOfRecords)
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.$emit('update:totalNumberOfRecords', totalNumberOfRecords)
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
        if (dataType.toLowerCase() === 'string') {
          filterableProps['filterableType'] = 'text'
        } else if (dataType.toLowerCase() === 'email') {
          filterableProps['filterableType'] = 'text'
        } else if (dataType.toLowerCase() === 'number') {
          filterableProps['filterableType'] = 'text'
        } else if (dataType.toLowerCase() === 'boolean') {
          filterableProps['filterableType'] = 'select'
          filterableProps['filterableItems'] = [
            { text: 'Yes', value: 1 },
            { text: 'No', value: 0 }
          ]
        } else if (dataType.toLowerCase() === 'date') {
          filterableProps['filterableType'] = 'dateOnly'
        } else if (dataType.toLowerCase() === 'datetime') {
          filterableProps['filterableType'] = 'date'
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
      if (!this.tableOptions.columns.find((col) => col.property === PROPERTY_STORE.STATUS)) {
        this.tableOptions.columns.push(this.tableOptions.statusColumn)
      }
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
      const statusField = this.axiosPayload.filter.FilterGroups[0]['FilterItems'].find(
        (item) => item.FieldName === 'Status'
      )
      if (statusField) statusField.Value = this.isShowInvalid ? 'Error' : 'New,Exists,Error'
      else if (this.hideFilter) {
        this.axiosPayload.filter.FilterGroups[0]['FilterItems'].unshift({
          FieldName: 'Status',
          Operator: 'Include',
          Value: this.isShowInvalid ? 'Error' : 'New,Exists,Error'
        })
      }
      this.callForData()
    },
    handleSelectionChange(selection) {
      if (this.hideFilter) return
      this.setSelectedUsers(selection)
    }
  }
}
</script>
