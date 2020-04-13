<template>
  <div class="investigations">
    <v-overlay
      id="add-new-community-overlay"
      :value="isWantToAddNewCommunity"
      :class="{ newInvestigationOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <new-investigation @closeAdd="onAddClose" />
    </v-overlay>
    <div :key="tableData.length">
      <datatable
        :refName="'investigationTable'"
        :columns="columns"
        :table="tableData"
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
        @createCommunityFromMobileInfo="createCommunityFromMobileInfo()"
      />
    </div>
  </div>
</template>
<script>
import Datatable from '../components/DataTable'
import newInvestigation from '../components/Investigation/NewInvestigation'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Datatable,
    newInvestigation
  },
  data: () => ({
    isWantToAddNewCommunity: false,
    data: [],
    columns: [
      // Should be defined to show the table
      {
        property: 'incident',
        align: 'left',
        editable: false,
        label: 'Incident',
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        width: 200
      },
      {
        property: 'detected',
        align: 'left',
        editable: false,
        label: 'Detected',
        fixed: false,
        sortable: true,
        show: true,
        type: 'status',
        width: 200
      },
      {
        property: 'source',
        align: 'left',
        editable: false,
        label: 'Source',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 120
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
        width: 100
      },
      {
        property: 'expiryDate',
        align: 'center',
        editable: false,
        label: 'Expiry Date',
        fixed: false,
        sortable: false,
        show: true,
        type: 'date',
        width: 120
      },
      {
        property: 'userStatus',
        align: 'center',
        editable: false,
        label: 'User Status',
        fixed: false,
        sortable: false,
        show: true,
        type: 'chart',
        width: 130
      },
      {
        property: 'progress',
        align: 'center',
        editable: false,
        label: 'Progress',
        fixed: false,
        sortable: false,
        show: true,
        type: 'progress',
        width: 85
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
        name: 'details',
        icon: 'mdi-text-box-multiple',
        action: 'investigationDetails'
      },
      {
        name: 'Stop Action',
        icon: 'mdi-stop',
        action: 'stopInvestigation'
      }
    ],
    addUsers: {
      show: true,
      popUp: false,
      action: 'createCommunityFromMobileInfo'
    },
    iEmpty: {
      message: 'You do not have any users added, yet',
      subMes: 'Start now',
      btn: 'Add Users',
      icon: 'mdi-account-plus'
    },
    selectEvent: {
      clipboard: true,
      edit: true,
      delete: true,
      download: true
    },
    chartOptions: {
      chart: {
        width: 60,
        height: 60,
        type: 'pie',
        offsetX: -1,
        offsetY: 1
      },
      labels: ['Team A', 'Team B'],
      colors: ['#3f51b5', '#00bcd4'],
      legend: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      dataLabels: {
        enabled: false
      }
    },
    bodyData: {
      pageNumber: 1,
      pageSize: 3,
      orderBy: 'ExpireDate',
      ascending: true,
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [
              {
                FieldName: 'Status',
                Operator: 'Include',
                Value: 'Cancelled,Running,Idle'
              }
            ],
            FilterGroups: []
          }
        ]
      }
    }
  }),
  methods: {
    onAddClose() {
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true
      }
      this.isWantToAddNewCommunity = false
    },
    createCommunityFromMobileInfo() {
      this.isWantToAddNewCommunity = true
    }
  },
  computed: {
    ...mapGetters({
      tableData: 'investigations/investigationListGetter' // for using getters
    })
  },
  mounted() {
    // let editBodyData = this.bodyData;
    // editBodyData.orderBy =
    this.$store.dispatch('investigations/getInvestigationList', this.bodyData) //module name than method name
  }
}
</script>
<style lang="scss" scoped>
.investigations {
  padding: 16px;
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
</style>
