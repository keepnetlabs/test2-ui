<template>
  <div class="training-library-filters">
    <div>
      <VMenu
        v-model="menu"
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
              ref="refFiltersInput"
              class="pointer-none"
              id="input--training-library-filters"
              outlined
              hide-details
              autocomplete="off"
              placeholder="Filters"
              prepend-inner-icon="mdi-filter-variant"
              append-icon="mdi-menu-down"
            />
          </div>
        </template>
        <div v-if="getTotalFilterLength" class="training-library-filters-container">
          <div class="training-library-filters-container__left">
            <div v-for="filter in filters" v-if="filter.show" :key="filter.key">
              <VListItem
                :class="[
                  'training-library-filtering-options-parent-list-item cursor-pointer',
                  activeFilter.key === filter.key ? 'training-library-filter-active' : ''
                ]"
                @click="handleSetActiveFilter(filter)"
              >
                <VListItemTitle class="training-library-filtering-options-parent-list-item-title">
                  <div class="training-library-filtering-options-parent-list-item-title__left-side">
                    <VIcon :color="activeFilter.key === filter.key ? '#2196F3' : '#757575'">{{
                      filter.icon
                    }}</VIcon>
                    <span :style="activeFilter.key === filter.key ? 'color: #2196F3' : ''">{{
                      filter.text
                    }}</span>
                  </div>
                  <VIcon :color="activeFilter.key === filter.key ? '#2196F3' : '#757575'"
                    >mdi-menu-right</VIcon
                  >
                </VListItemTitle>
              </VListItem>
            </div>
          </div>
          <div class="training-library-filters-container__right">
            <div class="training-library-filters-container__right-container">
              <TrainingLibrarySearchFilter
                v-if="activeFilter.filterType === 'search'"
                :total-filter-length="getTotalFilterLength"
                :items="activeFilter.items"
                :filter="activeFilter"
              />
              <TrainingLibrarySelectFilter v-else :filter="activeFilter" />
            </div>
            <div class="training-library-filters-container__right-footer">
              <v-btn
                text
                class="filter__footer-button"
                color="#00BCD4"
                @click="handleClearFilter(activeFilter)"
              >
                Clear
              </v-btn>
              <v-btn
                text
                class="filter__footer-button"
                color="#2196F3"
                :disabled="isFilterButtonDisabled"
                @click="handleFilter(activeFilter)"
              >
                Filter
              </v-btn>
            </div>
          </div>
        </div>
        <div v-else class="training-library-filters-container__empty">
          <p class="mb-0">
            No filter has been applied. Please select a filter from the filtering options.
          </p>
        </div>
      </VMenu>
      <TrainingLibraryFilteringOptions />
    </div>
    <div>
      <TrainingLibrarySorting />
    </div>
  </div>
</template>

<script>
import TrainingLibraryFilteringOptions from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilteringOptions.vue'
import TrainingLibrarySorting from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySorting.vue'
import TrainingLibrarySearchFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySearchFilter.vue'
import { mapGetters } from 'vuex'
import TrainingLibrarySelectFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySelectFilter.vue'

export default {
  name: 'TrainingLibraryFilters',
  components: {
    TrainingLibrarySelectFilter,
    TrainingLibrarySearchFilter,
    TrainingLibrarySorting,
    TrainingLibraryFilteringOptions
  },
  data() {
    return {
      activeFilter: {},
      menu: false
    }
  },
  computed: {
    ...mapGetters({
      filters: 'trainingLibrary/getFilters'
    }),
    getTotalFilterLength() {
      return this.filters.filter((item) => item.show).length
    },
    isFilterButtonDisabled() {
      if (this.activeFilter.filterType === 'search') {
        return this.activeFilter.value.length === 0
      } else {
        return !this.activeFilter.value
      }
    }
  },
  created() {
    if (this.filters) this.handleSetActiveFilter(this.filters[0])
  },
  methods: {
    handleSetActiveFilter(filter) {
      this.activeFilter = filter
    },
    handleClearFilter(key) {},
    handleFilter() {}
  }
}
</script>
