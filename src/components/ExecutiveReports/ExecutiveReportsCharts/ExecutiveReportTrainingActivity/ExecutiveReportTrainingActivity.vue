<template>
  <div class="executive-report-training-activity">
    <ExecutiveReportTrainingActivityWidget
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
    <ExecutiveReportTrainingActivityTable
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
import ExecutiveReportTrainingActivityWidget from "./ExecutiveReportTrainingActivityWidget.vue";
import ExecutiveReportTrainingActivityTable from "./ExecutiveReportTrainingActivityTable.vue";

export default {
  name: "ExecutiveReportTrainingActivity",
  components: {
    ExecutiveReportTrainingActivityWidget,
    ExecutiveReportTrainingActivityTable,
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
.executive-report-training-activity {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow: hidden;
}
</style>
