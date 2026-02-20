<template>
  <div class="languages-popover">
    <div class="languages-popover__header">
      <v-text-field
        v-model="searchQuery"
        placeholder="Search"
        outlined
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="languages-popover__search-input"
      />
      <v-icon
        class="languages-popover__close-btn"
        size="20"
        @click="onClose && onClose()"
      >
        mdi-close
      </v-icon>
    </div>
    <div class="languages-popover__divider" />
    <h3
      v-if="filteredPreferredLanguages.length > 0"
      class="languages-popover__title mt-2"
    >
      Languages your employees prefer
    </h3>
    <div
      class="languages-popover__list"
      :class="{ 'languages-popover__list--no-title': filteredPreferredLanguages.length === 0 }"
    >
      <div
        v-for="(language, index) in filteredPreferredLanguages"
        :key="`pref-${index}-${language}`"
        class="languages-popover__item"
      >
        {{ language }}
      </div>
      <div
        v-if="filteredPreferredLanguages.length > 0 && filteredNonPreferredLanguages.length > 0"
        class="languages-popover__section-divider"
      />
      <div
        v-for="(language, index) in filteredNonPreferredLanguages"
        :key="`nonpref-${index}-${language}`"
        class="languages-popover__item"
      >
        {{ language }}
      </div>
      <div
        v-if="filteredPreferredLanguages.length === 0 && filteredNonPreferredLanguages.length === 0"
        class="languages-popover__empty"
      >
        No languages found
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LanguagesPopover',
  props: {
    preferredLanguages: {
      type: Array,
      default: () => []
    },
    nonPreferredLanguages: {
      type: Array,
      default: () => []
    },
    onClose: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredPreferredLanguages() {
      return this.filterByQuery(
        Array.isArray(this.preferredLanguages) ? this.preferredLanguages : []
      )
    },
    filteredNonPreferredLanguages() {
      return this.filterByQuery(
        Array.isArray(this.nonPreferredLanguages) ? this.nonPreferredLanguages : []
      )
    }
  },
  methods: {
    filterByQuery(list) {
      const query = (this.searchQuery || '').trim().toLowerCase()
      if (!query) return list
      return list.filter((lang) =>
        (lang || '').toLowerCase().includes(query)
      )
    }
  }
}
</script>
