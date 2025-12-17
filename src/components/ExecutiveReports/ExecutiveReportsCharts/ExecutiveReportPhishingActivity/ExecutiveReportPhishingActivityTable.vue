<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="tableTitle"
          :subtitle="card.parentKey"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <DataTable
            ref="refPhishingActivityTable"
            class="phishing-activity-table"
            :columns="columns"
            :table="tableData"
            :empty="empty"
            :show-pagination="false"
            :show-page-size="false"
            :show-filter-options="false"
            :show-datatable-row-actions="false"
          >
            <template #datatable-custom-column="{ scope, col }">
              <template v-if="col.property === 'opened'">
                <v-icon :color="scope.row.opened ? 'success' : 'grey'" size="18">
                  {{ scope.row.opened ? "mdi-check-circle" : "mdi-close-circle" }}
                </v-icon>
              </template>
              <template v-if="col.property === 'clicked'">
                <v-icon :color="scope.row.clicked ? 'error' : 'grey'" size="18">
                  {{ scope.row.clicked ? "mdi-check-circle" : "mdi-close-circle" }}
                </v-icon>
              </template>
              <template v-if="col.property === 'difficulty'">
                <v-chip :color="getDifficultyColor(scope.row.difficulty)" small dark>
                  {{ scope.row.difficulty }}
                </v-chip>
              </template>
            </template>
          </DataTable>
        </ExecutiveWidgetBody>
      </ExecutiveWidgetContainer>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetLoading from "@/components/SkeletonLoading/WidgetLoading.vue";
import ExecutiveWidgetContainer from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue";
import ExecutiveWidgetHeader from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue";
import ExecutiveWidgetBody from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue";
import DataTable from "@/components/DataTable";
import { getExecutiveReportChartData } from "@/api/reports";

export default {
  name: "ExecutiveReportPhishingActivityTable",
  components: {
    WidgetLoading,
    ExecutiveWidgetContainer,
    ExecutiveWidgetHeader,
    ExecutiveWidgetBody,
    DataTable,
  },
  props: {
    editMode: {
      type: Boolean,
      default: true,
    },
    card: {
      type: Object,
      default: () => ({}),
    },
    dateRange: {
      type: Array,
      default: () => [],
    },
    datePeriod: {
      type: Number,
      default: 1,
    },
    defaultWidgetData: {
      type: [Object, Array],
    },
    dateFormat: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: false,
      tableTitle: "Phishing Activity Details",
      tableData: [],
      columns: [
        {
          property: "firstName",
          label: "First Name",
          align: "left",
          show: true,
          type: "text",
          sortable: true,
          width: 120,
        },
        {
          property: "lastName",
          label: "Last Name",
          align: "left",
          show: true,
          type: "text",
          sortable: true,
          width: 120,
        },
        {
          property: "email",
          label: "Email",
          align: "left",
          show: true,
          type: "text",
          sortable: true,
          width: 200,
        },
        {
          property: "campaignName",
          label: "Campaign Name",
          align: "left",
          show: true,
          type: "text",
          sortable: true,
          width: 180,
        },
        {
          property: "scenarioName",
          label: "Scenario Name",
          align: "left",
          show: true,
          type: "text",
          sortable: true,
          width: 180,
        },
        {
          property: "category",
          label: "Category",
          align: "left",
          show: true,
          type: "text",
          sortable: true,
          width: 120,
        },
        {
          property: "difficulty",
          label: "Difficulty",
          align: "center",
          show: true,
          type: "slot",
          sortable: true,
          width: 100,
        },
        {
          property: "opened",
          label: "Opened",
          align: "center",
          show: true,
          type: "slot",
          sortable: true,
          width: 80,
        },
        {
          property: "clicked",
          label: "Clicked",
          align: "center",
          show: true,
          type: "slot",
          sortable: true,
          width: 80,
        },
      ],
      empty: {
        message: "No phishing activity data available",
      },
    };
  },
  watch: {
    dateRange() {
      this.callForData();
    },
  },
  created() {
    if (this?.defaultWidgetData?.length) {
      this.setTableData(this.defaultWidgetData);
    } else {
      this.callForData();
    }
  },
  methods: {
    callForData() {
      this.isLoading = true;
      const payload = {
        widgetIds: [this.card.resourceId],
        datePeriod: this.datePeriod,
        startDate: this.dateRange[0],
        endDate: this.dateRange[1],
      };
      getExecutiveReportChartData(payload)
        .then((response) => {
          const {
            data: { data },
          } = response || {};
          this.$emit("on-set-default-widget-data", this.card.key, data);
          this.setTableData(data);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    setTableData(data) {
      if (!data || !data.length) {
        this.tableData = [];
        return;
      }

      const widgetData = data[0]?.widgetDatas;
      if (!widgetData || !widgetData.length) {
        this.tableData = [];
        return;
      }

      // Map the data to table format
      this.tableData = widgetData.map((item) => ({
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        email: item.email || "",
        campaignName: item.campaignName || "",
        scenarioName: item.scenarioName || "",
        category: item.category || "",
        difficulty: item.difficulty || "",
        opened: item.opened || false,
        clicked: item.clicked || false,
      }));
    },
    getDifficultyColor(difficulty) {
      const colors = {
        Easy: "#43A047",
        Medium: "#FB8C00",
        Hard: "#E53935",
        Expert: "#8E24AA",
      };
      return colors[difficulty] || "#757575";
    },
    handleDelete() {
      this.$emit("on-delete", this.card);
    },
    handleEdit() {
      this.$emit("on-edit", this.card);
    },
  },
};
</script>

<style lang="scss" scoped>
.phishing-activity-table {
  ::v-deep {
    .el-table {
      font-size: 13px;
    }

    .el-table__header th {
      font-size: 12px;
      font-weight: 600;
    }
  }
}
</style>
