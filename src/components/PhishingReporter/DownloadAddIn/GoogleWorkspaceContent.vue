<template>
  <div class="download-add-in-google-workspace-content">
    <section class="download-add-in-google-workspace-content__section">
      <h3 class="download-add-in-google-workspace-content__section-title">
        Google Workspace
      </h3>
      <p class="download-add-in-google-workspace-content__section-subtitle">
        JSON add-in for web-based Google Workspace emails.
      </p>
      <DownloadAddInListItem
        :is-loading="isLoading"
        description=""
        hide-border
        button-id="btn-download-google-workspace--phishing-reporter-settings-add-in-modal"
        @button-click="$emit('download')"
      />
    </section>
  </div>
</template>

<script>
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'

export default {
  name: 'DownloadAddInGoogleWorkspaceContent',
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
