<template>
  <v-tooltip bottom opacity="1" z-index="9999">
    <template v-slot:activator="{ on }">
      <div
        v-if="att.isFlagged"
        v-on="on"
        id="text--attachment-preview-flagged"
        class="attach-icon red-icon"
      >
        <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
      </div>
      <div v-else v-on="on" id="text--attachment-preview-no-flaged" class="attach-icon blue-icon">
        <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
      </div>
      <div
        v-on="on"
        v-if="!att.isHidden"
        id="text--attachment-preview-name"
        class="file-name safari-hide-tooltip max-char pl-2"
      >
        {{ att.name }}
      </div>
      <div
        v-on="on"
        v-if="att.isHidden"
        id="text--attachment-preview-hidden-by-owner"
        class="file-name max-char pl-2"
      >
        Hidden by Owner
      </div>
    </template>
    <span id="text--attachment-preview-tooltip"
      >{{ !att.isHidden ? att.name : 'Hidden by Owner'
      }}{{ att.isFlagged ? ' has been reported as a malicious file' : '' }}</span
    >
  </v-tooltip>
</template>

<script>
export default {
  name: 'AttachmentsPreview',
  props: ['att']
}
</script>

<style scoped></style>
