<template>
  <DataTable
    v-if="getThreatIntelligencePermissionsSearch"
    ref="refThreatIntelligence"
    :showPagination="true"
    :options="true"
    id="threat-intelligence-table"
    is-server-side
    selectable
    :loading="isLoading"
    :countRow="10"
    :table="tableData"
    :filterable="false"
    :columns="tableOptions.columns"
    :empty="tableOptions.iEmpty"
    :server-side-props="serverSideProps"
    :server-side-events="tableOptions.serverSideEvents"
    :row-actions="rowActions"
    :add-button="tableOptions.addButton"
    :select-event="tableOptions.selectEvent"
    :axios-payload.sync="axiosPayload"
    :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
    :saved-table-settings-local-storage-key="
      tableOptions.savedTableSettingsLocalStorageKey
    "
    :download-button="tableOptions.downloadButton"
    row-key="email"
    @columnFilterChanged="columnFilterChanged"
    @server-side-page-number-changed="serverSidePageNumberChanged"
    @server-side-size-changed="serverSideSizeChanged"
    @sortChangedEvent="sortChanged"
    @searchChangedEvent="handleSearchChange"
    @downloadEvent="exportData"
    @refreshAction="callForData"
  ></DataTable>
</template>

<script>
import DataTable from "@/components/DataTable";
import { getDefaultAxiosPayload } from "@/utils/functions";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import labels from "@/model/constants/labels";
import { useLoading } from "@/hooks/useLoading";
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS,
} from "@/model/constants/commonConstants";
import useDefaultTableFunctions from "@/hooks/useDefaultTableFunctions";
import {
  getThreatIntelligenceList,
  exportThreatIntelligence,
} from "@/api/threatIntelligence";
import { mapGetters } from "vuex";

export default {
  name: "ThreatIntelligenceList",
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    justShowReportAction: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      CONSTANTS: {
        id: "ThreatIntelligenceList",
        ascending: "ascending",
      },
      axiosPayload: getDefaultAxiosPayload({}, "leakdate"),
      serverSideProps: new ServerSideProps(),
      tableData: [],
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.THREATS_INTELLIGENCE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.THREATS_INTELLIGENCE_TABLE,
        serverSideEvents: { pagination: true, search: false, sort: true },
        columns: [
          {
            property: "email",
            //align: 'left',
            editable: false,
            label: "Breached Account",
            fixed: true,
            hideSort: false,
            show: true,
            type: "text",
            width: 150,
            filterableType: false,
          },
          {
            property: "hashtype",
            //align: 'left',
            editable: false,
            label: "Password Type",
            fixed: false,
            hideSort: false,
            show: true,
            type: "text",
            width: 150,
            filterableType: false,
          },
          {
            property: "source",
            //align: 'left',
            editable: false,
            label: "Source",
            fixed: false,
            hideSort: false,
            show: true,
            type: "text",
            width: 150,
            filterableType: false,
          },
          {
            property: "leakdate",
            //align: 'left',
            editable: false,
            label: "Leak Date",
            fixed: false,
            hideSort: false,
            show: true,
            type: "text",
            filterableType: false,
          },
        ],
        addButton: {
          show: false,
        },
        iEmpty: {
          message:
            "We could not detect any breached and exposed accounts <br/> with email addresses of your domain names",
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false,
        },
        downloadButton: {
          show: true,
          disabled:
            !this.$store.getters[
              "permissions/getThreatIntelligencePermissionsExport"
            ],
        },
      },
      rowActions: [],
    };
  },
  created() {
    this.callForData();
  },
  computed: {
    ...mapGetters({
      getThreatIntelligencePermissionsSearch:
        "permissions/getThreatIntelligencePermissionsSearch",
    }),
  },
  methods: {
    callForData() {
      this.loading = true;
      getThreatIntelligenceList(this.axiosPayload)
        .then((response) => {
          const {
            data: { data },
          } = response;
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber } =
            response.data.data;
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords;
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages;
          this.serverSideProps.pageNumber = pageNumber;
          const { results = [] } = data;
          for (let i = 0; i < results.length; i++) {
            const data = results[i];
            data.isActive = data.isActive ? "Active" : "Passive";
          }
          this.tableData = results;
        })
        .catch(() => {
          this.tableData = [];
        })
        .finally(() => (this.loading = false));
    },
    exportData(downloadTypes) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === "XLS" ? "Excel" : item,
          filter: this.axiosPayload.filter,
        };
        exportThreatIntelligence(payload).then((response) => {
          const { data } = response;
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(data);
          link.download = `Campaign-Manager-Report.${
            item.toLocaleLowerCase() === "xls"
              ? "xlsx"
              : item.toLocaleLowerCase()
          }`;
          link.click();
        });
      });
    },
  },
};
</script>

<style lang="scss">
#threat-intelligence-table {
  .table-header {
    justify-content: right !important;
  }
}
</style>
