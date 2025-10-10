<template>
  <VMenu
    v-model="menu"
    :close-on-content-click="true"
    offset-y
    nudge-bottom="8"
    bottom
    left
    :max-width="menuWidth"
    :min-width="menuWidth"
  >
    <template #activator="{ on, attrs }">
      <div v-on="on" v-bind="attrs">
        <slot name="activator"></slot>
      </div>
    </template>
    <VCard class="training-library-drawer-actions-menu">
      <VList class="training-library-drawer-actions-menu__list">
        <!-- Download item with hover submenu for languages -->
        <template v-if="hasDownloadSubmenu">
          <VMenu open-on-hover offset-x right :close-on-content-click="false">
            <template #activator="{ on }">
              <VListItem class="training-library-drawer-actions-menu__item" v-on="on">
                <VListItemIcon>
                  <VIcon size="20" color="#757575">mdi-download</VIcon>
                </VListItemIcon>
                <VListItemTitle>Download {{ downloadTypeText }}</VListItemTitle>
                <VSpacer />
                <VIcon size="18" color="#757575">mdi-chevron-right</VIcon>
              </VListItem>
            </template>
            <VCard class="training-library-drawer-actions-menu__submenu">
              <div class="px-4 pt-3 pb-1">
                <VTextField
                  v-model="langSearch"
                  outlined
                  dense
                  hide-details
                  placeholder="Search"
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
              <VList>
                <VListItem
                  v-for="lang in filteredLanguages"
                  :key="lang.value || lang.id || lang"
                  @click.stop="handleDownload(lang)"
                >
                  <VListItemTitle>{{ lang.text || lang }}</VListItemTitle>
                </VListItem>
                <VListItem v-if="!filteredLanguages.length">
                  <VListItemTitle class="text-center grey--text">No languages found</VListItemTitle>
                </VListItem>
              </VList>
            </VCard>
          </VMenu>
        </template>

        <!-- The rest of the static menu items -->
        <VListItem
          v-for="item in otherItems"
          :key="item.action"
          class="training-library-drawer-actions-menu__item"
          @click="handleAction(item.action)"
        >
          <VListItemIcon>
            <VIcon size="20" color="#757575">{{ item.icon }}</VIcon>
          </VListItemIcon>
          <VListItemTitle>{{ item.text }}</VListItemTitle>
        </VListItem>
      </VList>
    </VCard>
  </VMenu>
</template>

<script>
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingLibraryDrawerActionsMenu',
  props: {
    type: {
      type: String,
      default: TRAINING_LIBRARY_TYPES.TRAINING
    },
    isDeletable: {
      type: Boolean,
      default: true
    },
    languages: {
      type: Array,
      default: () => []
    },
    isNested: {
      type: Boolean,
      default: false
    },
    isDeepNested: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menu: false,
      langSearch: ''
    }
  },
  computed: {
    hasDownloadSubmenu() {
      return (
        this.type === TRAINING_LIBRARY_TYPES.POSTER ||
        this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC ||
        this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER
      )
    },
    downloadTypeText() {
      if (this.type === TRAINING_LIBRARY_TYPES.POSTER) return 'Poster'
      if (this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC) return 'Infographic'
      if (this.type === TRAINING_LIBRARY_TYPES.SCREENSAVER) return 'Screensaver'
      return 'File'
    },
    otherItems() {
      const items = []
      items.push({ action: 'edit', icon: 'mdi-pencil', text: 'Edit' })
      if (!this.isNested && !this.isDeepNested) {
        items.push({
          action: 'duplicate',
          icon: 'mdi-content-copy',
          text: 'Duplicate'
        })
        if (this.isDeletable) items.push({ action: 'delete', icon: 'mdi-delete', text: 'Delete' })
      }
      return items
    },
    menuWidth() {
      // Submenu varsa 240, yoksa training için 160, diğerleri 180
      if (this.hasDownloadSubmenu) return '240'
      if (this.type === TRAINING_LIBRARY_TYPES.TRAINING) return '160'
      return '180'
    },
    filteredLanguages() {
      if (!this.langSearch) return this.languages
      const q = this.langSearch.toLowerCase()
      return (this.languages || []).filter((l) => (l.text || String(l)).toLowerCase().includes(q))
    }
  },
  methods: {
    handleDownload(language) {
      this.$emit('download', language)
      this.menu = false
    },
    handleAction(action) {
      this.$emit(action)
      this.menu = false
    }
  }
}
</script>
