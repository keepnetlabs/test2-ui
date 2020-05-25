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
        <CreateNewRule/>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import CreateNewRule from "./CreateNewRule"

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
            property: 'ruleName',
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
          {
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
          },
          {
            property: 'created',
            align: 'left',
            editable: false,
            label: 'Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 80,
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
      }
    }
  },
  methods: {
    handleDelete(row) {

    },
    handleAdd() {
      this.isCreateNewRule = !this.isCreateNewRule;
    }
  },
  mounted() {
    this.$refs.refRulesList.loadWithDataArray([
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
    ])
    if (this.$route.query.openPopup) {
      this.isCreateNewRule = true
    }
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
