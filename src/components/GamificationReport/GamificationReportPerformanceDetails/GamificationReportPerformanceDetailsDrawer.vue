<template>
  <VNavigationDrawer
    v-click-outside="handleDrawerClickOutside"
    :value="status"
    class="k-navigation-drawer"
    temporary
    fixed
    overlay-color="rgba(0, 0, 0, 0.17)"
    overlay-opacity="1"
    right
    stateless
    width="calc(100% - 72px)"
    height="100%"
    style="z-index: 99999;"
  >
    <div class="campaign-manager-scenario-statistics-modal__header--sticky">
      <div class="campaign-manager-scenario-statistics-modal__header">
        <div>
          <VListItem class="">
            <VListItemContent>
              <VListItemTitle class="k-overlay__title">
                {{ selectedRow.firstName }} {{ selectedRow.lastName }}'s Performance Detail
              </VListItemTitle>
              <VListItemSubtitle
                >Detailed performance analysis and actionable recommendations for the user.
              </VListItemSubtitle>
            </VListItemContent>
          </VListItem>
        </div>
        <div>
          <VIcon
            class="cursor-pointer"
            color="#757575"
            @click="$emit('navigation-drawer-change', false)"
            >mdi-close</VIcon
          >
        </div>
      </div>
      <div class="campaign-manager-scenario-statistics-modal__body">
        <div class="campaign-manager-scenario-statistics-modal__body-header">
          {{ selectedRow.firstName }} {{ selectedRow.lastName }}'s Points Breakdown
        </div>
        <div>
          {{ selectedRow.firstName }} {{ selectedRow.lastName }} earned
          <span class="fw-600">{{ selectedRow.points }} points</span> out of a maximum of
          <span class="fw-600">{{ selectedRow.points }} points.</span>
          <GamificationReportPerformanceDetailsTable :columns="columns" :data="tableData" />
        </div>
      </div>
    </div>
  </VNavigationDrawer>
</template>

<script>
import GamificationReportPerformanceDetailsTable from './GamificationReportPerformanceDetailsTable.vue'

export default {
  name: 'GamificationReportPerformanceDetailsDrawer',
  components: { GamificationReportPerformanceDetailsTable },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns: [
        {
          label: 'Activity Type',
          key: 'activityType',
          type: 'text'
        },
        {
          label: 'Performance',
          key: 'performance',
          type: 'text'
        },
        {
          label: 'Points',
          key: 'points',
          type: 'number'
        },
        {
          label: 'Max Points',
          key: 'maxPoints',
          type: 'number'
        }
      ],
      tableData: [
        {
          activityType: 'Reporting phishing emails',
          performance: 'Successfully reported 3 out of 11 campaigns',
          points: '1200',
          maxPoints: '2800'
        },
        {
          activityType: 'Failed phishing campaigns',
          performance: 'Failed 4 out of 12 campaigns',
          points: '-700',
          maxPoints: '2800'
        },
        {
          activityType: 'Training enrolled',
          performance: 'Completed 10 out of 14 training',
          points: '1200',
          maxPoints: '2800'
        },
        {
          activityType: 'Exam performance',
          performance: 'Passed 5 out of 7 exams',
          points: '1000',
          maxPoints: '1400'
        }
      ]
    }
  },
  methods: {
    handleDrawerClickOutside() {
      this.$emit('on-close')
    }
  }
}
</script>
