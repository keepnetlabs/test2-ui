<template>
  <div class="training-library-drawer-info-card">
    <!-- Popover mode: multiple items with dropdown -->
    <template v-if="hasPopover">
      <div class="training-library-drawer-info-card__content">
        <div class="training-library-drawer-info-card__icon-row">
          <VIcon color="#757575">{{ icon }}</VIcon>
        </div>
        <div class="training-library-drawer-info-card__value-row">
          <VMenu
            v-model="isPopoverOpen"
            offset-y
            :min-width="200"
            :close-on-content-click="false"
            :attach="true"
            content-class="training-library-drawer-info-card__popover"
          >
            <template #activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on"
                class="
                  training-library-drawer-info-card__value
                  training-library-drawer-info-card__value--interactive
                "
              >
                <span class="training-library-drawer-info-card__value-text">{{ text }}</span>
                <VIcon size="18" color="#383b41">mdi-menu-down</VIcon>
              </span>
            </template>
            <div class="training-library-drawer-info-card__popover-content">
              <div class="training-library-drawer-info-card__popover-header">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  outlined
                  dense
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  class="training-library-drawer-info-card__popover-search"
                />
                <VIcon
                  size="20"
                  class="training-library-drawer-info-card__popover-close"
                  @click="isPopoverOpen = false"
                >
                  mdi-close
                </VIcon>
              </div>
              <div class="training-library-drawer-info-card__popover-divider" />
              <div class="training-library-drawer-info-card__popover-list">
                <div
                  v-for="(item, idx) in filteredPopoverItems"
                  :key="idx"
                  class="training-library-drawer-info-card__popover-item"
                >
                  {{ item }}
                </div>
                <div
                  v-if="filteredPopoverItems.length === 0"
                  class="training-library-drawer-info-card__popover-empty"
                >
                  No results found
                </div>
              </div>
            </div>
          </VMenu>
        </div>
      </div>
    </template>
    <!-- Tooltip mode -->
    <template v-else-if="tooltip">
      <VTooltip bottom>
        <template #activator="{ on }">
          <div class="training-library-drawer-info-card__content" v-on="on">
            <div class="training-library-drawer-info-card__icon-row">
              <VIcon color="#757575">{{ icon }}</VIcon>
            </div>
            <div class="training-library-drawer-info-card__value-row">
              <span class="training-library-drawer-info-card__value">
                <span class="training-library-drawer-info-card__value-text">
                  {{ text }}
                </span>
              </span>
            </div>
          </div>
        </template>
        <span>{{ tooltip }}</span>
      </VTooltip>
    </template>
    <!-- Default mode -->
    <div v-else class="training-library-drawer-info-card__content">
      <div class="training-library-drawer-info-card__icon-row">
        <VIcon color="#757575">{{ icon }}</VIcon>
      </div>
      <div class="training-library-drawer-info-card__value-row">
        <span class="training-library-drawer-info-card__value">
          <span class="training-library-drawer-info-card__value-text">
            {{ text }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryDrawerInfoCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: [String, Number],
      required: true
    },
    tooltip: {
      type: [String, Number],
      default: ''
    },
    popoverItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isPopoverOpen: false,
      searchQuery: ''
    }
  },
  computed: {
    hasPopover() {
      return this.popoverItems && this.popoverItems.length > 1
    },
    filteredPopoverItems() {
      const query = (this.searchQuery || '').trim().toLowerCase()
      if (!query) return this.popoverItems
      return this.popoverItems.filter((item) =>
        (item || '').toLowerCase().includes(query)
      )
    }
  }
}
</script>
