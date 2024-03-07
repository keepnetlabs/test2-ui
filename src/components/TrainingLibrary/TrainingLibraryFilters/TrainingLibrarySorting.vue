<template>
  <div>
    <VMenu
      v-model="parentMenu"
      bottom
      offset-y
      nudge-bottom="12"
      :close-on-content-click="false"
      content-class="filter-options__menu-content"
      class="filter-options__menu training-library-filtering-options"
    >
      <template #activator="{ on }">
        <VTextField
          v-on="on"
          v-model.trim="activeSort"
          ref="refFiltersInput"
          id="input--training-library-sorting"
          style="max-width: 200px;"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Sort By"
          prepend-inner-icon="mdi-arrow-down"
          append-icon="mdi-menu-down"
        />
      </template>
      <div :key="item.text" v-for="(item, index) in TRAINING_LIBRARY_SORTING_OPTIONS">
        <VMenu
          v-model="childMenu[index]"
          left
          open-on-hover
          nudge-left="200"
          content-class="filter-options__menu-content"
          class="filter-options__menu training-library-filtering-options"
        >
          <template #activator="{ on }">
            <VListItem v-on="on" class="training-library-filtering-options-parent-list-item">
              <VListItemTitle class="training-library-filtering-options-parent-list-item-title"
                >{{ item.text }} <VIcon>{{ item.icon }}</VIcon></VListItemTitle
              >
            </VListItem>
          </template>
          <div :key="filter.text" v-for="filter in item.menu">
            <VListItem
              class="training-library-filtering-options-parent-list-item cursor-pointer"
              @click="handleSortBy(filter)"
            >
              <VListItemTitle class="training-library-filtering-options-parent-list-item-title">{{
                filter.text
              }}</VListItemTitle>
            </VListItem>
          </div>
        </VMenu>
      </div>
    </VMenu>
  </div>
</template>
<script>
import { TRAINING_LIBRARY_SORTING_OPTIONS } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'
import { mapActions } from 'vuex'

export default {
  name: 'TrainingLibrarySorting',
  data() {
    return {
      TRAINING_LIBRARY_SORTING_OPTIONS,
      activeSort: '',
      parentMenu: false,
      childMenu: [false, false, false]
    }
  },
  methods: {
    ...mapActions({ setSortBy: 'trainingLibrary/setSortBy' }),
    handleSortBy(filter) {
      this.parentMenu = false
      this.setSortBy(filter)
    }
  }
}
</script>
