<template>
  <div>
    <AlertBox
      class="alert-box--campaign-report"
      icon-name="mdi-information"
      text="During the tracking duration of the campaign, data of the target users may vary depending on the bot activity rules."
      :slots="{ primaryAction: false, secondaryAction: false }"
    />
    <div class="alert-box d-block bg-aqua-light my-4">
      <div class="alert-box__default-content justify-space-between w-100 d-flex">
        <div class="d-flex">
          <v-icon color="#2196f3">mdi-information</v-icon>
          <p style="margin-top: 2px;">Bot Activity Rules:</p>
        </div>
        <v-icon class="cursor-pointer" color="#2196F3" @click="toggleAccordionDetail">{{
          isShowAccordion ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }}</v-icon>
      </div>
      <div v-if="isShowAccordion">
        <p class="mb-0 ml-8">&bull; A1: Unusual User-Agent Interacted</p>
        <p class="mb-0 ml-8">
          &bull; A2: The honeypot link is clicked by the same User Agent and Same Source IP in 5
          minutes
        </p>
        <p class="mb-0 ml-8">
          &bull; A3: Bot activity that happened in the same second that matched other rules.
        </p>
        <div class="mb-0 ml-8">
          &bull; A4: Stop Bot Activity Challenge
          <p class="mb-0 ml-4">
            &bull; A4.1: The phishing link was clicked, and bot-like behavior was detected. However,
            the user was still redirected to the phishing page.
          </p>
          <p class="mb-0 ml-4">
            &bull; A4.2: A real browser should pass challenges, but this browser did not load the
            challenge.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AlertBox from '@/components/AlertBox.vue'

export default {
  name: 'SandboxDetailDialogAlerts',
  components: { AlertBox },
  data() {
    return {
      isShowAccordion: false
    }
  },
  methods: {
    toggleAccordionDetail() {
      this.isShowAccordion = !this.isShowAccordion
    }
  }
}
</script>
