<template>
  <Fragment v-if="isRenderComponent">
    <div v-if="isFilterTypeSelect" class="training-library-filter-badge">
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type"
          >{{ filter.text }} ({{ getOperatorLabel(filter.activeOperator) }}):</span
        >
        <VTooltip :disabled="!shouldRenderTooltip(filter.text, filter.activeValue)" bottom>
          <template #activator="{ on }">
            <span v-on="on" class="training-library-filter-badge-value">{{
              getTruncatedFilterValue(filter.text, filter.activeValue)
            }}</span>
          </template>
          <span>{{ filter.activeValue }}</span>
        </VTooltip>
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
      :key="'search-' + fIndex"
      class="training-library-filter-badge"
    >
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type"
          >{{ filter.text }} ({{ getOperatorLabel(filter.activeOperator) }}):</span
        >
        <VTooltip
          :disabled="!shouldRenderTooltip(filter.text, getFilterValue(filter, filterVal))"
          bottom
        >
          <template #activator="{ on }">
            <span v-on="on" class="training-library-filter-badge-value">{{
              getTruncatedFilterValue(filter.text, getFilterValue(filter, filterVal))
            }}</span>
          </template>
          <span>{{ getFilterValue(filter, filterVal) }}</span>
        </VTooltip>
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
    <div
      v-else-if="isFilterTypeLongTextSearch"
      v-for="(filterVal, fIndex) in filter.activeValue"
      :key="'longtext-' + fIndex"
      class="training-library-filter-badge training-library-filter-badge-long-text-search"
    >
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type"
          >{{ filter.text }} ({{ getOperatorLabel(filter.activeOperator) }}):</span
        >
        <VTooltip bottom>
          <template #activator="{ on }">
            <span v-on="on" class="training-library-filter-badge-value">{{
              getFilterValue(filter, filterVal)
            }}</span>
          </template>
          <span>{{ getFilterValue(filter, filterVal) }}</span>
        </VTooltip>
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
        <span class="training-library-filter-badge-type"
          >{{ filter.text }} ({{ getOperatorLabel(filter.activeOperator) }}):</span
        >
        <VTooltip :disabled="!shouldRenderTooltip(filter.text, getDateFilterValue(filter))" bottom>
          <template #activator="{ on }">
            <span v-on="on" class="training-library-filter-badge-value">{{
              getTruncatedFilterValue(filter.text, getDateFilterValue(filter))
            }}</span>
          </template>
          <span>{{ getDateFilterValue(filter) }}</span>
        </VTooltip>
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
  name: 'TrainingLibraryLearningPathFilterBadge',
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
      types: 'trainingLibraryHelpers/getLearningPathTrainingTypes',
      targetAudiences: 'trainingLibraryHelpers/getTargetAudiences',
      vendors: 'trainingLibraryHelpers/getTrainingVendors',
      levels: 'trainingLibraryHelpers/getLevels',
      durations: 'trainingLibraryHelpers/getDurations'
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
    isFilterTypeLongTextSearch() {
      return this.filter.filterType === 'longTextSearch' && this.filter.activeValue
    },
    isFilterTypeDateSelect() {
      return this.filter.filterType === 'date' && this.filter.activeValue
    },
    isRenderComponent() {
      return (
        this.isFilterTypeSelect ||
        this.isFilterTypeSearch ||
        this.isFilterTypeDateSelect ||
        this.isFilterTypeLongTextSearch
      )
    }
  },
  methods: {
    ...mapActions({
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary',
      removeFilterFromPayload: 'trainingLibrary/removeFilterFromPayload'
    }),
    getOperatorLabel(operator) {
      const operatorMap = {
        Include: 'Equal',
        '!=': 'Not Equal',
        '>=': 'After',
        '<=': 'Before',
        '=': 'Equal',
        between: 'Between'
      }
      return operatorMap[operator] || operator
    },
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
      else if (filter.key === PROPERTY_STORE.VENDOR) return this.getVendorFilterValue(filterVal)
      else if (filter.key === PROPERTY_STORE.LEVEL) return this.getLevelFilterValue(filterVal)
      else if (filter.key === PROPERTY_STORE.DURATION) return this.getDurationFilterValue(filterVal)
      return filterVal
    },
    getLevelFilterValue(filterVal) {
      const val = String(filterVal ?? '')
      return (
        this.levels?.find(
          (item) => String(item?.value ?? '') === val || String(item?.id ?? '') === val
        )?.text || filterVal
      )
    },
    getDurationFilterValue(filterVal) {
      const val = String(filterVal ?? '')
      return (
        this.durations?.find(
          (item) => String(item?.value ?? '') === val || String(item?.id ?? '') === val
        )?.text || filterVal
      )
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
        })?.isoFriendlyName || langCode
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
    getBehaviourFilterValue(filterVal) {
      return (
        this.behaviours.find((beh) => {
          if (beh.value === filterVal) {
            return filterVal
          }
        })?.text || filterVal
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
    getVendorFilterValue(filterVal) {
      return (
        this.vendors.find((type) => {
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
    },
    shouldRenderTooltip(filterText, filterValue) {
      return filterText?.length + filterValue?.length > 33
    },
    getTruncatedFilterValue(filterText, filterValue) {
      if (filterText?.length + filterValue?.length > 33) {
        return `${filterValue.substring(0, 30)}...`
      }
      return filterValue
    }
  }
}
</script>
