<template>
  <Fragment v-if="isRenderComponent">
    <div v-if="isFilterTypeSelect" class="training-library-filter-badge">
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type">{{ filter.text }}:</span>
        <span class="training-library-filter-badge-value">{{ filter.activeValue }}</span>
      </div>
      <div>
        <VIcon
          class="fw-600 cursor-pointer"
          style="font-size: 20px; margin-top: -2px;"
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
          getFilterValue(filter, filterVal)
        }}</span>
      </div>
      <div>
        <VIcon
          class="fw-600 cursor-pointer"
          style="font-size: 20px; margin-top: -2px;"
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
          style="font-size: 20px; margin-top: -2px;"
          color="#757575"
          @click="removeSelectFilter"
          >mdi-close</VIcon
        >
      </div>
    </div>
  </Fragment>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { Fragment } from 'vue-frag'

export default {
  name: 'TrainingLibraryFilterBadge',
  components: {
    Fragment
  },
  props: {
    filter: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages',
      compliances: 'trainingLibraryHelpers/getCompliances',
      categories: 'trainingLibraryHelpers/getCategories',
      behaviours: 'trainingLibraryHelpers/getBehaviours',
      types: 'trainingLibraryHelpers/getTrainingTypes',
      targetAudiences: 'trainingLibraryHelpers/getTargetAudiences'
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
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary',
      removeFilterFromPayload: 'trainingLibrary/removeFilterFromPayload'
    }),
    getFilterValue(filter, filterVal) {
      if (filter.key === PROPERTY_STORE.LANGUAGES) return this.getLanguageFilterValue(filterVal)
      else if (filter.key === PROPERTY_STORE.COMPLIANCE)
        return this.getComplianceFilterValue(filterVal)
      else if (filter.key === PROPERTY_STORE.CATEGORY) return this.getCategoryFilterValue(filterVal)
      else if (filter.key === PROPERTY_STORE.BEHAVIOURS)
        return this.getBehaviourFilterValue(filterVal)
      else if (filter.key === PROPERTY_STORE.TYPE) return this.getTrainingTypeFilterValue(filterVal)
      else if (filter.key === PROPERTY_STORE.TARGET_AUDIENCE)
        return this.getTargetAudienceFilterValue(filterVal)
      return filterVal
    },
    removeSelectFilter() {
      this.filter.activeValue = ''
      this.filter.value = ''
      this.filter.isFilterActive = false
      this.removeFilterFromPayload(this.filter)
    },
    removeSearchFilter(value, index) {
      this.filter.activeValue.splice(index, 1)
      this.filter.value = this.filter.activeValue
      this.filter.isFilterActive = !!this.filter.activeValue.length
      this.removeFilterFromPayload(this.filter)
    },
    getLanguageFilterValue(langCode = '') {
      return (
        this.languages.find((lang) => {
          if (lang.code === langCode) {
            return lang
          }
        })?.name || langCode
      )
    },
    getComplianceFilterValue(compliance = '') {
      return (
        this.compliances.find((cmp) => {
          if (cmp.value === compliance) {
            return cmp
          }
        })?.text || compliance
      )
    },
    getCategoryFilterValue(category = '') {
      return (
        this.categories.find((cat) => {
          if (cat.value === category) {
            return cat
          }
        })?.text || category
      )
    },
    getBehaviourFilterValue(behaviour) {
      return (
        this.behaviours.find((beh) => {
          if (beh.value === behaviour) {
            return behaviour
          }
        })?.text || filter
      )
    },
    getTrainingTypeFilterValue(filterVal) {
      return (
        this.types.find((type) => {
          if (type.value === filterVal) {
            return type
          }
        })?.text || filterVal
      )
    },
    getTargetAudienceFilterValue(filterVal) {
      return (
        this.targetAudiences.find((type) => {
          if (type.value === filterVal) {
            return type
          }
        })?.text || filterVal
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
