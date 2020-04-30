<template>
  <div class="investigations">
    <!-- New investigation popup starts here. You can define all props here. If you want to open that overlay, you have to set isWantToAddNewCommunity to true -->
    <v-overlay
      id="add-new-community-overlay"
      :value="isWantToAddNewCommunity"
      :class="{ newInvestigationOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <new-investigation @closeAdd="onAddClose" @refreshDatatable="refreshDatatable" />
    </v-overlay>
    <datatable
      id="investigationList"
      :refName="'investigationTable'"
      :columns="columns"
      :table="tableData"
      :title="title"
      :countRow="5"
      :pageSizes="pageSizes"
      :defaultSort="'date'"
      :selectable="false"
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
      v-if="showDatatable"
    />
  </div>
</template>
<script>
import Datatable from "../components/DataTable";
import newInvestigation from "../components/Investigation/NewInvestigation";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    Datatable,
    newInvestigation
  },
  data: () => ({
    isWantToAddNewCommunity: false,
    showDatatable: false,
    columns: [
      // Should be defined to show the table
      {
        property: "incident",
        align: "left",
        editable: false,
        label: "Incident",
        fixed: "left",
        sortable: true,
        show: true,
        type: "text",
        width: 200,
        minWidth: 200
      },
      {
        property: "detected",
        align: "center",
        editable: false,
        label: "Detected",
        fixed: false,
        sortable: true,
        show: true,
        type: "detected",
        width: 120,
        minWidth: 120
      },
      {
        property: "source",
        align: "left",
        editable: false,
        label: "Source",
        fixed: false,
        sortable: true,
        show: true,
        type: "text",
        width: 200,
        minWidth: 200
      },
      {
        property: "status",
        align: "center",
        editable: false,
        label: "Status",
        fixed: false,
        sortable: true,
        show: true,
        type: "status",
        width: 220,
        minWidth: 220
      },
      {
        property: "startDate",
        align: "left",
        editable: false,
        label: "Start Date",
        fixed: false,
        sortable: true,
        show: true,
        type: "text",
        width: 160,
        minWidth: 160
      },
      {
        property: "expireDate",
        align: "left",
        editable: false,
        label: "Expiry Date",
        fixed: false,
        sortable: true,
        show: true,
        type: "text",
        width: 160,
        minWidth: 160
      },
      {
        property: "userStatus",
        align: "center",
        editable: false,
        label: "User Status",
        fixed: false,
        sortable: false,
        show: true,
        type: "chart",
        width: 90,
        minWidth: 90
      },
      {
        property: "progress",
        align: "center",
        editable: false,
        label: "Progress",
        fixed: false,
        sortable: false,
        show: true,
        type: "progress",
        width: 90,
        minWidth: 90
      }
    ],
    title: {
      icon: "mdi-tab-unselected",
      title: "Investigations",
      subTitle: ""
    },
    pageSizes: [5, 10, 25, 50, 100],
    rowActions: [
      {
        name: "details",
        icon: "mdi-text-box-multiple",
        action: "investigationDetails"
      },
      {
        name: "Stop Action",
        icon: "mdi-stop",
        action: "stopInvestigationFunc"
      }
    ],
    addUsers: {
      show: true,
      popUp: false,
      action: "createCommunityFromMobileInfo"
    },
    iEmpty: {
      message: "No investigation has been started, yet",
      subMes: "Start new Investigation",
      btn: "Add Users",
      icon: "mdi-account-plus"
    },
    selectEvent: {
      clipboard: true,
      edit: true,
      delete: true,
      download: true
    },
    chartOptions: {
      chart: {
        type: 'pie',
      },
      summary:{
        show:true,
        seperator:"/"
      },
      labels: ["Completed Users Count", "Scanned Users Count"],
      colors: ["#3f51b5", "#00bcd4"],
      legend: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      dataLabels: {
        enabled: false,
      },
      showTooltipLine:true,
    },
    bodyData: {
      // @todo pagesize is not statci shoudl be dynamic. Discsss with back end @arda
      pageNumber: 1,
      pageSize: 500,
      orderBy: "StartDate",
      ascending: false,
      filter: {
        Condition: "AND",
        FilterGroups: [
          {
            Condition: "AND",
            FilterItems: [
              {
                FieldName: "Status",
                Operator: "Include",
                Value: "Cancelled,Running,Idle"
              }
            ],
            FilterGroups: []
          }
        ]
      }
    }
  }),
  methods: {
    refreshDatatable() {
      this.showDatatable = false;
      this.$store
        .dispatch("investigations/getInvestigationList", this.bodyData)
        .finally(() => (this.showDatatable = true)); //module name than method name
    },
    onAddClose() {
      // set mobile vision
      if (this.isMobileVisible && this.windowWidth < 769) {
        this.isMobileInfo = true;
      }
      this.isWantToAddNewCommunity = false;
    },
    createCommunityFromMobileInfo() {
      // open new investigation overlay
      this.isWantToAddNewCommunity = true;
    },
    investigationDetails(value) {
      this.$router.push({
        name: "Investigation Details",
        params: { id: value.row.resourceId }
      });
    },
    stopInvestigationFunc(value) {
      console.log("value",value)
      let store = this.$store;
      this.$store
        .dispatch("investigations/cancelInvestigation", value.row.resourceId)
        .catch(() => {})
        .then(() => {
          store.dispatch("investigations/SET_INVESTIGATIONLISTEMPY", []);
          this.refreshDatatable();
        });
    }
  },
  computed: {
    ...mapGetters({
      // get table data via vuex.
      tableData: "investigations/investigationListGetter" // for using getters
    })
  },
  mounted() {
    // triggered to relevant action at investigations.js
    this.$store
      .dispatch("investigations/getInvestigationList", this.bodyData)
      .finally(() => (this.showDatatable = true)); //module name than method name
  }
};
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
