<template>
  <div class="target-users-groups">
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
              <span class="tooltip-span">{{ 'Add Groups' }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item :key="item" @click="handleAddGroups(item)" v-for="item in addGroupsItems">
              <v-list-item-title class="add-users__title">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </datatable>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import { getTargetGroups } from '../../api/targetUsers'

export default {
  name: 'Groups',
  components: {
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
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'link',
            href: '/target-groups',
            hrefKey: 'resourceId',
            minWidth: 33,
            isEditable: true,
            editComponent: 'textfield'
          },
          {
            property: 'priority',
            align: 'center',
            editable: false,
            label: 'Priority',
            sortable: true,
            show: true,
            type: 'priority',
            isEditable: true,
            editComponent: 'select',
            editComponentItems: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
            minWidth: 33
          },
          {
            property: 'createDate',
            align: 'left',
            editable: false,
            label: 'Create Date',
            sortable: true,
            show: true,
            type: 'text',
            isEditable: true,
            minWidth: 33
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
      addGroupsItems: ['Create User Group', 'Create Smart Group']
    }
  },
  methods: {
    handleSyncWithLDAP(row) {},
    handleAddGroups(item) {
      console.log('item', item)
      switch (item) {
        case this.addGroupsItems[0]:
          break
        case this.addGroupsItems[1]:
          break
        default:
          break
      }
    }
  },
  created() {
    getTargetGroups().then((response) => {
      const { data } = response.data
      this.$refs.refGroupsTable.loadWithDataArray(data)
    })
  }
}
</script>

<style lang="scss">
.target-users-groups {
  padding-top: 24px;
}
</style>
