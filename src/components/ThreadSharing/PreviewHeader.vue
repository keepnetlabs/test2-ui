<template>
  <div class="preview-header pt-0">
    <h2
      style="padding: 0 2px; border-bottom: 1px solid transparent;"
      v-if="uploadRespond && !!uploadRespond.subject"
    >
      <span
        id="text--threat-sharing-preview-header-subject"
        :class="{
          'malicious-style': uploadRespond.isSubjectFlagged && !uploadRespond.isSubjectHidden,
          'malicious-style-hidden': uploadRespond.isSubjectHidden,
          'hidden-icon-link': uploadRespond.isSubjectHidden
        }"
      >
        Subject: {{ uploadRespond.subject }}
        <span v-if="uploadRespond.isSubjectHidden" class="hidden-icon mdi mdi-eye-off"></span>
        <v-tooltip v-if="uploadRespond.isSubjectFlagged" bottom opacity="1">
          <template v-slot:activator="{ on }">
            <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
          </template>
          <span>The subject has been reported as a threat source</span>
        </v-tooltip></span
      >
    </h2>
    <div class="header-info pb-5">
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-if="uploadRespond && !!uploadRespond.from"
      >
        <span
          id="text--threat-sharing-preview-header-from"
          :class="{
            'malicious-style': uploadRespond.isFromFlagged && !uploadRespond.isFromHidden,
            'malicious-style-hidden': uploadRespond.isFromHidden,
            'hidden-icon-link': uploadRespond.isFromHidden
          }"
        >
          From: {{ uploadRespond.from }}
          <span v-if="uploadRespond.isFromHidden" class="hidden-icon mdi mdi-eye-off"></span>
          <v-tooltip v-if="uploadRespond.isFromFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>Emails from this sender may include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-if="uploadRespond && uploadRespond.to && !!uploadRespond.to.length"
      >
        <span
          id="text--threat-sharing-preview-header-to"
          :class="{
            'malicious-style': uploadRespond.isToFlagged && !uploadRespond.isToHidden,
            'malicious-style-hidden': uploadRespond.isToHidden,
            'hidden-icon-link': uploadRespond.isToHidden
          }"
        >
          To: {{ uploadRespond.to && uploadRespond.to.toString() }}
          <span v-if="uploadRespond.isToHidden" class="hidden-icon mdi mdi-eye-off"></span
          ><v-tooltip v-if="uploadRespond.isToFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        id="text--threat-sharing-preview-header-cc"
        v-if="uploadRespond && uploadRespond.cc && !!uploadRespond.cc.length"
      >
        <span
          :class="{
            'malicious-style': uploadRespond.isCcFlagged && !uploadRespond.isCcHidden,
            'malicious-style-hidden': uploadRespond.isCcHidden,
            'hidden-icon-link': uploadRespond.isCcHidden
          }"
        >
          CC: {{ uploadRespond.cc && uploadRespond.cc.toString()
          }}<span v-if="uploadRespond.isCcHidden" class="hidden-icon mdi mdi-eye-off"></span
          ><v-tooltip v-if="uploadRespond.isCcFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        id="text--threat-sharing-preview-header-bcc"
        v-if="uploadRespond && uploadRespond.bcc && !!uploadRespond.bcc.length"
      >
        <span
          :class="{
            'malicious-style': uploadRespond.isBccFlagged && !uploadRespond.isBccHidden,
            'malicious-style-hidden': uploadRespond.isBccHidden,
            'hidden-icon-link': uploadRespond.isBccHidden
          }"
        >
          BCC: {{ uploadRespond.bcc && uploadRespond.bcc.toString()
          }}<span v-if="uploadRespond.isBccHidden" class="hidden-icon mdi mdi-eye-off"></span
          ><v-tooltip v-if="uploadRespond.isBccFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div id="text--threat-sharing-preview-header-sent-time">
        Date: {{ uploadRespond.sentTime }}
        <br />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewHeader',
  props: {
    uploadRespond: {
      required: true
    }
  }
}
</script>

<style>
.hidden-icon-link {
  background-color: #757575;
  color: #ffffff;
}
</style>
