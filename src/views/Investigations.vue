<template>
  <KContainer tabless id="investigations">
    <new-investigation
      v-if="isShowNewInvestigationModal"
      ref="refNewInvestigation"
      :status="isShowNewInvestigationModal"
      @closeWithRoute="onAddClose"
      @closeAdd="isShowNewInvestigationModal = false"
      @refreshDatatable="refreshDatatable"
    />
    <app-dialog
      icon="mdi-alert"
      :status="isWantToStopInvestigation"
      :title="labels.StopOngoingInvestigation"
      :subtitle="labels.DoYouWantToStopInvestigation"
      :body="labels.OnceYouStoppedInvestigation"
      @changeStatus="isWantToStopInvestigation = false"
    >
      <template #app-dialog-footer>
        <app-dialog-footer
          cancel-button-id="btn-cancel--investigations-popup"
          confirm-button-id="btn-stop--investigations-popup"
          :confirm-button-disabled="stopInvestigateButtonDisabled"
          @handleClose="isWantToStopInvestigation = false"
          @handleConfirm="stopInvestigation"
        />
      </template>
    </app-dialog>
    <app-modal
      v-if="showPlaybookModal"
      class-name="incident-responder__playbook"
      :status="showPlaybookModal"
      :icon-name="getIconName"
      :title="getTitle"
      :show-footer="false"
    >
      <template v-slot:overlay-body>
        <CreateOrEditRule
          v-if="showPlaybookModal"
          :playbookId="selectedPlaybookId"
          @cancelForm="togglePlaybookModal"
          @closeFormWithUpdate="closePlaybookWithUpdate"
        />
      </template>
    </app-modal>
    <datatable
      v-bind="tableState"
      ref="investigationTable"
      id="investigations-data-table"
      selectable
      filterable
      options
      is-server-side
      :loading="loading"
      :columns="columns"
      :table="tableData.data"
      :rowActions="rowActions"
      :addButton="newInvestigationButton"
      :empty="iEmpty"
      :selectEvent="selectEvent"
      :chartOptions="chartOptions"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="savedTableSettingsLocalStorageKey"
      @startNewInvestigation="startNewInvestigation"
      @stopInvestigationFunc="stopInvestigationFunc($event)"
      @investigationDetails="investigationDetails($event)"
      @downloadEvent="exportInvestigationList"
      @onEmptyBtnClicked="isShowNewInvestigationModal = true"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="callForData"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @searchChangedEvent="handleSearchChange"
      @sortChangedEvent="sortChanged"
    >
      <template v-slot:datatable-custom-column="{ scope }">
        <span
          v-if="
            scope.row && scope.row.matchingPlaybooks && scope.row.matchingPlaybooks.length === 0
          "
        >
          {{ scope.row.source === labels.Auto ? 'Auto Analysis' : scope.row.source }}
        </span>
        <template v-else>
          <span
            v-for="item in scope.row.matchingPlaybooks"
            :key="item.resourceId"
            class="popup-link"
            @click="togglePlaybookModalWithSelected(item.resourceId)"
            >{{ item.name }}</span
          >
        </template>
      </template>
      <template v-slot:datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :id="rowActions[0].id"
          :icon="rowActions[0].icon"
          :text="rowActions[0].name"
          :scope="scope"
          :disabled="rowActions[0].disabled"
          @on-click="investigationDetails(scope)"
        />
        <DefaultButtonRowAction
          :id="rowActions[1].id"
          :icon="rowActions[1].icon"
          :text="rowActions[1].name"
          :scope="scope"
          :disabled="rowActions[1].disabled || scope.row.status !== 'Running'"
          @on-click="stopInvestigationFunc(scope)"
        />
      </template>
    </datatable>
  </KContainer>
</template>

<script>
import Datatable from '@/components/DataTable'
import newInvestigation from '@/components/Investigation/NewInvestigation'
import AppDialog from '@/components/AppDialog'
import { mapGetters } from 'vuex'
import { exportInvestigationList } from '@/api/incidentResponder'
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  getStoreValue,
  TABLE_SETTINGS_KEYS
} from '@/model/constants/commonConstants'
import CreateOrEditRule from '@/components/Playbook/CreateOrEditRule'
import AppModal from '@/components/AppModal'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import KContainer from '@/components/KContainer/KContainer'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
export default {
  name: 'Investigations',
  components: {
    KContainer,
    AppDialogFooter,
    Datatable,
    newInvestigation,
    AppDialog,
    CreateOrEditRule,
    AppModal,
    DefaultButtonRowAction
  },
  mixins: [useDefaultTableFunctions],
  props: {
    selectedEmail: {
      type: Object
    },
    isSelectedEmail: {
      type: Boolean
    },
    isLoadState: {
      type: Boolean
    },
    PERMISSIONS: {
      type: Object
    }
  },
  data() {
    return {
      tableState: null,
      stopInvestigateButtonDisabled: false,
      loading: false,
      showPlaybookModal: false,
      selectedPlaybookId: null,
      isShowNewInvestigationModal: false,
      isWantToStopInvestigation: false,
      init: true,
      labels,
      columns: [
        {
          property: 'incident',
          align: 'left',
          editable: false,
          label: getStoreValue('investigationName'),
          fixed: 'left',
          sortable: true,
          show: true,
          type: 'text',
          width: 240,
          isFilterable: true,
          editComponent: 'textfield',
          filterableType: 'text'
        },
        {
          property: 'source',
          align: 'left',
          editable: false,
          label: getStoreValue('trigger'),
          fixed: false,
          sortable: true,
          show: true,
          type: 'slot',
          width: 240,
          filterableType: 'text'
        },
        {
          property: 'status',
          align: 'center',
          editable: false,
          label: getStoreValue('status'),
          fixed: false,
          sortable: true,
          show: true,
          type: 'status',
          isEditable: true,
          isWithTooltip: true,
          width: 150,
          filterableType: 'select',
          filterableItems: ['Running', 'Cancelled', 'Expired', 'Finished', 'Queued', 'No match']
        },
        {
          property: 'createTime',
          align: 'left',
          editable: false,
          label: getStoreValue('createTime'),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'date'
        },
        {
          property: 'expireDate',
          align: 'left',
          editable: false,
          label: getStoreValue('expireDate'),
          fixed: false,
          sortable: true,
          show: true,
          type: 'text',
          filterableType: 'date'
        },
        {
          property: 'userStatus',
          informationTextProperty: 'scanStatusText',
          align: 'center',
          editable: false,
          label: getStoreValue('scanStatus'),
          fixed: false,
          sortable: false,
          hideSort: true,
          show: true,
          type: 'chart',
          width: 175
        },
        {
          property: 'progress',
          align: 'center',
          editable: false,
          label: getStoreValue('progress'),
          fixed: false,
          sortable: false,
          show: true,
          type: 'progress',
          progressType: 'stats',
          width: 130
        }
      ],
      rowActions: [
        {
          name: labels.Details,
          icon: 'mdi-text-box-multiple',
          action: 'investigationDetails',
          id: 'btn-details--investigations-row-actions',
          disabled: !this?.PERMISSIONS?.GET?.hasPermission
        },
        {
          name: labels.StopAction,
          icon: 'mdi-stop',
          id: 'btn-stop--investigations-row-actions',
          action: 'stopInvestigationFunc',
          disabled: !this?.PERMISSIONS?.STOP?.hasPermission
        }
      ],
      newInvestigationButton: {
        show: true,
        tooltip: labels.StartAnInvestigation,
        action: 'startNewInvestigation',
        id: 'btn-add--investigations',
        disabled: !this?.PERMISSIONS?.POST?.hasPermission
      },
      iEmpty: {
        message: labels.NoInvestigationStarted,
        btn: labels.StartAnInvestigation,
        id: 'btn-empty--investigations'
      },
      selectEvent: {
        clipboard: true,
        edit: false,
        delete: false,
        download: false,
        pause: false,
        stop: false
      },
      chartOptions: {
        backgroundColor: ['#3f51b5', '#00bcd4'],
        labels: [labels.CompletedUserCount, labels.NotStartedUserCount],
        showTooltipLine: true,
        isWithText: true
      },
      savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.INVESTIGATIONS,
      savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.INVESTIGATIONS,
      axiosPayload: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps()
    }
  },
  computed: {
    ...mapGetters({
      tableData: 'investigations/investigationListGetter' // for using getters
    }),
    getTitle() {
      return `${this.selectedPlaybookId ? 'Edit' : 'Create New'} Rule`
    },
    getIconName() {
      return `${this.selectedPlaybookId ? 'mdi-pencil' : 'mdi-plus'}`
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'Investigation Details' && !to.params.isLoadState) {
      next({ ...to, params: { isLoadState: true } })
    } else {
      next()
    }
  },
  created() {
    if (!this?.PERMISSIONS?.SEARCH?.hasPermission) {
      this.$router.push('/incident-responder')
    }
    if (this.$route.query.openPopup) {
      this.isShowNewInvestigationModal = true
    }
  },
  mounted() {
    this.callForData()
    if (this.$route.params && this.$route.params.selectedEmail) {
      this.isShowNewInvestigationModal = true
      if (this.$refs.refNewInvestigation && this.init) {
        this.init = false
        this.$refs.refNewInvestigation.fillForm(this.$route.params.selectedEmail)
      }
    }
  },
  beforeDestroy() {
    const tableState = {
      ...this.$refs.investigationTable.getState(),
      serverSideProps: this.serverSideProps
    }
    this.$store.dispatch('datatable/setTable', {
      key: 'Investigations',
      tableState
    })
    this.$store.commit('investigations/SET_INVESTIGATIONLISTEMPY', [])
  },
  beforeRouteLeave(to, from, next) {
    const { refNewInvestigation } = this.$refs
    if (refNewInvestigation && refNewInvestigation.status) {
      if (to.name === 'Investigation Details') {
        return next()
      }
      refNewInvestigation.handleClose()
      next(false)
    } else {
      next()
    }
  },
  methods: {
    callForData() {
      this.loading = true
      this.$store
        .dispatch('investigations/getInvestigationList', this.axiosPayload)
        .finally(() => {
          this.loading = false
          this.tableData.data = this.tableData.data || []
          this.setDynamicScanStatusWidth()
          if (this.$refs && this.$refs.investigationTable) {
            this.$refs.investigationTable.$forceUpdate()
          }
        })
        .then((response) => {
          if (response?.data?.data) {
            const {
              data: {
                data: { totalNumberOfRecords, totalNumberOfPages, pageNumber }
              }
            } = response
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages
            this.serverSideProps.pageNumber = pageNumber
          }
        })
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
    },
    getDynamicScanStatusWidth(columnItems) {
      if (!columnItems) {
        return 250
      }
      const lengthMap = columnItems.map(
        (item) => item[0].toString().length + item[1].toString().length
      )
      const maxLength = Math.max(...lengthMap)
      if (isNaN(maxLength) || maxLength === Infinity || maxLength === -Infinity) {
        return 250
      }
      return 175 + maxLength * 10
    },
    setDynamicScanStatusWidth() {
      const scanStatusItems = this.tableData.data.map((item) => item.userStatus)
      const scanStatusColumnIndex = this.columns.findIndex(
        (column) => column.property === 'userStatus'
      )
      if (scanStatusColumnIndex !== -1) {
        this.columns[scanStatusColumnIndex].width = this.getDynamicScanStatusWidth(scanStatusItems)
      }
    },
    handeRuleNameClick(resourceId) {
      this.selectedPlaybookId = resourceId
      this.showPlaybookModal = true
    },
    closePlaybookWithUpdate() {
      this.togglePlaybookModal()
    },
    togglePlaybookModal() {
      this.selectedPlaybookId = null
      this.showPlaybookModal = !this.showPlaybookModal
    },
    togglePlaybookModalWithSelected(selectedPlaybookId) {
      this.selectedPlaybookId = selectedPlaybookId
      this.showPlaybookModal = !this.showPlaybookModal
    },
    refreshDatatable() {
      this.loading = true
      this.callForData()
    },
    onAddClose(resp) {
      if (resp?.data?.data?.resourceId) {
        this.$router.push(
          `/incident-responder/investigations/investigation-details/${resp.data.data.resourceId}`
        )
      }
      this.isShowNewInvestigationModal = false
    },
    startNewInvestigation() {
      this.isShowNewInvestigationModal = true
    },
    investigationDetails(value) {
      this.$router.push({
        name: 'Investigation Details',
        params: { id: value.row.resourceId }
      })
    },
    exportInvestigationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.axiosPayload.filter
        }
        exportInvestigationList(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Investigations.${
            exportType.toLocaleLowerCase() === 'xls' ? 'xlsx' : exportType.toLocaleLowerCase()
          }`
          link.click()
        })
      })
    },

    stopInvestigationFunc(value) {
      this.isWantToStopInvestigation = true
      this.selectedRow = value
    },
    stopInvestigation() {
      const value = this.selectedRow
      let store = this.$store
      this.stopInvestigateButtonDisabled = true
      this.$store
        .dispatch('investigations/cancelInvestigation', value.row.resourceId)
        .catch(() => {})
        .then(() => {
          this.isWantToStopInvestigation = false
          store.dispatch('investigations/SET_INVESTIGATIONLISTEMPY', [])
        })
        .finally(() => {
          this.stopInvestigateButtonDisabled = false
          this.refreshDatatable()
        })
    }
  }
}
</script>
