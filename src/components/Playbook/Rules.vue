<template>
  <div class="playbook-rules">
    <app-dialog
      :status="isWantToDelete"
      icon="mdi-alert"
      title="Delete Playbook Rule"
      :subtitle="deleteMessage(deleteValues)"
      @changeStatus="isWantToDelete = false"
      body="Do you want to delete playbook rule?"
      v-if="getDeleteModalPermission"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          :confirm-button-disabled="deleteButtonDisabled"
          @handleClose="isWantToDelete = false"
          @handleConfirm="isWantToDeleteRuleConfirm(true)"
        />
      </template>
    </app-dialog>
    <app-dialog
      :status="showMatchingModal"
      icon="mdi-email"
      :title="labels.MatchingIncidents"
      v-if="getMatchingModalRenderStatus"
      :subtitle="getSelectedMatchingIncidentsSubtitle"
      @changeStatus="toggleMatchingModal"
      size="maximum"
      class-name="matching-modal"
      maxHeightSize="665"
    >
      <template v-slot:app-dialog-body>
        <v-card light>
          <v-list-item class="matching-modal__list-item">
            <v-list-item-content>
              <datatable
                :refName="'matchingInvestigationPlaybookRules'"
                :table="matchingPlaybookData"
                :columns="matchingInvestigationPlaybookRules.columns"
                :pageSizes="[5, 10, 25]"
                :show-all-records="showAllRecordsMatchingPopup"
                :showHeader="true"
                :count-row="5"
                :loading="isMatchingTableLoading"
                :defaultSort="'subject'"
                :selectable="false"
                :download-button="getMatchingModalDownloadButton"
                :filterable="true"
                :options="true"
                :rowActions="[]"
                :cell-padding="15"
                :empty="matchingInvestigationPlaybookRules.iEmpty"
                @refreshAction="matchingPopupClick(selectedMatch, false)"
                @on-all-records-button-click="handleAllRecordsMatchingPopupClick"
              />
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="toggleMatchingModal"
            >{{ labels.Close.toUpperCase() }}
          </v-btn>
        </div>
      </template>
    </app-dialog>
    <datatable
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      :show-all-records="showAllRecords"
      ref="refRulesList"
      :refName="'rulesListTable'"
      :columns="tableOptions.columns"
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
      :download-button="getDownloadButton"
      @onEmptyBtnClicked="toggleRuleModal"
      @downloadEvent="exportRules"
      id="playbook-data-table"
      @deleteAction="deleteRule($event)"
      @editAction="handleEdit"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForSearchPlaybook"
      @on-all-records-button-click="handleAllRecordsClick"
    >
      <template v-slot:datatable-column-popup="{ scope, col }">
        <span v-if="scope.row[col.property] === 0">
          {{ labels.NoMatchEmptyText }}
        </span>
        <span v-else @click="matchingPopupClick(scope.row)" :class="getMatchingPlaybookPermission">
          {{ scope.row[col.property] === 0 ? 'No' : scope.row[col.property] }} {{ labels.Matches }}
        </span>
      </template>
    </datatable>
    <app-modal
      :status="showRuleModal"
      v-if="getModalRenderStatus"
      :icon-name="getIconName"
      :title="getTitle"
      :show-footer="false"
      class="playbook-modal"
    >
      <template v-slot:overlay-body>
        <CreateOrEditRule
          :playbookId="selectedPlaybookId"
          @cancelForm="toggleRuleModal"
          @closeFormWithUpdate="updateTable"
          v-if="showRuleModal"
        />
      </template>
    </app-modal>
  </div>
</template>

<script>
import Datatable from '../DataTable'
import CreateOrEditRule from './CreateOrEditRule'
import { mapActions, mapGetters, mapState } from 'vuex'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import { getMatchingIncidents } from '@/api/incidentResponder'
import AppDialog from '../AppDialog'
import { exportPlaybookRules, deletePlaybookRule } from '@/api/playbook'
import AppModal from '@/components/AppModal'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
export default {
  name: 'Rules',
  components: {
    AppDialogFooter,
    AppModal,
    Datatable,
    CreateOrEditRule,
    AppDialog
  },
  props: {
    playbookId: {
      type: String
    },
    PERMISSIONS: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      deleteButtonDisabled: false,
      tableData: [],
      totalNumberOfRecords: 0,
      showAllRecords: false,
      showAllRecordsMatchingPopup: false,
      totalNumberOfRecordsMatchingPopup: 0,
      labels,
      loading: false,
      matchingPlaybookData: [],
      showRuleModal: false,
      matchingPopupPayload: {
        pageNumber: 1,
        pageSize: 1000,
        orderBy: 'CreateDate',
        ascending: true
      },
      selectedMatch: null,
      showMatchingModal: false,
      isWantToDelete: false,
      deleteValues: null,
      isMatchingTableLoading: true,
      selectedPlaybookId: null,
      tableOptions: {
        isColumnFilterActive: false,
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
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'text',
            filterableCustomFieldName: 'Description'
          },
          {
            property: 'matchingCount',
            align: 'left',
            editable: false,
            label: 'Matching Incidents',
            fixed: false,
            sortable: false,
            show: true,
            type: 'popup',
            minWidth: '80',
            width: 160,
            emptyText: 'No Match'
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            filterableType: 'date',
            filterableCustomFieldName: 'CreateTime'
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
            width: 150,
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }]
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
            width: 150,
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Priority',
            filterableItems: [
              { text: 'Very Low', value: 'VeryLow' },
              'Low',
              'Medium',
              'High',
              { text: 'Very High', value: 'VeryHigh' }
            ]
          }
        ],
        empty: this.getTableEmptyStatus(),
        rowActions: this.getRowActions(),
        pageSizes: [5, 10, 25],
        addButton: this.getAddButton(),
        selectEvent: {
          clipboard: true,
          delete: this.PERMISSIONS.DELETE.hasPermission
        }
      },
      tableCredientials: {
        pageNumber: 1,
        pageSize: 1000,
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
    handleAllRecordsMatchingPopupClick() {
      this.matchingPopupPayload.pageSize = 75000
      this.showAllRecordsMatchingPopup = false
      this.matchingPopupClick(this.selectedMatch)
    },
    handleAllRecordsClick() {
      this.tableCredientials.pageSize = 75000
      this.showAllRecords = false
      this.callForSearchPlaybook()
    },
    getTableEmptyStatus() {
      const emptyObj = {
        message: LABEL_STORE.NO_RULES_CONFIGURED,
        icon: 'mdi-plus',
        btn: 'Add a Rule'
      }
      if (!this.PERMISSIONS.CREATE.hasPermission) {
        emptyObj['disabled'] = true
      }
      return emptyObj
    },
    getRowActions() {
      const rowActions = [
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
      ]
      const { UPDATE, DELETE, GET } = this.PERMISSIONS
      if (!(UPDATE.hasPermission || GET.hasPermission)) {
        rowActions[0]['disabled'] = true
      }
      if (!DELETE.hasPermission) {
        rowActions[1]['disabled'] = true
      }
      return rowActions
    },
    getAddButton() {
      const obj = {
        show: true,
        action: 'addAction',
        tooltip: 'Add a Rule'
      }
      return this.PERMISSIONS.CREATE.hasPermission ? obj : { ...obj, disabled: true }
    },
    getStatus(row) {
      return JSON.stringify(row.resourceId) === JSON.stringify(this.selectedMatch.resourceId)
    },
    toggleMatchingModal() {
      this.showMatchingModal = !this.showMatchingModal
    },
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
      this.loading = true
      this.getPlaybookList(this.tableCredientials)
        .then(() => {
          this.tableData = this.playbookList.results
        })
        .finally(() => (this.loading = false))
    },
    matchingPopupClick(match, toggleModal = true) {
      if (this.PERMISSIONS.MATCHING_PLAYBOOKS_SEARCH.hasPermission) {
        this.selectedMatch = match
        this.isMatchingTableLoading = true
        if (toggleModal) {
          this.toggleMatchingModal()
        }

        getMatchingIncidents(this.matchingPopupPayload, match.resourceId)
          .then((response) => {
            const {
              data: { data }
            } = response
            const { totalNumberOfRecords = 0 } = data
            this.totalNumberOfRecordsMatchingPopup = totalNumberOfRecords
            if (this.matchingPopupPayload.pageSize === 1000 && totalNumberOfRecords > 1000) {
              this.showAllRecords = true
            }
            const matchingPlaybookData = data
            this.matchingPlaybookData = matchingPlaybookData.results || []
          })
          .finally(() => (this.isMatchingTableLoading = false))
      }
    },
    exportRules({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: this.tableCredientials.orderBy,
          ascending: this.tableCredientials.ascending,
          reportAllPages: reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.tableCredientials.filter
        }
        exportPlaybookRules(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `Playbook.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch(() => {})
      })
    },
    deleteRule(value) {
      let isArray = Array.isArray(value)
      this.totalSelectedItemsCount = isArray ? value.length : 1
      this.isWantToDelete = true
      this.deleteValues = value
    },
    isWantToDeleteRuleConfirm() {
      const { DELETE } = this.PERMISSIONS
      if (DELETE.hasPermission) {
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
          this.deleteButtonDisabled = true
          deletePlaybookRule(item).then(() => {
            this.isWantToDelete = false
            this.loading = true
            _this
              .getPlaybookList(_this.tableCredientials)
              .then(() => {
                this.tableData = _this.playbookList.results
              })
              .finally(() => {
                this.loading = false
                this.deleteButtonDisabled = false
              })
          })
        })
      }
    },
    deleteMessage(item) {
      const nameValues =
        this.totalSelectedItemsCount > 1
          ? `${this.totalSelectedItemsCount} rules`
          : item && item.name
      return `${nameValues} will be deleted!`
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true

      let items = []
      let requestBody = this.tableCredientials.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
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
        const { FieldName, Value } = filter
        if ((FieldName === 'Status' || FieldName === 'Priority') && Value === '') {
        } else {
          requestBody.push(elem)
        }
      }

      this.tableCredientials.filter.FilterGroups[0].FilterItems = requestBody
      this.getTableData()
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
      this.getTableData()

      this.tableOptions.isColumnFilterActive =
        this.tableCredientials.filter.FilterGroups[0].FilterItems.length >= 1
    },
    getTableData() {
      this.loading = true
      this.getPlaybookList(this.tableCredientials)
        .then(() => {
          this.tableData = this.playbookList.results
        })
        .finally(() => (this.loading = false))
    },
    callForSearchPlaybook() {
      this.loading = true
      this.getPlaybookList(this.tableCredientials)
        .then((response) => {
          const {
            data: { data }
          } = response
          const { totalNumberOfRecords = 0 } = data
          this.totalNumberOfRecords = totalNumberOfRecords
          if (this.tableCredientials.pageSize === 1000 && totalNumberOfRecords > 1000) {
            this.showAllRecords = true
          }
          this.tableData = this.playbookList.results
        })
        .finally(() => (this.loading = false))
    },
    controlGetAndUpdatePermission(playbookId = '') {
      const { UPDATE, GET } = this.PERMISSIONS
      if (playbookId && GET.hasPermission) {
        if (UPDATE.hasPermission) {
          this.selectedPlaybookId = playbookId
          this.showRuleModal = true
        }
      }
    }
  },
  mounted() {
    if (this.PERMISSIONS.SEARCH.hasPermission) {
      this.callForSearchPlaybook()
    }
    this.controlGetAndUpdatePermission(this.playbookId)
  },
  created() {
    if (this.$route.params && this.$route.params.playbookId) {
      this.controlGetAndUpdatePermission(this.$route.params.playbookId)
    }
  },
  computed: {
    ...mapGetters({
      playbookList: 'playbook/playbookListGetter'
    }),
    getMatchingPlaybookPermission() {
      return this.PERMISSIONS.MATCHING_PLAYBOOKS_SEARCH.hasPermission && 'popup-link'
    },
    getDeleteModalPermission() {
      return this.isWantToDelete && this.PERMISSIONS.DELETE.hasPermission
    },
    getDownloadButton() {
      const { EXPORT } = this.PERMISSIONS
      const obj = {
        show: true
      }
      if (!EXPORT.hasPermission) {
        obj['disabled'] = true
      }
      return obj
    },
    getMatchingModalDownloadButton() {
      const { MATCHING_PLAYBOOKS_EXPORT } = this.PERMISSIONS
      const obj = {
        show: false
      }
      if (!MATCHING_PLAYBOOKS_EXPORT.hasPermission) {
        obj['disabled'] = true
      }
      return obj
    },
    getModalRenderStatus() {
      const { CREATE, UPDATE } = this.PERMISSIONS
      return this.showRuleModal && (CREATE.hasPermission || UPDATE.hasPermission)
    },
    getMatchingModalRenderStatus() {
      const { MATCHING_PLAYBOOKS_SEARCH, MATCHING_PLAYBOOKS_EXPORT } = this.PERMISSIONS
      return (
        this.showMatchingModal &&
        (MATCHING_PLAYBOOKS_SEARCH.hasPermission || MATCHING_PLAYBOOKS_EXPORT.hasPermission)
      )
    },
    ...mapState({
      playbookList: (state) => state.playbook.playbookList
    }),
    getTitle() {
      return `${this.selectedPlaybookId ? 'Edit' : 'Create New'} Rule`
    },
    getIconName() {
      return `${this.selectedPlaybookId ? 'mdi-pencil' : 'mdi-plus'}`
    },
    getSelectedMatchingIncidentsSubtitle() {
      return this.selectedMatch && `Incidents matching Rule: ${this.selectedMatch.name}`
    }
  }
}
</script>

<style lang="scss">
.playbook-rules {
  margin-top: 24px;
  .overlay {
    background: white;
    width: 100vw;
    height: 100vh;
  }
  .k-overlay__list-item.k-overlay__header {
    padding: 32px 96px 0 96px;
    margin-bottom: 24px;
    flex-shrink: 0;
  }
}
.playbook-modal {
  .v-overlay__content {
    overflow-x: hidden;
  }
}
</style>
