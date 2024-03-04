<template>
  <div>
    <VTextField
      v-model.trim="activeSort"
      ref="refFiltersInput"
      id="input--training-library-sorting"
      style="max-width: 200px;"
      outlined
      hide-details
      autocomplete="off"
      placeholder="Sort By"
      prepend-inner-icon="mdi-arrow-down"
      append-icon="mdi-menu-down"
    />
  </div>
</template>
<script>
export default {
  name: 'TrainingLibrarySorting',
  data() {
    return {
      activeSort: ''
    }
  }
}
</script>
