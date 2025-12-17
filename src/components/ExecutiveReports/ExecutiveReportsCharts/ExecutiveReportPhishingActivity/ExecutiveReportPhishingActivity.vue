<template>
  <div class="executive-report-phishing-activity">
    <ExecutiveReportPhisihingActivityWidget
      :edit-mode="editMode"
      :card="card"
      :date-range="dateRange"
      :date-period="datePeriod"
      :default-widget-data="defaultWidgetData"
      :date-format="dateFormat"
      @on-delete="handleDelete"
      @on-edit="handleEdit"
      @on-set-default-widget-data="handleSetDefaultWidgetData"
    />
    <ExecutiveReportPhishingActivityTable
      :edit-mode="editMode"
      :card="card"
      :date-range="dateRange"
      :date-period="datePeriod"
      :default-widget-data="defaultWidgetData"
      :date-format="dateFormat"
    />
  </div>
</template>

<script>
import ExecutiveReportPhisihingActivityWidget from "./ExecutiveReportPhisihingActivityWidget.vue";
import ExecutiveReportPhishingActivityTable from "./ExecutiveReportPhishingActivityTable.vue";

export default {
  name: "ExecutiveReportPhishingActivity",
  components: {
    ExecutiveReportPhisihingActivityWidget,
    ExecutiveReportPhishingActivityTable,
  },
  props: {
    editMode: {
      type: Boolean,
      default: true,
    },
    card: {
      type: Object,
      default: () => {},
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
    return {};
  },
  watch: {},
  created() {},
  methods: {
    handleDelete(card) {
      this.$emit("on-delete", card);
    },
    handleEdit(card) {
      this.$emit("on-edit", card);
    },
    handleSetDefaultWidgetData(key, data) {
      this.$emit("on-set-default-widget-data", key, data);
    },
  },
};
</script>

<style scoped>
.executive-report-phishing-activity {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
