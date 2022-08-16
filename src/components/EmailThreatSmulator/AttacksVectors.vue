<template>
  <div id="attack-vectors" class="attack-vectors">
    <v-overlay
      id="add-new-quick-scan-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewAttackVector
        ref="newScenarioModal"
        :status="modalStatus"
        :isEdit="isEdit"
        :attackVectorDetails="attackVectorDetails"
        @changeNewScanModalStatus="changeNewScanModalStatus"
      />
    </v-overlay>
    <DeleteAttackVector
      :status="showDeleteModal"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      :selectedItem="selectedScan"
    />
    <data-table
      v-if="getEtsAttackVectorPermissionSearch"
      id="quick-scan-data-table"
      class="AttacksVector"
      ref="refAttacksVectorList"
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
      row-key="pluginResourceId"
      @deleteAction="showDeleteModal = true"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewScanModalStatus(true)"
      @downloadEvent="exportTableData"
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
          @on-click="handleEditAttackVector(scope.row)"
        />
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[1].icon"
          :text="tableOptions.rowActions[1].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[1].disabled"
          @on-click="handleActionDelete(scope.row)"
        />
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from "../DataTable";
import NewAttackVector from "./NewAttackVector";
import DeleteAttackVector from "./DeleteAttackVector";
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
import {
  getAttackVectorList,
  getAttackVectorById,
  exportAttacksVector,
} from "@/api/emailThreatSimlator";
import { columnFilterChanged, columnFilterCleared } from "@/utils/helperFunctions";
import { mapGetters } from "vuex";
import useCallForLanguagesForTableFilter from "@/hooks/useCallForLanguagesForTableFilter";
import DefaultButtonRowAction from "@/components/SmallComponents/RowActions/DefaultButtonRowAction";
export default {
  name: "EmailTemplates",
  components: {
    DataTable,
    DeleteAttackVector,
    NewAttackVector,
    DefaultButtonRowAction,
  },
  mixins: [useCallForLanguagesForTableFilter],
  data() {
    return {
      languageFilterOptions: [],
      attackVectorDetails: {},
      isShowFastLaunch: false,
      isShowPreviewDialog: false,
      selectedRow: null,
      methodItems: [],
      difficultyItems: [],
      editableFormValues: {},
      loading: true,
      isEdit: false,
      labels,
      selectedScenarioURL: "",
      tableData: [],
      showDeleteModal: false,
      selectedScan: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.ETS_ATTACK_VECTOR_TABLE,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.ETS_ATTACK_VECTOR_TABLE,
        columns: [
          {
            property: "pluginName",
            align: "left",
            editable: false,
            label: "Attack Vector Name",
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            filterableType: "text",
            width: 190,
          },
          {
            property: "categoryName",
            align: "left",
            editable: false,
            label: "Type",
            sortable: true,
            show: true,
            type: "text",
            width: 150,
            filterableType: "text",
          },
          {
            property: "hash",
            align: "left",
            editable: false,
            label: "Hash",
            sortable: true,
            show: true,
            type: "text",
            width: 105,
            filterableType: "text",
          },
          {
            property: "riskFactor",
            align: "left",
            editable: false,
            label: "Severity",
            sortable: true,
            show: true,
            type: "badge",
            width: 125,
            filterableType: "number",
          },
          {
            property: "isActive",
            align: "left",
            editable: false,
            label: "Status",
            sortable: false,
            show: true,
            type: "text",
            class: "test",
            width: 130,
            filterableType: "select",
            filterableItems: [
              { text: "Active", value: true },
              { text: "Passive", value: false },
            ],
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: "left",
            editable: false,
            label: "Date Create",
            sortable: true,
            show: true,
            type: "text",
            filterableType: "date",
          },
        ],
        rowActions: [
          {
            name: "Edit",
            icon: "mdi-pencil",
            action: "handleEdit",
            disabled: !this.$store.getters["permissions/getEtsAttackVectorPermissionUpdate"],
          },
          {
            name: labels.Delete,
            icon: "mdi-delete",
            action: "deleteAction",
            disabled: !this.$store.getters["permissions/getEtsAttackVectorPermissionDelete"],
          },
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters["permissions/getEtsAttackVectorPermissionExport"],
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false,
        },
        empty: {
          message: LABEL_STORE.NO_ATTACK_VECTOR,
          btn: labels.New,
          icon: "mdi-plus",
          id: "btn-empty--scan",
          disabled: !this.$store.getters["permissions/getEtsAttackVectorPermissionCreate"],
        },
        addButton: {
          show: true,
          action: "addAction",
          tooltip: "Add a Scenario",
          id: "btn-add--scan",
          disabled: !this.$store.getters["permissions/getEtsAttackVectorPermissionCreate"],
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
      getEtsAttackVectorPermissionSearch: "permissions/getEtsAttackVectorPermissionSearch",
    }),
  },
  methods: {
    toggleShowPreviewDialog() {
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
      this.$refs.refAttacksVectorList.$refs.elTableRef.toggleRowSelection(row, false);
    },
    handleEditAttackVector(row) {
      getAttackVectorById(row.pluginResourceId).then((response) => {
        this.isEdit = true;
        this.attackVectorDetails = response.data.data;
        this.modalStatus = true;
      });
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
      this.isEdit = false;
      this.attackVectorDetails = {};
      if (restart) {
        this.selectedScan = {};
        this.getDatatableList();
      }
    },
    exportTableData({ exportTypes, reportAllPages, pageNumber, pageSize }) {
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
        exportAttacksVector(payload).then((response) => {
          const { data } = response;
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(data);
          link.download = `AttacksVector.${
            exportType.toLocaleLowerCase() === "xls" ? "xlsx" : exportType.toLocaleLowerCase()
          }`;
          link.click();
        });
      });
    },
    getDatatableList() {
      this.loading = true;
      if (this.getEtsAttackVectorPermissionSearch) {
        getAttackVectorList(this.bodyData)
          .then((response) => {
            const {
              data: { data },
            } = response;
            const { totalNumberOfRecords, totalNumberOfPages, pageNumber } = response.data.data;
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
    this.callForLanguages("refAttacksVectorList");
    this.getDatatableList();
  },
};
</script>
<style lang="scss">
.attack-vectors {
  .k-badge__sizes--medium.v-btn {
    width: 30px !important;
    display: block;
    margin: auto !important;
  }
}
</style>
