<template>
  <div class="details-content">
    <ReAnalyzeIncidentDialog
      v-if="showReAnalyzeIncidentDialog"
      :status="showReAnalyzeIncidentDialog"
      :name="mailDetails.subject"
      :resourceId="getResourceId"
      @on-close-dialog="toggleShowReAnalyzeDialog"
    />
    <div class="details-content--item mb-6" style="justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <div class="details-content--item--key">Analysis Date</div>
        <div class="details-content--item--value">
          {{ mailDetails.analysisDate }}
        </div>
      </div>
      <div class="details-content-header__container">
        <div
          id="btn-download--incident-responder-email-details"
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
        <div @click="$emit('handleDownloadEmail')" class="ml-6 cursor-pointer download">
          <v-icon style="font-size: 20px; margin-top: -1px;" color="#2196f3" class="selection-icons"
            >mdi-download</v-icon
          >
          <span class="ml-2">DOWNLOAD EMAIL</span>
        </div>
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">From</div>
      <div class="details-content--item--value">
        {{ mailDetails.from }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">From Name</div>
      <div class="details-content--item--value">
        {{ mailDetails.senderName }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">To</div>
      <div class="details-content--item--value">
        {{ getMailDetailsTo }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">CC</div>
      <div class="details-content--item--value">
        {{ getMailDetailsCc }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">BCC</div>
      <div class="details-content--item--value">
        {{ getMailDetailsBcc }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">Date Received</div>
      <div class="details-content--item--value">
        {{ mailDetails['receivedDate'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">Sender IP</div>
      <div class="details-content--item--value">
        {{ mailDetails['senderIp'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">Folder Name</div>
      <div class="details-content--item--value">
        {{ mailDetails['folderName'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">Attachment Count</div>
      <div class="details-content--item--value">
        {{ mailDetails && mailDetails.attachments.length }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">Url Count</div>
      <div class="details-content--item--value">
        {{ mailDetails && mailDetails.urls.length }}
      </div>
    </div>
  </div>
</template>

<script>
import ReAnalyzeIncidentDialog from '@/components/IncidentResponder/ReAnalyzeIncidentDialog'
export default {
  name: 'EmailDetailsContentDetails',
  components: { ReAnalyzeIncidentDialog },
  props: {
    mailDetails: {
      type: Object
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
      return mailDetails.status === 'BeingAnalyzed'
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
