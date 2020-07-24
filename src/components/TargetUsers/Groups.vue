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
      :selected-row="selectedRow"
    />
    <datatable
      :columns="tableOptions.columns"
      :countRow="5"
      :empty="tableOptions.iEmpty"
      :filterable="true"
      :options="true"
      :pageSizes="tableOptions.pageSizes"
      :refName="'groupsTable'"
      :rowActions="tableOptions.rowActions"
      :selectEvent="tableOptions.selectEvent"
      :selectable="true"
      ref="refGroupsTable"
      @syncWithLDAP="handleSyncWithLDAP"
      @handleEdit="handleEdit"
      @delete="handleDelete"
      @onEmptyBtnClicked="showNewUserGroupModal = true"
      titleKey="name"
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
  </div>
</template>

<script>
import DataTable from '../DataTable'
import {
  getTargetGroups,
  createTargetGroup,
  updateTargetGroup,
  deleteTargetUser,
  deleteTargetGroup
} from '../../api/targetUsers'
import CreateNewUserGroupModal from './CreateNewUserGroupModal'

import DeleteGroupModal from './DeleteGroupModal'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import { required } from '../../utils/validations'

export default {
  name: 'Groups',
  components: {
    DeleteGroupModal,
    CreateNewUserGroupModal,
    datatable: DataTable
  },
  data() {
    return {
      tableOptions: {
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
            property: PROPERTY_STORE.CREATEDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            sortable: true,
            show: true,
            type: 'text',
            isEditable: true,
            width: 300
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        selectEvent: {
          clipboard: true,
          edit: true,
          delete: true,
          download: true
        },
        iEmpty: {
          message: 'You do not have any groups, yet',
          subMes: 'Start now',
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
        ]
      },
      addGroupsItems: ['Create User Group', 'Create Smart Group'],
      showNewUserGroupModal: false,
      showDeleteGroupModal: false,
      selectedRow: {}
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
    callForCreateNewUserGroup(group) {
      createTargetGroup(group)
        .then((response) => {
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
      getTargetGroups().then((response) => {
        const { data } = response.data
        this.$refs.refGroupsTable.loadWithDataArray(data)
      })
    },
    callForDeleteGroup() {
      //TODO
    },
    callForUpdateTargetGroup(payload) {
      updateTargetGroup(payload)
        .then((response) => {
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
        .catch((error) => {})
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
