<template>
  <v-tooltip bottom opacity="1" z-index="9999">
    <template v-slot:activator="{ on }">
      <div
        v-if="att.isFlagged && !isEmailTemplate"
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
        v-if="!att.isHidden && !isEmailTemplate"
        id="text--attachment-preview-name"
        class="file-name safari-hide-tooltip max-char pl-2"
      >
        {{ att.name }}
      </div>
      <div
        v-on="on"
        v-if="att.isHidden && !isEmailTemplate"
        id="text--attachment-preview-hidden-by-owner"
        class="file-name max-char pl-2"
      >
        Hidden by Owner
      </div>
      <div
        v-on="on"
        v-if="isEmailTemplate"
        id="text--attachment-email-template-preview-name"
        class="file-name safari-hide-tooltip max-char pl-2"
      >
        {{ att.fileName }}
      </div>
    </template>
    <span id="text--attachment-preview-tooltip" v-if="!isEmailTemplate"
      >{{ !att.isHidden ? att.name : 'Hidden by Owner'
      }}{{ att.isFlagged ? ' has been reported as a malicious file' : '' }}</span
    >
    <span id="text--attachment-preview-tooltip-email-template" v-else>{{ att.fileName }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'AttachmentsPreview',
  props: ['att', 'isEmailTemplate']
}
</script>

<style lang="scss">
.attachment-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: max-content;
  min-height: auto;

  .attachment {
    width: 182px;
    min-width: 182px;
    height: 32px;
    align-items: center;
    display: flex;
    flex-direction: row;
    margin: 16px;
    margin-left: 0;
    margin-top: 0;

    .attach-icon {
      min-width: 40px;
      height: 32px;
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .red-icon {
      background-color: #bb2a45 !important;
    }

    .blue-icon {
      background-color: #2196f3 !important;
    }

    span {
      width: 100%;
      text-align: center;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }

  .red-attach {
    background-color: #f3e1e5;
  }

  .blue-attach {
    background-color: #f1f8fe;
  }

  .file-name {
    display: block;
    max-width: 93%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 2;
  }
}
</style>
