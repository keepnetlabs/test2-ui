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
    <div class="training-library-search-filter-body">
      <VCheckbox
        v-for="item in getItems"
        v-model="filterChecked"
        :key="item.value"
        hide-details
        class="mb-2"
        color="#2196f3"
        :value="item.value"
        :label="item.text"
      >
      </VCheckbox>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TrainingLibrarySearchFilter',
  props: {
    filterKey: {
      type: String
    },
    items: {
      type: Array
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
