<template>
  <div>
    <AlertBox
      class="mb-6"
      icon-name="mdi-information"
      icon-color="#000"
      style="background-color: #fafafa !important; border: 1px solid #e0e0e0;"
      :slots="{ primaryAction: true, secondaryAction: true }"
    >
      <template>
        <div class="d-flex gap-2 w-100">
          <div>
            <VIcon color="#000">mdi-information</VIcon>
          </div>
          <div class="d-flex justify-space-between flex-grow-1 align-center">
            <div style="font-weight: 600; font-size: 18px; color: #383b41;">
              {{ botActivityCount }} user{{ botActivityCount > 1 ? 's' : '' }}
              detected with bot activity.
            </div>
            <div class="cursor-pointer fw-600 fs-medium" @click="handleShowBotActivity">
              {{ isShowSandbox ? 'HIDE BOT ACTIVITY' : 'SHOW BOT ACTIVITY' }}
            </div>
          </div>
        </div>
      </template>
    </AlertBox>
  </div>
</template>

<script>
import AlertBox from '@/components/AlertBox.vue'

export default {
  name: 'CampaignManagerReportBotActivityAlertBox',
  components: {
    AlertBox
  },
  props: {
    botActivityCount: {
      type: Number,
      default: 0
    },
    isShowSandbox: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleShowBotActivity() {
      this.$emit('on-activity-change')
    }
  }
}
</script>
