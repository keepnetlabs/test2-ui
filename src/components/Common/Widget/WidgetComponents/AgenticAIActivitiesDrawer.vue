<template>
  <div v-if="isVisible">
    <div
      class="common-simulator-preview-overlay agentic-ai-activities-drawer__overlay"
      @click="handleMainOverlayClick"
    ></div>
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
          <div
            v-if="!batchListLoading && !batchList.length && !leftSearch && !leftTypeFilter && !leftStatusFilter"
            class="agentic-ai-activities-drawer__empty-state"
          >
            <h2 class="agentic-ai-activities-drawer__empty-state-title">No activities yet</h2>
            <p class="agentic-ai-activities-drawer__empty-state-subtitle">
              Agentic AI hasn't taken any actions yet. Activities will appear here once the AI starts executing tasks.
            </p>
          </div>

          <template v-else>
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
              @scroll="handleBatchListScroll"
            >
              <div class="agentic-ai-activities-drawer__list">
                <div
                  v-if="batchListLoading"
                  class="agentic-ai-activities-drawer__skeleton-list"
                >
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="agentic-ai-activities-drawer__skeleton-card"
                  >
                    <div class="agentic-ai-activities-drawer__skeleton-line agentic-ai-activities-drawer__skeleton-line--title" />
                    <div class="agentic-ai-activities-drawer__skeleton-meta">
                      <div class="agentic-ai-activities-drawer__skeleton-line agentic-ai-activities-drawer__skeleton-line--badge" />
                      <div class="agentic-ai-activities-drawer__skeleton-line agentic-ai-activities-drawer__skeleton-line--date" />
                    </div>
                    <div class="agentic-ai-activities-drawer__skeleton-line agentic-ai-activities-drawer__skeleton-line--bar" />
                  </div>
                </div>
                <div
                  v-else-if="!batchList.length"
                  class="agentic-ai-activities-drawer__list-placeholder"
                >
                  No activities found.
                </div>

                <button
                  v-for="batch in batchList"
                  :key="batch.batchResourceId"
                  type="button"
                  class="agentic-ai-activities-drawer__batch-card"
                  :class="{
                    'agentic-ai-activities-drawer__batch-card--selected':
                      batch.batchResourceId === selectedBatchId
                  }"
                  @click="handleBatchSelect(batch)"
                >
                  <div class="agentic-ai-activities-drawer__batch-card-title-row">
                    <span class="agentic-ai-activities-drawer__batch-card-title">
                      {{ batch.title }}
                    </span>
                  </div>

                  <div class="agentic-ai-activities-drawer__batch-card-meta-main">
                    <span
                      v-if="batch.userCount !== null && batch.userCount !== undefined"
                      class="agentic-ai-activities-drawer__batch-card-meta"
                    >
                      <VIcon size="14" color="#667085">mdi-account-multiple</VIcon>
                      {{ getUserCountText(batch.userCount) }}
                    </span>
                    <template v-if="batch.subtitle">
                      <span class="agentic-ai-activities-drawer__batch-card-meta-sep">·</span>
                      <span class="agentic-ai-activities-drawer__batch-card-type">{{
                        batch.subtitle
                      }}</span>
                    </template>
                    <template v-if="batch.createTime">
                      <span class="agentic-ai-activities-drawer__batch-card-meta-sep">·</span>
                      <span class="agentic-ai-activities-drawer__batch-card-date">{{
                        formatBatchDate(batch.createTime)
                      }}</span>
                    </template>
                  </div>

                  <div class="agentic-ai-activities-drawer__batch-card-chips">
                    <v-chip
                      v-if="getBatchStatusCounts(batch).pending > 0"
                      small
                      label
                      class="agentic-ai-activities-drawer__batch-card-chip agentic-ai-activities-drawer__batch-card-chip--pending"
                      outlined
                    >
                      {{ getBatchStatusCounts(batch).pending }} pending
                    </v-chip>
                    <v-chip
                      v-if="getBatchStatusCounts(batch).approved > 0"
                      small
                      label
                      class="agentic-ai-activities-drawer__batch-card-chip agentic-ai-activities-drawer__batch-card-chip--approved"
                      outlined
                    >
                      {{ getBatchStatusCounts(batch).approved }} approved
                    </v-chip>
                    <v-chip
                      v-if="getBatchStatusCounts(batch).retrying > 0"
                      small
                      label
                      class="agentic-ai-activities-drawer__batch-card-chip agentic-ai-activities-drawer__batch-card-chip--retrying"
                      outlined
                    >
                      {{ getBatchStatusCounts(batch).retrying }} retrying
                    </v-chip>
                    <v-chip
                      v-if="getBatchStatusCounts(batch).declined > 0"
                      small
                      label
                      class="agentic-ai-activities-drawer__batch-card-chip agentic-ai-activities-drawer__batch-card-chip--declined"
                      outlined
                    >
                      {{ getBatchStatusCounts(batch).declined }} declined
                    </v-chip>
                    <v-chip
                      v-if="getBatchStatusCounts(batch).retried > 0"
                      small
                      label
                      class="agentic-ai-activities-drawer__batch-card-chip agentic-ai-activities-drawer__batch-card-chip--retried"
                      outlined
                    >
                      {{ getBatchStatusCounts(batch).retried }} retried
                    </v-chip>
                  </div>

                  <div class="agentic-ai-activities-drawer__batch-card-progress">
                    <div
                      class="agentic-ai-activities-drawer__batch-card-progress-bar agentic-ai-activities-drawer__batch-card-progress-bar--approved"
                      :style="{ width: getBatchSegmentWidth(batch, 'approved') }"
                    />
                    <div
                      class="agentic-ai-activities-drawer__batch-card-progress-bar agentic-ai-activities-drawer__batch-card-progress-bar--pending"
                      :style="{ width: getBatchSegmentWidth(batch, 'pending') }"
                    />
                    <div
                      class="agentic-ai-activities-drawer__batch-card-progress-bar agentic-ai-activities-drawer__batch-card-progress-bar--retrying"
                      :style="{ width: getBatchSegmentWidth(batch, 'retrying') }"
                    />
                    <div
                      class="agentic-ai-activities-drawer__batch-card-progress-bar agentic-ai-activities-drawer__batch-card-progress-bar--retried"
                      :style="{ width: getBatchSegmentWidth(batch, 'retried') }"
                    />
                    <div
                      class="agentic-ai-activities-drawer__batch-card-progress-bar agentic-ai-activities-drawer__batch-card-progress-bar--declined"
                      :style="{ width: getBatchSegmentWidth(batch, 'declined') }"
                    />
                  </div>
                </button>

                <div
                  v-if="batchListLoadingMore"
                  class="agentic-ai-activities-drawer__list-loader agentic-ai-activities-drawer__list-loader--append"
                >
                  <v-progress-circular indeterminate size="24" width="2" color="primary" />
                </div>
              </div>
            </div>

            <multipane-resizer class="agentic-ai-activities-drawer__resizer" />

            <div
              class="pane agentic-ai-activities-drawer__pane agentic-ai-activities-drawer__pane--detail"
              :style="{ flexGrow: 1 }"
            >
              <template v-if="selectedBatch || pagedTableData.length || isLoading">
                <div
                  v-if="showApproveAllBanner"
                  class="agentic-ai-activities-drawer__detail-header"
                >
                  <div class="agentic-ai-activities-drawer__detail-header-actions">
                    <VBtn
                      class="agentic-ai-activities-drawer__approval-button agentic-ai-activities-drawer__approval-button--approve"
                      rounded
                      small
                      :disabled="actionInProgress"
                      @click="handleApprove(selectedBatch)"
                    >
                      <VIcon size="14" class="mr-1">mdi-check</VIcon>
                      Approve All
                    </VBtn>
                    <VBtn
                      class="agentic-ai-activities-drawer__approval-button agentic-ai-activities-drawer__approval-button--decline"
                      rounded
                      small
                      outlined
                      :disabled="actionInProgress"
                      @click="handleDeclineAll(selectedBatch)"
                    >
                      <VIcon size="14" class="mr-1">mdi-close</VIcon>
                      Decline All
                    </VBtn>
                  </div>
                  <v-chip
                    outlined
                    small
                    label
                    color="#2196f3"
                    text-color="#2196f3"
                    style="font-weight: 600"
                  >
                    {{ selectedBatchPendingCount }} pending
                  </v-chip>
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
                    <template #datatable-custom-column="{ scope, col }">
                      <template v-if="col.property === 'status'">
                        <v-tooltip
                          v-if="shouldShowApprovalStatusDeclineReasonTooltip(scope.row)"
                          bottom
                          opacity="1"
                          max-width="360px"
                          :z-index="1200"
                        >
                          <template #activator="{ on }">
                            <div v-on="on" class="d-flex justify-center">
                              <Badge
                                v-bind="col.props"
                                :color="getStatusBadgeColor(scope.row.status)"
                                :full-width="col.fullWidth"
                                :text="formatApprovalStatusCellLabel(scope.row.status)"
                              />
                            </div>
                          </template>
                          <span class="agentic-ai-activities-drawer__approval-status-tooltip">{{
                            scope.row.declineReason
                          }}</span>
                        </v-tooltip>
                        <DataTableStatus
                          v-else
                          :scope="scope"
                          :col="agenticApprovalStatusColumnForCell(col)"
                        />
                      </template>
                    </template>
                    <template #datatable-row-actions="{ scope }">
                      <div
                        class="d-flex align-center justify-end flex-nowrap agentic-ai-activities-drawer__row-actions"
                        :class="
                          isExecuted(scope.row)
                            ? 'agentic-ai-activities-drawer__row-actions--dual'
                            : 'agentic-ai-activities-drawer__row-actions--single'
                        "
                      >
                        <DefaultButtonRowAction
                          icon="mdi-eye"
                          :id="getViewActionId(scope.$index)"
                          text="Preview"
                          :scope="scope"
                          :check-is-owner-property="false"
                          :class="isExecuted(scope.row) ? 'mr-1' : ''"
                          @on-click="handleView(scope.row)"
                        />
                        <DefaultButtonRowAction
                          v-if="isExecuted(scope.row)"
                          icon="mdi-text-box"
                          :id="`btn-agentic-ai-activity-report-${scope.$index}`"
                          text="View Report"
                          :scope="scope"
                          :check-is-owner-property="false"
                          @on-click="handleViewReport(scope.row)"
                        />
                      </div>
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
          </template>
        </div>
      </div>

      <CommonSimulatorPreviewDialog
        v-if="previewType === 'Phishing'"
        :status="previewType === 'Phishing' && !previewClosing"
        :selected-row="previewSelectedRow"
        :api-func="getPhishingScenarioLandingPageAndEmailTemplate"
        is-nested
        read-only
        :show-approval-footer="isPreviewRowWaitingForApproval"
        :show-retry-button="isPreviewRowError"
        :approval-type-name="previewType"
        :reasoning-text="previewReasoningText"
        :decline-reason-text="previewDeclineReasonText"
        :approval-actions-disabled="previewApprovalActionsDisabled"
        :approval-actions-disabled-tooltip="inactiveTargetUserApprovalTooltip"
        @approve="handlePreviewApprove"
        @decline="handlePreviewDecline"
        @retry="handlePreviewRetry"
        @on-close="onPreviewClosed"
      />
      <CommonSimulatorPreviewDialog
        v-if="previewType === 'Quishing'"
        :type="PREVIEW_DIALOG_TYPES.QUISHING"
        :status="previewType === 'Quishing' && !previewClosing"
        :selected-row="previewSelectedRow"
        :api-func="getQuishingScenarioLandingPageAndEmailTemplate"
        is-nested
        read-only
        :show-approval-footer="isPreviewRowWaitingForApproval"
        :show-retry-button="isPreviewRowError"
        :approval-type-name="previewType"
        :reasoning-text="previewReasoningText"
        :decline-reason-text="previewDeclineReasonText"
        :approval-actions-disabled="previewApprovalActionsDisabled"
        :approval-actions-disabled-tooltip="inactiveTargetUserApprovalTooltip"
        @approve="handlePreviewApprove"
        @decline="handlePreviewDecline"
        @retry="handlePreviewRetry"
        @on-close="onPreviewClosed"
      />
      <TrainingLibraryDrawer
        v-if="previewType === 'Training'"
        :value="previewType === 'Training' && !previewClosing"
        :training-data="previewSelectedRow"
        only-preview
        is-nested
        :show-approval-footer="isPreviewRowWaitingForApproval"
        :show-retry-button="isPreviewRowError"
        approval-type-name="Training"
        :reasoning-text="previewReasoningText"
        :decline-reason-text="previewDeclineReasonText"
        :approval-actions-disabled="previewApprovalActionsDisabled"
        :approval-actions-disabled-tooltip="inactiveTargetUserApprovalTooltip"
        @approve="handlePreviewApprove"
        @decline="handlePreviewDecline"
        @retry="handlePreviewRetry"
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
    <AgenticAIRejectDialog
      :status="rejectDialog.status"
      :action="rejectDialog.action"
      :loading="rejectDialog.loading"
      @cancel="closeRejectDialog"
      @confirm="handleRejectConfirm"
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
import KSelect from "@/components/Common/Inputs/KSelect.vue";
import DataTable from "@/components/DataTable";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import DefaultButtonRowAction from "@/components/SmallComponents/RowActions/DefaultButtonRowAction";
import AgenticAIConfirmDialog from "./AgenticAIConfirmDialog.vue";
import AgenticAIRejectDialog from "./AgenticAIRejectDialog.vue";
import CommonSimulatorPreviewDialog from "@/components/Common/Simulator/CommonSimulatorPreviewDialog.vue";
// TODO: SmishingScenarioPreview will be re-added after z-index fix
// import SmishingScenarioPreview from "@/components/SmishingScenarios/SmishingScenarioPreview.vue";
import TrainingLibraryDrawer from "@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawer.vue";
import TrainingLibraryLightbox from "@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightbox.vue";
import TrainingLibraryLightboxContent from "@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightboxContent.vue";
import { PREVIEW_DIALOG_TYPES } from "@/components/Common/Simulator/utils";
import useDrawerAnimation from "@/hooks/useDrawerAnimation";
import { searchAgenticAIActivities, approveAgenticAIBatch, approveAgenticAIActivity, rejectAgenticAIActivity, rejectAgenticAIBatch } from "@/api/company";
import { getPhishingScenarioLandingPageAndEmailTemplate } from "@/api/phishingsimulator";
import { getDefaultAxiosPayload, getDataTableFieldLabel as formatDataTableFieldLabel } from "@/utils/functions";
import Badge from "@/components/Badge";
import DataTableStatus from "@/components/DataTableComponents/DataTableStatus.vue";
import { columnFilterChanged, columnFilterCleared } from "@/utils/helperFunctions";
import QuishingService from "@/api/quishing";
import { retryAutonomous } from "@/api/agenticAIService";

const ACTIVITY_TYPE_MAP = {
  1: "Phishing",
  2: "Quishing",
  3: "Smishing",
  4: "Training"
};

const DEFAULT_BATCH_PRODUCT_FILTER_OPTIONS = [
  "Phishing",
  "Quishing",
  "Training"
];

/** Page size for grouped batch list (left pane); scroll loads next pages. */
const BATCH_LIST_PAGE_SIZE = 100;

const BATCH_LIST_SCROLL_LOAD_THRESHOLD_PX = 140;

/** Shown when Approve / Retry must be blocked because `targetUserStatus` is not Active. */
const INACTIVE_TARGET_USER_APPROVAL_TOOLTIP =
  "Approve and retry are unavailable when the target user status is not Active.";

export default {
  name: "AgenticAIActivitiesDrawer",
  mixins: [useDrawerAnimation],
  components: {
    AgenticAIConfirmDialog,
    AgenticAIRejectDialog,
    Badge,
    DataTable,
    DataTableStatus,
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
      serverSideProps: new ServerSideProps("", false, 10, 1, 0, 0),
      serverSideEvents: { pagination: true, search: true, sort: true },
      actionInProgress: false,
      axiosPayload: this.createDefaultPayload(),
      pagedTableData: [],
      batchList: [],
      batchListPageNumber: 1,
      batchListTotalRecords: 0,
      /** When API sends totalNumberOfPages, this drives hasMore (preferred over raw totals). */
      batchListTotalPages: 0,
      batchListLastPageSize: 0,
      batchListLoadingMore: false,
      /** Monotonic tokens for stale-response guards (safe in same tick; Date.now() is not). */
      batchRequestSeq: 0,
      activitiesRequestSeq: 0,
      /** requestAnimationFrame id for scroll; cleared on destroy. */
      batchListScrollRafId: null,
      batchTypeFilterOptions: [...DEFAULT_BATCH_PRODUCT_FILTER_OPTIONS],
      batchStatusFilterOptions: [],
      batchListLoading: false,
      selectedBatchId: null,
      leftSearch: "",
      leftSearchDebounceId: null,
      leftTypeFilter: null,
      leftStatusFilter: null,
      isLoading: false,
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
      rejectDialog: {
        status: false,
        action: null,
        row: null,
        loading: false
      },
      PREVIEW_DIALOG_TYPES,
      inactiveTargetUserApprovalTooltip: INACTIVE_TARGET_USER_APPROVAL_TOOLTIP,
      getPhishingScenarioLandingPageAndEmailTemplate,
      getQuishingScenarioLandingPageAndEmailTemplate:
        QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
    };
  },
  beforeDestroy() {
    this.clearLeftSearchDebounce();
    this.cancelBatchListScrollRaf();
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
    isPreviewRowError() {
      const s = String(this.previewActivityRow?.status || "").toLowerCase();
      return s === "error";
    },
    previewReasoningText() {
      return this.previewActivityRow?.explanationJson?.reasoningText || "";
    },
    /** Declined-row explainability; shown in preview card when present. */
    previewDeclineReasonText() {
      const raw = this.previewActivityRow?.declineReason;
      return raw && String(raw).trim() ? String(raw).trim() : "";
    },
    batchTypeFilterItems() {
      return this.getStableFilterItems(this.batchTypeFilterOptions, this.leftTypeFilter);
    },
    batchStatusFilterItems() {
      return this.getStableFilterItems(this.batchStatusFilterOptions, this.leftStatusFilter);
    },
    isCurrentBatchTraining() {
      if (!this.selectedBatch) return false;
      const first = this.selectedBatch.activities?.[0];
      if (first?.activityType === 4) return true;
      const raw = this.selectedBatch.contentType || this.selectedBatch.subtitle || "";
      return this.formatActivityTypeDisplay(String(raw)) === "Training";
    },
    drawerColumns() {
      let clonedColumns = (this.columns || []).map((column) => ({
        ...column
      }));
      if (this.isCurrentBatchTraining) {
        clonedColumns = clonedColumns.filter((column) => column.property !== "scenarioName");
      }
      const statusColumnIndex = clonedColumns.findIndex((column) => column.property === "status");

      const statusColumn =
        statusColumnIndex > -1
          ? {
              ...clonedColumns.splice(statusColumnIndex, 1)[0],
              label: "Approval Status",
              fixed: "right",
              type: "slot"
            }
          : null;

      return [...clonedColumns, ...(statusColumn ? [statusColumn] : [])];
    },
    batchListHasMore() {
      if (this.batchListTotalPages > 0) {
        return this.batchListPageNumber < this.batchListTotalPages;
      }
      const total = this.batchListTotalRecords;
      if (total > 0) {
        return this.batchList.length < total;
      }
      return this.batchListLastPageSize >= BATCH_LIST_PAGE_SIZE;
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
    previewApprovalActionsDisabled() {
      return this.previewActivityRow ? !this.isTargetUserActive(this.previewActivityRow) : false;
    },
    pendingApprovalText() {
      const count = this.selectedBatchPendingCount;
      return count === 1 ? "1 approval is waiting" : `${count} approvals are waiting`;
    }
  },
  methods: {
    formatActivityTypeDisplay(value = "") {
      const normalizedValue = String(value).trim().toLowerCase().replaceAll(/\s+/g, "");

      if (normalizedValue === "phishing" || normalizedValue === "phishingsimulation") {
        return "Phishing";
      }

      if (normalizedValue === "quishing" || normalizedValue === "quishingsimulation") {
        return "Quishing";
      }

      if (normalizedValue === "smishing" || normalizedValue === "smishingsimulation") {
        return "Smishing";
      }

      if (normalizedValue === "training") {
        return "Training";
      }

      return value;
    },
    createDefaultPayload(pageSize = 10, isGroupedByBatch = false) {
      return getDefaultAxiosPayload({ pageSize, isGroupedByBatch }, "CreateTime");
    },
    normalizeBatchTypeFilterLabel(value = "") {
      const normalizedValue = String(value).trim().toLowerCase().replaceAll(/\s+/g, "");

      if (normalizedValue === "smishing" || normalizedValue === "smishingsimulation") {
        return "";
      }

      return this.formatActivityTypeDisplay(value);
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

      if (normalizedValue === "pending" || normalizedValue === "waitingforapproval") {
        return "1";
      }

      if (normalizedValue === "declined" || normalizedValue === "rejected") {
        return "3";
      }

      if (normalizedValue === "approved" || normalizedValue === "executed") {
        return "4";
      }

      if (normalizedValue === "error") {
        return "5";
      }

      if (normalizedValue === "retrying") {
        return "6";
      }

      if (normalizedValue === "retried") {
        return "7";
      }

      return value;
    },
    buildBatchRequestPayload(pageNumber = 1) {
      const payload = this.createDefaultPayload(BATCH_LIST_PAGE_SIZE, true);
      payload.pageNumber = pageNumber;
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
          FieldName: "BatchStatusName",
          Operator: "=",
          Value: this.leftStatusFilter
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
      this.cancelBatchListScrollRaf();
      this.closeConfirmDialog();
      this.closeRejectDialog();
      this.serverSideProps = new ServerSideProps("", false, 10, 1, 0, 0);
      this.axiosPayload = this.createDefaultPayload(10, false);
      this.pagedTableData = [];
      this.batchList = [];
      this.batchListPageNumber = 1;
      this.batchListTotalRecords = 0;
      this.batchListTotalPages = 0;
      this.batchListLastPageSize = 0;
      this.batchListLoadingMore = false;
      this.batchRequestSeq = 0;
      this.activitiesRequestSeq = 0;
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
        targetUserStatus: "targetUserStatus",
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
        targetUserStatus: "TargetUserStatus",
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
      const normalizedAndGroupItems = andGroup.FilterItems.map((item) => this.normalizeFilterItem(item)).filter(
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
      return this.formatActivityTypeDisplay(
        ACTIVITY_TYPE_MAP[activity.activityType] || activity.activityTypeName || ""
      );
    },
    getBatchWaitingCount(statusCounts = {}) {
      return (
        statusCounts.Pending ??
        statusCounts.pending ??
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
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
      const statusMap = {
        pending: "Pending",
        "waiting for approval": "Pending",
        waitingforapproval: "Pending",
        declined: "Declined",
        rejected: "Declined",
        approved: "Approved",
        executed: "Approved",
        "awaiting approval": "Awaiting Approval",
        awaitingapproval: "Awaiting Approval",
        "all approved": "All Approved",
        allapproved: "All Approved",
        "all declined": "All Declined",
        alldeclined: "All Declined",
        error: "Error",
        retrying: "Retrying",
        retried: "Retried"
      };
      if (statusMap[cleaned]) return statusMap[cleaned];
      if (!cleaned) return status;
      return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
    },
    mapActivityToBatch(activity = {}) {
      const firstActivity = activity.activities?.[0] || {};
      const contentType = this.getActivityTypeName(firstActivity);
      const activityTypeName = this.formatActivityTypeDisplay(firstActivity.activityTypeName || contentType);
      const statusCounts = activity.statusCounts || {};

      return {
        batchResourceId: activity.batchResourceId || firstActivity.batchResourceId || activity.resourceId,
        title:
          activity.batchName ||
          firstActivity.batchName ||
          activity.campaignName ||
          firstActivity.campaignName ||
          "Untitled activity",
        subtitle: contentType || activityTypeName || "Activity",
        contentType: contentType || activityTypeName || "",
        activityTypeName: activityTypeName || contentType || "",
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
    /**
     * API may return a real boolean; avoid `Boolean("false") === true` if a string slips through.
     */
    normalizeTargetUserIsDeletedFlag(raw) {
      if (raw === true || raw === 1) return true;
      if (raw === false || raw === 0 || raw === null || raw === undefined) return false;
      return String(raw).trim().toLowerCase() === "true";
    },
    mapActivityToRow(activity) {
      const targetUserIsDeleted = this.normalizeTargetUserIsDeletedFlag(activity.targetUserIsDeleted);
      return {
        resourceId: activity.resourceId,
        batchResourceId: activity.batchResourceId,
        activityType: activity.activityType,
        activityTypeName: activity.activityTypeName,
        scenarioResourceId: activity.scenarioResourceId,
        scenarioName:
          activity.activityType === 4
            ? (activity.scenarioName || activity.contentCategory || "").trim()
            : activity.scenarioName,
        trainingResourceId: activity.trainingResourceId,
        enrollmentResourceId: activity.enrollmentResourceId,
        campaignResourceId: activity.campaignResourceId,
        targetUserResourceId: activity.targetUserResourceId || "",
        preferredLanguage: activity.preferredLanguage || "",
        firstName: activity.targetUserFirstName || "",
        lastName: activity.targetUserLastName || "",
        email: activity.targetUserEmail || "",
        department: activity.targetUserDepartment || "",
        targetUserIsDeleted,
        targetUserStatus: targetUserIsDeleted ? "Deleted" : activity.targetUserStatus || "",
        contentType: this.getActivityTypeName(activity),
        contentCategory: activity.contentCategory || "",
        status: this.normalizeStatus(activity.statusName || activity.status || ""),
        startDate: activity.executionTime || activity.createTime || "",
        instanceGroup: activity.instanceGroup,
        explanationJson: activity.explanationJson || null,
        declineReason: (activity.declineReason ?? "").trim() || null,
        retryOfActivityResourceId: activity.retryOfActivityResourceId || null,
        retryActivityResourceId: activity.retryActivityResourceId || null
      };
    },
    async fetchBatches({ preserveSelection = true, append = false } = {}) {
      if (!this.value) {
        return;
      }

      if (append) {
        if (this.batchListLoadingMore || this.batchListLoading || !this.batchListHasMore) {
          return;
        }
        this.batchListLoadingMore = true;
      } else {
        this.batchListLoading = true;
      }

      this.batchRequestSeq += 1;
      const requestId = this.batchRequestSeq;
      const previousSelection = preserveSelection ? this.selectedBatchId : null;
      const pageNumber = append ? this.batchListPageNumber + 1 : 1;

      try {
        const response = await searchAgenticAIActivities(this.buildBatchRequestPayload(pageNumber));
        const result = response.data?.data || {};

        if (requestId !== this.batchRequestSeq) {
          return;
        }

        const mappedBatches = (result.results || [])
          .map((item) => this.mapActivityToBatch(item))
          .filter(
            (item, index, list) =>
              item.batchResourceId &&
              index === list.findIndex((entry) => entry.batchResourceId === item.batchResourceId)
          );

        const apiTotal =
          result.totalNumberOfRecords ?? result.totalRowCount ?? result.totalCount ?? 0;
        const apiTotalPages = result.totalNumberOfPages ?? 0;

        if (append && mappedBatches.length === 0) {
          this.batchListTotalRecords = this.batchList.length;
          this.batchListLastPageSize = 0;
          this.batchListTotalPages = Math.max(this.batchListTotalPages, this.batchListPageNumber);
          return;
        }

        if (append) {
          const beforeCount = this.batchList.length;
          const merged = [...this.batchList];
          const seen = new Set(merged.map((b) => b.batchResourceId));
          for (const b of mappedBatches) {
            if (b.batchResourceId && !seen.has(b.batchResourceId)) {
              seen.add(b.batchResourceId);
              merged.push(b);
            }
          }
          if (mappedBatches.length > 0 && merged.length === beforeCount) {
            this.batchListTotalRecords = beforeCount;
            this.batchListLastPageSize = 0;
            this.batchListTotalPages = Math.max(this.batchListTotalPages, this.batchListPageNumber);
            return;
          }
          this.batchList = merged;
          this.batchListPageNumber = pageNumber;
          if (apiTotal > 0) {
            this.batchListTotalRecords = apiTotal;
          }
          if (apiTotalPages > 0) {
            this.batchListTotalPages = apiTotalPages;
          }
          this.syncBatchFilterOptions(mappedBatches);
        } else {
          this.syncBatchFilterOptions(mappedBatches);
          this.batchList = mappedBatches;
          this.batchListPageNumber = 1;
          this.batchListTotalRecords =
            apiTotal > 0 ? apiTotal : mappedBatches.length;
          this.batchListTotalPages = apiTotalPages > 0 ? apiTotalPages : 0;

          if (previousSelection && mappedBatches.some((item) => item.batchResourceId === previousSelection)) {
            this.selectedBatchId = previousSelection;
          } else {
            this.selectedBatchId = mappedBatches[0]?.batchResourceId || null;
          }
        }

        this.batchListLastPageSize = mappedBatches.length;
      } catch {
        if (!append) {
          this.batchList = [];
          this.selectedBatchId = null;
          this.batchListPageNumber = 1;
          this.batchListTotalRecords = 0;
          this.batchListTotalPages = 0;
          this.batchListLastPageSize = 0;
        }
      } finally {
        if (append) {
          this.batchListLoadingMore = false;
        } else {
          this.batchListLoading = false;
        }
      }
    },
    cancelBatchListScrollRaf() {
      if (this.batchListScrollRafId != null) {
        cancelAnimationFrame(this.batchListScrollRafId);
        this.batchListScrollRafId = null;
      }
    },
    handleBatchListScroll(event) {
      const el = event.currentTarget;
      if (!el) {
        return;
      }
      if (this.batchListScrollRafId != null) {
        return;
      }
      this.batchListScrollRafId = requestAnimationFrame(() => {
        this.batchListScrollRafId = null;
        this.loadMoreBatchesIfNearBottom(el);
      });
    },
    loadMoreBatchesIfNearBottom(el) {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight <= BATCH_LIST_SCROLL_LOAD_THRESHOLD_PX;
      if (!nearBottom) {
        return;
      }
      if (this.batchListLoading || this.batchListLoadingMore || !this.batchListHasMore) {
        return;
      }
      this.fetchBatches({ preserveSelection: true, append: true });
    },
    async fetchActivities() {
      if (!this.value) {
        return;
      }

      this.activitiesRequestSeq += 1;
      const requestId = this.activitiesRequestSeq;
      this.isLoading = true;

      try {
        const payload = this.buildRequestPayload();
        const response = await searchAgenticAIActivities(payload);
        const result = response.data.data;

        if (requestId !== this.activitiesRequestSeq) {
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
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
      return normalized === "pending" || normalized === "waiting for approval" || normalized === "waitingforapproval";
    },
    isTargetUserActive(row = {}) {
      if (row.targetUserIsDeleted) {
        return false;
      }
      const raw = row.targetUserStatus;
      if (raw === undefined || raw === null) {
        return true;
      }
      const normalized = String(raw).trim().toLowerCase();
      if (normalized === "deleted") {
        return false;
      }
      return normalized === "active";
    },
    /** Approve / Retry must be blocked when the recipient target user is not Active (Decline still allowed). */
    isTargetUserActionRestricted(row = {}) {
      return !this.isTargetUserActive(row);
    },
    isExecuted(row = {}) {
      const s = String(row.status || "").toLowerCase();
      return s === "approved" || s === "executed";
    },
    getViewActionId(index) {
      return `btn-agentic-ai-activity-view-${index}`;
    },
    getUserCountText(count = 0) {
      return String(count);
    },
    formatBatchDate(dateStr = "") {
      return dateStr || "";
    },
    /** Slot cell uses DataTableStatus; column from parent has `type: 'slot'`. */
    agenticApprovalStatusColumnForCell(col = {}) {
      return { ...col, type: "status" };
    },
    /** Hover tooltip for `declineReason` on Retried / Declined rows (same column slot). */
    shouldShowApprovalStatusDeclineReasonTooltip(row = {}) {
      const normalized = this.normalizeStatus(row.status || "").toLowerCase();
      const reason = row.declineReason;
      if (reason == null || String(reason).trim() === "") return false;
      return normalized === "retried" || normalized === "declined";
    },
    formatApprovalStatusCellLabel(value) {
      return formatDataTableFieldLabel(value);
    },
    getBatchStatusCounts(batch = {}) {
      const counts = batch.statusCounts || {};
      const approved = counts.Approved ?? counts.approved ?? counts.Executed ?? counts.executed ?? 0;
      const declined = counts.Declined ?? counts.declined ?? counts.Rejected ?? counts.rejected ?? 0;
      const pending = counts.Pending ?? counts.pending ?? counts.WaitingForApproval ?? 0;
      const retrying = counts.Retrying ?? counts.retrying ?? 0;
      const retried = counts.Retried ?? counts.retried ?? 0;
      return { approved, pending, declined, retrying, retried };
    },
    getBatchSegmentWidth(batch = {}, type = "pending") {
      const total = batch.userCount || 0;
      if (!total) return "0%";
      const { approved, pending, declined, retrying, retried } = this.getBatchStatusCounts(batch);
      const map = { approved, pending, declined, retrying, retried };
      const pct = Math.round(((map[type] || 0) / total) * 100);
      return `${pct}%`;
    },
    getStatusBadgeColor(status = "") {
      const normalized = this.normalizeStatus(status).toLowerCase();

      if (normalized === "pending" || normalized === "waiting for approval") {
        return "#2196f3";
      }

      if (normalized === "approved" || normalized === "executed") {
        return "#43a047";
      }

      if (normalized === "declined" || normalized === "rejected") {
        return "#757575";
      }

      if (normalized === "error") {
        return "#e53935";
      }

      if (normalized === "retrying") {
        return "#1173C1";
      }

      if (normalized === "retried") {
        return "#757575";
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
    handleApprove(row) {
      this.closeRejectDialog();
      const n = this.getApprovalCountForDialog(row) || 0;
      this.confirmDialog = {
        status: true,
        action: "approve",
        row,
        icon: "mdi-check",
        title: "Approve all recommendations?",
        message: `${n} pending recommendation${n === 1 ? "" : "s"} will be approved and launched immediately.`,
        recommendation: "",
        confirmText: "Approve All",
        loading: false
      };
    },
    handleDeclineAll(row) {
      this.closeConfirmDialog();
      this.rejectDialog = {
        status: true,
        action: "declineAll",
        row,
        loading: false
      };
    },
    /** Single-row approve: no AgenticAIConfirmDialog (bulk-only). */
    async handleApproveRow(row) {
      this.closeRejectDialog();
      await this.executeApproveReject("approveActivity", row);
    },
    /** Single-row decline: feedback dialog; API `declineForRetry: false` (permanent decline). */
    handleDecline(row) {
      this.closeConfirmDialog();
      this.rejectDialog = {
        status: true,
        action: "decline",
        row,
        loading: false
      };
    },
    closeRejectDialog() {
      this.rejectDialog = {
        status: false,
        action: null,
        row: null,
        loading: false
      };
    },
    /**
     * @param {string | { reason: string, declineForRetry: boolean }} payload — from AgenticAIRejectDialog (`reason`; `declineForRetry` true only for retry action).
     */
    async handleRejectConfirm(payload) {
      const { action, row } = this.rejectDialog;
      if (!row) return;
      const rejectPayload = this.normalizeRejectPayload(payload, action);
      this.rejectDialog.loading = true;
      await this.executeApproveReject(action, row, rejectPayload);
      this.rejectDialog.loading = false;
      this.closeRejectDialog();
      if (this.previewType) {
        this.onPreviewClosed();
      }
    },
    normalizeRejectPayload(payload, action) {
      if (typeof payload === "string") {
        return {
          reason: payload.trim(),
          declineForRetry: action === "retry"
        };
      }
      const reason = (payload?.reason ?? "").trim();
      return {
        reason,
        declineForRetry: action === "retry"
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
      if (this.previewType) this.closePreview();
    },
    showSnackbar(message, color = "green", icon = "mdi-check-circle") {
      this.$store.dispatch("common/createSnackBar", { message, color, icon });
    },
    buildAgenticRejectBody({ resourceIds, batchResourceId, reason, declineForRetry }) {
      const body = { ...(resourceIds ? { resourceIds } : {}), ...(batchResourceId ? { batchResourceId } : {}) };
      if (reason) {
        body.reason = reason;
      }
      if (declineForRetry !== undefined) {
        body.declineForRetry = declineForRetry;
      }
      return body;
    },
    async executeApproveReject(action, row, rejectPayload = {}) {
      if (!row || this.actionInProgress) return;
      const reason = typeof rejectPayload === "string" ? rejectPayload : rejectPayload?.reason ?? "";
      const declineForRetry =
        typeof rejectPayload === "object" && rejectPayload !== null && "declineForRetry" in rejectPayload
          ? !!rejectPayload.declineForRetry
          : action === "retry";
      if (
        (action === "approveActivity" || action === "retry") &&
        this.isTargetUserActionRestricted(row)
      ) {
        return;
      }
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
        } else if (action === "approveActivity") {
          const response = await approveAgenticAIActivity({ resourceIds: [row.resourceId] });
          const data = response.data?.data || {};
          const errors = data.errorCount || 0;
          if (errors > 0) {
            this.showSnackbar("Approval failed. Please try again.", "orange", "mdi-alert-circle");
          } else {
            this.showSnackbar("Action approved and executed successfully.", "green", "mdi-check-circle");
          }
          this.$emit("on-approve", row);
        } else if (action === "declineAll") {
          await rejectAgenticAIBatch(
            this.buildAgenticRejectBody({
              batchResourceId: row.batchResourceId,
              reason,
              declineForRetry
            })
          );
          this.showSnackbar("Pending recommendations declined.", "green", "mdi-close-circle");
          this.$emit("on-decline", row);
        } else if (action === "decline") {
          await rejectAgenticAIActivity(
            this.buildAgenticRejectBody({
              resourceIds: [row.resourceId],
              reason,
              declineForRetry
            })
          );
          this.showSnackbar("Recommendation declined.", "green", "mdi-close-circle");
          this.$emit("on-decline", row);
        } else if (action === "retry") {
          await rejectAgenticAIActivity(
            this.buildAgenticRejectBody({
              resourceIds: [row.resourceId],
              batchResourceId: row.batchResourceId,
              reason,
              declineForRetry: true
            })
          );
          const activityTypeActionMap = { 1: "phishing", 2: "phishing", 3: "phishing", 4: "training" };
          const actionName = activityTypeActionMap[row.activityType] || "phishing";
          retryAutonomous({
            targetUserResourceId: row.targetUserResourceId,
            firstName: row.firstName,
            lastName: row.lastName,
            departmentName: row.department,
            actions: [actionName],
            preferredLanguage: row.preferredLanguage,
            batchResourceId: row.batchResourceId,
            rejectingReason: reason,
            rejectedScenarioResourceId: row.scenarioResourceId,
            retryOfActivityResourceId: row.resourceId
          }).catch(() => {});
          this.showSnackbar(
            "Agentic AI request submitted. This may take 3-5 minutes. A new entry will appear in the table.",
            "green",
            "mdi-refresh"
          );
          this.$emit("on-retry", row);
        }
        await this.fetchBatches();
        this.fetchActivities();
      } catch {
        // error handled by interceptor
      } finally {
        this.actionInProgress = false;
      }
    },
    async handlePreviewApprove() {
      const row = this.previewActivityRow;
      if (!row) return;
      this.closePreview();
      await this.executeApproveReject("approveActivity", row);
    },
    /** Preview decline: same feedback dialog as table decline (permanent decline, `declineForRetry: false`). */
    handlePreviewDecline() {
      const row = this.previewActivityRow;
      if (!row) return;
      this.closeConfirmDialog();
      this.rejectDialog = {
        status: true,
        action: "decline",
        row,
        loading: false
      };
    },
    isRowError(row = {}) {
      return String(row.status || "").toLowerCase() === "error";
    },
    handleRetry(row) {
      this.closeConfirmDialog();
      this.rejectDialog = { status: true, action: "retry", row, loading: false };
    },
    handlePreviewRetry() {
      const row = this.previewActivityRow;
      if (!row) return;
      this.handleRetry(row);
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

