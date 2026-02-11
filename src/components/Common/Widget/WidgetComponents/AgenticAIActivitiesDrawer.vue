<template>
  <VNavigationDrawer
    v-if="value"
    v-click-outside="handleDrawerClickOutside"
    :value="value"
    class="k-navigation-drawer agentic-ai-activities-drawer"
    temporary
    fixed
    overlay-color="rgba(0, 0, 0, 0.17)"
    overlay-opacity="1"
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
        @click="handleClose"
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
        :stored-table-settings="storedTableSettings"
        :saved-table-settings-local-storage-key="savedTableSettingsKey"
        rowKey="email"
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
          <RowActionsMenu v-if="isWaitingForApproval(scope.row)">
            <DefaultMenuRowAction
              id="btn-agentic-ai-activity-approve"
              icon="mdi-check-circle-outline"
              text="Approve"
              class-name="agentic-ai-activities-drawer__menu-item"
              :scope="scope"
              @on-click="handleApprove(scope.row)"
            />
            <DefaultMenuRowAction
              id="btn-agentic-ai-activity-reject"
              icon="mdi-close-circle-outline"
              text="Reject"
              class-name="agentic-ai-activities-drawer__menu-item"
              :scope="scope"
              @on-click="handleReject(scope.row)"
            />
          </RowActionsMenu>
        </template>
      </DataTable>
    </div>
  </VNavigationDrawer>
</template>

<script>
import DataTable from "@/components/DataTable";
import ServerSideProps from "@/helper-classes/server-side-table-props";
import DefaultButtonRowAction from "@/components/SmallComponents/RowActions/DefaultButtonRowAction";
import DefaultMenuRowAction from "@/components/SmallComponents/RowActions/DefaultMenuRowAction";
import RowActionsMenu from "@/components/SmallComponents/RowActions/RowActionsMenu";

export default {
  name: "AgenticAIActivitiesDrawer",
  components: {
    DataTable,
    DefaultButtonRowAction,
    DefaultMenuRowAction,
    RowActionsMenu
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
    tableData: {
      type: Array,
      default: () => []
    },
    rowActions: {
      type: Array,
      default: () => []
    },
    shouldControlBodyScroll: {
      type: Boolean,
      default: true
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
      searchText: "",
      sortProps: null,
      pagedTableData: [],
      isLoading: false,
      latestRequestId: 0,
      savedTableSettingsKey: "agentic-ai-activities-table",
      storedTableSettings: {
        firstColFixed: true,
        lastColFixed: true,
        renderedColumns: []
      }
    };
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this.$nextTick(this.moveToBody);
        if (this.shouldControlBodyScroll) {
          this.disableBodyScroll();
        }
        this.fetchActivities();
      } else if (this.shouldControlBodyScroll) {
        this.enableBodyScroll();
      }
    }
  },
  mounted() {
    if (this.value) {
      this.$nextTick(this.moveToBody);
      if (this.shouldControlBodyScroll) {
        this.disableBodyScroll();
      }
      this.fetchActivities();
    }
  },
  beforeDestroy() {
    if (this.shouldControlBodyScroll) {
      this.enableBodyScroll();
    }
  },
  methods: {
    disableBodyScroll() {
      const html = document.querySelector("html");
      if (html) {
        html.style.overflowY = "hidden";
      }
      const body = document.querySelector("body");
      if (body) {
        body.style.overflowY = "hidden";
      }
    },
    enableBodyScroll() {
      const html = document.querySelector("html");
      if (html) {
        html.style.overflowY = "";
      }
      const body = document.querySelector("body");
      if (body) {
        body.style.overflowY = "";
      }
    },
    mockApiRequest(payload) {
      return new Promise((resolve) => {
        window.setTimeout(() => {
          resolve(payload);
        }, 350);
      });
    },
    applySearch(data, searchValue) {
      if (!searchValue) {
        return data;
      }
      const normalized = searchValue.trim().toLowerCase();
      return data.filter((row) =>
        this.columns.some((column) => {
          const value = row?.[column.property];
          if (value === undefined || value === null) {
            return false;
          }
          return String(value).toLowerCase().includes(normalized);
        })
      );
    },
    applySort(data, sortProps) {
      if (!sortProps || !sortProps.prop || !sortProps.order) {
        return data;
      }
      const direction = sortProps.order === "descending" ? -1 : 1;
      return [...data].sort((a, b) => {
        const aVal = a?.[sortProps.prop];
        const bVal = b?.[sortProps.prop];
        if (aVal === undefined || aVal === null) return -1 * direction;
        if (bVal === undefined || bVal === null) return 1 * direction;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * direction;
        }
        return String(aVal).localeCompare(String(bVal)) * direction;
      });
    },
    applyPagination(data, pageNumber, pageSize) {
      const startIndex = Math.max(pageNumber - 1, 0) * pageSize;
      return data.slice(startIndex, startIndex + pageSize);
    },
    async fetchActivities() {
      if (!this.value) {
        return;
      }
      const requestId = Date.now();
      this.latestRequestId = requestId;
      this.isLoading = true;
      const sourceData = [...this.tableData];
      const searchValue = this.searchText;
      const sortProps = this.sortProps;
      const pageNumber = this.serverSideProps.pageNumber;
      const pageSize = this.serverSideProps.pageSize;
      const filtered = this.applySearch(sourceData, searchValue);
      const sorted = this.applySort(filtered, sortProps);
      const totalNumberOfRecords = sorted.length;
      const totalNumberOfPages = Math.max(
        Math.ceil(totalNumberOfRecords / pageSize),
        1
      );
      const pagedData = this.applyPagination(sorted, pageNumber, pageSize);
      const normalizedPagedData = pagedData.map((row) => ({
        ...row,
        status: this.normalizeStatus(row.status)
      }));
      const response = await this.mockApiRequest({
        data: normalizedPagedData,
        totalNumberOfRecords,
        totalNumberOfPages
      });
      if (this.latestRequestId !== requestId) {
        return;
      }
      this.serverSideProps.totalNumberOfRecords = response.totalNumberOfRecords;
      this.serverSideProps.totalNumberOfPages = response.totalNumberOfPages;
      if (this.serverSideProps.pageNumber > response.totalNumberOfPages) {
        this.serverSideProps.pageNumber = 1;
      }
      this.pagedTableData = response.data;
      this.isLoading = false;
      this.$nextTick(this.refreshTableLayout);
    },
    getDrawerTarget() {
      return document.querySelector(".v-application") || document.body;
    },
    refreshTableLayout() {
      const tableRef = this.$refs.activitiesTable;
      if (tableRef?.$refs?.elTableRef?.doLayout) {
        tableRef.$refs.elTableRef.doLayout();
      }
    },
    handleServerSidePageChange(pageNumber) {
      this.serverSideProps.pageNumber = pageNumber;
      this.fetchActivities();
    },
    handleServerSideSizeChange(pageSize) {
      this.serverSideProps.pageSize = pageSize;
      this.fetchActivities();
    },
    handleSortChange(sortProps) {
      this.sortProps = sortProps;
      this.fetchActivities();
    },
    handleSearchChange(bodyDataFilter) {
      this.searchText = bodyDataFilter?.filter?.SearchInputTextValue || "";
      this.serverSideProps.pageNumber = 1;
      this.fetchActivities();
    },
    handleRefresh() {
      this.fetchActivities();
    },
    normalizeStatus(status = "") {
      const cleaned = String(status)
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
      const statusMap = {
        "waiting for approval": "Waiting for Approval",
        waitingforapproval: "Waiting for Approval",
        executed: "Executed",
        rejected: "Rejected"
      };
      if (statusMap[cleaned]) return statusMap[cleaned];
      if (!cleaned) return status;
      return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
    },
    isWaitingForApproval(row = {}) {
      const normalized = String(row.status || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
      return (
        normalized === "waiting for approval" ||
        normalized === "waitingforapproval"
      );
    },
    getViewActionId(index) {
      return `btn-agentic-ai-activity-view-${index}`;
    },
    handleView(row) {
      this.$emit("on-view", row);
    },
    handleApprove(row) {
      this.$emit("on-approve", row);
    },
    handleReject(row) {
      this.$emit("on-reject", row);
    },
    moveToBody() {
      const target = this.getDrawerTarget();
      if (!this.$el || this.$el === target) {
        return;
      }
      if (this.$el.parentNode !== target) {
        target.appendChild(this.$el);
      }
      this.$nextTick(this.refreshTableLayout);
    },
    handleDrawerClickOutside(event) {
      const target = event?.target;
      if (target && target.closest('.v-menu__content')) {
        return;
      }
      this.handleClose();
    },
    handleClose() {
      if (this.shouldControlBodyScroll) {
        this.enableBodyScroll();
      }
      this.$emit("on-close");
    }
  }
};
</script>
