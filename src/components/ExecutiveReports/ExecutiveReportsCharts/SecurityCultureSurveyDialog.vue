<template>
  <app-dialog
    :status="status"
    title="Survey Breakdown"
    icon="mdi-book"
    size="big"
    custom-size="840px"
    max-height
    max-height-size="auto"
    @changeStatus="handleStatusChange"
  >
    <template #app-dialog-body>
      <div class="security-culture-survey-dialog__subtitle">Overall score is weighted by Total Users. Completed responses only.</div>
      <DataTable
        id="survey-breakdown-table"
        :table="enrollmentsWithOverallScore"
        :columns="tableColumns"
        :loading="false"
        :empty="emptyConfig"
        :select-event="selectEventConfig"
        :count-row="5"
        row-key="enrollmentId"
        filterable
        hide-sort
      />
    </template>
    <template #app-dialog-footer>
      <div class="security-culture-survey-dialog__footer">
        <v-btn
          text
          color="#2196f3"
          class="k-dialog__button"
          @click="handleClose"
        >
          Close
        </v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'
import DataTable from '@/components/DataTable.vue'
import '@/assets/scss/components/SecurityCultureSurveyDialog.scss'

export default {
  name: 'SecurityCultureSurveyDialog',
  components: {
    AppDialog,
    DataTable
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    enrollments: {
      type: Array,
      default: () => []
    },
    overallScore: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      emptyConfig: {
        message: 'No surveys available'
      },
      selectEventConfig: {}
    }
  },
  computed: {
    enrollmentsWithOverallScore() {
      return this.enrollments.map((enrollment) => ({
        ...enrollment,
        avgScore: enrollment.overallScore
      }))
    },
    tableColumns() {
      return [
        {
          property: 'enrollmentName',
          align: 'left',
          label: 'Enrollment Name',
          sortable: true,
          show: true,
          type: 'text',
          width: 350,
          hideSort: true
        },
        {
          property: 'participantCount',
          align: 'center',
          label: 'Completed Users',
          sortable: true,
          show: true,
          type: 'number',
          width: 200,
          hideSort: true
        },
        {
          property: 'avgScore',
          align: 'center',
          label: 'Avg Score',
          sortable: true,
          show: true,
          type: 'text',
          hideSort: true
        }
      ]
    }
  },
  emits: ['update:status'],
  methods: {
    handleStatusChange(newStatus) {
      this.$emit('update:status', newStatus)
    },
    handleClose() {
      this.$emit('update:status', false)
    }
  }
}
</script>
