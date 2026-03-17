<template>
  <div v-if="isVisible">
    <div class="common-simulator-preview-overlay" @click="handleMainOverlayClick"></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      class="agentic-ai-activities-drawer"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="agentic-ai-activities-drawer__header">
        <span class="agentic-ai-activities-drawer__header-title">View Activities</span>
        <VIcon class="agentic-ai-activities-drawer__header-close" @click="closeDrawer">
          mdi-close
        </VIcon>
      </div>

      <div class="agentic-ai-activities-drawer__body">
        <div class="agentic-ai-activities-drawer__intro">
          <h2>Agentic AI Activities</h2>
          <p>Review grouped AI actions on the left and inspect recipients on the right.</p>
        </div>

        <div class="agentic-ai-activities-drawer__workspace">
          <div class="agentic-ai-activities-drawer__workspace-filters">
            <div class="agentic-ai-activities-drawer__list-filter-row">
              <div
                class="agentic-ai-activities-drawer__list-filter-item agentic-ai-activities-drawer__list-filter-item--search"
              >
                <VTextField
                  v-model="leftSearch"
                  hide-details
                  outlined
                  dense
                  clearable
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Search"
                  class="agentic-ai-activities-drawer__search"
                  @input="handleLeftSearchInput"
                  @click:clear="handleLeftSearchClear"
                />
              </div>
              <div class="agentic-ai-activities-drawer__list-filter-item">
                <KSelect
                  v-model="leftTypeFilter"
                  :items="batchTypeFilterItems"
                  hide-details
                  outlined
                  clearable
                  persistent-hint
                  min-width-type="medium"
                  placeholder="Product Type"
                  class="agentic-ai-activities-drawer__select"
                  @change="handleLeftFiltersChanged"
                />
              </div>
              <div class="agentic-ai-activities-drawer__list-filter-item">
                <KSelect
                  v-model="leftStatusFilter"
                  :items="batchStatusFilterItems"
                  hide-details
                  outlined
                  clearable
                  persistent-hint
                  min-width-type="medium"
                  placeholder="Status"
                  class="agentic-ai-activities-drawer__select"
                  @change="handleLeftFiltersChanged"
                />
              </div>
            </div>
          </div>
          <multipane class="agentic-ai-activities-drawer__panes" layout="vertical">
            <div
              class="pane agentic-ai-activities-drawer__pane agentic-ai-activities-drawer__pane--list agentic-ai-activities-drawer__pane--list-initial"
            >
              <div class="agentic-ai-activities-drawer__list">
                <div
                  v-if="batchListLoading"
                  class="agentic-ai-activities-drawer__list-placeholder"
                >
                  Loading activities...
                </div>
                <div
                  v-else-if="!filteredBatchList.length"
                  class="agentic-ai-activities-drawer__list-placeholder"
                >
                  No activities found.
                </div>

                <button
                  v-for="batch in filteredBatchList"
                  :key="batch.batchResourceId"
                  type="button"
                  class="agentic-ai-activities-drawer__batch-card"
                  :class="{
                    'agentic-ai-activities-drawer__batch-card--selected':
                      batch.batchResourceId === selectedBatchId
                  }"
                  :style="getBatchCardStyle(batch)"
                  @click="handleBatchSelect(batch)"
                >
                  <div class="agentic-ai-activities-drawer__batch-card-title-row">
                    <span
                      class="agentic-ai-activities-drawer__batch-card-title"
                      :style="getBatchCardTitleStyle(batch)"
                    >
                      {{ batch.title }}
                    </span>
                  </div>

                  <div class="agentic-ai-activities-drawer__batch-card-subtitle">
                    {{ batch.subtitle || "Activity" }}
                  </div>

                  <div class="agentic-ai-activities-drawer__batch-card-footer">
                    <Badge
                      :text="batch.status || 'Unknown'"
                      :color="getStatusBadgeColor(batch.status)"
                      size="small"
                      :full-width="false"
                      class-name="agentic-ai-activities-drawer__status-badge"
                    />

                    <span
                      v-if="batch.userCount !== null && batch.userCount !== undefined"
                      class="agentic-ai-activities-drawer__batch-card-meta"
                    >
                      <VIcon size="14" color="#667085">mdi-account-multiple</VIcon>
                      {{ getUserCountText(batch.userCount) }}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <multipane-resizer class="agentic-ai-activities-drawer__resizer" />

            <div
              class="pane agentic-ai-activities-drawer__pane agentic-ai-activities-drawer__pane--detail"
              :style="{ flexGrow: 1 }"
            >
              <template v-if="selectedBatch || pagedTableData.length || isLoading">
                <div class="agentic-ai-activities-drawer__detail-header">
                  <div>
                    <div class="agentic-ai-activities-drawer__detail-title">
                      <span class="agentic-ai-activities-drawer__detail-title-label">
                        Campaign Name:
                      </span>
                      <span class="agentic-ai-activities-drawer__detail-title-value">
                        {{ selectedBatchTitle }}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="showApproveAllBanner"
                  class="agentic-ai-activities-drawer__approval-banner"
                >
                  <span class="agentic-ai-activities-drawer__approval-text">
                    {{ pendingApprovalText }}
                  </span>
                  <VBtn
                    color="#ffffff"
                    class="agentic-ai-activities-drawer__approval-button"
                    rounded
                    :disabled="actionInProgress"
                    @click="handleApprove(selectedBatch)"
                  >
                    <VIcon left size="16" color="#2196f3">mdi-check</VIcon>
                    Approve All Users
                  </VBtn>
                </div>

                <div class="agentic-ai-activities-drawer__table-wrapper">
                  <DataTable
                    id="agentic-ai-activities-table"
                    ref="activitiesTable"
                    :table="pagedTableData"
                    :columns="drawerColumns"
                    :loading="isLoading"
                    :empty="empty"
                    :row-actions="rowActions"
                    :download-button="{ show: false }"
                    :is-settings-popup="true"
                    :axios-payload.sync="axiosPayload"
                    rowKey="resourceId"
                    filterable
                    options
                    is-server-side
                    :server-side-props="serverSideProps"
                    :server-side-events="serverSideEvents"
                    :show-refresh-button="true"
                    :showFilterOptions="true"
                    :pageSizes="[5, 10, 25]"
                    @server-side-page-number-changed="handleServerSidePageChange"
                    @server-side-size-changed="handleServerSideSizeChange"
                    @sortChangedEvent="handleSortChange"
                    @searchChangedEvent="handleSearchChange"
                    @columnFilterChanged="handleColumnFilterChanged"
                    @columnFilterCleared="handleColumnFilterCleared"
                    @refreshAction="handleRefresh"
                  >
                    <template #datatable-row-actions="{ scope }">
                      <DefaultButtonRowAction
                        icon="mdi-eye"
                        :id="getViewActionId(scope.$index)"
                        text="View"
                        :scope="scope"
                        @on-click="handleView(scope.row)"
                      />
                      <DefaultButtonRowAction
                        v-if="isExecuted(scope.row)"
                        icon="mdi-text-box"
                        :id="`btn-agentic-ai-activity-report-${scope.$index}`"
                        text="View Report"
                        :scope="scope"
                        @on-click="handleViewReport(scope.row)"
                      />
                      <DefaultButtonRowAction
                        v-if="isWaitingForApproval(scope.row)"
                        icon="mdi-close"
                        :id="`btn-agentic-ai-activity-reject-${scope.$index}`"
                        text="Reject"
                        :scope="scope"
                        @on-click="handleReject(scope.row)"
                      />
                    </template>
                  </DataTable>
                </div>
              </template>

              <div
                v-else
                class="agentic-ai-activities-drawer__detail-placeholder"
              >
                Select an activity from the left to view its recipients and actions.
              </div>
            </div>
          </multipane>
        </div>
      </div>

      <CommonSimulatorPreviewDialog
        v-if="previewType === 'Phishing'"
        :status="previewType === 'Phishing' && !previewClosing"
        :selected-row="previewSelectedRow"
        :api-func="getPhishingScenarioLandingPageAndEmailTemplate"
        read-only
        :show-approval-footer="isPreviewRowWaitingForApproval"
        :approval-type-name="previewType"
        @approve="handlePreviewApprove"
        @reject="handlePreviewReject"
        @on-close="onPreviewClosed"
      />
      <CommonSimulatorPreviewDialog
        v-if="previewType === 'Quishing'"
        :type="PREVIEW_DIALOG_TYPES.QUISHING"
        :status="previewType === 'Quishing' && !previewClosing"
        :selected-row="previewSelectedRow"
        :api-func="getQuishingScenarioLandingPageAndEmailTemplate"
        read-only
        :show-approval-footer="isPreviewRowWaitingForApproval"
        :approval-type-name="previewType"
        @approve="handlePreviewApprove"
        @reject="handlePreviewReject"
        @on-close="onPreviewClosed"
      />
      <TrainingLibraryDrawer
        v-if="previewType === 'Training'"
        :value="previewType === 'Training' && !previewClosing"
        :training-data="previewSelectedRow"
        only-preview
        is-nested
        :show-approval-footer="isPreviewRowWaitingForApproval"
        approval-type-name="Training"
        @approve="handlePreviewApprove"
        @reject="handlePreviewReject"
        @close="onPreviewClosed"
      />
    </VNavigationDrawer>

    <!-- TODO: SmishingScenarioPreview will be re-added after z-index fix -->
    <AgenticAIConfirmDialog
      :status="confirmDialog.status"
      :action="confirmDialog.action"
      :icon="confirmDialog.icon"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :recommendation="confirmDialog.recommendation"
      :confirm-text="confirmDialog.confirmText"
      :loading="confirmDialog.loading"
      @cancel="closeConfirmDialog"
      @confirm="handleConfirmAction"
    />
    <TrainingLibraryLightbox :value="getLightbox.status" @input="handleLightboxClose">
      <TrainingLibraryLightboxContent
        :preview-data="getLightbox.previewData"
        :is-loading="getLightbox.isLoading"
        :type="getLightbox.type"
      />
    </TrainingLibraryLightbox>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from "vue-multipane";
import Badge from "@/components/Badge.vue";
import KSelect from "@/components/Common/Inputs/KSelect.vue";
import DataTable from "@/components/DataTable";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import DefaultButtonRowAction from "@/components/SmallComponents/RowActions/DefaultButtonRowAction";
import AgenticAIConfirmDialog from "./AgenticAIConfirmDialog.vue";
import CommonSimulatorPreviewDialog from "@/components/Common/Simulator/CommonSimulatorPreviewDialog.vue";
// TODO: SmishingScenarioPreview will be re-added after z-index fix
// import SmishingScenarioPreview from "@/components/SmishingScenarios/SmishingScenarioPreview.vue";
import TrainingLibraryDrawer from "@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawer.vue";
import TrainingLibraryLightbox from "@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightbox.vue";
import TrainingLibraryLightboxContent from "@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightboxContent.vue";
import { PREVIEW_DIALOG_TYPES } from "@/components/Common/Simulator/utils";
import useDrawerAnimation from "@/hooks/useDrawerAnimation";
import { searchAgenticAIActivities, approveAgenticAIBatch, rejectAgenticAIActivity } from "@/api/company";
import { getPhishingScenarioLandingPageAndEmailTemplate } from "@/api/phishingsimulator";
import { getDefaultAxiosPayload } from "@/utils/functions";
import { columnFilterChanged, columnFilterCleared } from "@/utils/helperFunctions";
import QuishingService from "@/api/quishing";

const ACTIVITY_TYPE_MAP = {
  1: "Phishing Simulation",
  2: "Quishing Simulation",
  3: "Smishing Simulation",
  4: "Training"
};

const DEFAULT_BATCH_PRODUCT_FILTER_OPTIONS = [
  "Phishing Simulation",
  "Quishing Simulation",
  "Training"
];

export default {
  name: "AgenticAIActivitiesDrawer",
  mixins: [useDrawerAnimation],
  components: {
    AgenticAIConfirmDialog,
    Badge,
    DataTable,
    DefaultButtonRowAction,
    CommonSimulatorPreviewDialog,
    KSelect,
    TrainingLibraryDrawer,
    TrainingLibraryLightbox,
    TrainingLibraryLightboxContent,
    Multipane,
    MultipaneResizer
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    rowActions: {
      type: Array,
      default: () => []
    },
    empty: {
      type: Object,
      default: () => ({
        message: "No data available",
        subMes: ""
      })
    }
  },
  data() {
    return {
      serverSideProps: new ServerSideProps("", false, 5, 1, 0, 0),
      serverSideEvents: { pagination: true, search: true, sort: true },
      actionInProgress: false,
      axiosPayload: this.createDefaultPayload(),
      pagedTableData: [],
      batchList: [],
      batchTypeFilterOptions: [...DEFAULT_BATCH_PRODUCT_FILTER_OPTIONS],
      batchStatusFilterOptions: [],
      batchListLoading: false,
      selectedBatchId: null,
      leftSearch: "",
      leftSearchDebounceId: null,
      leftTypeFilter: null,
      leftStatusFilter: null,
      isLoading: false,
      batchLatestRequestId: 0,
      latestRequestId: 0,
      previewSelectedRow: null,
      previewActivityRow: null,
      previewType: null,
      previewClosing: false,
      confirmDialog: {
        status: false,
        action: null,
        row: null,
        icon: "mdi-information",
        title: "",
        message: "",
        recommendation: "",
        confirmText: "",
        loading: false
      },
      PREVIEW_DIALOG_TYPES,
      getPhishingScenarioLandingPageAndEmailTemplate,
      getQuishingScenarioLandingPageAndEmailTemplate:
        QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
    };
  },
  beforeDestroy() {
    this.clearLeftSearchDebounce();
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this.initializeDrawerData();
      }
    },
    "getLightbox.status"(isOpen) {
      const drawerBody = this.$el?.querySelector(".agentic-ai-activities-drawer__body");
      if (drawerBody) {
        drawerBody.style.overflowY = isOpen ? "hidden" : "";
      }
    }
  },
  computed: {
    status() {
      return this.value;
    },
    isNested() {
      return false;
    },
    getNavigationDrawerClass() {
      return {
        "k-navigation-drawer k-navigation-drawer--preview-dialog": true
      };
    },
    getLightbox() {
      return this.$store.getters["trainingLibrary/getLightbox"] || {};
    },
    hasNestedPreview() {
      return this.previewType !== null;
    },
    isPreviewRowWaitingForApproval() {
      return this.previewActivityRow ? this.isWaitingForApproval(this.previewActivityRow) : false;
    },
    batchTypeFilterItems() {
      return this.getStableFilterItems(this.batchTypeFilterOptions, this.leftTypeFilter);
    },
    batchStatusFilterItems() {
      return this.getStableFilterItems(this.batchStatusFilterOptions, this.leftStatusFilter);
    },
    drawerColumns() {
      const clonedColumns = (this.columns || []).map((column) => ({
        ...column
      }));
      const scenarioColumnIndex = clonedColumns.findIndex(
        (column) => column.property === "scenarioName"
      );
      const statusColumnIndex = clonedColumns.findIndex((column) => column.property === "status");

      const scenarioColumn =
        scenarioColumnIndex > -1
          ? {
              ...clonedColumns.splice(scenarioColumnIndex, 1)[0],
              label: "Scenario Name",
              filterableType: "text",
              fixed: "right"
            }
          : {
              label: "Scenario Name",
              property: "scenarioName",
              type: "text",
              show: true,
              filterableType: "text",
              minWidth: 180,
              width: 180,
              fixed: "right"
            };

      const statusColumn =
        statusColumnIndex > -1
          ? {
              ...clonedColumns.splice(
                scenarioColumnIndex > -1 && statusColumnIndex > scenarioColumnIndex
                  ? statusColumnIndex - 1
                  : statusColumnIndex,
                1
              )[0],
              label: "Approval Status",
              fixed: "right"
            }
          : null;

      return [...clonedColumns, scenarioColumn, ...(statusColumn ? [statusColumn] : [])];
    },
    filteredBatchList() {
      return this.batchList;
    },
    selectedBatch() {
      return this.batchList.find((item) => item.batchResourceId === this.selectedBatchId) || null;
    },
    selectedBatchTitle() {
      return this.selectedBatch?.title || "Select an activity";
    },
    selectedBatchPendingCount() {
      const batchPendingCount = this.selectedBatch?.waitingCount;
      if (batchPendingCount !== null && batchPendingCount !== undefined) {
        return Number(batchPendingCount) || 0;
      }
      return this.pagedTableData.filter((item) => this.isWaitingForApproval(item)).length;
    },
    showApproveAllBanner() {
      return !!this.selectedBatch && this.selectedBatchPendingCount > 0;
    },
    pendingApprovalText() {
      const count = this.selectedBatchPendingCount;
      return count === 1 ? "1 approval is waiting" : `${count} approvals are waiting`;
    }
  },
  methods: {
    createDefaultPayload(pageSize = 5, isGroupedByBatch = false) {
      return getDefaultAxiosPayload({ pageSize, isGroupedByBatch }, "CreateTime");
    },
    normalizeBatchTypeFilterLabel(value = "") {
      const normalizedValue = String(value).trim().toLowerCase().replaceAll(/\s+/g, "");

      if (normalizedValue === "phishing" || normalizedValue === "phishingsimulation") {
        return "Phishing Simulation";
      }

      if (normalizedValue === "quishing" || normalizedValue === "quishingsimulation") {
        return "Quishing Simulation";
      }

      if (normalizedValue === "training") {
        return "Training";
      }

      if (normalizedValue === "smishing" || normalizedValue === "smishingsimulation") {
        return "";
      }

      return value;
    },
    getBatchTypeFilterValueForApi(value = "") {
      const normalizedValue = String(value).trim().toLowerCase().replaceAll(/\s+/g, "");

      if (normalizedValue === "phishing" || normalizedValue === "phishingsimulation") {
        return "1";
      }

      if (normalizedValue === "quishing" || normalizedValue === "quishingsimulation") {
        return "2";
      }

      if (normalizedValue === "training") {
        return "4";
      }

      return value;
    },
    getStatusFilterValueForApi(value = "") {
      const normalizedValue = String(value).trim().toLowerCase().replaceAll(/\s+/g, "");

      if (normalizedValue === "waitingforapproval") {
        return "1";
      }

      if (normalizedValue === "approved") {
        return "2";
      }

      if (normalizedValue === "rejected") {
        return "3";
      }

      if (normalizedValue === "executed") {
        return "4";
      }

      if (normalizedValue === "error") {
        return "5";
      }

      return value;
    },
    buildBatchRequestPayload() {
      const payload = this.createDefaultPayload(100, true);
      const searchValue = this.leftSearch?.trim() || "";

      payload.isGroupedByBatch = true;
      payload.filter.SearchInputTextValue = searchValue;
      payload.filter.FilterGroups[0].FilterItems = [];
      payload.filter.FilterGroups[1].FilterItems = [];

      if (this.leftTypeFilter) {
        payload.filter.FilterGroups[0].FilterItems.push({
          FieldName: "ActivityType",
          Operator: "Include",
          Value: this.getBatchTypeFilterValueForApi(this.leftTypeFilter)
        });
      }

      if (this.leftStatusFilter) {
        payload.filter.FilterGroups[0].FilterItems.push({
          FieldName: "Status",
          Operator: "Include",
          Value: this.getStatusFilterValueForApi(this.leftStatusFilter)
        });
      }

      if (searchValue) {
        payload.filter.FilterGroups[1].FilterItems.push(
          {
            FieldName: "batchName",
            Operator: "Contains",
            Value: searchValue
          },
          {
            FieldName: "scenarioName",
            Operator: "Contains",
            Value: searchValue
          },
          {
            FieldName: "activityTypeName",
            Operator: "Contains",
            Value: searchValue
          },
          {
            FieldName: "contentCategory",
            Operator: "Contains",
            Value: searchValue
          },
          {
            FieldName: "StatusName",
            Operator: "Contains",
            Value: searchValue
          }
        );
      }

      return payload;
    },
    initializeDrawerData() {
      this.serverSideProps = new ServerSideProps("", false, 5, 1, 0, 0);
      this.axiosPayload = this.createDefaultPayload(5, false);
      this.pagedTableData = [];
      this.batchList = [];
      this.batchTypeFilterOptions = [...DEFAULT_BATCH_PRODUCT_FILTER_OPTIONS];
      this.batchStatusFilterOptions = [];
      this.batchListLoading = false;
      this.selectedBatchId = null;
      this.leftSearch = "";
      this.clearLeftSearchDebounce();
      this.leftTypeFilter = null;
      this.leftStatusFilter = null;
      this.$nextTick(this.moveToBody);
      this.fetchBatches({ preserveSelection: false }).then(() => {
        this.fetchActivities();
      });
    },
    getStableFilterItems(items = [], selectedValue = null) {
      if (!selectedValue || items.includes(selectedValue)) {
        return items;
      }
      return [selectedValue, ...items];
    },
    syncBatchFilterOptions(batches = []) {
      const nextTypeOptions = batches
        .map((item) => item.activityTypeName || item.contentType)
        .map((value) => this.normalizeBatchTypeFilterLabel(value))
        .filter(Boolean);
      const nextStatusOptions = batches.map((item) => item.status).filter(Boolean);

      this.batchTypeFilterOptions = [...new Set([...this.batchTypeFilterOptions, ...nextTypeOptions])];
      this.batchStatusFilterOptions = [...new Set([...this.batchStatusFilterOptions, ...nextStatusOptions])];
    },
    getFilterFieldName(property) {
      const fieldMap = {
        firstName: "targetUserFirstName",
        lastName: "targetUserLastName",
        email: "targetUserEmail",
        department: "targetUserDepartment",
        contentType: "ActivityType",
        contentCategory: "contentCategory",
        status: "Status",
        startDate: "createTime"
      };
      return fieldMap[property] || property;
    },
    getSortFieldName(property) {
      const fieldMap = {
        firstName: "TargetUserFirstName",
        lastName: "TargetUserLastName",
        email: "TargetUserEmail",
        department: "TargetUserDepartment",
        contentType: "ActivityType",
        contentCategory: "ContentCategory",
        status: "Status",
        startDate: "CreateTime"
      };
      return fieldMap[property] || property || "CreateTime";
    },
    normalizeFilterItem(filterItem = {}) {
      return {
        ...filterItem,
        FieldName: this.getFilterFieldName(filterItem.FieldName),
        Value: filterItem.Value ?? filterItem.value ?? ""
      };
    },
    buildRequestPayload() {
      const filterGroups = this.axiosPayload?.filter?.FilterGroups || [];
      const andGroup = filterGroups[0] || { Condition: "AND", FilterItems: [], FilterGroups: [] };
      const orGroup = filterGroups[1] || { Condition: "OR", FilterItems: [], FilterGroups: [] };
      const normalizedAndGroupItems = andGroup.FilterItems.map((item) => this.normalizeFilterItem(item))
        .filter(
          (item) =>
            item.FieldName !== "batchResourceId" && item.FieldName !== "BatchResourceId"
        );

      if (this.selectedBatchId) {
        normalizedAndGroupItems.push({
          FieldName: "BatchResourceId",
          Operator: "=",
          Value: this.selectedBatchId
        });
      }

      return {
        ...this.axiosPayload,
        isGroupedByBatch: false,
        pageNumber: this.serverSideProps.pageNumber,
        pageSize: this.serverSideProps.pageSize,
        orderBy: this.getSortFieldName(this.axiosPayload.orderBy),
        filter: {
          ...this.axiosPayload.filter,
          FilterGroups: [
            {
              ...andGroup,
              FilterItems: normalizedAndGroupItems
            },
            {
              ...orGroup,
              FilterItems: orGroup.FilterItems.map((item) => this.normalizeFilterItem(item))
            }
          ]
        }
      };
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1;
      this.serverSideProps.pageNumber = 1;
    },
    getActivityTypeName(activity = {}) {
      return ACTIVITY_TYPE_MAP[activity.activityType] || activity.activityTypeName || "";
    },
    getBatchWaitingCount(statusCounts = {}) {
      return (
        statusCounts.WaitingForApproval ??
        statusCounts["Waiting For Approval"] ??
        statusCounts.waitingForApproval ??
        statusCounts["waiting for approval"] ??
        0
      );
    },
    normalizeStatus(status = "") {
      const cleaned = String(status)
        .trim()
        .toLowerCase()
        .replaceAll(/[_-]+/g, " ")
        .replaceAll(/\s+/g, " ");
      const statusMap = {
        "waiting for approval": "Waiting for Approval",
        waitingforapproval: "Waiting for Approval",
        executed: "Executed",
        rejected: "Rejected",
        approved: "Approved",
        error: "Error"
      };
      if (statusMap[cleaned]) return statusMap[cleaned];
      if (!cleaned) return status;
      return cleaned.replaceAll(/\b\w/g, (char) => char.toUpperCase());
    },
    mapActivityToBatch(activity = {}) {
      const firstActivity = activity.activities?.[0] || {};
      const contentType = this.getActivityTypeName(firstActivity);
      const statusCounts = activity.statusCounts || {};

      return {
        batchResourceId: activity.batchResourceId || firstActivity.batchResourceId || activity.resourceId,
        title:
          activity.batchName ||
          firstActivity.batchName ||
          activity.campaignName ||
          firstActivity.campaignName ||
          "Untitled activity",
        subtitle: contentType || firstActivity.activityTypeName || "Activity",
        contentType: contentType || firstActivity.activityTypeName || "",
        activityTypeName: firstActivity.activityTypeName || contentType || "",
        contentCategory: firstActivity.contentCategory || "",
        status: this.normalizeStatus(activity.batchStatus || activity.statusName || firstActivity.statusName || ""),
        userCount:
          activity.activityCount ??
          activity.totalUserCount ??
          activity.userCount ??
          activity.totalCount ??
          activity.totalRowCount ??
          null,
        waitingCount: this.getBatchWaitingCount(statusCounts),
        scenarioName: firstActivity.scenarioName || "",
        campaignName: activity.batchName || firstActivity.campaignName || "",
        createTime: activity.executionTime || activity.createTime || firstActivity.createTime || "",
        lastActivityTime: activity.lastActivityTime || "",
        activities: activity.activities || [],
        statusCounts
      };
    },
    mapActivityToRow(activity) {
      return {
        resourceId: activity.resourceId,
        batchResourceId: activity.batchResourceId,
        activityType: activity.activityType,
        activityTypeName: activity.activityTypeName,
        scenarioResourceId: activity.scenarioResourceId,
        scenarioName: activity.scenarioName,
        trainingResourceId: activity.trainingResourceId,
        enrollmentResourceId: activity.enrollmentResourceId,
        campaignResourceId: activity.campaignResourceId,
        firstName: activity.targetUserFirstName || "",
        lastName: activity.targetUserLastName || "",
        email: activity.targetUserEmail || "",
        department: activity.targetUserDepartment || "",
        contentType: this.getActivityTypeName(activity),
        contentCategory: activity.contentCategory || "",
        status: this.normalizeStatus(activity.statusName || activity.status || ""),
        startDate: activity.executionTime || activity.createTime || "",
        instanceGroup: activity.instanceGroup
      };
    },
    async fetchBatches({ preserveSelection = true } = {}) {
      if (!this.value) {
        return;
      }

      const requestId = Date.now();
      this.batchLatestRequestId = requestId;
      this.batchListLoading = true;
      const previousSelection = preserveSelection ? this.selectedBatchId : null;

      try {
        const response = await searchAgenticAIActivities(this.buildBatchRequestPayload());
        const result = response.data?.data || {};

        if (this.batchLatestRequestId !== requestId) {
          return;
        }

        const mappedBatches = (result.results || [])
          .map((item) => this.mapActivityToBatch(item))
          .filter(
            (item, index, list) =>
              item.batchResourceId &&
              index === list.findIndex((entry) => entry.batchResourceId === item.batchResourceId)
          );

        this.syncBatchFilterOptions(mappedBatches);
        this.batchList = mappedBatches;

        if (previousSelection && mappedBatches.some((item) => item.batchResourceId === previousSelection)) {
          this.selectedBatchId = previousSelection;
        } else {
          this.selectedBatchId = mappedBatches[0]?.batchResourceId || null;
        }
      } catch {
        this.batchList = [];
        this.selectedBatchId = null;
      } finally {
        this.batchListLoading = false;
      }
    },
    async fetchActivities() {
      if (!this.value) {
        return;
      }

      const requestId = Date.now();
      this.latestRequestId = requestId;
      this.isLoading = true;

      try {
        const payload = this.buildRequestPayload();
        const response = await searchAgenticAIActivities(payload);
        const result = response.data.data;

        if (this.latestRequestId !== requestId) {
          return;
        }

        const activities = result.results || [];
        this.pagedTableData = activities.map((item) => this.mapActivityToRow(item));
        this.serverSideProps.totalNumberOfRecords =
          result.totalNumberOfRecords || activities[0]?.totalRowCount || 0;
        this.serverSideProps.totalNumberOfPages = result.totalNumberOfPages || 1;

        if (this.serverSideProps.pageNumber > this.serverSideProps.totalNumberOfPages) {
          this.serverSideProps.pageNumber = 1;
        }
      } catch {
        this.pagedTableData = [];
      } finally {
        this.isLoading = false;
        this.$nextTick(this.refreshTableLayout);
      }
    },
    refreshTableLayout() {
      const tableRef = this.$refs.activitiesTable;
      if (tableRef) {
        tableRef.lastColFixed = true;
        tableRef.actionFixed = "right";
      }
      if (tableRef?.$refs?.elTableRef?.doLayout) {
        tableRef.$refs.elTableRef.doLayout();
      }
    },
    clearLeftSearchDebounce() {
      if (this.leftSearchDebounceId) {
        clearTimeout(this.leftSearchDebounceId);
        this.leftSearchDebounceId = null;
      }
    },
    handleLeftSearchInput() {
      this.clearLeftSearchDebounce();
      this.leftSearchDebounceId = setTimeout(() => {
        this.handleLeftFiltersChanged();
        this.leftSearchDebounceId = null;
      }, 250);
    },
    handleLeftSearchClear() {
      this.clearLeftSearchDebounce();
      this.handleLeftFiltersChanged();
    },
    handleLeftFiltersChanged() {
      const previousSelection = this.selectedBatchId;

      this.fetchBatches().then(() => {
        if (!this.selectedBatchId) {
          this.pagedTableData = [];
          return;
        }

        if (previousSelection !== this.selectedBatchId) {
          this.resetPageNumber();
          this.fetchActivities();
        }
      });
    },
    handleBatchSelect(batch) {
      if (!batch?.batchResourceId || batch.batchResourceId === this.selectedBatchId) {
        return;
      }

      this.selectedBatchId = batch.batchResourceId;
      this.resetPageNumber();
      this.fetchActivities();
    },
    handleServerSidePageChange(pageNumber) {
      this.axiosPayload.pageNumber = pageNumber;
      this.serverSideProps.pageNumber = pageNumber;
      this.fetchActivities();
    },
    handleServerSideSizeChange(pageSize) {
      this.axiosPayload.pageSize = pageSize;
      this.serverSideProps.pageSize = pageSize;
      this.resetPageNumber();
      this.fetchActivities();
    },
    handleSortChange({ order, prop } = {}) {
      this.axiosPayload.ascending = order === "ascending";
      this.axiosPayload.orderBy = prop || "CreateTime";
      this.fetchActivities();
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter?.filter?.FilterGroups?.[0]?.FilterItems || [];
      this.axiosPayload.filter.SearchInputTextValue =
        searchFilter?.filter?.SearchInputTextValue || "";
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems];
      this.resetPageNumber();
      this.fetchActivities();
    },
    async handleRefresh() {
      await this.fetchActivities();
    },
    handleColumnFilterChanged(filter) {
      this.resetPageNumber();
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      ).map((item) => ({
        ...item,
        Value: item.Value ?? item.value ?? ""
      }));
      this.fetchActivities();
    },
    handleColumnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      );
      this.resetPageNumber();
      this.fetchActivities();
    },
    isWaitingForApproval(row = {}) {
      const normalized = String(row.status || "")
        .trim()
        .toLowerCase()
        .replaceAll(/[_-]+/g, " ")
        .replaceAll(/\s+/g, " ");
      return normalized === "waiting for approval" || normalized === "waitingforapproval";
    },
    isExecuted(row = {}) {
      return String(row.status || "").toLowerCase() === "executed";
    },
    getViewActionId(index) {
      return `btn-agentic-ai-activity-view-${index}`;
    },
    getUserCountText(count = 0) {
      return String(count);
    },
    getBatchCardStyle(batch = {}) {
      if (batch.batchResourceId !== this.selectedBatchId) {
        return {};
      }

      return {
        backgroundColor: "#f1f8fe"
      };
    },
    getBatchCardTitleStyle(batch = {}) {
      if (batch.batchResourceId !== this.selectedBatchId) {
        return {};
      }

      return {
        color: "#2196f3"
      };
    },
    getStatusBadgeColor(status = "") {
      const normalized = this.normalizeStatus(status).toLowerCase();

      if (normalized === "waiting for approval") {
        return "#2196f3";
      }

      if (normalized === "executed" || normalized === "approved") {
        return "#43a047";
      }

      if (normalized === "rejected" || normalized === "error") {
        return "#e53935";
      }

      return "#667085";
    },
    async handleView(row) {
      const typeMap = { 1: "Phishing", 2: "Quishing", 3: "Smishing", 4: "Training" };
      const previewType = typeMap[row.activityType];

      if (!previewType) {
        return;
      }

      this.previewType = null;
      this.previewSelectedRow = null;
      this.previewActivityRow = null;
      this.previewClosing = false;

      this.$nextTick(() => {
        this.$nextTick(() => {
          this.previewActivityRow = row;

          if (previewType === "Training") {
            if (!row.trainingResourceId) return;
            this.previewSelectedRow = {
              trainingId: row.trainingResourceId
            };
            this.previewType = previewType;
            return;
          }

          if (!row.scenarioResourceId) {
            return;
          }

          this.previewSelectedRow = {
            resourceId: row.scenarioResourceId,
            name: row.scenarioName || ""
          };
          this.previewType = previewType;
        });
      });
    },
    closePreview() {
      this.previewClosing = true;
    },
    onPreviewClosed() {
      this.previewType = null;
      this.previewSelectedRow = null;
      this.previewActivityRow = null;
      this.previewClosing = false;
    },
    handleMainOverlayClick() {
      if (this.previewClosing) {
        this.onPreviewClosed();
        this.closeDrawer();
        return;
      }
      if (this.hasNestedPreview) {
        this.closePreview();
        return;
      }
      this.closeDrawer();
    },
    handleLightboxClose(value) {
      if (!value) {
        this.$store.commit("trainingLibrary/SET_LIGHTBOX", {
          status: false,
          previewData: null,
          isLoading: false,
          type: null
        });
      }
    },
    getApprovalCountForDialog(row = {}) {
      if (row.batchResourceId) {
        if (row.batchResourceId === this.selectedBatchId && this.selectedBatchPendingCount > 0) {
          return this.selectedBatchPendingCount;
        }
        if (row.waitingCount !== null && row.waitingCount !== undefined) {
          return Number(row.waitingCount) || 0;
        }
      }
      return this.isWaitingForApproval(row) ? 1 : 0;
    },
    getRejectDisplayName(row = {}) {
      const fullName = [row.firstName, row.lastName].filter(Boolean).join(" ").trim();
      return fullName || row.email || "This user";
    },
    handleApprove(row) {
      const approvalCount = this.getApprovalCountForDialog(row);
      this.confirmDialog = {
        status: true,
        action: "approve",
        row,
        icon: "mdi-check",
        title: "Confirm Approval",
        message: `${
          approvalCount || 0
        } approval${approvalCount === 1 ? "" : "s"} will be approved. Reviewing the scenario and user list beforehand is recommended. This action cannot be undone.`,
        recommendation: "",
        confirmText: "APPROVE ALL USERS",
        loading: false
      };
    },
    handleReject(row) {
      const rejectDisplayName = this.getRejectDisplayName(row);
      this.confirmDialog = {
        status: true,
        action: "reject",
        row,
        icon: "mdi-close",
        title: "Confirm Rejection",
        message: `${rejectDisplayName}'s approval will be rejected. This action cannot be undone.`,
        recommendation: "",
        confirmText: "REJECT USER",
        loading: false
      };
    },
    closeConfirmDialog() {
      this.confirmDialog = {
        ...this.confirmDialog,
        status: false,
        row: null,
        action: null,
        loading: false
      };
    },
    async handleConfirmAction() {
      const { action, row } = this.confirmDialog;
      if (!row) return;
      this.confirmDialog.loading = true;
      await this.executeApproveReject(action, row);
      this.confirmDialog.loading = false;
      this.closeConfirmDialog();
    },
    showSnackbar(message, color = "green", icon = "mdi-check-circle") {
      this.$store.dispatch("common/createSnackBar", { message, color, icon });
    },
    async executeApproveReject(action, row) {
      if (!row || this.actionInProgress) return;
      this.actionInProgress = true;
      try {
        if (action === "approve") {
          const response = await approveAgenticAIBatch({ batchResourceId: row.batchResourceId });
          const data = response.data?.data || {};
          const approved = data.approvedCount || 0;
          const errors = data.errorCount || 0;
          if (errors > 0) {
            this.showSnackbar(`${approved} approved, ${errors} failed`, "orange", "mdi-alert-circle");
          } else {
            this.showSnackbar("Action approved and executed successfully.", "green", "mdi-check-circle");
          }
          this.$emit("on-approve", row);
        } else if (action === "reject") {
          await rejectAgenticAIActivity({ resourceIds: [row.resourceId] });
          this.showSnackbar("Action rejected and will not be executed.", "green", "mdi-close-circle");
          this.$emit("on-reject", row);
        }
        await this.fetchBatches();
        this.fetchActivities();
      } catch {
        // error handled by interceptor
      } finally {
        this.actionInProgress = false;
      }
    },
    handlePreviewApprove() {
      const row = this.previewActivityRow;
      if (!row) return;
      this.closePreview();
      this.executeApproveReject("approve", row);
    },
    handlePreviewReject() {
      const row = this.previewActivityRow;
      if (!row) return;
      this.closePreview();
      this.executeApproveReject("reject", row);
    },
    handleViewReport(row) {
      const instanceGroup = row.instanceGroup || 1;
      const typeRouteMap = {
        1: { name: "Campaign Report", params: { id: row.campaignResourceId, instanceGroup } },
        2: { name: "Quishing Report", params: { id: row.campaignResourceId, instanceGroup } },
        3: { name: "Smishing Report", params: { id: row.campaignResourceId, instanceGroup } },
        4: { name: "Training Report", params: { id: row.enrollmentResourceId || row.batchResourceId } }
      };
      const routeConfig = typeRouteMap[row.activityType];
      if (!routeConfig) return;
      const route = this.$router.resolve(routeConfig);
      window.open(route.href, "_blank");
    },
    moveToBody() {
      const target = document.querySelector(".v-application") || document.body;
      if (!this.$el || this.$el === target) {
        return;
      }
      if (this.$el.parentNode !== target) {
        target.appendChild(this.$el);
      }
      this.$nextTick(this.refreshTableLayout);
    }
  }
};
</script>

