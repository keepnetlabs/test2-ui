<template>
  <AppDialog
    title-id="text--campaign-manager-schedule-popup-title"
    subtitle-id="text--campaign-manager-schedule-popup-subtitle"
    custom-size="700"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
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
export default {
  name: 'CampaignManagerItemDeleteDialog',
  components: { DatatableLoading, AppDialog },
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
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-calendar-range',
        title: 'Callback Scenarios Frequency Schedule'
      }
    }
  },
  computed: {
    getSubtitle() {
      return this?.campaignName || ''
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
