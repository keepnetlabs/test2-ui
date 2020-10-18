<template>
  <div class="target-users-groups">
    <create-new-user-group-modal
      :status="showNewUserGroupModal"
      @changeNewUserGroupStatus="changeNewUserGroupStatus"
      @handleSave="callForCreateNewUserGroup"
    />
    <delete-group-modal
      :status="showDeleteGroupModal"
      @changeDeleteGroupModalStatus="changeDeleteGroupModalStatus"
      @handleDelete="handleDeleteGroup"
      @handleMultipleDelete="handleDeleteGroupMultiple"
      :selected-row="selectedRow"
    />
    <DatatableLoading :loading="loading">
      <template v-slot:skeleton-content>
        <datatable
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :table="tableData"
          :columns="tableOptions.columns"
          :countRow="5"
          :empty="tableOptions.iEmpty"
          :filterable="true"
          :options="true"
          :pageSizes="tableOptions.pageSizes"
          :refName="'groupsTable'"
          :rowActions="tableOptions.rowActions"
          :extended-view-options="tableOptions.extendedViewOptions"
          :extendedViewValue="extendedViewValue"
          :selectEvent="tableOptions.selectEvent"
          @handleMultipleDelete="handleMultipleDelete"
          :selectable="true"
          ref="refGroupsTable"
          @syncWithLDAP="handleSyncWithLDAP"
          @handleEdit="handleEdit"
          @onEditClick="onEditClick"
          @delete="handleDelete"
          @onEmptyBtnClicked="showNewUserGroupModal = true"
          titleKey="name"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
        >
          <template v-slot:addUsers>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  class="btn-add mr-1"
                  icon
                  v-on="{ ...tooltip }"
                  @click.native="showNewUserGroupModal = true"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">{{ 'Add Groups' }}</span>
            </v-tooltip>
          </template>
        </datatable>
      </template>
    </DatatableLoading>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  getTargetGroups,
  createTargetGroup,
  updateTargetGroup,
  deleteTargetUser,
  deleteTargetGroup,
  searchTargetGroups
} from '@/api/targetUsers'
import CreateNewUserGroupModal from './CreateNewUserGroupModal'
import DatatableLoading from '../SkeletonLoading/DatatableLoading'
import DeleteGroupModal from './DeleteGroupModal'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import { required } from '@/utils/validations'

export default {
  name: 'Groups',
  components: {
    DeleteGroupModal,
    CreateNewUserGroupModal,
    datatable: DataTable,
    DatatableLoading
  },
  data() {
    return {
      loading: true,
      tableData: [],
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: 'resourceId',
            show: false
          },
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'link',
            href: '/target-groups',
            hrefKey: 'resourceId',
            width: 300,
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
            width: 300
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            sortable: true,
            show: true,
            type: 'text',
            isEditable: true,
            width: 300
          }
        ],
        pageSizes: [5, 10, 25],
        selectEvent: {
          clipboard: true,
          edit: true,
          delete: true,
          download: false
        },
        iEmpty: {
          message: LABEL_STORE.NO_TARGET_GROUPS_DEFINED,
          btn: 'ADD A GROUP',
          icon: 'mdi-plus'
        },
        rowActions: [
          {
            name: 'Edit this row',
            icon: 'mdi-pencil',
            action: 'edit',
            isNotShow: true
          },
          {
            name: 'Sync With LDAP',
            icon: 'mdi-account-multiple-plus',
            action: 'syncWithLDAP'
          },
          {
            name: 'Download',
            icon: 'mdi-download',
            action: 'download',
            subElements: ['PDF', 'CSV', 'XLS']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'delete'
          }
        ],
        extendedViewOptions: {
          titleKey: 'name',
          footer: [
            {
              label: 'Date Created',
              key: 'createDate'
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
                props: {
                  rules: [(v) => required(v, 'Required')]
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
      addGroupsItems: ['Create User Group', 'Create Smart Group'],
      showNewUserGroupModal: false,
      showDeleteGroupModal: false,
      selectedRow: {},
      extendedViewValue: [],
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
      }
    }
  },
  methods: {
    handleSyncWithLDAP(row) {},
    handleAddGroups(item) {
      switch (item) {
        case this.addGroupsItems[0]:
          this.changeNewUserGroupStatus(true)
          break
        case this.addGroupsItems[1]:
          break
        default:
          break
      }
    },
    handleMultipleDelete(selection) {
      this.selectedRow = selection
      this.changeDeleteGroupModalStatus(true)
    },
    callForCreateNewUserGroup(group) {
      createTargetGroup(group)
        .then(() => {
          this.changeNewUserGroupStatus(false)
          this.$store.dispatch('common/createSnackBar', {
            message: `New group named ${group.name} created`,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-information',
            action: {
              link: '/',
              label: 'VIEW',
              linkType: 'text'
            }
          })
          this.callForTargetGroups()
        })
        .catch((error) => {
          //this.showNewUserGroupModal = false
        })
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
      searchTargetGroups(this.tableCredientials)
        .then((response) => {
          let data = response.data.data
          this.tableData = data.results.length ? data.results : []
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    callForDeleteGroup() {
      //TODO
    },
    callForUpdateTargetGroup(payload) {
      updateTargetGroup(payload)
        .then(() => {
          this.callForTargetGroups()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            message: error.message,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR
          })
        })
    },
    handleDelete(selectedRow) {
      this.changeDeleteGroupModalStatus(true)
      this.selectedRow = selectedRow
    },
    onEditClick({ selected: selections, isEditPopupOpen }) {
      if (isEditPopupOpen) {
        this.extendedViewValue = [...selections]
      }
    },
    handleDeleteGroupMultiple(selection) {
      selection.forEach((item) => this.handleDeleteGroup(item))
    },
    handleDeleteGroup(selectedRow) {
      deleteTargetGroup(selectedRow.resourceId)
        .then((response) => {
          if (response.data && response.data.message) {
            this.$store.dispatch('common/createSnackBar', {
              message: response.data.message,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              icon: 'mdi-check-circle-outline'
            })
            this.callForTargetGroups()
          }
        })
        .catch(() => {})
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
      this.callForTargetGroups()
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
      this.callForTargetGroups()

      this.tableOptions.isColumnFilterActive =
        this.tableCredientials.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },
  created() {
    this.callForTargetGroups()
  }
}
</script>

<style lang="scss">
.target-users-groups {
  padding-top: 24px;
}
</style>
