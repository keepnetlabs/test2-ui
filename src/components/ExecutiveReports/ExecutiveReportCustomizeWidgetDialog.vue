<template>
  <AppDialog
    :status="status"
    icon="mdi-cog"
    title="Customize Widget"
    :subtitle="selectedRow.name"
    :custom-size="'800'"
    maxHeightSize="804"
    title-id="text--phishing-reporters-download-history-title"
    subtitle-id="text--phishing-reporters-download-history-subtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="executive-report-customize-widget-row mb-4">
        <KSelect
          v-model="formData.valueType"
          label="Value Type"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a value type"
          :items="valueTypes"
        />
        <KSelect
          v-model="formData.category"
          label="Category"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a category"
          :items="categories"
        />
        <KSelect
          v-model="formData.groupedBy"
          ref="refFiltersInput"
          label="Grouped By"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a grouped by"
          :items="groupedBy"
        />
      </div>
      <div class="executive-report-customize-widget-row mb-4">
        <KSelect
          v-model="formData.targetGroups"
          label="Target Groups"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a target group"
          :items="targetGroups"
        />
        <VTextField
          v-model="formData.title"
          label="Title"
          outlined
          hide-details
          autocomplete="off"
          style="flex-basis: 27%;"
          placeholder="Enter a title"
        />
        <KSelect
          v-model="formData.chartType"
          label="Chart Type"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a chartType"
        />
      </div>
      <div class="executive-report-customize-widget-row mb-4">
        <InputDate
          v-model="formData.startDate"
          class="date-picker-height-40 black-placeholder"
          type="datetime"
          ref="refPicker"
          placeholder="Select Start Date"
          style="flex-basis: 32%;"
          :format="parsedFormat"
          :valueFormat="parsedFormat"
        />
        <InputDate
          v-model="formData.endDate"
          class="date-picker-height-40 black-placeholder"
          type="datetime"
          ref="refPicker"
          placeholder="Select End Date"
          style="flex-basis: 32%;"
          :format="parsedFormat"
          :valueFormat="parsedFormat"
        />
        <KSelect
          v-model="formData.dateInterval"
          ref="refFiltersInput"
          label="Date Interval"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a date interval"
          :items="dateIntervals"
        />
      </div>
      <div class="executive-report-customize-widget-preview">
        <div class="executive-report-customize-widget-preview-title">{{ formData.title }}</div>
        <div class="executive-report-customize-widget-preview-type">{{ formData.type }}</div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--scenario-popup"
        confirm-button-id="btn-delete--scenario-popup"
        action-button-text="CONFIRM"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { getTimeZone } from '@/utils/functions'
import { mapGetters } from 'vuex'

export default {
  name: 'ExecutiveReportCustomizeWidgetDialog',
  components: { InputDate, AppDialogFooter, KSelect, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => {}
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActionButtonDisabled: false,
      parsedFormat: getTimeZone(false),
      formData: {
        valueType: '',
        category: '',
        groupedBy: '',
        targetGroups: '',
        title: '',
        chartType: '',
        startDate: '',
        endDate: '',
        dateInterval: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      valueTypes: 'executiveReports/getValueTypes',
      categories: 'executiveReports/getCategories',
      groupedBy: 'executiveReports/getGroupedBy',
      targetGroups: 'executiveReports/getTargetGroups',
      chartTypes: 'executiveReports/getChartTypes',
      dateIntervals: 'executiveReports/getDateIntervals'
    })
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {},
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {}
  }
}
</script>
