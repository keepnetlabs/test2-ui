<template>
  <v-chip
    class="template-list--item template-list--item__chip"
    style="
      background-color: #757575;
      margin-left: 12px;
      margin-top: 1px;
      color: white;
      border-radius: 6px;
      height: 24px;
      font-weight: 600;
      font-size: 12px;
    "
  >
    <v-icon style="font-size: 18px;" color="#fff">mdi-web</v-icon>
    <span
      v-for="(language, index) in languageShortCode"
      :key="language"
      class="template-list--item__language"
    >
      <span v-if="index < 2">{{ language }}</span>
      <span
        v-if="languageShortCode.length > 2 ? index < 2 : index < languageShortCode.length - 1"
        class="template-list--item__language-separator"
        >|</span
      >
      <VTooltip v-if="languageShortCode.length > 2 && index === 2" bottom z-index="10000">
        <template #activator="{ on }">
          <span v-on="on">+{{ languageShortCode.length - 2 }}</span>
        </template>
        <span>{{ languageShortCode.slice(2).join(', ') }}</span>
      </VTooltip>
    </span>
  </v-chip>
</template>
<script>
export default {
  name: 'EmailTemplateListPreviewLanguages',
  props: {
    languageShortCode: {
      type: Array,
      required: true
    }
  }
}
</script>
