<template>
  <div class="d-flex align-center">
    <div class="template-list--item__narrator d-flex mr-2">
      <v-icon :size="16" color="#757575" class="mr-1">mdi-web</v-icon>
      <span
        v-for="(language, index) in item.languageTypeCode"
        :key="language"
        class="template-list--item__language"
      >
        <span v-if="index < 2" class="mr-1">{{ language }}</span>
        <span
          v-if="
            item.languageTypeCode.length > 2 ? index < 2 : index < item.languageTypeCode.length - 1
          "
          class="template-list--item__language-separator"
          >|</span
        >
        <VTooltip v-if="item.languageTypeCode.length > 2 && index >= 2" bottom z-index="10000">
          <template #activator="{ on }">
            <span v-on="on">+{{ item.languageTypeCode.length - 2 }}</span>
          </template>
          <span>{{ item.languageTypeCode.slice(2).join(', ') }}</span>
        </VTooltip>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EmailTemplateListLeftSideLanguages',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
