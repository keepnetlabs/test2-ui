<template>
  <div class="details-content">
    <div class="details-content--item mb-6" style="justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <div class="details-content--item--key">
          Analysis Date
        </div>
        <div class="details-content--item--value">
          {{ mailDetails.analysisDate }}
        </div>
      </div>
      <div>
        <div @click="handleDownloadEmail()" class="cursor-pointer download">
          <v-icon color="#2196f3" class="selection-icons">mdi-download</v-icon>
          DOWNLOAD EMAIL
        </div>
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">
        From
      </div>
      <div class="details-content--item--value">
        {{ mailDetails.from }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">
        From Name
      </div>
      <div class="details-content--item--value">
        {{ mailDetails.senderName }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">
        To
      </div>
      <div class="details-content--item--value">
        {{ getMailDetailsTo }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">
        CC
      </div>
      <div class="details-content--item--value">
        {{ getMailDetailsCc }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">
        BCC
      </div>
      <div class="details-content--item--value">
        {{ getMailDetailsBcc }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">
        Date Received
      </div>
      <div class="details-content--item--value">
        {{ mailDetails['receivedDate'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">
        Sender IP
      </div>
      <div class="details-content--item--value">
        {{ mailDetails['senderIp'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">
        Folder Name
      </div>
      <div class="details-content--item--value">
        {{ mailDetails['folderName'] }}
      </div>
    </div>

    <div class="details-content--item">
      <div class="details-content--item--key">
        Attachment Count
      </div>
      <div class="details-content--item--value">
        {{ mailDetails && mailDetails.attachments.length }}
      </div>
    </div>
    <div class="details-content--item">
      <div class="details-content--item--key">
        Url Count
      </div>
      <div class="details-content--item--value">
        {{ mailDetails && mailDetails.urls.length }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailDetailsContentDetails',
  props: {
    mailDetails: {
      type: Object
    }
  },
  computed: {
    getMailDetailsTo() {
      const mailDetails = this.mailDetails
      return mailDetails && mailDetails.to && mailDetails.to.toString()
    },
    getMailDetailsCc() {
      const mailDetails = this.mailDetails
      return mailDetails && mailDetails.cc && mailDetails.cc.toString()
    },
    getMailDetailsBcc() {
      const mailDetails = this.mailDetails
      return mailDetails && mailDetails.to && mailDetails.bcc.toString()
    }
  }
}
</script>
