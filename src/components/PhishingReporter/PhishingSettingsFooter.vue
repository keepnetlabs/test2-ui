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
      <v-btn
        @click="submit"
        id="btn-save--phishing-reporter-settings"
        class="white--text btn-util btn-save-changes"
        color="#2196f3"
        rounded
        :disabled="getPhishingReporterSavePermissions && saveDisable"
      >
        {{ labels.Save }} CHANGES
      </v-btn>
      <v-btn
        @click="submitWithDownload"
        id="btn-save-download--phishing-reporter-settings"
        class="white--text btn-util btn-download-add-in ml-3"
        color="#00bcd4"
        rounded
        :disabled="getPhishingReporterSavePermissions && saveDisable"
      >
        <v-icon left>mdi-download</v-icon>
        {{ labels.SaveAndDownload }}
      </v-btn>
      <div
        class="add-in-settings__link"
        id="btn-download-history--phishing-reporter-settings"
        @click="versionHistoryModalStatus = true"
      >
        DOWNLOAD History
      </div>
    </div>
  </div>
</template>

<script>
import ReporterVersionModal from '@/components/PhishingReporter/Settings/ReporterVersionModal'
import VersionHistoryModal from './Settings/VersionHistoryModal'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'

export default {
  name: 'PhishingSettingsFooter',
  components: {
    VersionHistoryModal,
    ReporterVersionModal
  },
  data() {
    return {
      labels,
      versionHistoryModalStatus: false,
      selectedVersionRow: null,
      reporterVersionModalStatus: false
    }
  },
  computed: {
    ...mapGetters({
      getPhishingReporterSavePermissions: 'permissions/getPhishingReporterSavePermissions'
    })
  },
  props: {
    className: {
      type: String
    },
    saveDisable: {
      type: Boolean,
      default: false
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
