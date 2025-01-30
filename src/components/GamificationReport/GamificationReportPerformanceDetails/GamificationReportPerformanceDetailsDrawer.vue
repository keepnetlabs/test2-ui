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
          <VListItem>
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
          <GamificationReportPerformanceDetailsInfoCard class="mt-4 mb-8" />
        </div>
        <div class="campaign-manager-scenario-statistics-modal__body-header">
          Actions to Improve User Performance
        </div>
        <div>
          These steps outline how you can help {{ selectedRow.firstName }}
          {{ selectedRow.lastName }} improve performance.
        </div>
        <GamificationReportPerformanceDetailsTable
          :columns="actionColumns"
          :data="actionTableData"
        />
        <GamificationReportPerformanceDetailsInfoCard
          class="mt-4 mb-8"
          title="Celebrate Progress"
          description="Selami has made significant progress by earning 150 points. Only a few steps remain to achieve full potential. Completing the remaining actions will unlock new milestones and rewards, demonstrating expertise and dedication."
        />
      </div>
    </div>
  </VNavigationDrawer>
</template>

<script>
import GamificationReportPerformanceDetailsTable from './GamificationReportPerformanceDetailsTable.vue'
import GamificationReportPerformanceDetailsInfoCard from './GamificationReportPerformanceDetailsInfoCard.vue'

export default {
  name: 'GamificationReportPerformanceDetailsDrawer',
  components: {
    GamificationReportPerformanceDetailsInfoCard,
    GamificationReportPerformanceDetailsTable
  },
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
      ],
      actionColumns: [
        {
          label: 'Priority',
          key: 'priority',
          type: 'badge',
          align: 'center',
          maxWidth: '120px',
          minWidth: '120px'
        },
        {
          label: 'Action',
          key: 'action',
          type: 'text'
        },
        {
          label: 'Activity Name',
          key: 'activityName',
          type: 'text'
        },
        {
          label: 'Activity Name',
          key: 'activityName',
          type: 'text'
        },
        {
          label: 'Points Available',
          key: 'pointsAvailable',
          align: 'center',
          type: 'number',
          maxWidth: '160px'
        },
        {
          label: 'Next Step',
          key: 'nextStep',
          align: 'center',
          type: 'link'
        }
      ],
      actionTableData: [
        {
          priority: 'Critical',
          action: 'Send reminder to report remaining phishing emails',
          activityName: 'Unreported 8 campaigns',
          pointsAvailable: '400',
          nextStep: 'Go to Report'
        },
        {
          priority: 'Critical',
          action: 'Send reminder to report remaining phishing emails',
          activityName: 'Unreported 8 campaigns',
          pointsAvailable: '400',
          nextStep: 'Go to Report'
        },
        {
          priority: 'Critical',
          action: 'Send reminder to report remaining phishing emails',
          activityName: 'Unreported 8 campaigns',
          pointsAvailable: '400',
          nextStep: 'Go to Report'
        },
        {
          priority: 'Critical',
          action: 'Send reminder to report remaining phishing emails',
          activityName: 'Unreported 8 campaigns',
          pointsAvailable: '400',
          nextStep: 'Go to Report'
        },
        {
          priority: 'Critical',
          action: 'Send reminder to report remaining phishing emails',
          activityName: 'Unreported 8 campaigns',
          pointsAvailable: '400',
          nextStep: 'Go to Report'
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
