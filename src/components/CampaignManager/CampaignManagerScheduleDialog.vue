<template>
  <AppDialog
    title-id="text--campaign-manager-schedule-popup-title"
    subtitle-id="text--campaign-manager-schedule-popup-subtitle"
    custom-size="700"
    :icon="CONSTANTS.icon"
    :title="getTitle"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <template v-else>
        <div class="fs-4 text-primary-color">Selected Frequency: {{ selectedFrequency }}</div>
        <div class="campaign-manager-schedule-dialog__container">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="campaign-manager-schedule-dialog__item"
          >
            <span class="campaign-manager-schedule-dialog__item--scenario-name">
              {{ item.scenarioName }}
            </span>
            <span>
              {{ item.scheduleDate }}
            </span>
          </div>
        </div>
        <AlertBox
          v-if="isPhishing && isCategoryBasedDistribution"
          class="bg-aqua-light mt-6"
          icon-color="#2196F3"
          icon-name="mdi-information"
          text="This is not the full list. The campaign will continue to send scenarios with the defined frequency until it’s stopped. "
          :slots="{ primaryAction: false, secondaryAction: false }"
        />
      </template>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex justify-end">
        <v-btn
          id="btn-close--campaign-manager-schedule-close"
          text
          color="#2196f3"
          class="k-dialog__button"
          @click="$emit('on-close')"
        >
          Close
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import { useLoading } from '@/hooks/useLoading'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import AlertBox from '@/components/AlertBox'
export default {
  name: 'CampaignManagerItemDeleteDialog',
  components: { DatatableLoading, AppDialog, AlertBox },
  mixins: [useLoading],
  props: {
    status: {
      type: Boolean
    },
    campaignName: {
      type: String,
      default: ''
    },
    selectedFrequency: {
      type: String,
      default: ''
    },
    frequencyId: {
      type: Number,
      default: 0
    },
    scheduleTypeId: {
      type: String
    },
    phishingScenarios: {
      type: Array,
      default: () => []
    },
    scheduledDateTimeZoneId: {
      type: String
    },
    scheduledDate: {
      type: String
    },
    type: {
      type: String,
      default: DISTRIBUTION_TYPES.PHISHING
    },
    items: {
      type: Array,
      default: () => []
    },
    scenarioType: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    isCategoryBasedDistribution: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-calendar-range',
        title:
          this.scenarioType === SCENARIO_TYPES.PHISHING
            ? 'Phishing Scenarios Frequency Schedule'
            : 'Quishing Scenarios Frequency Schedule'
      }
    }
  },
  computed: {
    getSubtitle() {
      return this?.campaignName || ''
    },
    getTitle() {
      return this.type === DISTRIBUTION_TYPES.PHISHING
        ? this.CONSTANTS.title
        : 'Smishing Scenarios Frequency Schedule'
    },
    isPhishing() {
      return this.scenarioType === SCENARIO_TYPES.PHISHING
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleDelete() {
      this.$emit('on-delete', this.item)
    }
  }
}
</script>
