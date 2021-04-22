<template>
  <div class="details-content">
    <ReAnalyzeIncidentDialog
      v-if="showReAnalyzeIncidentDialog"
      :status="showReAnalyzeIncidentDialog"
      :name="mailDetails.subject"
      :resourceId="getResourceId"
      @on-close-dialog="toggleShowReAnalyzeDialog"
      @on-confirm="$emit('on-re-analyze-click')"
    />
    <div class="details-content--item mb-6" style="justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <div id="text--email-details-analysis-date-key" class="details-content--item--key">
          Analysis Date
        </div>
        <div id="text--email-details-analysis-date-value" class="details-content--item--value">
          {{ mailDetails.analysisDate }}
        </div>
      </div>
      <div class="details-content-header__container">
        <div
          id="btn-re-analyze--incident-responder-email-details"
          :class="[
            'cursor-pointer',
            { 'details-content-header__item--disabled': isReAnalyzeDisabled }
          ]"
          @click="handleReAnalyze"
        >
          <v-icon style="font-size: 20px; margin-top: -1px;" color="#00bcd4" class="selection-icons"
            >mdi-refresh</v-icon
          >
          <span class="ml-2">RE-ANALYZE</span>
        </div>
        <div
          id="btn--download-incident-responder-email-details"
          @click="$emit('handleDownloadEmail')"
          class="ml-6 cursor-pointer download"
        >
          <v-icon style="font-size: 20px; margin-top: -1px;" color="#2196f3" class="selection-icons"
            >mdi-download</v-icon
          >
          <span class="ml-2">DOWNLOAD EMAIL</span>
        </div>
      </div>
    </div>
    <div class="details-content--item">
      <div id="text--email-details-from-key" class="details-content--item--key">From</div>
      <div id="text--email-details-from-value" class="details-content--item--value">
        {{ mailDetails.from }}
      </div>
    </div>
    <div class="details-content--item">
      <div id="text--email-details-from-name-key" class="details-content--item--key">From Name</div>
      <div id="text--email-details-from-name-value" class="details-content--item--value">
        {{ mailDetails.senderName }}
      </div>
    </div>
    <div class="details-content--item">
      <div id="text--email-details-to-key" class="details-content--item--key">To</div>
      <div id="text--email-details-to-value" class="details-content--item--value">
        {{ getMailDetailsTo }}
      </div>
    </div>

    <div class="details-content--item">
      <div id="text--email-details-cc-key" class="details-content--item--key">CC</div>
      <div id="text--email-details-cc-value" class="details-content--item--value">
        {{ getMailDetailsCc }}
      </div>
    </div>
    <div class="details-content--item">
      <div id="text--email-details-bcc-key" class="details-content--item--key">BCC</div>
      <div id="text--email-details-bcc-value" class="details-content--item--value">
        {{ getMailDetailsBcc }}
      </div>
    </div>
    <div class="details-content--item">
      <div id="text--email-details-date-received-key" class="details-content--item--key">
        Date Received
      </div>
      <div id="text--email-details-date-received-value" class="details-content--item--value">
        {{ mailDetails['receivedDate'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div id="text--email-details-sender-ip-key" class="details-content--item--key">Sender IP</div>
      <div id="text--email-details-sender-ip-value" class="details-content--item--value">
        {{ mailDetails['senderIp'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div id="text--email-details-folder-name-key" class="details-content--item--key">
        Folder Name
      </div>
      <div id="text--email-details-folder-name-value" class="details-content--item--value">
        {{ mailDetails['folderName'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div id="text--email-details-attachment-count-key" class="details-content--item--key">
        Attachment Count
      </div>
      <div id="text--email-details-attachment-count-value" class="details-content--item--value">
        {{ mailDetails && mailDetails.attachments.length }}
      </div>
    </div>
    <div class="details-content--item">
      <div id="text--email-details-url-count-key" class="details-content--item--key">Url Count</div>
      <div id="text--email-details-url-count-value" class="details-content--item--value">
        {{ mailDetails && mailDetails.urls.length }}
      </div>
    </div>
    <email-details-sender-ip-blacklist-check
      :mail-details="mailDetails"
      :loading="loading"
      @on-refresh-click="$emit('on-re-analyze-click')"
    />
  </div>
</template>

<script>
import ReAnalyzeIncidentDialog from '@/components/IncidentResponder/ReAnalyzeIncidentDialog'
import EmailDetailsSenderIpBlacklistCheck from '@/components/IncidentResponder/EmailDetails/EmailDetailsSenderIpBlacklistCheck'
export default {
  name: 'EmailDetailsContentDetails',
  components: { EmailDetailsSenderIpBlacklistCheck, ReAnalyzeIncidentDialog },
  props: {
    mailDetails: {
      type: Object
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      showReAnalyzeIncidentDialog: false
    }
  },
  computed: {
    getMailDetailsTo() {
      const mailDetails = this.mailDetails
      return mailDetails && mailDetails.to && mailDetails.to.toString()
    },
    getResourceId() {
      return this.$route.params.id
    },
    getMailDetailsCc() {
      const mailDetails = this.mailDetails
      return mailDetails && mailDetails.cc && mailDetails.cc.toString()
    },
    getMailDetailsBcc() {
      const mailDetails = this.mailDetails
      return mailDetails && mailDetails.to && mailDetails.bcc.toString()
    },
    isReAnalyzeDisabled() {
      const mailDetails = this.mailDetails
      return mailDetails.status === 'BeingAnalyzed' || mailDetails.status === 'InProgress'
    }
  },
  methods: {
    handleReAnalyze() {
      this.toggleShowReAnalyzeDialog()
    },
    toggleShowReAnalyzeDialog() {
      this.showReAnalyzeIncidentDialog = !this.showReAnalyzeIncidentDialog
    }
  }
}
</script>

<style lang="scss">
.details-content-header {
  &__container {
    display: flex;
    div:first-child {
      color: #00bcd4;
    }
    span {
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
    }
  }

  &__item--disabled {
    pointer-events: none;
    color: rgba(0, 0, 0, 0.12) !important;
    .selection-icons {
      color: rgba(0, 0, 0, 0.12) !important;
    }
  }
}
</style>
