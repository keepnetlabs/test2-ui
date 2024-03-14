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
        <div v-on="on">
          <VTextField
            :value="activeSort"
            ref="refFiltersInput"
            id="input--training-library-sorting"
            label="Sort By"
            style="width: 210px;"
            class="pointer-none"
            outlined
            hide-details
            autocomplete="off"
            placeholder="Sort By"
            append-icon="mdi-menu-down"
          />
        </div>
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
              @click="handleSortBy(item, filter)"
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TrainingLibrarySorting',
  data() {
    return {
      TRAINING_LIBRARY_SORTING_OPTIONS,
      parentMenu: false,
      childMenu: [false, false, false]
    }
  },
  computed: {
    ...mapGetters({
      activeSort: 'trainingLibrary/getSortBy'
    })
  },
  methods: {
    ...mapActions({ setSortBy: 'trainingLibrary/setSortBy' }),
    handleSortBy(item, sort) {
      console.log(sort)
      this.parentMenu = false
      this.setSortBy(`${item.text} - ${sort.text}`)
    }
  }
}
</script>
