<template>
  <div id="preview-footer-container" class="preview-footer">
    <h2>Attachments</h2>
    <div class="attachment-wrapper">
      <div
        v-for="(att, ind) of mailDetails.attachments"
        :key="att.resourceId"
        :id="`text--email-details-preview__attachment-${ind}`"
        :class="`attachment ${getClass(att['analysisList'])}`"
      >
        <div v-if="getIsAnalysisMalicious(att['analysisList'])" class="attach-icon red-icon">
          <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
        </div>
        <div v-else class="attach-icon blue-icon">
          <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
        </div>
        <v-menu
          content-class="email-preview__attachment-container-menu"
          bottom
          right
          offset-y
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <div v-on="on" class="pl-2 email-preview__attachment-container">
              <span> {{ att.name }} </span>
              <v-icon style="padding-left: 6px;">mdi-chevron-down</v-icon>
            </div>
          </template>
          <v-list class="v-cart-dropdown-list el-table__action-buttons">
            <v-list-item @click="$emit('on-attachment-click', ind, att.sha512)">
              <v-icon>mdi-text-box-multiple</v-icon>
              <span class="ml-4"> Attachment Details</span>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailDetailsPreviewFooter',
  props: {
    mailDetails: {
      type: Object
    }
  },
  emits: ['on-attachment-click'],
  methods: {
    getClass(analysisList = []) {
      return this.getIsAnalysisMalicious(analysisList) ? 'red-attach' : 'blue-attach'
    },
    getIsAnalysisMalicious(analysisList = []) {
      return (
        analysisList.length &&
        analysisList.some(({ result }) => {
          return ['Malicious', 'Phishing'].includes(result)
        })
      )
    }
  }
}
</script>
