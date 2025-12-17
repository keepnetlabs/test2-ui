<template>
  <div class="training-activity-table-wrapper">
    <DataTable
      ref="refTrainingActivityTable"
      class="training-activity-table"
      :columns="columns"
      :table="tableData"
      :empty="empty"
      :show-pagination="true"
      :show-page-size="true"
      :show-filter-options="false"
      :show-datatable-row-actions="false"
      :filterable="true"
      :options="true"
      :count-row="5"
    />
  </div>
</template>

<script>
import DataTable from "@/components/DataTable";
import { getExecutiveReportChartData } from "@/api/reports";

export default {
  name: "ExecutiveReportTrainingActivityTable",
  components: {
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
      tableTitle: "Training Activity Details",
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
          type: "text",
          sortable: true,
          width: 180,
        },
        {
          property: "opened",
          label: "Opened",
          align: "center",
          show: true,
          type: "number",
          sortable: true,
          width: 180,
        },
        {
          property: "clicked",
          label: "Clicked",
          align: "center",
          show: true,
          type: "number",
          sortable: true,
          width: 180,
        },
      ],
      empty: {
        message: "No training activity data available",
      },
    };
  },
  watch: {
    dateRange() {
      this.callForData();
    },
  },
  created() {
    // TODO: Remove mock data after testing
    this.setMockTableData();
    return;
    // Original code below
    if (this?.defaultWidgetData?.length) {
      this.setTableData(this.defaultWidgetData);
    } else {
      this.callForData();
    }
  },
  methods: {
    setMockTableData() {
      // Mock data for testing - Training Activity
      this.tableData = [
        {
          firstName: "Alice",
          lastName: "Thompson",
          email: "alice.t@company.com",
          campaignName: "Security Fundamentals",
          scenarioName: "Phishing Basics",
          category: "Awareness",
          difficulty: "Low",
          opened: 5,
          clicked: 3,
        },
        {
          firstName: "Bob",
          lastName: "Anderson",
          email: "bob.a@company.com",
          campaignName: "Advanced Security",
          scenarioName: "Social Engineering",
          category: "Technical",
          difficulty: "High",
          opened: 2,
          clicked: 1,
        },
        {
          firstName: "Carol",
          lastName: "Martinez",
          email: "carol.m@company.com",
          campaignName: "Security Fundamentals",
          scenarioName: "Password Safety",
          category: "Awareness",
          difficulty: "Medium",
          opened: 4,
          clicked: 2,
        },
        {
          firstName: "Daniel",
          lastName: "Lee",
          email: "daniel.l@company.com",
          campaignName: "Compliance Training",
          scenarioName: "GDPR Essentials",
          category: "Compliance",
          difficulty: "Medium",
          opened: 3,
          clicked: 1,
        },
        {
          firstName: "Eva",
          lastName: "Wilson",
          email: "eva.w@company.com",
          campaignName: "Advanced Security",
          scenarioName: "Malware Prevention",
          category: "Technical",
          difficulty: "High",
          opened: 6,
          clicked: 4,
        },
        {
          firstName: "Frank",
          lastName: "Taylor",
          email: "frank.t@company.com",
          campaignName: "Security Fundamentals",
          scenarioName: "Email Security",
          category: "Awareness",
          difficulty: "Low",
          opened: 2,
          clicked: 0,
        },
        {
          firstName: "Grace",
          lastName: "Chen",
          email: "grace.c@company.com",
          campaignName: "Compliance Training",
          scenarioName: "Data Protection",
          category: "Compliance",
          difficulty: "Medium",
          opened: 4,
          clicked: 2,
        },
        {
          firstName: "Henry",
          lastName: "Kim",
          email: "henry.k@company.com",
          campaignName: "Advanced Security",
          scenarioName: "Incident Response",
          category: "Technical",
          difficulty: "High",
          opened: 5,
          clicked: 3,
        },
      ];
      this.isLoading = false;
    },
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
        opened: item.opened || 0,
        clicked: item.clicked || 0,
      }));
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
