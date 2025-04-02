<template>
  <div class="training-library-filters">
    <div>
      <VMenu
        :value="menu"
        ref="refMenu"
        bottom
        offset-y
        nudge-bottom="12"
        :close-on-content-click="false"
        :close-on-click="isCloseOnClick"
        content-class="filter-options__menu-content"
        class="filter-options__menu training-library-filtering-options"
        @input="handleMenuVisibilityChange"
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
                  filter && activeFilter.key === filter.key ? 'training-library-filter-active' : ''
                ]"
                @click="handleSetActiveFilter(filter)"
              >
                <VListItemTitle class="training-library-filtering-options-parent-list-item-title">
                  <div class="training-library-filtering-options-parent-list-item-title__left-side">
                    <VIcon
                      :color="filter && activeFilter.key === filter.key ? '#2196F3' : '#757575'"
                      >{{ filter.icon }}</VIcon
                    >
                    <span
                      :style="filter && activeFilter.key === filter.key ? 'color: #2196F3' : ''"
                      >{{ filter.text }}</span
                    >
                  </div>
                  <div
                    class="training-library-filtering-options-parent-list-item-title__right-side"
                  >
                    <div v-if="filter.isFilterActive" class="training-library-filter-number">
                      {{
                        filter.filterType === 'search' || filter.filterType === 'longTextSearch'
                          ? filter.activeValue.length
                          : 1
                      }}
                    </div>
                    <VIcon
                      :color="filter && activeFilter.key === filter.key ? '#2196F3' : '#757575'"
                      >mdi-menu-right</VIcon
                    >
                  </div>
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
              <TrainingLibraryDateFilter
                v-else-if="activeFilter.filterType === 'date'"
                ref="refDateFilter"
                :filter="activeFilter"
                @on-date-picker-change="handleDatePickerChange"
              />
              <TrainingLibraryLongTextSearchFilter
                v-else-if="activeFilter.filterType === 'longTextSearch'"
                :filter="activeFilter"
                :total-filter-length="getTotalFilterLength"
                :items="activeFilter.items"
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
import { mapGetters, mapActions } from 'vuex'
import TrainingLibrarySelectFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibrarySelectFilter.vue'
import TrainingLibraryDateFilter from './TrainingLibraryDateFilter.vue'
import TrainingLibraryLongTextSearchFilter from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryLongTextSearchFilter.vue'
export default {
  name: 'TrainingLibraryFilters',
  components: {
    TrainingLibraryLongTextSearchFilter,
    TrainingLibraryDateFilter,
    TrainingLibrarySelectFilter,
    TrainingLibrarySearchFilter,
    TrainingLibrarySorting,
    TrainingLibraryFilteringOptions
  },
  data() {
    return {
      activeFilter: {},
      menu: false,
      isCloseOnClick: true
    }
  },
  computed: {
    ...mapGetters({
      filters: 'trainingLibrary/getFilters',
      renderKey: 'trainingLibrary/getFiltersRenderKey'
    }),
    getTotalFilterLength() {
      return this.filters.filter((item) => item.show).length
    },
    isFilterButtonDisabled() {
      if (
        this.activeFilter.filterType === 'search' ||
        this.activeFilter.filterType === 'longTextSearch'
      ) {
        return this.activeFilter.value.length === 0
      } else {
        return !this.activeFilter.value
      }
    }
  },
  watch: {
    renderKey() {
      if (this.filters) this.activeFilter = this.filters[0]
    }
  },
  created() {
    if (this.filters) this.handleSetActiveFilter(this.filters[0])
  },
  methods: {
    ...mapActions({
      setFilterToPayload: 'trainingLibrary/setFilterToPayload',
      removeFilterFromPayload: 'trainingLibrary/removeFilterFromPayload'
    }),
    handleSetActiveFilter(filter) {
      if (filter && this.activeFilter.key === filter.key) return
      this.checkFilter(filter)
      this.activeFilter = filter
    },
    checkFilter(filter) {
      if (filter.isFilterActive) {
        filter.value = filter.activeValue
        filter.operator = filter.activeOperator
      } else {
        let filterValue
        if (filter.filterType === 'search' || filter.filterType === 'longTextSearch')
          filterValue = []
        else filterValue = ''
        filter.value = filterValue
      }
    },
    handleClearFilter(filter) {
      filter.isFilterActive = false
      let filterValue, filterOperator
      if (filter.filterType === 'search' || filter.filterType === 'longTextSearch') {
        filterValue = []
        filterOperator = 'Include'
      } else if (filter.filterType === 'select') {
        filterValue = ''
        filterOperator = 'Contains'
      } else {
        filterValue = ''
        filterOperator = '='
      }
      filter.value = filterValue
      filter.activeValue = filterValue
      filter.operator = filterOperator
      filter.activeOperator = filterOperator
      this.removeFilterFromPayload(filter)
    },
    handleFilter(filter) {
      filter.isFilterActive = true
      filter.activeValue = filter.value
      filter.activeOperator = filter.operator
      console.log('handleFilter', filter)
      this.setFilterToPayload(filter)
    },
    handleMenuVisibilityChange(val) {
      if (this.activeFilter.filterType === 'date') {
        const { refPicker, refPicker2 } = this.$refs.refDateFilter.$refs
        const { refMenu } = this.$refs
        if ((refPicker && refPicker.pickerVisible) || (refPicker2 && refPicker2.pickerVisible)) {
          this.isCloseOnClick = false
          this.menu = true
          refMenu.isActive = true
          return
        }
      }
      this.isCloseOnClick = true
      this.menu = val
      if (!this.menu) this.checkFilter(this.activeFilter)
    },
    handleDatePickerChange() {
      const { refMenu } = this.$refs
      this.isCloseOnClick = !(
        this.activeFilter.operator === 'between' && this.activeFilter.value === ''
      )
      this.menu = true
      refMenu.isActive = true
    }
  }
}
</script>
