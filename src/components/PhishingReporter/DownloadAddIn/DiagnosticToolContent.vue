<template>
  <div class="download-add-in-diagnostic-tool-content">
    <section class="download-add-in-diagnostic-tool-content__section">
      <h3 class="download-add-in-diagnostic-tool-content__section-title">
        Diagnostic Tool
      </h3>
      <p class="download-add-in-diagnostic-tool-content__section-subtitle">
        Only for Outlook Desktop (Windows OS only).
      </p>
      <DownloadAddInListItem
        :is-loading="isLoading"
        description=""
        hide-border
        button-id="btn-download-diagnostic-tool--phishing-reporter-settings-add-in-modal"
        @button-click="$emit('download')"
      />
    </section>
  </div>
</template>

<script>
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'

export default {
  name: 'DownloadAddInDiagnosticToolContent',
  components: {
    DownloadAddInListItem
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
