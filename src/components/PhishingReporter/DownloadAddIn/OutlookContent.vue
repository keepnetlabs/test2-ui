<template>
  <div class="download-add-in-outlook-content">
    <section class="download-add-in-outlook-content__section">
      <h3 class="download-add-in-outlook-content__section-title">
        Outlook
      </h3>
      <p class="download-add-in-outlook-content__section-subtitle">
        MSI add-in for Windows Outlook Desktop.
      </p>
      <DownloadAddInListItem
        :is-loading="isLoading"
        description=""
        hide-border
        button-id="btn-download-outlook--phishing-reporter-settings-add-in-modal"
        @button-click="$emit('download')"
      />
    </section>

    <section class="download-add-in-outlook-content__section">
      <v-expansion-panels class="download-add-in-outlook-content__platform-accordion">
        <v-expansion-panel>
          <v-expansion-panel-header class="download-add-in-outlook-content__expansion-header">
            <div class="download-add-in-outlook-content__accordion-header-content">
              <h3 class="download-add-in-outlook-content__section-title mb-0">
                Check Platform Compatibility
              </h3>
              <p class="download-add-in-outlook-content__section-subtitle mb-0">
                Make sure the selected add-in is supported in your environment.
              </p>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <table class="download-add-in-outlook-content__platform-table">
              <thead>
                <tr>
                  <th>Feature / Platform</th>
                  <th>MSI Outlook</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in platformCompatibilityData"
                  :key="index"
                  :class="{ 'download-add-in-outlook-content__platform-table-row--alt': index % 2 === 1 }"
                >
                  <td>{{ row.platform }}</td>
                  <td>
                    <span class="d-flex align-center">
                      <VIcon
                        :color="row.supported ? '#43A047' : '#F56C6C'"
                        small
                        class="mr-1"
                      >
                        {{ row.supported ? 'mdi-check-circle-outline' : 'mdi-close' }}
                      </VIcon>
                      {{ row.supported ? 'Supported' : 'Not Supported' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </section>
  </div>
</template>

<script>
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'

export default {
  name: 'DownloadAddInOutlookContent',
  components: {
    DownloadAddInListItem
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      platformCompatibilityData: [
        { platform: 'Outlook on Windows (Classic)', supported: true },
        { platform: 'Outlook on Windows (New)', supported: false },
        { platform: 'Outlook Classic 2016+ on Windows (Exchange)', supported: true },
        { platform: 'Outlook on MacOS (Microsoft 365)', supported: false },
        { platform: 'Outlook on MacOS (Exchange)', supported: false },
        { platform: 'Outlook on Web MacOS (Exchange)', supported: false },
        { platform: 'Outlook on the Web (Microsoft 365)', supported: false },
        { platform: 'Outlook on the Web (Exchange)', supported: false },
        { platform: 'Outlook on iOS (Microsoft 365)', supported: false },
        { platform: 'Outlook on Android (Microsoft 365)', supported: false }
      ]
    }
  }
}
</script>
