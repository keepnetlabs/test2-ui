<template>
  <div class="investigations">
    <div class="investigations__container">
      <!-- New investigation popup starts here. You can define all props here. If you want to open that overlay, you have to set isWantToAddNewCommunity to true -->

      <new-investigation
        @closeWithRoute="onAddClose"
        @closeAdd="isWantToAddNewCommunity = false"
        @refreshDatatable="refreshDatatable"
        ref="refNewInvestigation"
        :status="isWantToAddNewCommunity"
        v-if="isWantToAddNewCommunity"
      />
      <app-dialog
        :status="isWantToStopInvestigation"
        icon="mdi-alert"
        title="Stop Ongoing Investigation"
        subtitle="Do you want to stop this investigation?"
        body="Once you stopped, you cannot resume this investigation."
      >
        <template v-slot:app-dialog-footer>
          <div class="d-flex download-buttons flex-row flex-wrap justify-end">
            <v-btn
              text
              color="#f56c6c"
              class="k-dialog__button"
              @click="isWantToStopInvestigation = false"
              >CANCEL</v-btn
            >
            <v-btn text color="#2196f3" class="k-dialog__button" @click="stopInvestigation"
              >CONFIRM</v-btn
            >
          </div>
        </template>
      </app-dialog>
      <v-card class="investigations__container-card" light>
        <datatable
          id="investigationList"
          ref="investigationTable"
          :refName="'investigationTable'"
          :columns="columns"
          :table="tableData.data"
          :countRow="5"
          :pageSizes="pageSizes"
          :defaultSort="'date'"
          :selectable="true"
          :filterable="true"
          :options="true"
          :rowActions="rowActions"
          :addUsers="addUsers"
          :empty="iEmpty"
          :selectEvent="selectEvent"
          :chartOptions="chartOptions"
          :sizeable="true"
          @createCommunityFromMobileInfo="createCommunityFromMobileInfo()"
          @stopInvestigationFunc="stopInvestigationFunc($event)"
          @investigationDetails="investigationDetails($event)"
          @downloadEvent="exportInvestigationList"
          @sortChangedEvent="sortChangedEvent($event)"
          @paginationChangedEvent="paginationChangedEvent($event)"
          @searchChangedEvent="searchChangedEvent($event)"
          :dataLength="tableData && tableData.totalNumberOfRecords"
          :requestParams="bodyData"
          :isServerSide="false"
          @onEmptyBtnClicked="isWantToAddNewCommunity = true"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
        >
          <template v-slot:datatable-custom-column="{ scope }">
            <span
              v-if="
                scope.row && scope.row.matchingPlaybooks && scope.row.matchingPlaybooks.length === 0
              "
            >
              {{ scope.row.source === 'Auto' ? 'Auto Analysis' : scope.row.source }}
            </span>
            <span
              :key="item.resourceId"
              v-else
              :to="{ name: 'Playbook', params: { playbookId: item.resourceId } }"
              v-for="item in scope.row.matchingPlaybooks"
              class="popup-link"
              @click="togglePlaybookModalWithSelected(item.resourceId)"
              >{{ item.name }}</span
            >
          </template>
        </datatable>
      </v-card>
    </div>
    <v-dialog v-model="showPlaybookModal" fullscreen scrollable persistent no-click-animation>
      <CreateOrEditRule
        :playbookId="selectedPlaybookId"
        @cancelForm="togglePlaybookModal"
        @closeFormWithUpdate="closePlaybookWithUpdate"
        v-if="showPlaybookModal"
      />
    </v-dialog>
  </div>
</template>
<script>
import Datatable from '../components/DataTable'
import newInvestigation from '../components/Investigation/NewInvestigation'
import AppDialog from '../components/AppDialog'
import { mapActions, mapGetters } from 'vuex'
import { exportInvestigationList } from '../api/incidentResponder'
import { getStoreValue } from '../model/constants/commonConstants'
import CreateOrEditRule from '../components/Playbook/CreateOrEditRule'
export default {
  components: {
    Datatable,
    newInvestigation,
    AppDialog,
    CreateOrEditRule
  },
  props: {
    selectedEmail: {
      type: Object
    },
    isSelectedEmail: {
      type: Boolean
    }
  },
  data: () => ({
    showPlaybookModal: false,
    selectedPlaybookId: null,
    isWantToAddNewCommunity: false,
    isWantToStopInvestigation: false,
    init: true,
    investigationListDataLength: 0,
    columns: [
      // Should be defined to show the table
      {
        property: 'incident',
        align: 'left',
        editable: false,
        label: getStoreValue('incident'),
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        width: 250,
        isFilterable: true,
        editComponent: 'textfield',
        filterableType: 'text'
      },
      {
        property: 'source',
        align: 'left',
        editable: false,
        label: getStoreValue('source'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'slot',
        width: 250,
        filterableType: 'text'
        //minWidth: 80
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
        width: 200,
        filterableType: 'select',
        filterableItems: ['Idle', 'Running', 'Cancelled', 'Expired', 'Finished']
      },
      {
        property: 'createDate',
        align: 'left',
        editable: false,
        label: getStoreValue('createDate'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 185,
        filterableType: 'date'
        //minWidth: 80
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
        width: 185,
        filterableType: 'date'
        //minWidth: 80
      },
      {
        property: 'userStatus',
        align: 'center',
        editable: false,
        label: getStoreValue('userStatus'),
        fixed: false,
        sortable: false,
        show: true,
        type: 'chart',
        width: 130
        //minWidth: 35
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
        width: 120
        // minWidth: 60
      }
    ],
    pageSizes: [5, 10, 25, 50, 100],
    rowActions: [
      {
        name: 'Details',
        icon: 'mdi-text-box-multiple',
        action: 'investigationDetails'
      },
      {
        name: 'Stop Action',
        icon: 'mdi-stop',
        action: 'stopInvestigationFunc'
      }
    ],
    addUsers: {
      show: true,
      popUp: false,
      tooltip: 'Start an Investigation',
      action: 'createCommunityFromMobileInfo'
    },
    iEmpty: {
      message: 'No investigations started',
      btn: 'START A NEW INVESTIGATION',
      icon: 'mdi-plus'
    },
    selectEvent: {
      clipboard: true,
      edit: false,
      delete: true,
      download: true
    },
    chartOptions: {
      chart: {
        type: 'pie'
      },
      summary: {
        show: true,
        seperator: '/'
      },
      labels: ['Scanned User Count', 'Not Scanned Users Count'],

      colors: ['#3f51b5', '#00bcd4'],
      legend: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {}
      },
      showTooltipLine: true
    },
    bodyData: {
      // @todo pagesize is not statci shoudl be dynamic. Discsss with back end @arda
      pageNumber: 1,
      pageSize: 500,
      orderBy: 'createDate',
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
  }),
  methods: {
    handeRuleNameClick(resourceId) {
      this.selectedPlaybookId = resourceId
      this.showPlaybookModal = true
    },
    closePlaybookWithUpdate() {
      this.togglePlaybookModal()
    },
    togglePlaybookModal() {
      this.selectedPlaybookId = null
      return (this.showPlaybookModal = !this.showPlaybookModal)
    },
    togglePlaybookModalWithSelected(selectedPlaybookId) {
      this.selectedPlaybookId = selectedPlaybookId
      return (this.showPlaybookModal = !this.showPlaybookModal)
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      const _this = this
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, this.bodyData)
      })
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      const _this = this
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    columnFilterChanged(filter) {
      let items = []
      let filterPayload = []
      this.bodyData.filter.FilterGroups[0].FilterItems.map((x, i, t) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      this.bodyData.filter.FilterGroups[0].FilterItems = []
      this.bodyData.filter.FilterGroups[0].FilterItems = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          this.bodyData.filter.FilterGroups[0].FilterItems.push(filter[i])
        })
      } else {
        this.bodyData.filter.FilterGroups[0].FilterItems.push(filter)
      }

      const _this = this
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    columnFilterCleared(fieldName) {
      let items = []
      this.bodyData.filter.FilterGroups[0].FilterItems.map((x, i, t) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      this.bodyData.filter.FilterGroups[0].FilterItems = [...items]
      const _this = this
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      const _this = this
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    refreshDatatable() {
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData)
    },
    onAddClose(resp) {
      // set mobile vision
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.$router.push(`/investigation-details/${resp.data.data.resourceId}`)
      this.isWantToAddNewCommunity = false
    },
    createCommunityFromMobileInfo() {
      // open new investigation overlay
      this.isWantToAddNewCommunity = true
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
          orderBy: 'ExpireDate',
          ascending: true,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }

        exportInvestigationList(payload).then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `investigations.${exportType.toLocaleLowerCase()}`
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
      this.isWantToStopInvestigation = false
      this.$store
        .dispatch('investigations/cancelInvestigation', value.row.resourceId)
        .catch(() => {})
        .then(() => {
          store.dispatch('investigations/SET_INVESTIGATIONLISTEMPY', [])
          this.refreshDatatable()
        })
    }
  },
  computed: {
    ...mapGetters({
      // get table data via vuex.
      tableData: 'investigations/investigationListGetter' // for using getters
    })
  },
  mounted() {
    // triggered to relevant action at investigations.js
    if (this.$route.params && this.$route.params.selectedEmail) {
      this.isWantToAddNewCommunity = true
    }
    this.$nextTick(() => {
      if (this.$route.params && this.$route.params.selectedEmail) {
        if (this.$refs.refNewInvestigation && this.init) {
          this.init = false
          this.$refs.refNewInvestigation.fillForm(this.$route.params.selectedEmail)
        }
      }
    })
    const _this = this
    this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
      this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
    })

    if (this.$route.query.openPopup) {
      this.isWantToAddNewCommunity = true
    }
  }
}
</script>
<style lang="scss">
.investigations {
  padding: 13px 16px 16px 16px;
  &__container {
    min-height: 80vh;
    &-card {
      border-radius: 20px !important;
      margin-top: -2px;
      box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
        0 1px 1px -1px rgba(204, 204, 204, 0.12) !important;
      background-color: #ffffff;
      padding: 16px 24px 0 24px;
    }
  }
  .table-wrapper {
    margin-top: 8px;
  }
  .newInvestigationOverlay {
    background-color: #fff !important;
    overflow: auto !important;
    height: 100% !important;
    max-width: 100vw !important;
    width: 100% !important;
    display: block !important;
    justify-content: center !important;
    align-items: center !important;

    > ::v-deep .v-overlay__content {
      height: auto;
      width: 100%;
    }
  }
}
</style>
