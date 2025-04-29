<template>
  <div>
    <div class="alert-box d-block bg-gray-light border-gray-light mb-4">
      <div class="alert-box__default-content justify-space-between w-100 d-flex">
        <div class="d-flex">
          <v-icon color="#757575">mdi-information</v-icon>
          <p style="margin-top: 2px;">
            During the tracking duration of the campaign, data of the target users may vary
            depending on the bot activity rules.
          </p>
        </div>
        <v-icon
          v-if="false"
          class="cursor-pointer"
          color="#757575"
          @click="toggleAccordionDetail"
          >{{ isShowAccordion ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon
        >
      </div>
      <div v-if="isShowAccordion">
        <div class="mt-1 ml-8">Bot Activity Rules:</div>
        <p class="mb-0 ml-9">&bull; A1: Unusual User-Agent Interacted</p>
        <p class="mb-0 ml-9">
          &bull; A2: The honeypot link is clicked by the same User Agent and Same Source IP in 5
          minutes
        </p>
        <p class="mb-0 ml-9">
          &bull; A3: Bot activity that happened in the same second that matched other rules.
        </p>
        <div v-if="isShowV4Rule" class="mb-0 ml-9">
          &bull; A4: Stop Bot Activity Challenge
          <p class="mb-0 ml-4">
            &bull; A4.1: The phishing link was clicked, but the challenge was failed.
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
export default {
  name: 'SandboxDetailDialogAlerts',
  props: {
    isShowV4Rule: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShowAccordion: true
    }
  },
  methods: {
    toggleAccordionDetail() {
      this.isShowAccordion = !this.isShowAccordion
    }
  }
}
</script>
