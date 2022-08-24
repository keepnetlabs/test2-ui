<template>
  <div id="scenarios">
    <PhishingScenariosFastLaunch
      ref="fastLaunch"
      v-if="isShowFastLaunch"
      :status="isShowFastLaunch"
      :selected-scenario="selectedRow"
      @on-close="toggleShowFastLaunch"
    />
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <NewScenario
        ref="newScenarioModal"
        :status="modalStatus"
        :scenarioId="scenarioId"
        :isEdit="isEdit"
        :isDuplicate="isDuplicate"
        :editableFormValues="editableFormValues"
        :scenarioDetailsLookup="scenarioDetailsLookup"
        :isAttachmentBased="isAttachmentBasedScenario"
        @changeNewScenarioModalStatus="changeNewScenarioModalStatus"
      />
    </v-overlay>
    <DeleteScenario
      :status="showDeleteModal"
      :selectedScenario="selectedScenario"
      @handleSuccessDeleteAction="handleSuccessDeleteAction"
      @handleCloseModal="showDeleteModal = false"
    />
    <PhishingScenarioPreview
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedPhishingScenario"
      @on-close="toggleShowPreviewDialog"
    />
    <data-table
      v-if="getPhishingScenariosSearchPermissions"
      id="scenarios-data-table"
      class="scenarios"
      ref="refScenariosList"
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
      :saved-filters-local-storage-key="
        tableOptions.savedFiltersLocalStorageKey
      "
      :saved-table-settings-local-storage-key="
        tableOptions.savedTableSettingsLocalStorageKey
      "
      @deleteAction="showDeleteModal = true"
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="modalStatus = true"
      @addAction="changeNewScenarioModalStatus(true)"
      @downloadEvent="exportScenario"
      @handleMultipleDelete="handleActionDelete"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @refreshAction="getDatatableList"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @on-fast-launch="handleFastLaunch"
    >
      <template #datatable-row-actions="{ scope }">
        <DefaultButtonRowAction
          :icon="tableOptions.rowActions[0].icon"
          :text="tableOptions.rowActions[0].name"
          :scope="scope"
          :disabled="tableOptions.rowActions[0].disabled"
          :checkIsOwnerProperty="false"
          @on-click="handleFastLaunch(scope.row)"
        />
        <RowActionsMenu>
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[1].disabled"
            :icon="tableOptions.rowActions[1].icon"
            :text="tableOptions.rowActions[1].name"
            @on-click="handleEdit(scope.row, false)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :check-is-owner-property="false"
            :disabled="tableOptions.rowActions[2].disabled"
            :icon="tableOptions.rowActions[2].icon"
            :text="tableOptions.rowActions[2].name"
            :checkIsOwnerProperty="false"
            @on-click="handlePreview(scope.row)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[3].disabled"
            :icon="tableOptions.rowActions[3].icon"
            :text="tableOptions.rowActions[3].name"
            :checkIsOwnerProperty="false"
            @on-click="handleEdit(scope.row, true)"
          />
          <DefaultMenuRowAction
            :scope="scope"
            :disabled="tableOptions.rowActions[4].disabled"
            :icon="tableOptions.rowActions[4].icon"
            :text="tableOptions.rowActions[4].name"
            @on-click="handleActionDelete(scope.row)"
          />
        </RowActionsMenu>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from "../DataTable";
import NewScenario from "./NewScenario";
import DeleteScenario from "./DeleteScenario";
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
  exportScenarios,
  getScenarioDataDetails,
  getScenariosList,
} from "@/api/scenarios";
import {
  columnFilterChanged,
  columnFilterCleared,
} from "@/utils/helperFunctions";
import PhishingScenariosFastLaunch from "@/components/PhishingScenarios/FastLaunch/PhishingScenariosFastLaunch";
import PhishingScenarioPreview from "@/components/PhishingScenarios/PhishingScenarioPreview";
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
    PhishingScenarioPreview,
    PhishingScenariosFastLaunch,
    DataTable,
    DeleteScenario,
    NewScenario,
  },
  mixins: [useCallForLanguagesForTableFilter],
  data() {
    return {
      languageFilterOptions: [],
      scenarioDetailsLookup: null,
      isShowFastLaunch: false,
      isShowPreviewDialog: false,
      selectedRow: null,
      methodItems: [],
      difficultyItems: [],
      editableFormValues: {},
      loading: true,
      isEdit: false,
      isDuplicate: false,
      scenarioId: null,
      labels,
      selectedScenarioURL: "",
      tableData: [],
      showDeleteModal: false,
      selectedScenario: {},
      tableOptions: {
        savedFiltersLocalStorageKey: DEFAULT_SEARCH_CONTAINER_KEYS.SCENARIOS,
        savedTableSettingsLocalStorageKey: TABLE_SETTINGS_KEYS.SCENARIOS,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: "left",
            editable: false,
            label: "Scenario Name",
            sortable: true,
            show: true,
            type: "text",
            fixed: "left",
            width: 240,
            filterableType: "text",
          },
          {
            property: "method",
            align: "left",
            editable: false,
            label: "Method",
            sortable: true,
            show: true,
            type: "text",
            fixed: false,
            width: 240,
            filterableType: "select",
            filterableItems: [
              { text: "Click Only", value: "Click-Only" },
              { text: "Data Submission", value: "Data Submission" },
              { text: "Attachment", value: "Attachment" },
            ],
          },
          {
            property: PROPERTY_STORE.LANGUAGE,
            align: "left",
            editable: false,
            label: labels.LANGUAGE,
            sortable: true,
            show: true,
            type: "text",
            fixed: false,
            width: 175,
            filterableType: "select",
            filterableItems: [],
            filterableCustomFieldName: "languageTypeResourceId",
          },
          {
            property: PROPERTY_STORE.TAGS,
            align: "left",
            editable: false,
            label: "Tags",
            fixed: false,
            sortable: true,
            show: true,
            type: "smallBadge",
            width: 150,
            hasTooltip: true,
            filterableType: "text",
            filterableCustomFieldName: PROPERTY_STORE.TAGS,
          },
          {
            property: "difficulty",
            align: "center",
            editable: false,
            label: labels.DIFFICULTY,
            sortable: true,
            show: true,
            type: "status",
            filterableType: "select",
            filterableItems: ["Easy", "Medium", "Hard"],
            width: 180,
          },
          {
            property: PROPERTY_STORE.CREATEDBY,
            align: "left",
            editable: false,
            label: "Created By",
            sortable: true,
            show: true,
            type: "text",
            width: 180,
            filterableType: "text",
            // filterableType: 'select',
            // filterableItems: ['Custom', 'System']
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: "left",
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: "text",
            filterableType: "date",
          },
        ],
        rowActions: [
          {
            name: labels.FastLaunch,
            icon: "mdi-send",
            action: "on-fast-launch",
            disabled: !this.$store.getters[
              "permissions/getPhishingScenariosPreviewPermissions"
            ],
          },
          {
            name: labels.Edit,
            icon: "mdi-pencil",
            action: "handleEdit",
            disabled: !this.$store.getters[
              "permissions/getPhishingScenariosEditPermissions"
            ],
          },
          {
            name: labels.Preview,
            icon: "mdi-eye",
            action: "handlePreview",
            // disabled: !this.$store.getters['permissions/getPhishingScenariosPreviewPermissions']
          },
          {
            name: "Duplicate",
            icon: "mdi-content-copy",
            action: "handleEdit",
            // disabled: !this.$store.getters['permissions/getPhishingScenariosCreatePermissions']
          },
          {
            name: labels.Delete,
            icon: "mdi-delete",
            action: "deleteAction",
            disabled: !this.$store.getters[
              "permissions/getPhishingScenariosDeletePermissions"
            ],
          },
        ],
        downloadButton: {
          show: true,
          disabled: !this.$store.getters[
            "permissions/getPhishingScenariosExportPermissions"
          ],
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
        },
        addButton: {
          show: true,
          action: "addAction",
          tooltip: "Add a Scenario",
          id: "btn-add--scenarios",
          disabled: !this.$store.getters[
            "permissions/getPhishingScenariosCreatePermissions"
          ],
        },
      },
      modalStatus: false,
      bodyData: getDefaultAxiosPayload(),
      defaultRequestBody: getDefaultAxiosPayload(),
      serverSideProps: new ServerSideProps(),
      selectedScenarioHeader: null,
      templateHTML: null,
      selectedPhishingScenario: {},
    };
  },
  computed: {
    ...mapGetters({
      getPhishingScenariosSearchPermissions:
        "permissions/getPhishingScenariosSearchPermissions",
    }),
    isAttachmentBasedScenario() {
      return this.selectedRow?.method === "Attachment" || undefined;
    },
  },
  methods: {
    toggleShowPreviewDialog() {
      if (this.isShowPreviewDialog) this.selectedPhishingScenario = {};
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
    handleSuccessDeleteAction(row) {
      this.$refs.refScenariosList.unSelectRow(row);
      this.showDeleteModal = false;
      this.getDatatableList();
    },
    handleFastLaunch(row = {}) {
      this.selectedRow = row;
      this.toggleShowFastLaunch();
    },
    handlePreview(row) {
      this.selectedPhishingScenario = row;
      this.toggleShowPreviewDialog();
    },
    toggleShowFastLaunch() {
      if (this.isShowFastLaunch) this.selectedRow = null;
      this.isShowFastLaunch = !this.isShowFastLaunch;
    },
    handleEdit(row, isDuplicate) {
      this.selectedRow = row;
      this.editableFormValues = row;
      this.modalStatus = true;
      this.isEdit = true;
      this.isDuplicate = isDuplicate;
      this.scenarioId = row.resourceId;
    },
    checkIfCanCLoseNewScenarioModal() {
      if (this.$refs.newScenarioModal) {
        this.$refs.newScenarioModal.changeNewScenarioModalStatus();
      }
    },
    checkIfCanCloseFastLaunchModal() {
      if (this.$refs.fastLaunch) {
        this.$refs.fastLaunch.closeOverlay();
      }
    },
    changeNewScenarioModalStatus(status, restart) {
      this.modalStatus = status;
      this.scenarioId = null;
      this.isEdit = false;
      this.isDuplicate = false;
      if (!status) {
        this.selectedRow = null;
      }
      if (restart) {
        this.editableFormValues = {};
        this.scenarioId = null;
        this.isEdit = false;
        this.isDuplicate = false;
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
            exportType.toLocaleLowerCase() === "xls"
              ? "xlsx"
              : exportType.toLocaleLowerCase()
          }`;
          link.click();
        });
      });
    },
    getDatatableList() {
      this.loading = true;
      if (this.getPhishingScenariosSearchPermissions) {
        getScenariosList(this.bodyData)
          .then((response) => {
            const {
              data: { data },
            } = response;
            const {
              totalNumberOfRecords,
              totalNumberOfPages,
              pageNumber,
            } = response.data.data;
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
      this.selectedScenario = row;
      this.showDeleteModal = true;
    },
    columnFilterChanged(filter) {
      this.bodyData.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.bodyData
      );
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
    this.callForLanguages("refScenariosList");
    getScenarioDataDetails()
      .then((response) => {
        this.scenarioDetailsLookup = response?.data?.data || {
          methodTypes: [],
          difficultyTypes: [],
        };
        this.$set(
          this.tableOptions.columns[1],
          "filterableItems",
          this.scenarioDetailsLookup.methodTypes.map((item) => {
            return { text: item.text, value: item.text };
          })
        );
        this.$set(
          this.tableOptions.columns[3],
          "filterableItems",
          this.scenarioDetailsLookup.difficultyTypes.map((item) => {
            return { text: item.text, value: item.text };
          })
        );
      })
      .finally(() => {
        this.getDatatableList();
      });
  },
};
</script>
