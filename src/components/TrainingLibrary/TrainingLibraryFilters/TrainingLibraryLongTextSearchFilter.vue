<template>
  <div>
    <div>
      <VTextField
        v-model="search"
        placeholder="Search"
        class="filter__text mb-2"
        outlined
        dense
        hide-details
        height="40"
        style="margin-top: 1px;"
      />
    </div>
    <div
      class="training-library-search-filter-body"
      :style="{ maxHeight: `${(totalFilterLength - 2) * 45}px` }"
    >
      <VCheckbox
        v-for="item in getItems"
        v-model="filter.value"
        :ripple="false"
        :key="item.value"
        hide-details
        class="mb-2"
        color="#2196f3"
        :value="item.value"
        :label="item.text"
      >
        <template #label>
          <VTooltip right content-class="training-library-long-text-search__tooltip">
            <template #activator="{ on }">
              <span class="training-library-long-text-search__activator" v-on="on">
                {{ item.text }}</span
              >
            </template>
            <span>{{ item.text }}</span>
          </VTooltip>
        </template>
      </VCheckbox>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TrainingLibraryLongTextSearchFilter',
  props: {
    filter: {
      type: Object
    },
    items: {
      type: Array
    },
    totalFilterLength: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      search: '',
      filterChecked: []
    }
  },
  computed: {
    getItems() {
      return this.search ? this.getFilteredSearchItems : this.items
    },
    getFilteredSearchItems() {
      return this.items.filter((item) =>
        item.text.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  }
}
</script>
