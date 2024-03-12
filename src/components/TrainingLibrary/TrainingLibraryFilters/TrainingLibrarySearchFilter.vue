<template>
  <div>
    <div>
      <VTextField
        v-model="search"
        placeholder="Search"
        class="filter__text"
        outlined
        dense
        height="40"
        style="margin-top: 1px;"
      />
    </div>
    <div></div>
  </div>
</template>
<script>
export default {
  name: 'TrainingLibrarySearchFilter',
  props: {
    filterKey: {
      type: String
    }
  },
  data() {
    return {
      search: ''
    }
  }
}
</script>
