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
        <VListItem
          v-for="item in menuItems"
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
    }
  },
  data() {
    return {
      menu: false
    }
  },
  computed: {
    menuItems() {
      const items = []

      // Download - sadece Poster ve Infographic için
      if (
        this.type === TRAINING_LIBRARY_TYPES.POSTER ||
        this.type === TRAINING_LIBRARY_TYPES.INFOGRAPHIC
      ) {
        items.push({
          action: 'download',
          icon: 'mdi-download',
          text: 'Download'
        })
      }

      // Edit - tüm tipler için
      items.push({
        action: 'edit',
        icon: 'mdi-pencil',
        text: 'Edit'
      })

      // Duplicate - tüm tipler için
      items.push({
        action: 'duplicate',
        icon: 'mdi-content-copy',
        text: 'Duplicate'
      })

      // Delete - sadece isDeletable true ise
      if (this.isDeletable) {
        items.push({
          action: 'delete',
          icon: 'mdi-delete',
          text: 'Delete'
        })
      }

      return items
    },
    menuWidth() {
      // Training tip ise 160, diğerleri için 180
      if (this.type === TRAINING_LIBRARY_TYPES.TRAINING) {
        return '160'
      }
      return '180'
    }
  },
  methods: {
    handleAction(action) {
      this.$emit(action)
      this.menu = false
    }
  }
}
</script>
