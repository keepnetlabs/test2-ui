<template>
  <div class="playbook-rules">
    <app-dialog
      :status="isWantToDelete"
      icon="mdi-alert"
      size="big"
      title="Delete Playbook Rule"
      :subtitle="deleteMessage(deleteValues)"
      @changeStatus="isWantToDelete = false"
      body="Do you want to delete playbook rule?"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-space-between flex-row">
          <div>
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#f56c6c"
              @click="isWantToDelete = false"
              >CANCEL
            </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn
              class="pa-0 k-dialog__button"
              text
              color="#2196f3"
              @click="isWantToDeleteRuleConfirm(true)"
              >Delete
            </v-btn>
          </div>
        </div>
      </template>
    </app-dialog>

    <datatable
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
      :selectEvent="tableOptions.selectEvent"
      @deleteFunction="deleteRule($event)"
      @addAction="toggleRuleModal"
      @onEmptyBtnClicked="toggleRuleModal"
      @downloadEvent="exportPlaybookRules"
      @deleteAction="deleteRule($event)"
      @editAction="handleEdit"
    >
      <template v-slot:datatable-column-popup="{ scope, col }">
        <span v-if="scope.row[col.property] === 0">
          No Matches
        </span>
        <span v-else @click="matchingPopupClick(scope.row)" class="popup-link">
          {{ scope.row[col.property] === 0 ? 'No' : scope.row[col.property] }} Matches
        </span>
        <app-dialog
          :status="scope.row.resourceId === selectedMatch.resourceId"
          icon="mdi-email"
          title="Matching Incidents"
          v-if="showMatchingModal"
          :subtitle="getSelectedMatchingIncidentsSubtitle"
          @changeStatus="showMatchingModal = false"
          size="maximum"
          class-name="matching-modal"
        >
          <template v-slot:app-dialog-body>
            <v-card light>
              <v-list-item class="matching-modal__list-item">
                <v-list-item-content>
                  <datatable
                    :refName="'matchingInvestigationPlaybookRules'"
                    ref="refmatchingInvestigationPlaybookRules"
                    :columns="matchingInvestigationPlaybookRules.columns"
                    :countRow="5"
                    :pageSizes="[5, 10, 20, 50, 100]"
                    :border="false"
                    :showHeader="true"
                    :defaultSort="'subject'"
                    :selectable="false"
                    :filterable="true"
                    :options="true"
                    :rowActions="[]"
                    :cell-padding="15"
                    class="no-sub-border-datatable"
                    :empty="matchingInvestigationPlaybookRules.iEmpty"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </template>
          <template v-slot:app-dialog-footer>
            <div class="d-flex" style="justify-content: flex-end;">
              <v-btn
                class="pa-0 k-dialog__button"
                text
                color="#2196f3"
                @click="showMatchingModal = false"
                >CLOSE
              </v-btn>
            </div>
          </template>
        </app-dialog>
      </template>
    </datatable>

    <v-dialog v-model="showRuleModal" fullscreen scrollable @input="(v) => v || toggleRuleModal()">
      <CreateOrEditRule
        :playbookId="selectedPlaybookId"
        @cancelForm="toggleRuleModal"
        @cancelFormWithUpdate="updateTable"
        v-if="showRuleModal"
      />
    </v-dialog>
  </div>
</template>

<script>
import Datatable from '../DataTable'
import CreateOrEditRule from './CreateOrEditRule'
import { mapActions, mapGetters, mapState } from 'vuex'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import { getMatchingIncidents } from '../../api/incidentResponder'
import AppDialog from '../AppDialog'
import { exportPlaybookRules, deletePlaybookRule } from '../../api/playbook'

export default {
  name: 'Rules',
  components: {
    Datatable,
    CreateOrEditRule,
    AppDialog
  },
  props: {
    playbookId: {
      type: String
    }
  },
  data() {
    return {
      showRuleModal: false,
      selectedMatch: null,
      showMatchingModal: false,
      isWantToDelete: false,
      deleteValues: null,
      selectedPlaybookId: null,
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
            fixed: 'left',
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
            width: 150,
            minWidth: 100
          },
          {
            property: 'matchCount',
            align: 'left',
            editable: false,
            label: 'Matching Incidents',
            fixed: false,
            sortable: false,
            show: true,
            type: 'popup',
            minWidth: '80',
            width: 170,
            emptyText: 'No Match'
          },
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
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 225,
            hasTooltip: true
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.PRIORITY,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.PRIORITY),
            fixed: false,
            sortable: true,
            show: true,
            type: 'priority',
            width: 225,
            hasTooltip: true
            //minWidth: 80
          }
        ],
        empty: {
          message: 'You do not have any rules, yet',
          btn: 'ADD A RULE',
          icon: 'mdi-plus'
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
          action: 'addAction',
          tooltip: 'Add a Rule'
        },
        selectEvent: {
          clipboard: true,
          delete: true
        }
      },
      tableCredientials: {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'CreateDate',
        ascending: false,
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
      },
      matchingInvestigationPlaybookRules: {
        table: [],
        columns: [
          {
            property: 'subject',
            align: 'left',
            editable: false,
            label: 'Subject',
            fixed: false,
            sortable: false,
            show: true,
            type: 'text',
            minWidth: '33'
          },
          {
            property: 'createDate',
            align: 'left',
            editable: false,
            label: getStoreValue('createDate'),
            fixed: false,
            sortable: false,
            show: true,
            type: 'text',
            minWidth: '33'
          },
          {
            property: 'reportedBy',
            align: 'left',
            editable: false,
            label: getStoreValue('reportedBy'),
            fixed: false,
            sortable: false,
            show: true,
            type: 'text',
            minWidth: '34'
          }
        ],
        addUsers: {
          show: false,
          popUp: false
        },
        addMenu: {
          show: false,
          popUp: false
        },
        iEmpty: {
          message: "There isn't any matching Incidents, yet",
          btn: '',
          icon: 'mdi-plus'
        },
        chartOptions: {}
      }
    }
  },
  methods: {
    ...mapActions({
      getPlaybookList: 'playbook/getPlaybookList'
    }),
    toggleRuleModal() {
      this.selectedPlaybookId = null
      return (this.showRuleModal = !this.showRuleModal)
    },
    handleEdit(row) {
      this.selectedPlaybookId = row.resourceId
      this.showRuleModal = true
    },
    updateTable() {
      this.toggleRuleModal()
      this.getPlaybookList(this.tableCredientials).then(() => {
        this.$refs.refRulesList.loadWithDataArray(this.playbookList.results)
      })
    },
    matchingPopupClick(match) {
      this.selectedMatch = match
      this.showMatchingModal = true
      const payload = {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'CreateDate',
        ascending: true
      }
      getMatchingIncidents(payload, match.resourceId)
        .then((response) => {
          const tableData = response.data.data
          this.$refs.refmatchingInvestigationPlaybookRules.loadWithDataArray(
            tableData.results || []
          )
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            errorState: true,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting the matching rules!'
          })
        })
    },
    exportPlaybookRules({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: 'CreateDate',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }
        exportPlaybookRules(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Playbook Rules.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch((error) => {})
      })
    },
    deleteRule(value, multi) {
      let isArray = Array.isArray(value)
      this.totalSelectedItemsCount = isArray ? value.length : 1
      this.isWantToDelete = true
      this.deleteValues = value
    },
    isWantToDeleteRuleConfirm(val, message) {
      let values = []
      let _this = this
      if (this.totalSelectedItemsCount > 1) {
        for (const [key, value] of Object.entries(this.deleteValues)) {
          values.push(value.resourceId)
        }
      } else {
        values.push(this.deleteValues.resourceId || this.deleteValues[0].resourceId)
      }
      values.map((item) => {
        deletePlaybookRule(item)
          .then((response) => {
            _this.$store.dispatch('common/createSnackBar', {
              errorState: true,
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
              message: 'Playbook rule deleted successfully!'
            })
            this.isWantToDelete = false
            _this.getPlaybookList(_this.tableCredientials).then(() => {
              _this.$refs.refRulesList.loadWithDataArray(_this.playbookList.results)
            })
          })
          .catch((error) => {
            _this.$store.dispatch('common/createSnackBar', {
              errorState: true,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message: 'Error when getting the matching rules!'
            })
          })
      })
    },
    deleteMessage(item) {
      const nameValues =
        this.totalSelectedItemsCount > 1
          ? `${this.totalSelectedItemsCount} rules`
          : item && item.name
      return `${nameValues} will be deleted!`
    }
  },
  mounted() {
    this.getPlaybookList(this.tableCredientials).then(() => {
      this.$refs.refRulesList.loadWithDataArray(this.playbookList.results)
    })

    if (this.playbookId) {
      this.selectedPlaybookId = this.playbookId
      this.showRuleModal = true
    }
  },

  computed: {
    ...mapGetters({
      playbookList: 'playbook/playbookListGetter'
    }),
    ...mapState({
      playbookList: (state) => state.playbook.playbookList
    }),
    getSelectedMatchingIncidentsSubtitle() {
      return this.selectedMatch && `Incidents matching Rule: ${this.selectedMatch.name}`
    }
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
