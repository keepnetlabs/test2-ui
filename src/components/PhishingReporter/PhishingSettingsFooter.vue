<template>
  <div class="w-100">
    <version-history-modal
      :status="versionHistoryModalStatus"
      @changeVersionHistoryModalStatus="versionHistoryModalStatus = false"
      @handleHistoryRow="handleHistoryRow"
      v-if="versionHistoryModalStatus"
    />
    <reporter-version-modal
      :selected-version-row="selectedVersionRow"
      :status="reporterVersionModalStatus"
      @changeReporterVersionModalStatus="reporterVersionModalStatus = false"
      v-if="reporterVersionModalStatus"
    />
    <div class="add-in-settings__footer mr-2" :class="className">
      <v-btn @click="submit" class="white--text btn-util btn-save-changes" color="#2196f3" rounded>
        SAVE CHANGES
      </v-btn>
      <v-btn
        @click="submitWithDownload"
        class="white--text btn-util btn-download-add-in ml-3"
        color="#00bcd4"
        rounded
      >
        <v-icon left>mdi-download</v-icon>
        Save and Download
      </v-btn>
      <div class="add-in-settings__link" @click="versionHistoryModalStatus = true">
        DOWNLOAD History
      </div>
    </div>
  </div>
</template>

<script>
import ReporterVersionModal from '@/components/PhishingReporter/Settings/ReporterVersionModal'
import VersionHistoryModal from './Settings/VersionHistoryModal'
export default {
  name: 'PhishingSettingsFooter',
  components: {
    VersionHistoryModal,
    ReporterVersionModal
  },
  data() {
    return {
      versionHistoryModalStatus: false,
      selectedVersionRow: null,
      reporterVersionModalStatus: false
    }
  },
  props: {
    className: {
      type: String
    }
  },
  methods: {
    submit(event) {
      this.$emit('submit', event)
    },
    submitWithDownload(event) {
      this.$emit('submitWithDownload', event)
    },
    handleHistoryRow(row) {
      this.selectedVersionRow = row
      this.reporterVersionModalStatus = true
    }
  }
}
</script>

<style lang="scss">
.btn-save-changes {
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
  &:focus {
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
  }
}
</style>
