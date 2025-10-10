<template>
  <VMenu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    nudge-bottom="8"
    bottom
    max-width="360"
    min-width="360"
  >
    <template #activator="{ on, attrs }">
      <div v-on="on" v-bind="attrs">
        <slot name="activator"></slot>
      </div>
    </template>
    <VCard class="training-library-drawer-language-menu">
      <div class="training-library-drawer-language-menu__search">
        <VTextField
          v-model="search"
          outlined
          dense
          hide-details
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
        />
      </div>
      <VList class="training-library-drawer-language-menu__list">
        <VListItem v-if="isLoading">
          <VListItemTitle class="text-center grey--text">
            <VProgressCircular indeterminate size="20" width="2" />
            Loading languages...
          </VListItemTitle>
        </VListItem>
        <template v-else>
          <VListItem
            v-for="language in filteredLanguages"
            :key="language.value"
            class="training-library-drawer-language-menu__item"
            @click="handleLanguageSelect(language)"
          >
            <VListItemTitle>{{ language.text }}</VListItemTitle>
          </VListItem>
          <VListItem v-if="!filteredLanguages.length && !isLoading">
            <VListItemTitle class="text-center grey--text">
              No languages found
            </VListItemTitle>
          </VListItem>
        </template>
      </VList>
    </VCard>
  </VMenu>
</template>

<script>
export default {
  name: 'TrainingLibraryDrawerLanguageMenu',
  props: {
    languages: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menu: false,
      search: ''
    }
  },
  computed: {
    filteredLanguages() {
      if (!this.search) return this.languages
      const searchLower = this.search.toLowerCase()
      return this.languages.filter((lang) => lang.text.toLowerCase().includes(searchLower))
    }
  },
  methods: {
    handleLanguageSelect(language) {
      this.$emit('language-selected', language)
      this.menu = false
      this.search = ''
    }
  }
}
</script>

<style lang="scss"></style>
