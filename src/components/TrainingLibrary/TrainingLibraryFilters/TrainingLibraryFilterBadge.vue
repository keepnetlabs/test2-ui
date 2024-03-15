<template>
  <div v-if="isRenderComponent" class="d-flex gap-2 flex-wrap">
    <div v-if="isFilterTypeSelect" class="training-library-filter-badge">
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type">{{ filter.text }}:</span>
        <span class="training-library-filter-badge-value">{{ filter.activeValue }}</span>
      </div>
      <div>
        <VIcon
          class="fw-600 cursor-pointer"
          style="font-size: 20px;"
          color="#757575"
          @click="removeSelectFilter"
          >mdi-close</VIcon
        >
      </div>
    </div>
    <div
      v-else-if="isFilterTypeSearch"
      v-for="(filterVal, fIndex) in filter.activeValue"
      :key="fIndex"
      class="training-library-filter-badge"
    >
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type">{{ filter.text }}:</span>
        <span class="training-library-filter-badge-value">{{
          filter.key === PROPERTY_STORE.LANGUAGES ? getFilterValue(filterVal) : filterVal
        }}</span>
      </div>
      <div>
        <VIcon
          class="fw-600 cursor-pointer"
          style="font-size: 20px;"
          color="#757575"
          @click="removeSearchFilter(filterVal, fIndex)"
          >mdi-close</VIcon
        >
      </div>
    </div>
    <div v-else-if="isFilterTypeDateSelect" class="training-library-filter-badge">
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type">{{ filter.text }}:</span>
        <span class="training-library-filter-badge-value">{{ getDateFilterValue(filter) }}</span>
      </div>
      <div>
        <VIcon
          class="fw-600 cursor-pointer"
          style="font-size: 20px;"
          color="#757575"
          @click="removeSelectFilter"
          >mdi-close</VIcon
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export default {
  name: 'TrainingLibraryFilterBadge',
  props: {
    filter: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages'
    }),
    PROPERTY_STORE() {
      return PROPERTY_STORE
    },
    isFilterTypeSelect() {
      return this.filter.filterType === 'select' && this.filter.activeValue
    },
    isFilterTypeSearch() {
      return this.filter.filterType === 'search' && this.filter.activeValue.length
    },
    isFilterTypeDateSelect() {
      return this.filter.filterType === 'date' && this.filter.activeValue
    },
    isRenderComponent() {
      return this.isFilterTypeSelect || this.isFilterTypeSearch || this.isFilterTypeDateSelect
    }
  },
  methods: {
    ...mapActions({
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    removeSelectFilter() {
      this.filter.activeValue = ''
      this.filter.value = ''
      this.filter.isFilterActive = false
      this.callForTrainingLibrary()
    },
    removeSearchFilter(value, index) {
      this.filter.activeValue.splice(index, 1)
      this.filter.value = this.filter.activeValue
      this.filter.isFilterActive = !!this.filter.activeValue.length
      this.callForTrainingLibrary()
    },
    getFilterValue(langCode = '') {
      return (
        this.languages.find((lang) => {
          if (lang.code === langCode) {
            return lang
          }
        })?.name || langCode
      )
    },
    getDateFilterValue(filter) {
      if (filter.activeOperator === 'between') {
        return `${filter.activeValue[0]} - ${filter.activeValue[1]}`
      }
      return filter.activeValue
    }
  }
}
</script>
