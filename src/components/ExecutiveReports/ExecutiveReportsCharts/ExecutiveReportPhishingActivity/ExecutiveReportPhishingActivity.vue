<template>
  <div class="executive-report-phishing-activity">
    <ExecutiveReportPhisihingActivityWidget
      :edit-mode="editMode"
      :card="card"
      :date-range="dateRange"
      :date-period="datePeriod"
      :default-widget-data="localWidgetData"
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
      :default-widget-data="localWidgetData"
      :date-format="dateFormat"
      @on-pagination-change="handlePaginationChange"
    />
  </div>
</template>

<script>
import ExecutiveReportPhisihingActivityWidget from './ExecutiveReportPhishingActivityWidget.vue'
import ExecutiveReportPhishingActivityTable from './ExecutiveReportPhishingActivityTable.vue'

export default {
  name: 'ExecutiveReportPhishingActivity',
  components: {
    ExecutiveReportPhisihingActivityWidget,
    ExecutiveReportPhishingActivityTable
  },
  props: {
    editMode: {
      type: Boolean,
      default: true
    },
    card: {
      type: Object,
      default: () => {}
    },
    dateRange: {
      type: Array,
      default: () => []
    },
    datePeriod: {
      type: Number,
      default: 1
    },
    defaultWidgetData: {
      type: [Object, Array]
    },
    dateFormat: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localWidgetData: null
    }
  },
  watch: {
    defaultWidgetData: {
      immediate: true,
      handler(val) {
        if (val) this.localWidgetData = val
      }
    }
  },
  created() {},
  methods: {
    handleDelete(card) {
      this.$emit('on-delete', card)
    },
    handleEdit(card) {
      this.$emit('on-edit', card)
    },
    handleSetDefaultWidgetData(key, data) {
      this.localWidgetData = data
      this.$emit('on-set-default-widget-data', key, data)
    },
    handlePaginationChange(card, pageSize) {
      this.$emit('on-pagination-change', card, pageSize)
    }
  }
}
</script>

<style scoped>
.executive-report-phishing-activity {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow: hidden;
}
</style>
