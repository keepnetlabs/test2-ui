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
        class="file-name safari-hide-tooltip max-char mx-2"
      >
        {{ getFileName }}
      </div>
      <div
        v-on="on"
        v-if="att.isHidden && !isEmailTemplate"
        id="text--attachment-preview-hidden-by-owner"
        class="file-name max-char px-2"
      >
        Hidden by Owner
      </div>
      <div
        v-on="on"
        v-if="isEmailTemplate"
        id="text--attachment-email-template-preview-name"
        :class="[
          'file-name safari-hide-tooltip max-char mx-2',
          isAttachmentNameFullWidth ? 'full-width' : ''
        ]"
      >
        {{ getFileName }}
      </div>
      <v-icon
        v-if="isEmailTemplate && deletable"
        style="position: absolute; right: -28px;"
        @click="handleDelete"
        >mdi-close</v-icon
      >
    </template>
    <span id="text--attachment-preview-tooltip" v-if="!isEmailTemplate"
      >{{ !att.isHidden ? att.name : 'Hidden by Owner'
      }}{{ att.isFlagged ? ' has been reported as a malicious file' : '' }}</span
    >
    <span id="text--attachment-preview-tooltip-email-template" v-else>{{ getFileName }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'AttachmentsPreview',
  props: ['att', 'isEmailTemplate', 'deletable', 'index', 'isAttachmentNameFullWidth'],
  computed: {
    getFileName() {
      return this.att.fileName || this.att.name
    }
  },
  methods: {
    handleDelete() {
      this.$emit('on-delete', this.index)
    }
  }
}
</script>
