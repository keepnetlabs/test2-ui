<template>
  <div class="languages-column">
    <div v-if="languages.length" class="languages-column__container">
      <span class="languages-column__first">{{ firstLanguage }}</span>
      <v-menu
        v-if="overflowCount > 0"
        v-model="isPopoverOpen"
        :min-width="248"
        offset-x
        offset-y
        nudge-left="8"
        :close-on-content-click="false"
        content-class="languages-column__popover"
      >
        <template #activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
            class="languages-column__overflow"
          >
            +{{ overflowCount }} {{ overflowCount === 1 ? 'language' : 'languages' }}
          </span>
        </template>
        <LanguagesPopover
          :preferred-languages="overflowPreferredLanguages"
          :non-preferred-languages="overflowNonPreferredLanguages"
          :on-close="handleClosePopover"
        />
      </v-menu>
    </div>
    <span v-else class="languages-column__empty">{{ emptyText }}</span>
  </div>
</template>

<script>
import LanguagesPopover from './LanguagesPopover'

export default {
  name: 'LanguagesColumn',
  components: { LanguagesPopover },
  props: {
    /** Row data - languages from scope.row[property] */
    value: {
      type: [Array, String],
      default: () => []
    },
    /** Preferred languages from scenarioDetailsLookup.preferredLanguageTypes */
    preferredLanguageTypes: {
      type: Array,
      default: () => []
    },
    /** Text when no languages */
    emptyText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPopoverOpen: false
    }
  },
  computed: {
    languages() {
      const val = this.value
      if (Array.isArray(val)) return val.filter(Boolean)
      return val ? [val] : []
    },
    firstLanguage() {
      return this.languages[0] || ''
    },
    overflowCount() {
      return Math.max(0, this.languages.length - 1)
    },
    preferredTexts() {
      const types = this.preferredLanguageTypes || []
      return types.map((t) => ((t && t.text) || '').trim().toLowerCase()).filter(Boolean)
    },
    overflowLanguages() {
      return this.languages.length > 1 ? this.languages.slice(1) : []
    },
    overflowPreferredLanguages() {
      const preferred = this.preferredTexts
      return this.overflowLanguages.filter((lang) => {
        const langLower = (lang || '').trim().toLowerCase()
        return preferred.some((p) => langLower === p || langLower.startsWith(p + ' '))
      })
    },
    overflowNonPreferredLanguages() {
      const preferred = this.preferredTexts
      return this.overflowLanguages.filter((lang) => {
        const langLower = (lang || '').trim().toLowerCase()
        return !preferred.some((p) => langLower === p || langLower.startsWith(p + ' '))
      })
    }
  },
  methods: {
    handleClosePopover() {
      this.isPopoverOpen = false
    }
  }
}
</script>
