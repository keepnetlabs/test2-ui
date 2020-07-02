<template>
  <div class="investigations">
    <div class="investigations__container">
      <!-- New investigation popup starts here. You can define all props here. If you want to open that overlay, you have to set isWantToAddNewCommunity to true -->

      <new-investigation
        @closeAdd="onAddClose"
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
      <datatable
        id="investigationList"
        ref="investigationTable"
        :refName="'investigationTable'"
        :columns="columns"
        :table="tableData.data"
        :title="title"
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
        v-if="showDatatable"
        @onEmptyBtnClicked="isWantToAddNewCommunity = true"
      >
      </datatable>
    </div>
  </div>
</template>
<script>
import Datatable from '../components/DataTable'
import newInvestigation from '../components/Investigation/NewInvestigation'
import AppDialog from '../components/AppDialog'
import { mapActions, mapGetters } from 'vuex'
import { exportInvestigationList } from '../api/incidentResponder'
import { getStoreValue } from '../model/constants/commonConstants'
export default {
  components: {
    Datatable,
    newInvestigation,
    AppDialog
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
    isWantToAddNewCommunity: false,
    isWantToStopInvestigation: false,
    showDatatable: false,
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
        editComponent: 'textfield'
        //minWidth: 80
      },
      {
        property: 'detected',
        align: 'center',
        editable: false,
        label: getStoreValue('detected'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'detected',
        width: 150
        //minWidth: 80
      },
      {
        property: 'source',
        align: 'left',
        editable: false,
        label: getStoreValue('source'),
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 250
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
        width: 200
        //minWidth: 80
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
        width: 185
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
        width: 185
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
        width: 90
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
        width: 90
        // minWidth: 60
      }
    ],
    title: {
      icon: 'mdi-tab-unselected',
      title: 'Investigations',
      subTitle: ''
    },
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
      action: 'createCommunityFromMobileInfo'
    },
    iEmpty: {
      message: 'No investigation has been started, yet',
      btn: 'START A NEW INVESTIGATION',
      icon: 'mdi-plus'
    },
    selectEvent: {
      clipboard: true,
      edit: true,
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
      labels: ['Completed Users Count', 'Scanned Users Count'],
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
        pie: {
          customScale: 0.75
        }
      },
      showTooltipLine: true
    },
    bodyData: {
      // @todo pagesize is not statci shoudl be dynamic. Discsss with back end @arda
      pageNumber: 1,
      pageSize: 500,
      orderBy: 'startDate',
      ascending: false
    }
  }),
  methods: {
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
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      const _this = this
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.investigationTable.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    refreshDatatable() {
      this.showDatatable = false
      this.$store
        .dispatch('investigations/getInvestigationList', this.bodyData)
        .finally(() => (this.showDatatable = true)) //module name than method name
    },
    onAddClose() {
      // set mobile vision
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
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
    this.$store
      .dispatch('investigations/getInvestigationList', this.bodyData)
      .finally(() => (this.showDatatable = true)) //module name than method name
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
  }
  .k-table__wrapper .card {
    padding: 24px;
    border-radius: 20px !important;
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
