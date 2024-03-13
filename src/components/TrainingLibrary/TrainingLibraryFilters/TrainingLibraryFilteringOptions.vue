<template>
  <VMenu
    v-model="isParentMenuOpen"
    bottom
    offset-y
    nudge-bottom="12"
    :close-on-content-click="false"
    content-class="filter-options__menu-content"
    class="filter-options__menu training-library-filtering-options"
  >
    <template #activator="{ on }">
      <div
        v-on="on"
        :class="['filter-options', { 'filter-options--menu-active': isParentMenuOpen }]"
      >
        <v-icon :class="['filter-options__icon', { 'filter-options--active-filter': isActive }]"
          >mdi-filter-variant</v-icon
        >
        <span :class="['filter-options__text', { 'filter-options--active': isActive }]"
          >Filtering Options</span
        >
      </div>
    </template>
    <div :key="item.text" v-for="item in TRAINING_LIBRARY_FILTER_OPTIONS">
      <VMenu
        v-if="item.hasMenu"
        right
        open-on-hover
        nudge-right="204"
        max-height="448"
        :nudge-top="item.nudgeTop"
        :max-width="item.maxWidth"
        :close-on-content-click="item.closeOnContentClick"
      >
        <template #activator="{ on }">
          <VListItem v-on="on" class="cursor-default" @click="handleListItemClick(item.text)">
            <VListItemTitle class="training-library-filtering-options-parent-list-item-title"
              >{{ item.text }} <VIcon>{{ item.icon }}</VIcon></VListItemTitle
            >
          </VListItem>
        </template>
        <TrainingLibraryFilterType
          v-if="item.text === 'Filter Type'"
          @on-filter-selected="isParentMenuOpen = false"
        />
        <TrainingLibraryShowFilterItems v-else />
      </VMenu>
      <VListItem
        v-else
        class="training-library-filtering-options-parent-list-item"
        @click="handleListItemClick(item.text)"
      >
        <VListItemTitle class="training-library-filtering-options-parent-list-item-title"
          >{{ item.text }} <VIcon>{{ item.icon }}</VIcon></VListItemTitle
        >
      </VListItem>
    </div>
  </VMenu>
</template>
<script>
import { TRAINING_LIBRARY_FILTER_OPTIONS } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'
import TrainingLibraryFilterType from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilterType.vue'
import TrainingLibraryShowFilterItems from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryShowFilterItems.vue'
import { mapActions } from 'vuex'

export default {
  name: 'TrainingLibraryFilteringOptions',
  components: { TrainingLibraryShowFilterItems, TrainingLibraryFilterType },
  props: {
    isActive: {
      type: Boolean
    }
  },
  data() {
    return {
      isParentMenuOpen: false,
      TRAINING_LIBRARY_FILTER_OPTIONS
    }
  },
  methods: {
    ...mapActions({
      writeFiltersToLocalStorage: 'trainingLibrary/writeFiltersToLocalStorage',
      restoreDefaultFilters: 'trainingLibrary/restoreDefaultFilters'
    }),
    handleListItemClick(item = '') {
      if (item === 'Set as Default Filter') {
        this.writeFiltersToLocalStorage()
        this.isParentMenuOpen = false
      }
      if (item === 'Restore Default Filter') {
        this.restoreDefaultFilters()
        this.isParentMenuOpen = false
      }
    }
  }
}
</script>
