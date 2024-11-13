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
    <div
      v-else-if="isFilterTypeLongTextSearch"
      v-for="(filterVal, fIndex) in filter.activeValue"
      :key="fIndex"
      class="training-library-filter-badge training-library-filter-badge-long-text-search"
    >
      <div class="training-library-filter-badge__left-side">
        <span class="training-library-filter-badge-type">{{ filter.text }}:</span>
        <VTooltip bottom content-class="training-library-long-text-search__tooltip">
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
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { Fragment } from 'vue-frag'

export default {
  name: 'GamificationReportUserDetailsDrawerFilterBadge',
  components: {
    Fragment
  },
  props: {
    filter: {
      type: Object
    },
    activityTypeFilterItems: {
      type: Array
    },
    productFilterItems: {
      type: Array
    },
    difficulityFilterItems: {
      type: Array
    }
  },
  computed: {
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
    getFilterValue(filter, filterVal) {
      if (filter.key === 'activityType') return this.getActivityTypeValue(filterVal)
      else if (filter.key === 'product') return this.getProductFilterValue(filterVal)
      else if (filter.key === 'difficulty') return this.getDifficultyFilterValue(filterVal)
      return filterVal
    },
    removeSearchFilter(value, index) {
      this.$emit('remove', { filter: value, index })
    },
    getActivityTypeValue(filterVal = '') {
      return (
        this.activityTypeFilterItems.find((at) => {
          if (at.value === filterVal) {
            return at
          }
        })?.text || filterVal
      )
    },
    getProductFilterValue(filterVal = '') {
      return (
        this.productFilterItems.find((pI) => {
          if (pI.value === filterVal) {
            return pI
          }
        })?.text || filterVal
      )
    },
    getDifficultyFilterValue(filterVal = '') {
      return (
        this.difficulityFilterItems.find((dI) => {
          if (dI.value === filterVal) {
            return dI
          }
        })?.text || filterVal
      )
    }
  }
}
</script>
