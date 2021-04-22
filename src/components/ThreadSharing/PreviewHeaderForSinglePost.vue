<template>
  <div class="preview-header pt-0">
    <h2
      style="padding: 0 2px; border-bottom: 1px solid transparent;"
      v-if="!uploadRespond.isSubjectHidden && !!uploadRespond.subject"
    >
      <span
        id="text--threat-sharing-preview-header-for-single-post-subject"
        :class="{
          'malicious-style': uploadRespond.isSubjectFlagged,
          'malicious-style-hidden': uploadRespond.isSubjectHidden
        }"
      >
        Subject: {{ uploadRespond.subject }}
        <v-tooltip v-if="uploadRespond.isSubjectFlagged" bottom opacity="1">
          <template v-slot:activator="{ on }">
            <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
          </template>
          <span>The subject has been reported as a threat source</span>
        </v-tooltip></span
      >
    </h2>
    <h2
      style="padding: 0 2px; border-bottom: 1px solid transparent;"
      v-else-if="uploadRespond.isSubjectHidden && !!uploadRespond.subject"
    >
      <span
        id="text--threat-sharing-preview-header-for-single-post-subject-hidden-by-owner"
        :class="{
          'malicious-style': uploadRespond.isSubjectFlagged,
          'malicious-style-hidden': uploadRespond.isSubjectHidden
        }"
      >
        Subject: Hidden by Owner<v-tooltip v-if="uploadRespond.isSubjectFlagged" bottom opacity="1">
          <template v-slot:activator="{ on }">
            <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
          </template>
          <span>The subject has been reported as a threat source</span>
        </v-tooltip>
      </span>
    </h2>
    <div class="header-info pb-5">
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-if="!uploadRespond.isFromHidden && !!uploadRespond.from"
      >
        <span
          id="text--threat-sharing-preview-header-for-single-post-from"
          :class="{
            'malicious-style': uploadRespond.isFromFlagged,
            'malicious-style-hidden': uploadRespond.isFromHidden
          }"
        >
          From: {{ uploadRespond.from }}
          <v-tooltip v-if="uploadRespond.isFromFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>Emails from this sender may include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        id="text--threat-sharing-preview-header-for-single-post-from-hidden-by-owner"
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-else-if="uploadRespond.isFromHidden && !!uploadRespond.from"
      >
        <span
          :class="{
            'malicious-style': uploadRespond.isFromFlagged,
            'malicious-style-hidden': uploadRespond.isFromHidden
          }"
        >
          From: Hidden by Owner
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
        v-if="!uploadRespond.isToHidden && uploadRespond.to && !!uploadRespond.to.length"
      >
        <span
          id="text--threat-sharing-preview-header-for-single-post-email-address-may-be-targeted"
          :class="{
            'malicious-style': uploadRespond.isToFlagged,
            'malicious-style-hidden': uploadRespond.isToHidden
          }"
        >
          To: {{ uploadRespond.to && uploadRespond.to.toString()
          }}<v-tooltip v-if="uploadRespond.isToFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        id="text--threat-sharing-preview-header-for-single-post-to-hidden-by-owner"
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-else-if="uploadRespond.isToHidden && uploadRespond.to && !!uploadRespond.to.length"
      >
        <span
          :class="{
            'malicious-style': uploadRespond.isToFlagged,
            'malicious-style-hidden': uploadRespond.isToHidden
          }"
        >
          To: Hidden by Owner<v-tooltip v-if="uploadRespond.isToFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-if="!uploadRespond.isCcHidden && uploadRespond.cc && !!uploadRespond.cc.length"
      >
        <span
          :class="{
            'malicious-style': uploadRespond.isCcFlagged,
            'malicious-style-hidden': uploadRespond.isCcHidden
          }"
        >
          CC: {{ uploadRespond.cc && uploadRespond.cc.toString()
          }}<v-tooltip v-if="uploadRespond.isCcFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-else-if="uploadRespond.isCcHidden && !!uploadRespond.cc.length && uploadRespond.cc"
      >
        <span
          id="text--threat-sharing-preview-header-for-single-post-cc-hidden-by-owner"
          :class="{
            'malicious-style': uploadRespond.isCcFlagged,
            'malicious-style-hidden': uploadRespond.isCcHidden
          }"
        >
          CC: Hidden by Owner<v-tooltip v-if="uploadRespond.isCcFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-if="!uploadRespond.isBccHidden && uploadRespond.bcc && !!uploadRespond.bcc.length"
      >
        <span
          id="text--threat-sharing-preview-header-for-single-post-bcc-hidden-by-owner"
          :class="{
            'malicious-style': uploadRespond.isBccFlagged,
            'malicious-style-hidden': uploadRespond.isBccHidden
          }"
        >
          BCC: {{ uploadRespond.bcc && uploadRespond.bcc.toString()
          }}<v-tooltip v-if="uploadRespond.isBccFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div
        style="padding: 0 2px; border-bottom: 1px solid transparent;"
        v-else-if="uploadRespond.isBccHidden && !!uploadRespond.bcc.length && uploadRespond.bcc"
      >
        <span
          :class="{
            'malicious-style': uploadRespond.isBccFlagged,
            'malicious-style-hidden': uploadRespond.isBccHidden
          }"
        >
          BCC: Hidden by Owner<v-tooltip v-if="uploadRespond.isBccFlagged" bottom opacity="1">
            <template v-slot:activator="{ on }">
              <v-icon color="#f56c6c" v-on="on" class="ml-2 malicious-icon">mdi-alert</v-icon>
            </template>
            <span>This email address may be targeted by emails include harmful content</span>
          </v-tooltip>
        </span>
      </div>
      <div>
        Date: {{ uploadRespond.sentTime }}
        <br />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewHeaderForSinglePost',
  props: {
    uploadRespond: {
      required: true
    }
  }
}
</script>

<style scoped></style>
