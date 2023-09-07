<template>
  <AppDialog
    title-id="text--campaign-manager-schedule-popup-title"
    subtitle-id="text--campaign-manager-schedule-popup-subtitle"
    size="maximum"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div class="fs-4 text-primary-color">Selected Frequency: {{ selectedFrequency }}</div>
      <div class="campaign-manager-schedule-dialog__container">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="campaign-manager-schedule-dialog__item"
        >
          <span>
            {{ item.scenarioName }}
          </span>
          <span>
            {{ item.scheduleDate }}
          </span>
        </div>
      </div>
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
import { getCalculatedScheduleInfo } from '@/api/phishingsimulator'
export default {
  name: 'CampaignManagerItemDeleteDialog',
  components: { AppDialog },
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
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-calendar-range',
        title: 'Phishing Scenarios Frequency Schedule'
      },
      items: []
    }
  },
  computed: {
    getSubtitle() {
      return this?.campaignName || ''
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      getCalculatedScheduleInfo({
        scheduledDate: this.scheduledDate,
        scheduledDateTimeZoneId: this.scheduledDateTimeZoneId,
        scheduleTypeId: this.scheduleTypeId,
        frequencyId: this.frequencyId,
        phishingScenarios: this.phishingScenarios
      }).then((res) => {
        this.items = res?.data?.data
      })
    },
    closeModal() {
      this.$emit('on-close')
    },
    handleDelete() {
      this.$emit('on-delete', this.item)
    }
  }
}
</script>
