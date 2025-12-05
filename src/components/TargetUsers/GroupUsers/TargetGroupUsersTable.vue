<template>
  <DataTable
    id="target-users-group-users-data-table"
    ref="refTargetGroupUsersTable"
    selectable
    filterable
    options
    is-server-side
    :is-server-side-selection="isServerSide"
    :loading="loading"
    :table="tableData"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :add-button="tableOptions.addButton"
    :row-actions="tableOptions.rowActions"
    :select-event="tableOptions.selectEvent"
    :server-side-props="serverSideProps"
    :server-side-events="{ pagination: true, search: true, sort: true }"
    :show-datatable-row-actions="false"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
    @addAction="handleAddAction"
    @downloadEvent="exportTargetGroupsUserList"
    @onEmptyBtnClicked="handleAddAction"
    @handleEditTargetUsers="handleEditTargetUsers"
    @handleAddToAnExistingGroup="handleAddToAnExistingGroup"
    @handleSelectionChange="handleSelectionChange"
    @handleRemoveToGroup="handleRemoveToGroup"
    @columnFilterChanged="columnFilterChanged"
    @columnFilterCleared="columnFilterCleared"
    @refreshAction="callForGetTargetUserCustomFieldsByCompanyId"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
  >
    <template #selection-all-slot v-if="hasSelectionSlot">
      <v-tooltip bottom opacity="1">
        <template v-slot:activator="{ on }">
          <v-btn
            class="btn-selected-hover mr-1"
            icon
            v-on="on"
            @click="handleAddUsersSelectionClick"
          >
            <v-icon class="selection-icons" color="white">mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-span">Add users to group</span>
      </v-tooltip>
      <v-tooltip bottom opacity="1">
        <template v-slot:activator="{ on }">
          <v-btn
            class="btn-selected-hover mr-1"
            icon
            v-on="on"
            @click="handleRemoveUsersSelectionClick"
          >
            <v-icon class="selection-icons" color="white">mdi-minus-circle</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-span">Remove Users</span>
      </v-tooltip>
    </template>
    <template #datatable-custom-column="{ scope, col }">
      <span v-if="col.property === 'manager'">
        {{
          scope.row.managerFirstName || scope.row.managerLastName
            ? `${scope.row.managerFirstName || ''} ${scope.row.managerLastName || ''}`.trim()
            : ''
        }}
      </span>
    </template>
    <template v-if="hasRowActions" #datatable-row-actions="{ scope }">
      <TargetUserRowActionsEditButton
        :id="tableOptions.rowActions[0].id"
        :scope="scope"
        @on-click="handleEditTargetUsers"
      />
      <RowActionsMenu>
        <DefaultMenuRowAction
          :id="tableOptions.rowActions[1].id"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled"
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          @on-click="handleAddToAnExistingGroup(scope.row)"
        />
        <TargetUserRowActionsRemoveFromGroupButton
          :id="tableOptions.rowActions[2].id"
          :scope="scope"
          :isGroupEditable="$route.params.isGroupEditable"
          @on-remove="handleRemoveToGroup"
        />
      </RowActionsMenu>
    </template>
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import {
  exportTargetGroupUsers,
  getTargetGroup,
  getTargetUserCustomFieldsByCompanyId,
  getTargetUsers,
  searchTargetGroupUsers
} from '@/api/targetUsers'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { getDefaultAxiosPayload } from '@/utils/functions'
import {
  columnFilterChanged,
  columnFilterCleared,
  createCustomFieldColumns
} from '@/utils/helperFunctions'
import TargetUserRowActionsEditButton from '@/components/SmallComponents/RowActions/TargetUserRowActionsEditButton'
import TargetUserRowActionsRemoveFromGroupButton from '@/components/SmallComponents/RowActions/TargetUserRowActionsRemoveFromGroupButton'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import { getValue } from '@/utils/validations'
import { mapGetters } from 'vuex'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
export default {
  name: 'TargetGroupUsersTable',
  components: {
    RowActionsMenu,
    DefaultMenuRowAction,
    TargetUserRowActionsRemoveFromGroupButton,
    TargetUserRowActionsEditButton,
    DataTable
  },
  props: {
    iEmpty: {
      type: Object,
      default: () => ({
        message: labels.NoTargetGroupUserAdded,
        btn: 'Add Users',
        icon: 'mdi-plus'
      })
    },
    groupName: {
      type: String
    },
    excludeGroupUsers: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: String
    },
    hasRowActions: {
      type: Boolean,
      default: true
    },
    hasAddButton: {
      type: Boolean,
      default: true
    },
    hasSelectionSlot: {
      type: Boolean,
      default: false
    },
    isServerSide: {
      default: true
    },
    isCallTargetUserSearch: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'handleAddAction',
    'handleEditTargetUser',
    'handleAddToAnExistingGroup',
    'handleSelectionChange',
    'handleAddUsersSelectionClick',
    'handleRemoveToGroup',
    'handleRemoveUsersSelectionClick',
    'handleRouteBackToTargetUsers',
    'handleCreateGroupWithUser'
  ],
  data() {
    return {
      axiosPayload: getDefaultAxiosPayload({
        excludeGroupUsers: this.excludeGroupUsers
      }),
      defaultRequestBody: getDefaultAxiosPayload({
        excludeGroupUsers: this.excludeGroupUsers
      }),
      defaultColumns: [
        {
          property: PROPERTY_STORE.FIRSTNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'text',
          dbName: 'firstName'
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
          dbName: 'lastName'
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
          dbName: 'email'
        },
        {
          property: PROPERTY_STORE.PHONENUMBER,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.PHONENUMBER),
          sortable: true,
          show: true,
          type: 'text',
          width: 200,
          filterableType: 'text',
          dbName: 'PhoneNumber'
        },
        {
          property: PROPERTY_STORE.DEPARTMENT,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'text',
          dbName: 'department'
        },
        {
          property: 'preferredLanguage',
          align: 'left',
          editable: false,
          label: labels.PreferredLanguage,
          sortable: true,
          show: true,
          type: 'text',
          fixed: false,
          width: 200,
          filterableType: 'select',
          filterableItems: [],
          filterableCustomFieldName: 'preferredLanguageId'
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
          property: 'manager',
          align: 'left',
          editable: false,
          label: 'Manager',
          sortable: false,
          hideSort: true,
          show: true,
          type: 'slot',
          width: 200,
          filterableType: 'text',
          dbName: 'ManagerFirstName'
        },
        {
          property: 'managerEmail',
          align: 'left',
          editable: false,
          label: 'Manager Email',
          sortable: true,
          show: true,
          type: 'text',
          width: 250,
          filterableType: 'text',
          dbName: 'ManagerEmail'
        }
      ],
      lastColumns: [
        {
          property: PROPERTY_STORE.PRIORITY,
          align: 'center',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.PRIORITY),
          sortable: true,
          show: true,
          type: 'priority',
          width: 150,
          fullWidth: true,
          filterableType: 'select',
          filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS
        },
        {
          property: PROPERTY_STORE.STATUS,
          align: 'center',
          label: getStoreValue(PROPERTY_STORE.STATUS),
          fixed: false,
          sortable: true,
          show: true,
          type: 'status',
          width: 150,
          isEditable: true,
          hasTooltip: true,
          fullWidth: true,
          dbName: 'status',
          filterableType: 'select',
          filterableItems: COMMON_CONSTANTS.STATUS_ITEMS
        },
        {
          property: 'createTime',
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.CREATETIME),
          fixed: !this.hasRowActions && 'right',
          sortable: true,
          show: true,
          type: 'text',
          maxWidth: 300,
          minWidth: 160,
          overrideWidth: true,
          filterableType: 'date',
          dbName: 'createTime'
        }
      ],
      loading: false,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TARGETGROUPUSERSTABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TARGET_USERS_GROUP_USERS,
        addButton: {
          show: this.hasAddButton,
          action: 'addAction',
          tooltip: 'Add Users'
        },
        columns: [],
        iEmpty: this.iEmpty,
        rowActions: this.getRowActions(),
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        }
      },
      tableData: [],
      customFields: [],
      selections: [],
      serverSideProps: new ServerSideProps(),
      languageFilterOptions: []
    }
  },
  computed: {
    ...mapGetters({
      getTimezones: 'common/getTimezones'
    })
  },
  watch: {
    groupName: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val === 'Repeat Offenders') {
          this.tableOptions.iEmpty = {
            message: 'No repeat offenders found in the last 3 months'
          }
          this.tableOptions.addButton = {
            show: false
          }
        } else if (
          val === 'Untrained Users' ||
          val === 'New Hires' ||
          val === 'Non-simulated Users' ||
          val === 'Non-Simulated Users'
        ) {
          this.tableOptions.iEmpty = {
            message: labels.NoTargetGroupUserAdded
          }
          this.tableOptions.addButton = {
            show: false
          }
        } else {
          this.tableOptions.iEmpty = {
            message: labels.NoTargetGroupUserAdded,
            btn: 'Add Users',
            icon: 'mdi-plus'
          }
          this.tableOptions.addButton = {
            show: this.hasAddButton,
            action: 'addAction',
            tooltip: 'Add Users'
          }
        }
      }
    },
    customFields() {
      this.addCustomFieldColumns()
    },
    getTimezones: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val?.timeZoneList?.length) this.setTimeZoneFilterableItems()
      }
    }
  },
  created() {
    this.callForGetTimeZones()
    this.callForLanguages()
    if (this.resourceId) {
      if (this.resourceId !== '7Tna1kvZXAgX') this.callForTargetGroup()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    }
  },
  methods: {
    callForTargetGroup() {
      getTargetGroup(this.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        if (data?.isScimGroup || data?.isGoogleGroup) {
          this.tableOptions.addButton = {
            show: false
          }
        }
      })
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageFilterOptions =
          response?.map((language) => ({
            text: language.isoFriendlyName,
            name: language.name,
            value: language.resourceId
          })) || []
        this.$set(
          this.defaultColumns.find((col) => col.property === 'preferredLanguage'),
          'filterableItems',
          this.languageFilterOptions
        )
      })
    },
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
        this.defaultColumns.find((col) => col.property === PROPERTY_STORE.TIME_ZONE),
        'filterableItems',
        filterableItems
      )
      this?.$refs?.refTargetGroupUsersTable?.reRenderFilters()
    },
    handleSearchChange(searchFilter = {}) {
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      const timeZoneIndex = this.axiosPayload.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === 'TimeZone'
      )
      if (timeZoneIndex !== -1) {
        this.axiosPayload.filter.FilterGroups[1].FilterItems.splice(timeZoneIndex, 1)
      }
      const preferredLanguageIndex = this.axiosPayload.filter.FilterGroups[1].FilterItems.findIndex(
        (item) => item.FieldName === 'PreferredLanguage'
      )
      if (preferredLanguageIndex !== -1) {
        this.axiosPayload.filter.FilterGroups[1].FilterItems.splice(preferredLanguageIndex, 1)
      }
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = prop
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    addCustomFieldColumns() {
      const columnsOfCustomFields = createCustomFieldColumns(this.customFields)
      if (!columnsOfCustomFields.length) {
        const newColumns = [...this.defaultColumns, ...this.lastColumns]
        this.setStoredTableSettings(newColumns)
        this.tableOptions.columns = newColumns
      } else {
        const newColumns = [...this.defaultColumns, ...columnsOfCustomFields, ...this.lastColumns]
        this.setStoredTableSettings(newColumns)
        this.tableOptions.columns = newColumns
      }
    },
    setStoredTableSettings(newColumns = []) {
      const renderedColumns = this?.$refs.refTargetGroupUsersTable?.renderedColumns
      if (renderedColumns?.length) {
        newColumns.forEach((column) => {
          const item = renderedColumns.find(
            (renderedColumnProp) => renderedColumnProp === column.property
          )
          column.show = !!item
        })
      }
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
      this.loading = true
      if (this.customFields.length) {
        this.callForSearchTargetGroupUsers()
      } else {
        getTargetUserCustomFieldsByCompanyId()
          .then((response) => {
            const { data } = response
            this.customFields = data.data.filter((item) => {
              return item.isActive
            })
            const sortProp = 'sortOrder'
            this.customFields.sort((a, b) => {
              if (a[sortProp] > b[sortProp]) {
                return 1
              } else if (a[sortProp] === b[sortProp]) {
                return 0
              }
              return -1
            })
            this.addCustomFieldColumns()
          })
          .finally(() => this.callForSearchTargetGroupUsers())
      }
    },
    callForSearchTargetGroupUsers(id = this.resourceId) {
      this.loading = true
      if (this.isCallTargetUserSearch) {
        getTargetUsers(this.axiosPayload)
          .then((response) => {
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } =
              response?.data?.data || {}
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { data: { data: { results = [] } } = {} } = response
            this.tableData = results.map((item) => {
              item.preferredLanguage = this.languageFilterOptions.find(
                (language) => language.name === item.preferredLanguage
              )?.text
              const { customFieldValues } = item
              for (let { name, value, dataType, timestampValue } of customFieldValues) {
                if (dataType === 'Boolean') {
                  if (value === 'True') {
                    item[name] = 'Yes'
                  } else if (value === 'False') {
                    item[name] = 'No'
                  } else {
                    item[name] = 'No'
                  }
                } else if (['Date', 'DateTime'].includes(dataType)) {
                  item[name] = timestampValue
                } else {
                  item[name] = getValue(value)
                }
              }
              return item
            })
          })
          .catch((err) => {
            if (err?.response?.status === 404) {
              this.$emit('handleRouteBackToTargetUsers')
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        searchTargetGroupUsers(id, this.axiosPayload)
          .then((response) => {
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } =
              response?.data?.data || {}
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
            const { data: { data: { results = [] } } = {} } = response
            results.forEach((item) => {
              item.preferredLanguage = this.languageFilterOptions.find(
                (language) => language.name === item.preferredLanguage
              )?.text
            })
            this.tableData = results.map((item) => {
              const { customFieldValues } = item
              for (let { name, value, dataType, timestampValue } of customFieldValues) {
                if (dataType === 'Boolean') {
                  if (value === 'True') {
                    item[name] = 'Yes'
                  } else if (value === 'False') {
                    item[name] = 'No'
                  } else {
                    item[name] = 'No'
                  }
                } else if (['Date', 'DateTime'].includes(dataType)) {
                  item[name] = timestampValue
                } else {
                  item[name] = getValue(value)
                }
              }
              return item
            })
          })
          .catch((err) => {
            if (err?.response?.status === 404) {
              this.$emit('handleRouteBackToTargetUsers')
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },

    columnFilterChanged(filter) {
      this.resetPageNumber()
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForSearchTargetGroupUsers()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.callForSearchTargetGroupUsers()
    },
    getRowActions() {
      return this.hasRowActions
        ? [
            {
              name: 'Edit this row',
              id: 'btn-edit--target-group-users-row-actions',
              icon: 'mdi-pencil',
              action: 'handleEditTargetUsers',
              isNotShow: true
            },
            {
              name: 'Add to an existing group',
              id: 'btn-add-to-an-exiting-group--target-group-users-row-actions',
              icon: 'mdi-account-multiple-plus',
              action: 'handleAddToAnExistingGroup'
            },
            {
              name: 'Remove from group',
              id: 'btn-remove-from-group--target-group-users-row-actions',
              icon: 'mdi-minus-circle',
              action: 'handleRemoveToGroup'
            }
          ]
        : []
    },
    handleCreateGroupWithUser(selectedRow = {}) {
      this.$emit('handleCreateGroupWithUser', selectedRow)
    },
    handleAddUsersSelectionClick() {
      const serverSideParams = this.$refs?.refTargetGroupUsersTable?.getServerSideSelectionParams() || {
        isSelectedAllEver: false,
        excludedResourceIdList: []
      }
      this.$emit(
        'handleAddUsersSelectionClick',
        this.selections,
        this.axiosPayload.filter,
        serverSideParams,
        this.serverSideProps
      )
    },
    handleEditTargetUsers(selectedRow = {}) {
      this.$emit('handleEditTargetUser', selectedRow)
    },
    handleAddAction() {
      this.$emit('handleAddAction')
    },
    handleAddToAnExistingGroup(selectedRow = {}) {
      this.$emit('handleAddToAnExistingGroup', selectedRow)
    },
    handleRemoveUsersSelectionClick() {
      this.$emit('handleRemoveUsersSelectionClick', this.selections)
    },
    handleSelectionChange(selection = [], excludedResourceIdList = [], isSelectedAllEver = false) {
      this.selections = selection
      this.$emit('handleSelectionChange', selection, excludedResourceIdList, isSelectedAllEver)
    },
    handleRemoveToGroup(selectedRow = {}) {
      this.$emit('handleRemoveToGroup', selectedRow)
    },
    exportTargetGroupsUserList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber,
          pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportTargetGroupUsers(this.resourceId, payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Target Group Details.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    }
  }
}
</script>
