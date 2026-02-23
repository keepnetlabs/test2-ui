<template>
  <div>
    <CampaignManagerItemDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :item="selectedRow"
      :is-action-button-disabled="isDeleteDialogActionButtonDisabled"
      @on-close="toggleShowDeleteDialog"
      @on-delete="handleOnDelete"
    />
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
      selectable
      filterable
      options
      is-server-side
      :loading="isLoading"
      :table="tableData"
      :columns="tableColumnsWithTooltips"
      :empty="tableOptions.iEmpty"
      :server-side-props="serverSideProps"
      :server-side-events="tableOptions.serverSideEvents"
      :select-event="tableOptions.selectEvent"
      :row-actions="tableOptions.rowActions"
      :add-button="tableOptions.addButton"
      :axios-payload.sync="axiosPayload"
      :saved-filters-local-storage-key="
        tableOptions.savedFiltersLocalStorageKey
      "
      :saved-table-settings-local-storage-key="
        tableOptions.savedTableSettingsLocalStorageKey
      "
      @on-add-button-click="handleOnAddButtonClick"
      @columnFilterChanged="columnFilterChanged"
      @columnFilterCleared="columnFilterCleared"
      @server-side-page-number-changed="serverSidePageNumberChanged"
      @server-side-size-changed="serverSideSizeChanged"
      @sortChangedEvent="sortChanged"
      @searchChangedEvent="handleSearchChange"
      @refreshAction="callForData"
      @downloadEvent="exportCampaignManagerItemList"
    >
      <template #datatable-custom-column="{ scope, col }">
        <template v-if="scope.column.property === 'totalTargetUserCount'">
          <span
            v-if="isTargetUsersShowGroups(scope.row)"
            class="campaign-manager-item-table__target-users-groups"
            @click.stop="handleTargetUsersGroupsClick(scope.row)"
          >
            {{ labels.Groups }}
            <VIcon color="#2196f3" small>mdi-account-multiple</VIcon>
          </span>
          <span v-else>{{ scope.row[col.property] }}</span>
        </template>
        <template v-else-if="scope.column.property === 'frequencyDescription'">
          <div class="reported-email-subject__container">
            <div class="reported-email-subject">
              <span> {{ scope.row[col.property] }}</span>
            </div>
            <TheRecordsButton
              label="recurrence"
              plural-label="recurrences"
              single-label="View Report"
              zero-label="No Recurrence"
              width="150px"
              variant="primary"
              :index="scope.$index"
              :row="scope.row"
              :disabled-count="0"
              :is-show-button-with-zero-total="false"
              @on-click="handleRecordButtonClick"
            />
          </div>
        </template>
        <div
          v-if="scope.column.property === 'status'"
          class="campaign-manager-item-table__status-column"
        >
          <v-tooltip bottom :disabled="getTooltipDisabilityStatus(scope.row)">
            <template #activator="{ on }">
              <v-btn style="display: none;" />
              <Badge
                v-bind="getStatusBadgeProps(scope.row.status)"
                :listeners="on"
                size="medium"
                :col="col"
              />
            </template>
            <span>{{ getErrorMessage(scope.row) }}</span>
          </v-tooltip>
        </div>
      </template>
      <template #table-search-left-side>
        <v-btn
          id="btn-back--campaign-manager-clustered-table"
          text
          color="#2196f3"
          class="clustered-table-back-btn"
          @click="handleBackClick"
        >
          <v-icon left>mdi-arrow-left</v-icon> {{ labels.Back }}</v-btn
        >
      </template>
      <template #datatable-row-actions="{ scope }">
        <CampaignManagerItemRowActions
          :campaign-resource-id="item.resourceId"
          :scope="scope"
          :row-actions="tableOptions.rowActions"
          @on-delete="handleDelete"
          @on-stop="handleStop"
          @on-launch="handleLaunch"
          @on-preview="handlePreview"
        />
      </template>
      <template #table-all-records>
        <div class="campaign-manager__table-all-records">
          {{ getTableAllRecordsText }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import ServerSideProps from "@/helper-classes/server-side-table-props";
import {
  ACTION_STATUSES,
  COLUMNS,
  getStatusBadgeProps,
  SCENARIO_DISTRIBUTION_TEXTS
} from "@/components/CampaignManager/utils";
import labels from "@/model/constants/labels";
import {
  DEFAULT_SEARCH_CONTAINER_KEYS,
  TABLE_SETTINGS_KEYS
} from "@/model/constants/commonConstants";
import DataTable from "@/components/DataTable";
import CampaignManagerItemRowActions from "@/components/CampaignManager/CampaignManagerItemRowActions";
import {
  deletePhishingCampaignJob,
  exportCampaignManagerItem,
  searchCampaignPhishingJob
} from "@/api/phishingsimulator";
import { useLoading } from "@/hooks/useLoading";
import CampaignManagerItemDeleteDialog from "@/components/CampaignManager/CampaignManagerItemDeleteDialog";
import { getDefaultAxiosPayload } from "@/utils/functions";
import useDefaultTableFunctions from "@/hooks/useDefaultTableFunctions";
import Badge from "@/components/Badge";
import TheRecordsButton from "@/components/IncidentResponder/TheRecordsButton.vue";

const EMITS = {
  UPDATE_AXIOS_PAYLOAD: "update:axiosPayload",
  RESET_AXIOS_PAYLOAD: "reset-axios-payload",
  ON_BACK_CLICK: "on-back-click",
  ON_RECORD_BUTTON_CLICK: "on-record-button-click"
};
export default {
  name: "CampaignManagerItemTable",
  components: {
    TheRecordsButton,
    Badge,
    CampaignManagerItemDeleteDialog,
    CampaignManagerItemRowActions,
    DataTable
  },
  props: {
    item: {
      type: Object
    },
    statusItems: {
      type: Array
    }
  },
  emits: EMITS,
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      labels,
      isShowDeleteDialog: false,
      isDeleteDialogActionButtonDisabled: false,
      axiosPayload: getDefaultAxiosPayload({ orderBy: "CreatedDate" }),
      CONSTANTS: {
        id: "campaign-manager-item-data-table",
        ascending: "ascending"
      },
      tableData: [],
      selectedRow: {},
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        savedFiltersLocalStorageKey:
          DEFAULT_SEARCH_CONTAINER_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE,
        savedTableSettingsLocalStorageKey:
          TABLE_SETTINGS_KEYS.CAMPAIGN_MANAGER_ITEM_TABLE,
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          COLUMNS.FREQUENCY,
          COLUMNS.START_TIME,
          COLUMNS.TARGET_USERS_ITEM_TABLE,
          COLUMNS.STATUS,
          COLUMNS.CREATE_TIME_ITEM_TABLE
        ],
        iEmpty: {
          message: labels.EmptyCampaignManagerReport,
          id: "btn-empty--campaign-manager-report"
        },
        addButton: {
          show: true,
          action: "on-add-button-click",
          tooltip: "Add a Campaign",
          id: "btn-add--item-campaign-manager",
          disabled: !this.$store.getters[
            "permissions/getCampaignManagerParentCreatePermissions"
          ]
        },
        rowActions: [
          {
            name: labels.Stop,
            isNotShow: true,
            id: "btn-stop--row-actions-campaign-item-manager",
            icon: "mdi-stop",
            action: "on-stop",
            disabled: !this.$store.getters[
              "permissions/getCampaignReportsPausePermissions"
            ]
          },
          {
            name: labels.Delete,
            id: "btn-delete--row-actions-campaign-manager",
            icon: "mdi-delete",
            action: "on-delete",
            disabled: !this.$store.getters[
              "permissions/getCampaignReportsDeletePermissions"
            ]
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    };
  },
  computed: {
    getTableAllRecordsText() {
      return `${labels.CampaignName}: ${this?.item?.name}`;
    },
    tableColumnsWithTooltips() {
      return this.tableOptions.columns.map((col) => {
        if (col.property === "totalTargetUserCount") {
          return {
            ...col,
            label: "Users",
            width: 240
          };
        }
        if (col.property === COLUMNS.STATUS.property) {
          return {
            ...col,
            width: 240,
            showHeaderTooltip: false
          };
        }
        return col;
      });
    }
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return;
        if (
          val.categoryDistributionType !== SCENARIO_DISTRIBUTION_TEXTS[0] &&
          val.frequency !== 0
        ) {
          this.tableOptions.addButton = {
            ...this.tableOptions.addButton,
            disabled: true,
            tooltip:
              "A new instance with frequency and random scenarios can’t be created."
          };
        } else {
          this.tableOptions.addButton = {
            ...this.tableOptions.addButton,
            disabled: false,
            tooltip: "Add a Campaign"
          };
        }
      }
    },
    statusItems: {
      handler(val) {
        if (val && val.length) {
          const col = this.tableOptions.columns.find(
            (col) => col.property === COLUMNS.STATUS.property
          );
          if (col) {
            this.$set(
              col,
              "filterableItems",
              val.map((item) => ({ ...item, value: item.text ?? item.value }))
            );
            this.reRenderFilters();
          }
        }
      },
      immediate: true
    }
  },
  created() {
    this.callForData();
  },
  methods: {
    callForData() {
      this.setLoading(true);
      this.$nextTick(() => {
        searchCampaignPhishingJob(this.axiosPayload, this.item.resourceId)
          .then((response) => {
            const {
              data: { data = [] }
            } = response;
            const {
              results = [],
              totalNumberOfRecords,
              totalNumberOfPages,
              pageNumber
            } = data;
            this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords;
            this.serverSideProps.totalNumberOfPages = totalNumberOfPages;
            this.serverSideProps.pageNumber = pageNumber;
            this.tableData = results.map((item) => {
              const newItem = JSON.parse(JSON.stringify(item));
              delete newItem["frequencyCount"];
              newItem.total = Number(item["frequencyCount"]) || 0;
              return newItem;
            });
          })
          .finally(this.setLoading);
      });
    },
    exportCampaignManagerItemList(downloadTypes = []) {
      downloadTypes.exportTypes.forEach((item) => {
        let payload = {
          pageNumber: downloadTypes.pageNumber,
          pageSize: downloadTypes.pageSize,
          orderBy: this.axiosPayload.orderBy,
          ascending: this.axiosPayload.ascending,
          reportAllPages: downloadTypes.reportAllPages,
          exportType: item === "XLS" ? "Excel" : item,
          filter: this.axiosPayload.filter
        };
        exportCampaignManagerItem(payload, this.item.resourceId).then(
          (response) => {
            const { data } = response;
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(data);
            link.download = `Campaign-Manager-Instance.${
              item.toLocaleLowerCase() === "xls"
                ? "xlsx"
                : item.toLocaleLowerCase()
            }`;
            link.click();
          }
        );
      });
    },
    handleBackClick() {
      this.$emit(EMITS.ON_BACK_CLICK);
    },
    handleOnAddButtonClick() {
      this.$emit("on-launch", { resourceId: this.item.resourceId });
    },
    toggleShowDeleteDialog() {
      if (this.isShowDeleteDialog) {
        this.selectedRow = {};
      }
      this.isShowDeleteDialog = !this.isShowDeleteDialog;
    },
    handleDelete(row = {}) {
      this.selectedRow = row;
      this.toggleShowDeleteDialog();
    },
    handleOnDelete(item = {}) {
      this.isDeleteDialogActionButtonDisabled = true;
      deletePhishingCampaignJob(this.item.resourceId, item.instanceGroup)
        .then(() => {
          this.$refs.refTable.unSelectRow(item);
          this.callForData();
        })
        .finally(() => {
          this.isDeleteDialogActionButtonDisabled = false;
          this.toggleShowDeleteDialog();
        });
    },
    handleStop(row = {}) {
      this.$emit("on-stop", {
        resourceId: this.item.resourceId,
        instanceGroup: row.instanceGroup
      });
    },
    handleLaunch(row = {}) {
      this.$emit("on-start", {
        resourceId: this.item.resourceId,
        instanceGroup: row.instanceGroup
      });
    },
    handlePreview(row) {
      this.$emit("on-preview", row);
    },
    getErrorMessage(row = {}) {
      if (row.status === "Error") {
        return row?.jobResultMessage || "";
      }
      return "";
    },
    getStatusBadgeProps(status = "") {
      return getStatusBadgeProps(status);
    },
    getTooltipDisabilityStatus(row = {}) {
      return row?.status !== "Error" || !row?.jobResultMessage;
    },
    isTargetUsersShowGroups(row = {}) {
      return [ACTION_STATUSES.IDLE, ACTION_STATUSES.SCHEDULED].includes(
        row?.status
      );
    },
    handleTargetUsersGroupsClick(row) {
      this.$emit("on-target-users-groups-click", {
        resourceId: this.item.resourceId,
        campaignType: this.item.campaignType,
        instanceGroup: row?.instanceGroup
      });
    },
    handleRecordButtonClick(row) {
      this.$emit(EMITS.ON_RECORD_BUTTON_CLICK, row);
    },
    reRenderFilters(filterValues = undefined) {
      this?.$refs?.refTable?.reRenderFilters(filterValues);
    },
    resetSearchText() {
      this.$refs.refTable.resetSearchText();
    },
    resetTable() {
      this.resetSearchText();
      this.reRenderFilters({});
      this.axiosPayload = getDefaultAxiosPayload({
        orderBy: "CreatedDate"
      });
    }
  }
};
</script>
