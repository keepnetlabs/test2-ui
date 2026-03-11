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
      <span class="agentic-ai-activities-drawer__header-title"
        >View Activities</span
      >
      <VIcon
        class="agentic-ai-activities-drawer__header-close"
        @click="closeDrawer"
      >
        mdi-close
      </VIcon>
    </div>
    <div class="agentic-ai-activities-drawer__body">
      <div class="agentic-ai-activities-drawer__intro">
        <h2>Agentic AI Activities</h2>
        <p>All AI actions across approval, rejection, and execution stages.</p>
      </div>
      <DataTable
        id="agentic-ai-activities-table"
        ref="activitiesTable"
        :table="pagedTableData"
        :columns="columns"
        :loading="isLoading"
        :empty="empty"
        :row-actions="rowActions"
        :download-button="{ show: false }"
        :is-settings-popup="false"
        :axios-payload.sync="axiosPayload"
        rowKey="resourceId"
        filterable
        options
        is-server-side
        :server-side-props="serverSideProps"
        :server-side-events="serverSideEvents"
        :show-refresh-button="true"
        :showFilterOptions="false"
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
          <span :style="isWaitingForApproval(scope.row) ? { marginRight: '-4px' } : {}">
            <DefaultButtonRowAction
              icon="mdi-eye"
              :id="getViewActionId(scope.$index)"
              text="View"
              :scope="scope"
              @on-click="handleView(scope.row)"
            />
          </span>
          <DefaultButtonRowAction
            v-if="isExecuted(scope.row)"
            icon="mdi-text-box"
            :id="`btn-agentic-ai-activity-report-${scope.$index}`"
            text="View Report"
            :scope="scope"
            @on-click="handleViewReport(scope.row)"
          />
          <RowActionsMenu v-if="isWaitingForApproval(scope.row)" :disabled="actionInProgress">
            <DefaultMenuRowAction
              id="btn-agentic-ai-activity-approve"
              icon="mdi-check-circle"
              :text="`Approve ${scope.row.activityTypeName || ''}`"
              :scope="scope"
              :disabled="actionInProgress"
              @on-click="handleApprove(scope.row)"
            />
            <DefaultMenuRowAction
              id="btn-agentic-ai-activity-reject"
              icon="mdi-close-circle"
              :text="`Reject ${scope.row.activityTypeName || ''}`"
              :scope="scope"
              :disabled="actionInProgress"
              @on-click="handleReject(scope.row)"
            />
          </RowActionsMenu>
        </template>
      </DataTable>
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
      @preview-first="handleConfirmPreviewFirst"
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
import DataTable from "@/components/DataTable";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import DefaultButtonRowAction from "@/components/SmallComponents/RowActions/DefaultButtonRowAction";
import DefaultMenuRowAction from "@/components/SmallComponents/RowActions/DefaultMenuRowAction";
import RowActionsMenu from "@/components/SmallComponents/RowActions/RowActionsMenu";
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

export default {
  name: "AgenticAIActivitiesDrawer",
  mixins: [useDrawerAnimation],
  components: {
    AgenticAIConfirmDialog,
    DataTable,
    DefaultButtonRowAction,
    DefaultMenuRowAction,
    RowActionsMenu,
    CommonSimulatorPreviewDialog,
    TrainingLibraryDrawer,
    TrainingLibraryLightbox,
    TrainingLibraryLightboxContent
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
      axiosPayload: getDefaultAxiosPayload({ pageSize: 5, isGroupedByBatch: false }, 'CreateTime'),
      pagedTableData: [],
      isLoading: false,
      latestRequestId: 0,
      previewSelectedRow: null,
      previewActivityRow: null,
      previewType: null,
      previewClosing: false,
      confirmDialog: {
        status: false,
        action: null,
        row: null,
        icon: 'mdi-information',
        title: '',
        message: '',
        recommendation: '',
        confirmText: '',
        loading: false
      },
      PREVIEW_DIALOG_TYPES,
      getPhishingScenarioLandingPageAndEmailTemplate,
      getQuishingScenarioLandingPageAndEmailTemplate: QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
    };
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this.axiosPayload = getDefaultAxiosPayload(
          { pageSize: this.serverSideProps.pageSize || 5, isGroupedByBatch: false },
          'CreateTime'
        );
        this.serverSideProps.pageNumber = 1;
        this.$nextTick(this.moveToBody);
        this.fetchActivities();
      }
    },
    'getLightbox.status'(isOpen) {
      const drawerBody = this.$el?.querySelector('.agentic-ai-activities-drawer__body');
      if (drawerBody) {
        drawerBody.style.overflowY = isOpen ? 'hidden' : '';
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
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true
      };
    },
    getLightbox() {
      return this.$store.getters['trainingLibrary/getLightbox'] || {};
    },
    hasNestedPreview() {
      return this.previewType !== null;
    },
    isPreviewRowWaitingForApproval() {
      return this.previewActivityRow ? this.isWaitingForApproval(this.previewActivityRow) : false;
    }
  },
  methods: {
    getFilterFieldName(property) {
      const fieldMap = {
        firstName: 'targetUserFirstName',
        lastName: 'targetUserLastName',
        email: 'targetUserEmail',
        department: 'targetUserDepartment',
        contentType: 'activityTypeName',
        contentCategory: 'contentCategory',
        status: 'statusName',
        startDate: 'createTime'
      };
      return fieldMap[property] || property;
    },
    getSortFieldName(property) {
      const fieldMap = {
        firstName: 'TargetUserFirstName',
        lastName: 'TargetUserLastName',
        email: 'TargetUserEmail',
        department: 'TargetUserDepartment',
        contentType: 'ActivityType',
        contentCategory: 'ContentCategory',
        status: 'Status',
        startDate: 'CreateTime'
      };
      return fieldMap[property] || property || 'CreateTime';
    },
    normalizeFilterItem(filterItem = {}) {
      return {
        ...filterItem,
        FieldName: this.getFilterFieldName(filterItem.FieldName),
        Value: filterItem.Value ?? filterItem.value ?? ''
      };
    },
    buildRequestPayload() {
      const filterGroups = this.axiosPayload?.filter?.FilterGroups || [];
      const andGroup = filterGroups[0] || { Condition: 'AND', FilterItems: [], FilterGroups: [] };
      const orGroup = filterGroups[1] || { Condition: 'OR', FilterItems: [], FilterGroups: [] };

      return {
        ...this.axiosPayload,
        pageNumber: this.serverSideProps.pageNumber,
        pageSize: this.serverSideProps.pageSize,
        orderBy: this.getSortFieldName(this.axiosPayload.orderBy),
        filter: {
          ...this.axiosPayload.filter,
          FilterGroups: [
            {
              ...andGroup,
              FilterItems: andGroup.FilterItems.map((item) => this.normalizeFilterItem(item))
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
    mapActivityToRow(activity) {
      const activityTypeMap = {
        1: 'Phishing Simulation',
        2: 'Quishing Simulation',
        3: 'Smishing Simulation',
        4: 'Training'
      };

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
        firstName: activity.targetUserFirstName || '',
        lastName: activity.targetUserLastName || '',
        email: activity.targetUserEmail || '',
        department: activity.targetUserDepartment || '',
        contentType: activityTypeMap[activity.activityType] || activity.activityTypeName || '',
        contentCategory: activity.contentCategory || '',
        status: this.normalizeStatus(activity.statusName || ''),
        startDate: activity.executionTime || activity.createTime || ''
      };
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
        this.pagedTableData = activities.map(a => this.mapActivityToRow(a));
        this.serverSideProps.totalNumberOfRecords = result.totalNumberOfRecords || activities[0]?.totalRowCount || 0;
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
      if (tableRef?.$refs?.elTableRef?.doLayout) {
        tableRef.$refs.elTableRef.doLayout();
      }
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
      this.axiosPayload.ascending = order === 'ascending';
      this.axiosPayload.orderBy = prop || 'CreateTime';
      this.fetchActivities();
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter?.filter?.FilterGroups?.[0]?.FilterItems || [];
      this.axiosPayload.filter.SearchInputTextValue =
        searchFilter?.filter?.SearchInputTextValue || '';
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems];
      this.resetPageNumber();
      this.fetchActivities();
    },
    handleRefresh() {
      this.fetchActivities();
    },
    handleColumnFilterChanged(filter) {
      this.resetPageNumber();
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      ).map((item) => ({
        ...item,
        Value: item.Value ?? item.value ?? ''
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
    isWaitingForApproval(row = {}) {
      const normalized = String(row.status || "")
        .trim()
        .toLowerCase()
        .replaceAll(/[_-]+/g, " ")
        .replaceAll(/\s+/g, " ");
      return (
        normalized === "waiting for approval" ||
        normalized === "waitingforapproval"
      );
    },
    getViewActionId(index) {
      return `btn-agentic-ai-activity-view-${index}`;
    },
    async handleView(row) {
      // TODO: Smishing (3) preview will be re-added after z-index fix
      const typeMap = { 1: 'Phishing', 2: 'Quishing', 3: 'Smishing', 4: 'Training' };
      const previewType = typeMap[row.activityType];

      if (!previewType) {
        return;
      }

      // Reset previous preview state first to ensure clean re-open
      this.previewType = null;
      this.previewSelectedRow = null;
      this.previewActivityRow = null;
      this.previewClosing = false;

      // Use double nextTick to ensure Vue fully removes the previous component
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.previewActivityRow = row;

          if (previewType === 'Training') {
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
            name: row.scenarioName || ''
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
        this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
          status: false,
          previewData: null,
          isLoading: false,
          type: null
        });
      }
    },
    isExecuted(row = {}) {
      return String(row.status || '').toLowerCase() === 'executed';
    },
    handleApprove(row) {
      this.confirmDialog = {
        status: true,
        action: 'approve',
        row,
        icon: 'mdi-information',
        title: 'Approving Without Preview',
        message: "You're approving this action without previewing the content.",
        recommendation: 'Recommended: Preview first to review what will be sent.',
        confirmText: 'APPROVE ANYWAY'
      };
    },
    handleReject(row) {
      this.confirmDialog = {
        status: true,
        action: 'reject',
        row,
        icon: 'mdi-information',
        title: 'Rejecting Without Preview',
        message: "You're rejecting this action without previewing the content.",
        recommendation: 'Recommended: Preview first to review the content.',
        confirmText: 'REJECT ANYWAY'
      };
    },
    closeConfirmDialog() {
      this.confirmDialog = { ...this.confirmDialog, status: false, row: null, action: null };
    },
    handleConfirmPreviewFirst() {
      const row = this.confirmDialog.row;
      this.closeConfirmDialog();
      if (row) {
        this.handleView(row);
      }
    },
    async handleConfirmAction() {
      const { action, row } = this.confirmDialog;
      if (!row) return;
      this.confirmDialog.loading = true;
      await this.executeApproveReject(action, row);
      this.confirmDialog.loading = false;
      this.closeConfirmDialog();
    },
    showSnackbar(message, color = 'green', icon = 'mdi-check-circle') {
      this.$store.dispatch('common/createSnackBar', { message, color, icon });
    },
    async executeApproveReject(action, row) {
      if (!row || this.actionInProgress) return;
      this.actionInProgress = true;
      try {
        if (action === 'approve') {
          const response = await approveAgenticAIBatch({ batchResourceId: row.batchResourceId });
          const data = response.data?.data || {};
          const approved = data.approvedCount || 0;
          const errors = data.errorCount || 0;
          if (errors > 0) {
            this.showSnackbar(`${approved} approved, ${errors} failed`, 'orange', 'mdi-alert-circle');
          } else {
            this.showSnackbar('Action approved and executed successfully.', 'green', 'mdi-check-circle');
          }
          this.$emit("on-approve", row);
        } else if (action === 'reject') {
          await rejectAgenticAIActivity({ resourceIds: [row.resourceId] });
          this.showSnackbar('Action rejected and will not be executed.', 'green', 'mdi-close-circle');
          this.$emit("on-reject", row);
        }
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
      this.executeApproveReject('approve', row);
    },
    handlePreviewReject() {
      const row = this.previewActivityRow;
      if (!row) return;
      this.closePreview();
      this.executeApproveReject('reject', row);
    },
    handleViewReport(row) {
      const instanceGroup = row.instanceGroup || 1;
      const typeRouteMap = {
        1: { name: 'Campaign Report', params: { id: row.campaignResourceId, instanceGroup } },
        2: { name: 'Quishing Report', params: { id: row.campaignResourceId, instanceGroup } },
        3: { name: 'Smishing Report', params: { id: row.campaignResourceId, instanceGroup } },
        4: { name: 'Training Report', params: { id: row.enrollmentResourceId || row.batchResourceId } }
      };
      const routeConfig = typeRouteMap[row.activityType];
      if (!routeConfig) return;
      const route = this.$router.resolve(routeConfig);
      window.open(route.href, '_blank');
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

