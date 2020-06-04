<template>
  <div class="rules">
    <data-table
      ref="refRulesList"
      :refName="'rulesListTable'"
      :columns="tableOptions.columns"
      :countRow="5"
      :selectable="true"
      :filterable="true"
      :options="true"
      :sizeable="true"
      :row-actions="tableOptions.rowActions"
      :pageSizes="tableOptions.pageSizes"
      :empty="tableOptions.empty"
      :addButton="tableOptions.addButton"
      @deleteAction="handleDelete"
      @addAction="handleAdd"
    />
    <v-overlay :value="this.isCreateNewRule" :z-index="15">
      <div class="overlay">
        <CreateNewRule />
      </div>
    </v-overlay>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import CreateNewRule from './CreateNewRule'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Users',
  components: {
    DataTable,
    CreateNewRule
  },
  data() {
    return {
      isCreateNewRule: false,
      tableOptions: {
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Rule Name',
            sortable: true,
            show: true,
            type: 'text',
            width: 175
            //minWidth: 80
          },
          {
            property: 'description',
            align: 'left',
            editable: false,
            label: 'Description',
            sortable: true,
            show: true,
            type: 'text',
            //width: 250,
            minWidth: 100
          },
          /*{
            property: 'company',
            align: 'left',
            editable: false,
            label: 'Company',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 125
            //minWidth: 80
          },*/
          {
            property: 'createDate',
            align: 'left',
            editable: false,
            label: 'Created',

            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180
            //minWidth: 80
          },
          {
            property: 'status',
            align: 'left',
            editable: false,
            label: 'Status',
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            hasTooltip: true
            //minWidth: 80
          },
          {
            property: 'priority',
            align: 'left',
            editable: false,
            label: 'Priority',
            fixed: false,
            sortable: true,
            show: true,
            type: 'priority',
            width: 160,
            hasTooltip: true
            //minWidth: 80
          }
        ],
        empty: {
          message: 'No rules are showing',
          subMes: 'Add Rule',
          btn: 'Add Rule',
          icon: 'mdi-account-plus'
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        addButton: {
          show: true,
          action: 'addAction'
        }
      },
      tableCredientials: {
        pageNumber: 1,
        pageSize: 3,
        orderBy: 'Name',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'Status',
                  Operator: '=',
                  Value: 'Active'
                }
              ],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getPlaybookList: 'playbook/getPlaybookList'
    }),
    handleDelete(row) {},
    handleAdd() {
      this.isCreateNewRule = !this.isCreateNewRule
    }
  },
  mounted() {
    this.getPlaybookList(this.tableCredientials)
    this.$refs.refRulesList.loadWithDataArray(this.playbookList.results)
    /* this.$refs.refRulesList.loadWithDataArray([
      {
        ruleName: 'Ransomware',
        description: 'Rule for ransomware',
        company: 'Company name',
        created: '08.17.2019',
        status: 'Active',
        priority: 'Low'
      },
      {
        ruleName: 'BankDecont.xls',
        description: 'Investigates and deletes emails with attachment named BankDecont.xls',
        company: 'Company name',
        created: '08.17.2019',
        status: 'Inactive',
        priority: 'Very Low'
      }
    ])*/
  },
  computed: {
    ...mapGetters({
      playbookList: 'playbook/playbookListGetter'
    }),
    ...mapState({
      playbookList: (state) => state.playbook.playbookList
    })
  }
}
</script>

<style lang="scss" scoped>
.rules {
  .overlay {
    background: white;
    width: 100vw;
    height: 100vh;
  }
}
</style>
