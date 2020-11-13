<template>
  <v-tooltip bottom opacity="1" z-index="9999">
    <template v-slot:activator="{ on }">
      <div v-if="att.isFlagged" v-on="on" class="attach-icon red-icon">
        <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
      </div>
      <div v-else v-on="on" class="attach-icon blue-icon">
        <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
      </div>
      <div v-on="on" v-if="!att.isHidden" class="file-name safari-hide-tooltip max-char pl-2">
        {{ att.name }}
      </div>
      <div v-on="on" v-if="att.isHidden" class="file-name max-char pl-2">
        hidden by owner
      </div>
    </template>
    <span
      >{{ !att.isHidden ? att.name : 'hidden by owner'
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
