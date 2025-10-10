<template>
  <div class="d-flex align-center flex-shrink-0">
    <div class="template-list--item__narrator d-flex mr-2">
      <v-icon :size="16" color="#757575" class="mr-1">mdi-web</v-icon>
      <span class="template-list--item__language">
        <span class="mr-1">{{ firstLanguage }}</span>
        <template v-if="item.languageTypeName && item.languageTypeName.length > 1">
          <span class="template-list--item__language-separator mr-1">|</span>
          <VTooltip bottom z-index="10000">
            <template #activator="{ on }">
              <span v-on="on">+{{ item.languageTypeName.length - 1 }}</span>
            </template>
            <span>{{ item.languageTypeName.slice(1).join(', ') }}</span>
          </VTooltip>
        </template>
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
  },
  computed: {
    firstLanguage() {
      return this.item.languageTypeName && this.item.languageTypeName.length > 0
        ? this.item.languageTypeName[0]
        : ''
    }
  }
}
</script>
