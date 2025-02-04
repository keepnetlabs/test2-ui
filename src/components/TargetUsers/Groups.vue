<template>
  <div class="target-users-groups">
    <default-error-dialog
      v-if="!!bulkDeleteErrorMessage"
      :status="!!bulkDeleteErrorMessage"
      :error-message="bulkDeleteErrorMessage"
      @on-close="bulkDeleteErrorMessage = ''"
    />
    <TargetGroupUsersAddUsersModal
      v-if="showAddUsersModal"
      :status="showAddUsersModal"
      :group-name="getGroupName"
      :resource-id="getResourceId"
      @closeOverlay="toggleAddUserModal"
      @closeOverlayWithUpdate="closeAddOverlayWithUpdate"
    />
    <AddTargetGroupModal
      v-if="showNewUserGroupModal"
      :status="showNewUserGroupModal"
      :is-create-button-disabled="isCreateButtonDisabled"
      @closeOverlay="showNewUserGroupModal = false"
      @handleSave="callForCreateNewUserGroup"
    />
    <delete-group-modal
      :status="showDeleteGroupModal"
      :selected-row="selectedRow"
      @changeDeleteGroupModalStatus="changeDeleteGroupModalStatus"
      @handleDelete="handleDeleteGroup"
      @handleMultipleDelete="handleDeleteGroupMultiple"
    />
    <datatable
      v-bind="tableState"
      ref="refGroupsTable"
      :refName="'groupsTable'"
      id="target-users-group-data-table"
      is-server-side
      filterable
      options
      selectable
      disable-extended-view-transition
      wait-extended-view-api
      :is-extended-view-cancel-button-disabled="isExtendedViewCancelButtonDisabled"
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :rowActions="tableOptions.rowActions"
      :extended-view-options="tableOptions.extendedViewOptions"
      :extendedViewValue="extendedViewValue"
      :extendedViewLoading="extendedViewLoading"
      :selectEvent="tableOptions.selectEvent"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :show-datatable-row-actions="false"
      :axios-payload.sync="tableCredientials"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      :getRowIsSelectable="handleRowIsSelectable"
      @downloadEvent="exportTargetGroupsList"
      @handleMultipleDelete="handleMultipleDelete"
      @syncWithLDAP="handleSyncWithLDAP"
      @handleEdit="handleEdit"
      @onEditClick="onEditClick"
      @delete="handleDelete"
      @onEmptyBtnClicked="showNewUserGroupModal = true"
      @add-group="handleAddGroup"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForTargetGroups"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
      <template v-slot:addUsers>
        <v-tooltip bottom opacity="1">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="btn-new"
              id="btn-add--target-users-group"
              rounded
              color="#2196f3"
              style="margin-right: 10px;"
              v-on="{ ...tooltip }"
              @click.native="showNewUserGroupModal = true"
              :disabled="!getTargetGroupsCreatePermissions"
            >
              <v-icon color="white" style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
              <span class="button-new__text">NEW</span>
            </v-btn>
          </template>
          <span class="tooltip-span">{{ 'Add Group' }}</span>
        </v-tooltip>
      </template>
      <template #datatable-custom-column="{ scope, col }">
        <span>
          <span @click="handleGroupNameClick(scope.row)" class="popup-link">
            {{ scope.row[col.property] }}
          </span>
          <VTooltip v-if="isTooltipRenderable(scope.row)" bottom max-width="320">
            <template #activator="{ on }">
              <v-icon v-on="on" class="ml-2" size="20" color="#757575">mdi-information</v-icon>
            </template>
            <span>
              {{ getGroupNameTooltipMessage(scope.row) }}
            </span>
          </VTooltip>
        </span>
      </template>
      <template #datatable-row-actions="{ scope }">
        <TargetUserRowActionsEditButton
          :id="tableOptions.rowActions[0].id"
          type="groups"
          :scope="scope"
          :disabled="isTooltipRenderable(scope.row)"
          :tooltipMessage="getEditButtonTooltipMessage(scope.row)"
          @on-click="handleEditBtnClick"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            :id="tableOptions.rowActions[1].id"
            :scope="scope"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            :showTooltip="isTooltipRenderable(scope.row)"
            :disabled="isTooltipRenderable(scope.row)"
            :disabledTooltipText="getAddUsersToGroupButtonTooltipMessage(scope.row)"
            @on-click="handleAddGroup(scope.row)"
          />
          <TargetGroupRowActionsDeleteButton
            :id="tableOptions.rowActions[2].id"
            :scope="scope"
            :disabled="isTooltipRenderable(scope.row)"
            :tooltipMessage="getDeleteButtonTooltipMessage(scope.row)"
            @on-delete="handleDelete"
          />
        </RowActionsMenu>
      </template>
    </datatable>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  createTargetGroup,
  updateTargetGroup,
  deleteTargetGroup,
  searchTargetGroups,
  exportTargetGroups
} from '@/api/targetUsers'
import DeleteGroupModal from './DeleteGroupModal'
import TargetGroupUsersAddUsersModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddUsersModal'
import {
  COMMON_CONSTANTS,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import { required, maxLength } from '@/utils/validations'
import { getDefaultAxiosPayload } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import TargetUserRowActionsEditButton from '@/components/SmallComponents/RowActions/TargetUserRowActionsEditButton'
import TargetGroupRowActionsDeleteButton from '@/components/SmallComponents/RowActions/TargetGroupRowActionsDeleteButton'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog'
import { mapGetters } from 'vuex'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import AddTargetGroupModal from '@/components/TargetUsers/AddTargetGroupModal.vue'
export default {
  name: 'Groups',
  components: {
    AddTargetGroupModal,
    RowActionsMenu,
    DefaultMenuRowAction,
    DefaultErrorDialog,
    TargetGroupRowActionsDeleteButton,
    TargetUserRowActionsEditButton,
    DeleteGroupModal,
    TargetGroupUsersAddUsersModal,
    datatable: DataTable
  },
  props: {
    isLoadState: {
      type: Boolean
    },
    isOpenTargetGroupModalOnCreated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bulkDeleteErrorMessage: '',
      showAddUsersModal: false,
      isCreateButtonDisabled: false,
      isExtendedViewCancelButtonDisabled: false,
      loading: false,
      tableData: [],
      selectedGroup: {},
      extendedViewLoading: true,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.TARGETUSERSGROUP,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.TARGET_USERS_GROUPS,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'slot',
            width: 260,
            isEditable: true,
            filterableType: 'text',
            editOptions: {
              component: 'textfield',
              props: {
                rules: [(v) => required(v, 'Required')]
              }
            }
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            sortable: true,
            show: true,
            type: 'priority',
            isEditable: true,
            filterableType: 'select',
            filterableItems: COMMON_CONSTANTS.PRIORITY_ITEMS,
            editOptions: {
              component: 'select',
              props: {
                items: [
                  { text: 'Very Low', value: 'VeryLow' },
                  'Low',
                  'Medium',
                  'High',
                  { text: 'Very High', value: 'VeryHigh' }
                ]
              }
            },
            width: 150
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            isEditable: true,
            width: 180
          }
        ],
        selectEvent: {
          clipboard: true,
          edit: true,
          delete: true,
          download: false
        },
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_GROUPS_DEFINED,
          btn: 'New',
          id: 'btn-empty--target-users-group',
          icon: 'mdi-plus'
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            id: 'btn-edit--target-users-group-row-actions',
            action: 'edit',
            isNotShow: true
          },
          {
            name: 'Add users to group',
            id: 'btn-add-users-to-group--target-users-group-row-actions',
            icon: 'mdi-account-multiple-plus',
            action: 'add-group'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete',
            id: 'btn-delete--target-users-people-row-actions'
          }
        ],
        extendedViewOptions: {
          titleKey: 'name',
          footer: [
            {
              label: 'Date Created',
              key: 'createTime'
            },
            {
              label: 'Last update',
              key: 'lastUpdateDate'
            }
          ],
          col: [
            {
              property: PROPERTY_STORE.NAME,
              label: 'Group Name',
              isEditable: true,
              type: 'text',
              editOptions: {
                component: 'textfield',
                getDisabledValue(row) {
                  return row.length > 1
                },
                props: {
                  rules: [
                    (v) => required(v, 'Required'),
                    (v) => maxLength(v, 64, labels.getMaxLengthMessage('Group name'))
                  ]
                }
              }
            },
            {
              property: PROPERTY_STORE.PRIORITY,
              label: getStoreValue(PROPERTY_STORE.PRIORITY),
              type: 'priority',
              isEditable: true,
              editOptions: {
                component: 'select',
                props: {
                  items: [
                    { text: 'Very Low', value: 'VeryLow' },
                    'Low',
                    'Medium',
                    'High',
                    { text: 'Very High', value: 'VeryHigh' }
                  ]
                }
              }
            }
          ]
        }
      },
      showNewUserGroupModal: false,
      showDeleteGroupModal: false,
      selectedRow: {},
      extendedViewValue: [],
      tableCredientials: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      tableState: null,
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      getTargetGroupsCreatePermissions: 'permissions/getTargetGroupsCreatePermissions'
    }),
    getGroupName() {
      return this.selectedGroup.name || localStorage.getItem('lastTargetGroupUsers')
    },
    getResourceId() {
      return this.selectedGroup.resourceId
    }
  },
  methods: {
    getEditButtonTooltipMessage(row) {
      if (!row?.name) return ''
      if (row.name === 'Repeat Offenders') {
        return 'Repeat Offenders group is can not be edited.'
      }
      if (row.name === 'New Hires') {
        return 'New Hires group is can not be edited.'
      }
      if (row.name === 'Non-Simulated Users')
        return 'Non-Simulated Users group is can not be edited.'
      if (row.name === 'Untrained Users') return 'Untraining Users group is can not be edited.'
    },
    getGroupNameTooltipMessage(row) {
      if (!row?.name) return ''
      if (row.name === 'Repeat Offenders') {
        return 'Users who fail two or more phishing campaigns are automatically added to the Repeat Offenders group, posing a higher security risk. Prioritize targeted training and simulations for their adaptation to your security culture, and they will be automatically removed once the risk is reduced.'
      }
      if (row.name === 'New Hires') {
        return 'New hires are automatically added to this group for 90 days to receive targeted training and simulations, prioritizing their adaptation to your security culture, before being automatically removed.'
      }
      if (row.name === 'Non-Simulated Users')
        return 'Users who haven’t participated in any simulations are automatically added to this group and removed once they do. Use this group to target users new to simulations.'
      if (row.name === 'Untrained Users')
        return 'Users who haven’t enrolled any training are automatically added to this group and removed once they do. Use this group to prioritize training for these users.'
      return ''
    },
    getAddUsersToGroupButtonTooltipMessage(row) {
      if (!row?.name) return ''
      if (row.name === 'Repeat Offenders') {
        return 'Users cannot be added to the Repeat Offenders group.'
      }
      if (row.name === 'New Hires') {
        return 'Users cannot be added to the New Hires group.'
      }
      if (row.name === 'Non-Simulated Users')
        return 'Users cannot be added to the Non-Simulated Users group.'
      if (row.name === 'Untrained Users')
        return 'Users cannot be added to the Untraining Users group.'
    },
    getDeleteButtonTooltipMessage(row) {
      if (!row?.name) return ''
      if (row.name === 'Repeat Offenders') {
        return 'Repeat Offenders group is can not be deleted.'
      }
      if (row.name === 'New Hires') {
        return 'New Hires group is can not be deleted.'
      }
      if (row.name === 'Non-Simulated Users')
        return 'Non-Simulated Users group is can not be deleted.'
      if (row.name === 'Untrained Users') return 'Untraining Users group is can not be deleted.'
    },
    isTooltipRenderable(row) {
      return (
        row?.name &&
        ['Repeat Offenders', 'New Hires', 'Non-Simulated Users', 'Untrained Users'].includes(
          row.name
        )
      )
    },
    handleRowIsSelectable(row) {
      return (
        row?.name &&
        !['Repeat Offenders', 'New Hires', 'Non-Simulated Users', 'Untrained Users'].includes(
          row.name
        )
      )
    },
    handleEditBtnClick(row) {
      this.$refs.refGroupsTable.handleEdit(row)
    },
    resetPageNumber() {
      this.tableCredientials.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      this.tableCredientials.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems
      ]
      this.resetPageNumber()
      this.callForTargetGroups()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.tableCredientials.pageNumber = pageNumber
      this.callForTargetGroups()
    },
    sortChanged({ order, prop } = {}) {
      this.tableCredientials.ascending = order === 'ascending'
      this.tableCredientials.orderBy = prop
      this.callForTargetGroups()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.tableCredientials.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForTargetGroups()
    },
    handleSyncWithLDAP(row) {},
    handleAddGroup(row = {}) {
      this.selectedGroup = row
      this.toggleAddUserModal()
    },
    toggleAddUserModal() {
      this.showAddUsersModal = !this.showAddUsersModal
    },
    closeAddOverlayWithUpdate() {
      this.toggleAddUserModal()
      this.callForTargetGroups()
    },
    handleGroupNameClick(row) {
      this.$router.push({
        name: 'Target Group Users',
        params: { id: row.resourceId, label: row.name, isGroupEditable: row.isEditable }
      })
    },
    handleMultipleDelete(selection) {
      this.selectedRow = selection
      this.changeDeleteGroupModalStatus(true)
    },
    callForCreateNewUserGroup(group) {
      this.isCreateButtonDisabled = true
      createTargetGroup(group)
        .then(() => {
          this.changeNewUserGroupStatus(false)
          this.callForTargetGroups()
        })
        .finally(() => (this.isCreateButtonDisabled = false))
    },
    changeNewUserGroupStatus(status) {
      this.showNewUserGroupModal = status
    },
    changeDeleteGroupModalStatus(status) {
      this.showDeleteGroupModal = status
    },
    handleEdit(rows) {
      rows.map((item) => {
        this.callForUpdateTargetGroup(item)
      })
    },
    callForTargetGroups() {
      this.loading = true
      searchTargetGroups(this.tableCredientials, true)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = data
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = data.results.length ? data.results : []
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    callForUpdateTargetGroup(payload) {
      this.isExtendedViewCancelButtonDisabled = true
      updateTargetGroup({ ...payload, isActive: true })
        .then(() => {
          this.$refs?.refGroupsTable?.resetSelectableParams()
          this.callForTargetGroups()
        })
        .finally(() => {
          this.isExtendedViewCancelButtonDisabled = false
        })
    },
    handleDelete(selectedRow) {
      this.changeDeleteGroupModalStatus(true)
      this.selectedRow = selectedRow
    },
    exportTargetGroupsList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.tableCredientials.filter
        }
        exportTargetGroups(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Target Groups.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },
    onEditClick({ selected: selections, isEditPopupOpen }) {
      if (isEditPopupOpen) {
        this.extendedViewLoading = false
        this.extendedViewValue = [...selections]
      }
    },
    handleDeleteGroupMultiple(selection) {
      selection.forEach((item) => this.handleDeleteGroup(item))
    },
    handleDeleteGroup(selectedRow) {
      deleteTargetGroup(selectedRow.resourceId)
        .then(() => {
          this.$refs.refGroupsTable.unSelectRow(selectedRow)
          this.callForTargetGroups()
        })
        .catch((error) => {
          this.bulkDeleteErrorMessage = error?.response?.data?.message
        })
    },
    columnFilterChanged(filter) {
      this.tableCredientials.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.tableCredientials
      )
      this.callForTargetGroups()
    },
    columnFilterCleared(fieldName) {
      this.tableCredientials.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.tableCredientials
      )
      this.callForTargetGroups()
    }
  },

  created() {
    const storeOfGroupTable = this?.$store?.state['datatable']?.tables['Groups']
    const tableState = storeOfGroupTable && storeOfGroupTable.tableState
    if (this.isLoadState && tableState) {
      this.serverSideProps = tableState.serverSideProps
      const { filterValues = {} } = tableState
      if (Object.keys(filterValues).length) {
        for (const [key, value] of Object.entries(filterValues)) {
          if (value.selectValue === 'between') {
            this.tableCredientials.filter.FilterGroups[0].FilterItems.push({
              Value: value.textValue[0],
              FieldName: key,
              Operator: '>='
            })
            this.tableCredientials.filter.FilterGroups[0].FilterItems.push({
              Value: value.textValue[1],
              FieldName: key,
              Operator: '<='
            })
          } else {
            this.tableCredientials.filter.FilterGroups[0].FilterItems.push({
              Value: value.textValue,
              FieldName: key,
              Operator: value.selectValue
            })
          }
        }
      }
      this.tableState = { persistentState: tableState }
    }
    if (!this.isLoadState || !tableState) {
      this.callForTargetGroups()
    }
    this.showNewUserGroupModal = this.isOpenTargetGroupModalOnCreated
  },
  beforeDestroy() {
    const tableState = {
      ...this.$refs.refGroupsTable.getState(),
      serverSideProps: this.serverSideProps
    }
    this.$store.dispatch('datatable/setTable', {
      key: 'Groups',
      tableState
    })
  }
}
</script>
