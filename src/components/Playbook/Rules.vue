<template>
  <div class="playbook-rules">
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
      @addAction="toggleRuleModal"
    />
    <v-dialog
      v-model="this.showRuleModal"
      fullscreen
      scrollable
      @input="(v) => v || toggleRuleModal()"
    >
      <CreateOrEditRule @cancelForm="toggleRuleModal" />
    </v-dialog>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import CreateOrEditRule from './CreateOrEditRule'
import { mapActions, mapGetters, mapState } from 'vuex'
import { getStoreValue, PROPERTY_STORE } from '../../model/constants/commonConstants'

export default {
  name: 'Rules',
  components: {
    DataTable,
    CreateOrEditRule
  },
  data() {
    return {
      showRuleModal: false,
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.NAME,
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
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
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
            property: PROPERTY_STORE.CREATEDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),

            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            hasTooltip: true
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
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
    toggleRuleModal() {
      return (this.showRuleModal = !this.showRuleModal)
    }
  },
  mounted() {
    this.getPlaybookList(this.tableCredientials).then(() => {
      this.$refs.refRulesList.loadWithDataArray(this.playbookList.results)
    })
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

<style lang="scss">
.playbook-rules {
  .overlay {
    background: white;
    width: 100vw;
    height: 100vh;
  }
}
</style>
