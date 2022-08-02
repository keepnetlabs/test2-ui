<template>
  <div id="scenarios">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewScan
        ref="newScenarioModal"
        :status="modalStatus"
        :isDuplicate="isDuplicate"
        :scanDetails="scanDetails"
        @changeNewScanModalStatus="changeNewScanModalStatus"
      />
    </v-overlay>
    <DeleteScans
      :status="showDeleteModal"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      :selectedScan="selectedScan"
    />
    <data-table
      v-if="getPhishingScenariosSearchPermissions"
      id="scenarios-data-table"
      class="scenarios"
      ref="refQuickScanList"
      is-server-side
      selectable
      filterable
      options
      :loading="loading"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.empty"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :addButton="tableOptions.addButton"
      :server-side-props="serverSideProps"
      :server-side-events="{ pagination: true, search: true, sort: true }"
      :download-button="tableOptions.downloadButton"
      :axios-payload.sync="bodyData"
      :saved-filters-local-storage-key="tableOptions.savedFiltersLocalStorageKey"
      :saved-table-settings-local-storage-key="tableOptions.savedTableSettingsLocalStorageKey"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewScanModalStatus(true)"
      @downloadEvent="exportScenario"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            :checkIsOwnerProperty="false"
            @on-click="handleActionDelete(scope.row, true)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handleDuplicateScan(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from "../DataTable";
import NewScan from "./NewScan";
import DeleteScans from "./DeleteScans";
import {
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE,
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS,
} from "@/model/constants/commonConstants";
import { getDefaultAxiosPayload } from "@/utils/functions";
import labels from "@/model/constants/labels";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import { getQuickScanList, getQuickScanById } from "@/api/emailThreatSimlator";
import {
  // deleteScenarios,
  exportScenarios,
} from "@/api/scenarios";
import { columnFilterChanged, columnFilterCleared } from "@/utils/helperFunctions";
import { mapGetters } from "vuex";
import useCallForLanguagesForTableFilter from "@/hooks/useCallForLanguagesForTableFilter";
import DefaultButtonRowAction from "@/components/SmallComponents/RowActions/DefaultButtonRowAction";
import RowActionsMenu from "@/components/SmallComponents/RowActions/RowActionsMenu";
import DefaultMenuRowAction from "@/components/SmallComponents/RowActions/DefaultMenuRowAction";

export default {
  name: "EmailTemplates",
  components: {
    DefaultMenuRowAction,
    RowActionsMenu,
    DefaultButtonRowAction,
    DataTable,
    DeleteScans,
    NewScan,
  },
  mixins: [useCallForLanguagesForTableFilter],
  data() {
    return {
      languageFilterOptions: [],
      scanDetails: {},
      isShowFastLaunch: false,
      isShowPreviewDialog: false,
      selectedRow: null,
      methodItems: [],
      difficultyItems: [],
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      labels,
      selectedScenarioURL: "",
      tableData: [],
      showDeleteModal: false,
      selectedScan: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ETS_QUICK_SCAN_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ETS_QUICK_SCAN_TABLE,
        columns: [
          {
            property: PROPERTY_STORE.CREATETIME,
            align: "left",
            editable: false,
            label: "Date Create",
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            filterableType: "date",
          },
          {
            property: "status",
            align: "center",
            editable: false,
            label: "Status",
            sortable: true,
            show: true,
            type: "status",
            filterableType: "select",
            filterableItems: ["Initial", "InProgress", "Completed", "Cancelled"],
            width: 180,
          },
          {
            property: "domain",
            align: "left",
            editable: false,
            label: "Domain",
            sortable: true,
            show: true,
            type: "text",
            fixed: "left",
            width: 240,
            filterableType: "text",
          },
        ],
        rowActions: [
          {
            name: labels.FastLaunch,
            icon: "mdi-receipt",
            action: "View Report",
            disabled: !this.$store.getters["permissions/getPhishingScenariosPreviewPermissions"],
          },
          {
            name: labels.Delete,
            icon: "mdi-delete",
            action: "deleteAction",
            disabled: !this.$store.getters[
              "permissions/getEtsQuickScanPermissionDelete"
            ],
          },
          {
            name: "Duplicate",
            icon: "mdi-content-copy",
            action: "handleEdit",
            disabled: !this.$store.getters[
              "permissions/getEtsQuickScanPermissionUpdate"
            ],
          },
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters["permissions/getPhishingScenariosExportPermissions"],
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false,
        },
        empty: {
          message: LABEL_STORE.NO_SCENARIO,
          btn: labels.New,
          icon: "mdi-plus",
          id: "btn-empty--scenarios",
          disabled: !this.$store.getters[
            "permissions/getsQuickScanPermissionCreate"
          ],
        },
        addButton: {
          show: true,
          action: "addAction",
          tooltip: "Add a Scenario",
          id: "btn-add--scenarios",
          disabled: !this.$store.getters[
            "permissions/getEtsQuickScanPermissionCreate"
          ],
        },
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
    };
  },
  computed: {
    ...mapGetters({
      getPhishingScenariosSearchPermissions: "permissions/getPhishingScenariosSearchPermissions",
    }),
  },
  methods: {
    toggleShowPreviewDialog() {
      console.log("a", this.isShowPreviewDialog);
      if (this.isShowPreviewDialog) this.selectedScan = {};
      this.isShowPreviewDialog = !this.isShowPreviewDialog;
    },
    resetPageNumber() {
      this.bodyData.pageNumber = 1;
      this.serverSideProps.pageNumber = 1;
    },
    handleSearchChange(searchFilter = {}) {
      this.bodyData.filter.FilterGroups[1].FilterItems = [
        ...searchFilter.filter.FilterGroups[0].FilterItems,
      ];
      this.resetPageNumber();
      this.getDatatableList();
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.bodyData.pageNumber = pageNumber;
      this.getDatatableList();
    },
    sortChanged({ order, prop } = {}) {
      this.bodyData.ascending = order === "ascending";
      this.bodyData.orderBy = prop;
      this.getDatatableList();
    },
    serverSideSizeChanged(pageSize = 10) {
      this.bodyData.pageSize = pageSize;
      this.serverSideProps.pageSize = pageSize;
      this.resetPageNumber();
      this.getDatatableList();
    },
    sortChangedEvent({ prop, order }) {
      this.bodyData = {
        ...this.bodyData,
        orderBy: prop,
        ascending: order === "ascending",
      };
      this.getDatatableList();
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords,
      };
      this.getDatatableList();
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter };
      this.getDatatableList();
    },
    handleSuccessDeleteAction() {
      this.showDeleteModal = false;
      this.getDatatableList();
    },
    handleDelete(row) {
      console.log(row);
      this.$refs.refQuickScanList.$refs.elTableRef.toggleRowSelection(row, false);
      /*deleteScenarios(row.resourceId).then(() => {
        this.getDatatableList()
      })*/
    },
    handleDuplicateScan(row) {
      getQuickScanById(row.quickScanResourceId).then((response) => {
        console.log(response);
        this.isDuplicate = true;
        this.scanDetails = response.data.data;
        this.modalStatus = true;
      })
      this.selectedScan = row;
      //quickScanResourceId
    },
    checkIfCanCLoseNewScenarioModal() {
      if (this.$refs.newScenarioModal) {
        this.$refs.newScenarioModal.changeNewScanModalStatus();
      }
    },
    checkIfCanCloseFastLaunchModal() {
      if (this.$refs.fastLaunch) {
        this.$refs.fastLaunch.closeOverlay();
      }
    },
    changeNewScanModalStatus(status, restart) {
      this.modalStatus = status;
        this.isDuplicate = false;
        this.scanDetails = {};
      if (restart) {
        this.selectedScan = {};
        this.getDatatableList();
      }
    },
    exportScenario({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderBy: "CreateTime",
          ascending: false,
          reportAllPages,
          exportType: exportType === "XLS" ? "Excel" : exportType,
          filter: this.bodyData.filter,
        };
        exportScenarios(payload).then((response) => {
          const { data } = response;
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(data);
          link.download = `Scenarios.${
            exportType.toLocaleLowerCase() === "xls" ? "xlsx" : exportType.toLocaleLowerCase()
          }`;
          link.click();
        });
      });
    },
    getDatatableList() {
      this.loading = true;
      if (this.getPhishingScenariosSearchPermissions) {
        getQuickScanList(this.bodyData)
          .then((response) => {
            const {
              data: { data },
            } = response;
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data;
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords;
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages;
            this.serverSideProps.pageNumber = pageNumber;
            const { results = [] } = data;
            this.tableData = results;
          })
          .catch(() => {
            this.tableData = [];
          })
          .finally(() => (this.loading = false));
      } else {
        this.$router.push("/");
      }
    },
    handleActionDelete(row) {
      this.selectedScan = row;
      this.showDeleteModal = true;
    },
    columnFilterChanged(filter) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(filter, this.bodyData);
      this.getDatatableList();
    },
    columnFilterCleared(fieldName) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.bodyData
      );
      this.getDatatableList();
    },
  },
  created() {
    this.callForLanguages("refQuickScanList");
    // getScenarioDataDetails()
    //   .then((response) => {
    //     this.scanDetails = response?.data?.data || {
    //       methodTypes: [],
    //       difficultyTypes: []
    //     }
    //     this.$set(
    //       this.tableOptions.columns[1],
    //       'filterableItems',
    //       this.scanDetails.methodTypes.map((item) => {
    //         console.log("ddd", item);
    //         return { text: item.text, value: item.text }
    //       })
    //     )
    //     this.$set(
    //       this.tableOptions.columns[3],
    //       'filterableItems',
    //       this.scanDetails.difficultyTypes.map((item) => {
    //         return { text: item.text, value: item.text }
    //       })
    //     )
    //   })
    //   .finally(() => {
    //
    //   });
    this.getDatatableList();
  },
};
</script>
