<template>
  <div class="people">
    <delete-user-modal
      :is-show="isWantToShowDeleteUserModal"
      :selectedRow="selectedRow"
      :isMultiple="isMultipleDelete"
      @deleteAction="handleDeleteUser"
      @deleteMultiple="handleDeleteUsers"
      v-if="isWantToShowDeleteUserModal"
      @changeModalStatus="changeDeleteModalStatus"
    />
    <add-users-manually-modal
      :is-show="isWantToShowAddUsersManuallyModal"
      v-if="isWantToShowAddUsersManuallyModal"
      @changeModalStatus="changeAddUsersManuallyModalStatus"
    />
    <add-user-modal
      :status="isWantToShowAddUsersModal"
      @closeAddUserModal="closeAddUserModal"
      @closeAddUserModalWithUpdate="closeAddUserModalWithUpdate"
      :editData="selectedRow"
      v-if="isWantToShowAddUsersModal"
    />
    <custom-fields-modal
      :status="isWantToShowCustomFieldsModal"
      @closeCustomFieldsModal="toggleCustomFieldsModal"
      @closeCustomFieldsModalWithUpdate="closeCustomFieldsModalWithUpdate"
      v-if="isWantToShowCustomFieldsModal"
    />
    <target-user-import-from-a-file
      :status="isWantToImportFile"
      @closeAddUserModal="closeImportModal"
      @closeOverlay="isWantToImportFile = false"
      v-if="isWantToImportFile"
      :columns="tableOptions.columns"
    />
    <datatable
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :addButton="tableOptions.addButton"
      :columns="tableOptions.columns"
      :countRow="5"
      id="target-users-people-data-table"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'peopleTable'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      :settingsPopupStyle="{ top: '-15px' }"
      :setClassName="setCellClassName"
      @addToGroup="handleAddToGroup"
      @createGroupWithUser="handleCreateGroupWithUser"
      @submenuItemClick="handleSubMenuItemClick"
      @syncUser="handleSyncUser"
      @deleteAction="handleDelete"
      ref="refPeopleTable"
      :isDownloadable="false"
      @editTargetUsers="handleEditTargetUsers"
      @onEmptyBtnClicked="isWantToShowAddUsersModal = true"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @handleMultipleDelete="handleMultipleDelete"
    >
      <template v-slot:addUsers>
        <v-menu :offset-y="true" bottom left>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn class="btn-add mr-1" icon v-on="{ ...tooltip, ...menu }">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">{{ 'Add User' }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item :key="item" @click="handleAddUsers(item)" v-for="item in addUsersItems">
              <v-list-item-title class="add-users__title">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:settings-popup-body>
        <div class="edit-fields" @click="handleEditFieldsClick">
          EDIT FIELDS
        </div>
      </template>
    </datatable>
  </div>
</template>

<script>
import Datatable from '../../components/DataTable'
import DeleteUserModal from './DeleteUserModal'
import AddUsersManuallyModal from './AddUsersManuallyModal'
import AddUserModal from './AddUserModal'
import {
  deleteTargetUser,
  getTargetUserCustomFieldsByCompanyId,
  getTargetUsers
} from '@/api/targetUsers'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import CustomFieldsModal from './CustomFieldsModal'
import TargetUserImportFromAFile from './TargetUserImportFromAFile'
export default {
  name: 'People',
  components: {
    CustomFieldsModal,
    DeleteUserModal,
    Datatable,
    AddUsersManuallyModal,
    AddUserModal,
    TargetUserImportFromAFile
  },
  data: () => ({
    tableCredientials: {
      pageNumber: 1,
      pageSize: 500,
      orderBy: 'CreateTime',
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
    },
    isWantToImportFile: false,
    tableData: [],
    loading: true,
    isMultipleDelete: false,
    isWantToShowDeleteUserModal: false,
    selectedSyncIndex: null,
    isWantToShowAddUsersManuallyModal: false,
    selectedRow: null,
    customFields: [],
    isWantToShowAddUsersModal: false,
    showPopupModal: false,
    isWantToShowImportUsersFromFileModal: false,
    isWantToShowCustomFieldsModal: false,
    items: [
      { title: 'Click Me1' },
      { title: 'Click Me2' },
      { title: 'Click Me3' },
      { title: 'Click Me4' }
    ],
    tableOptions: {
      isColumnFilterActive: false,
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
          fullWidth: true
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
          fullWidth: true
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
          width: 180
        }
      ],
      columns: [],
      defaultColumns: [
        // Should be defined to show the table
        {
          property: PROPERTY_STORE.FIRSTNAME,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.FIRSTNAME),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'text'
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
          filterableType: 'text'
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
          filterableType: 'text'
        },
        {
          property: PROPERTY_STORE.DEPARTMENT,
          align: 'left',
          editable: false,
          label: getStoreValue(PROPERTY_STORE.DEPARTMENT),
          sortable: true,
          show: true,
          type: 'text',
          width: 150,
          filterableType: 'text'
        }
      ],
      pageSizes: [5, 10, 25],
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: true,
        download: false
      },
      iEmpty: {
        message: LABEL_STORE.NO_TARGET_USER_ADDED,
        btn: 'ADD A USER',
        icon: 'mdi-account-plus'
      },
      addButton: {
        show: true,
        action: 'addButton'
      },
      rowActions: [
        {
          name: 'Edit this row',
          icon: 'mdi-pencil',
          action: 'editTargetUsers',
          isNotShow: true
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          action: 'deleteAction'
        }
      ]
    },

    addUsersItems: ['Add users manually', 'Import from a file']
  }),
  methods: {
    closeImportModal() {
      this.isWantToImportFile = false
    },
    toggleCustomFieldsModal() {
      this.isWantToShowCustomFieldsModal = !this.isWantToShowCustomFieldsModal
    },
    handleAddUsers(item) {
      switch (item) {
        case this.addUsersItems[0]:
          this.selectedRow = null
          this.isWantToShowAddUsersModal = true
          break
        case this.addUsersItems[1]:
          this.isWantToImportFile = true
          break
        default:
          break
      }
    },
    closeCustomFieldsModalWithUpdate() {
      this.toggleCustomFieldsModal()
      this.callForGetTargetUserCustomFieldsByCompanyId()
    },
    closeAddUserModalWithUpdate() {
      this.isWantToShowAddUsersModal = false
      this.callForTargetUsers()
    },
    handleEditTargetUsers(selectedRow) {
      this.selectedRow = selectedRow
      this.isWantToShowAddUsersModal = true
    },
    handleEditFieldsClick() {
      this.toggleCustomFieldsModal()
    },
    setCellClassName(obj) {
      if (obj.rowIndex === this.selectedSyncIndex && obj.columnIndex === 8) {
        return 'clock-wise'
      }
    },
    handleAddToGroup(row) {},
    handleCreateGroupWithUser(row) {},
    handleSubMenuItemClick(exportType) {},
    handleSyncUser(scope) {
      this.selectedSyncIndex = scope.$index
      this.tableOptions.rowActions = [
        {
          name: 'Sync User',
          icon: 'mdi-sync',
          action: 'syncUser'
        }
      ]
      setTimeout(() => {
        this.tableOptions.rowActions = [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'edit',
            isNotShow: true
          },
          {
            name: 'Add to a group',
            icon: 'mdi-account-multiple-plus',
            action: 'addToGroup'
          },
          {
            name: 'Create a group with user',
            icon: 'mdi-account-multiple',
            action: 'createGroupWithUser'
          },
          {
            name: 'Download',
            icon: 'mdi-download',
            action: 'download',
            subElements: ['PDF', 'CSV', 'XLS']
          },
          {
            name: 'Sync User',
            icon: 'mdi-sync',
            action: 'syncUser'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete'
          }
        ]
        this.selectedSyncIndex = null
      }, 5000)
    },
    handleMultipleDelete(selections = []) {
      this.isMultipleDelete = true
      this.changeDeleteModalStatus(true)
      this.selectedRow = selections
    },
    handleDelete(row) {
      this.isMultipleDelete = false
      this.changeDeleteModalStatus(true)
      this.selectedRow = row
    },
    closeAddUserModal() {
      this.isWantToShowAddUsersModal = false
    },
    changeDeleteModalStatus(status) {
      this.isWantToShowDeleteUserModal = status
    },
    changeAddUsersManuallyModalStatus(status) {
      this.isWantToShowAddUsersManuallyModal = status
    },
    handleDeleteUsers(selections) {
      selections.forEach((item) => this.handleDeleteUser(item))
    },
    handleDeleteUser(selectedUser) {
      deleteTargetUser(selectedUser.resourceId).then((response) => {
        if (response.data && response.data.message) {
          this.$store.dispatch('common/createSnackBar', {
            message: 'Target user has been deleted',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.callForTargetUsers()
        }
      })
    },
    callForTargetUsers() {
      this.loading = true
      getTargetUsers(this.tableCredientials)
        .then((response) => {
          let data = response.data.data.results.map((item, index) => {
            const { customFieldValues } = item
            for (let { name, value } of customFieldValues) {
              item[name] = value
            }
            return item
          })
          debugger

          this.tableData = data
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    callForGetTargetUserCustomFieldsByCompanyId() {
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

          const columnsOfCustomFields = this.customFields.map((field) => {
            return {
              property: field.name,
              type: 'text',
              sortable: true,
              filterable: true,
              label: field.name,
              align: 'left',
              show: true,
              width: 60 + field.name.length * 7
            }
          })
          this.tableOptions.columns = [
            ...this.tableOptions.defaultColumns,
            ...columnsOfCustomFields,
            ...this.tableOptions.lastColumns
          ]
        })
        .catch(() => {
          this.tableOptions.columns = [
            ...this.tableOptions.defaultColumns,
            ...this.tableOptions.lastColumns
          ]
        })
        .finally(() => {
          this.callForTargetUsers()
        })
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.tableCredientials.filter.FilterGroups[0].FilterItems
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
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.tableCredientials.filter.FilterGroups[0].FilterItems = requestBody
      this.callForTargetUsers()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.tableCredientials.filter.FilterGroups[0].FilterItems

      filterPayload.map((x) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.tableCredientials.filter.FilterGroups[0].FilterItems = filterPayload
      this.callForTargetUsers()

      this.tableOptions.isColumnFilterActive =
        this.tableCredientials.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },
  created() {
    // this.tableOptions.columns = [...this.tableOptions.columns, ...this.tableOptions.lastColumns]
    this.callForGetTargetUserCustomFieldsByCompanyId()
  },
  mounted() {}
}
</script>

<style lang="scss">
.people {
  padding-top: 24px;
  .add-users__title {
    font-size: 14px;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .edit-fields {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
    margin-top: 10px;
    cursor: pointer;
    color: #2196f3;
  }
  .btn-add {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5);
    background-color: #2196f3;
    color: white;

    .v-icon {
      font-size: 18px !important;
      color: white;
    }
  }
}
.clock-wise {
  .cell {
    * {
      visibility: visible !important;
    }
  }
  i {
    animation: antiClockwiseSpin 1s infinite ease-in;
    animation-delay: 0s;
    color: #2196f3 !important;
  }
}
@keyframes antiClockwiseSpin {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
