<template>
  <div class="playbook-rules">
    <app-dialog
      v-if="getDeleteModalPermission"
      icon="mdi-alert"
      title="Delete Playbook Rule"
      body="Do you want to delete playbook rule?"
      title-id="text--playbook-delete-popup-title"
      subtitle-id="text--playbook-delete-popup-subtitle"
      :subtitle="getDeleteDialogSubtitle"
      :status="isWantToDelete"
      @changeStatus="isWantToDelete = false"
    >
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          type="delete"
          cancel-button-id="btn-cancel--rules-popup"
          confirm-button-id="btn-delete--rules-popup"
          :confirm-button-disabled="deleteButtonDisabled"
          @handleClose="isWantToDelete = false"
          @handleConfirm="isWantToDeleteRuleConfirm(true)"
        />
      </template>
    </app-dialog>
    <matching-incident-modal
      v-if="getMatchingModalRenderStatus"
      subtitle-prop="name"
      :status="showMatchingModal"
      :selectedMatch="selectedMatch"
      @closeOverlay="toggleMatchingModal"
    />
    <datatable
      id="playbook-data-table"
      ref="refRulesList"
      selectable
      filterable
      options
      is-server-side
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :row-actions="tableOptions.rowActions"
      :empty="tableOptions.empty"
      :addButton="tableOptions.addButton"
      :selectEvent="tableOptions.selectEvent"
      :download-button="getDownloadButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="tableCredientials"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @addAction="toggleRuleModal"
      @onEmptyBtnClicked="toggleRuleModal"
      @downloadEvent="exportRules"
      @deleteAction="deleteRule"
      @handleMultipleDelete="deleteRule"
      @editAction="handleEdit"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForSearchPlaybook"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @searchChangedEvent="handleSearchChange"
      @sortChangedEvent="sortChanged"
    >
      <template v-slot:datatable-column-popup="{ scope, col }">
        <span v-if="scope.row[col.property] === 0">
          {{ labels.NoMatchEmptyText }}
        </span>
        <span v-else :class="getMatchingPlaybookPermission" @click="matchingPopupClick(scope.row)">
          {{ scope.row[col.property] === 0 ? 'No' : scope.row[col.property] }} {{ labels.Matches }}
        </span>
      </template>
    </datatable>
    <app-modal
      v-if="getModalRenderStatus"
      title-id="text--create-playbook-modal-title"
      class="playbook-modal"
      :status="showRuleModal"
      :icon-name="getIconName"
      :title="getTitle"
      :show-footer="false"
    >
      <template v-slot:overlay-body>
        <CreateOrEditRule
          v-if="showRuleModal"
          ref="refRuleModal"
          :playbookId="selectedPlaybookId"
          @cancelForm="toggleRuleModal"
          @closeFormWithUpdate="updateTable"
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
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import AppDialog from '../AppDialog'
import { exportPlaybookRules, deletePlaybookRule } from '@/api/playbook'
import AppModal from '@/components/AppModal'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import MatchingIncidentModal from '@/components/IncidentResponder/MatchingIncidentModal'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
export default {
  name: 'Rules',
  components: {
    MatchingIncidentModal,
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
      labels,
      loading: false,
      showRuleModal: false,
      selectedMatch: null,
      showMatchingModal: false,
      isWantToDelete: false,
      deleteValues: null,
      selectedPlaybookId: null,
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.PLAYBOOKRULES,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.PLAYBOOK,
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
            width: 170,
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
        addButton: this.getAddButton(),
        selectEvent: {
          clipboard: true,
          delete: this.PERMISSIONS.DELETE.hasPermission
        }
      },
      tableCredientials: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
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
          message: labels.EmptyMatchingIncidents,
          btn: '',
          icon: 'mdi-plus'
        }
      },
      serverSideProps: new ServerSideProps()
    }
  },
  methods: {
    ...mapActions({
      getPlaybookList: 'playbook/getPlaybookList'
    }),
    serverSidePageNumberChanged(pageNumber = 1) {
      this.tableCredientials.pageNumber = pageNumber
      this.callForSearchPlaybook()
    },
    serverSideSizeChanged(pageSize = 10) {
      this.tableCredientials.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForSearchPlaybook()
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.tableCredientials.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForSearchPlaybook()
    },
    sortChanged({ order, prop } = {}) {
      this.tableCredientials.ascending = order === 'ascending'
      this.tableCredientials.orderBy = prop
      this.callForSearchPlaybook()
    },
    resetPageNumber() {
      this.tableCredientials.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    getTableEmptyStatus() {
      const emptyObj = {
        message: LABEL_STORE.NO_RULES_CONFIGURED,
        icon: 'mdi-plus',
        btn: 'New',
        id: 'btn-empty--playbook-rules'
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
          id: 'btn-edit--playbook-rules-row-actions',
          action: 'editAction'
        },
        {
          name: 'Delete',
          icon: 'mdi-delete',
          id: 'btn-delete--playbook-rules-row-actions',
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
        tooltip: 'Add a Rule',
        id: 'btn-add--playbook-rules'
      }
      return this.PERMISSIONS.CREATE.hasPermission ? obj : { ...obj, disabled: true }
    },
    toggleMatchingModal() {
      this.showMatchingModal = !this.showMatchingModal
    },
    checkIfCanCloseRuleModal() {
      if (this.$refs.refRuleModal) {
        this.$refs.refRuleModal.cancelForm()
      }
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
      this.callForSearchPlaybook()
    },
    matchingPopupClick(match, toggleModal = true) {
      if (this.PERMISSIONS.MATCHING_PLAYBOOKS_SEARCH.hasPermission) {
        this.selectedMatch = match
        if (toggleModal) {
          this.toggleMatchingModal()
        }
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
            link.download = `Playbook.${
              exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
            }`
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
        if (this.totalSelectedItemsCount > 1) {
          for (const [_, value] of Object.entries(this.deleteValues)) {
            values.push(value)
          }
        } else {
          const value =
            this.deleteValues.constructor.name === 'Array'
              ? this.deleteValues[0]
              : this.deleteValues
          values.push(value)
        }
        values.map((item) => {
          this.deleteButtonDisabled = true
          deletePlaybookRule(item.resourceId)
            .then(() => {
              this.isWantToDelete = false
              this.loading = true
              this.$refs.refRulesList.unSelectRow(item)
            })
            .finally(() => {
              this.deleteButtonDisabled = false
              this.callForSearchPlaybook()
            })
        })
      }
    },
    columnFilterChanged(filter) {
      this.tableCredientials.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.tableCredientials
      )
      this.callForSearchPlaybook()
    },
    columnFilterCleared(fieldName) {
      this.tableCredientials.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.tableCredientials
      )
      this.callForSearchPlaybook()
    },
    callForSearchPlaybook() {
      this.loading = true
      this.getPlaybookList(this.tableCredientials)
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber } = {}
            } = {}
          } = response || {}
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results
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
  created() {
    this.controlGetAndUpdatePermission(this?.$route?.params?.playbookId || this.playbookId)
    if (this.PERMISSIONS.SEARCH.hasPermission) {
      this.callForSearchPlaybook()
    }
  },
  computed: {
    ...mapGetters({
      playbookList: 'playbook/playbookListGetter'
    }),
    getDeleteDialogSubtitle() {
      const item = this.deleteValues
      const nameValues =
        this.totalSelectedItemsCount > 1
          ? `${this.totalSelectedItemsCount} rules`
          : item && item.name
      return `${nameValues} will be deleted!`
    },
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
