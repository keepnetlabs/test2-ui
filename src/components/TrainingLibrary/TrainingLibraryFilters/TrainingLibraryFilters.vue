<template>
  <div class="training-library-filters">
    <div>
      <VTextField
        v-model.trim="activeFilter"
        ref="refFiltersInput"
        id="input--training-library-filters"
        outlined
        hide-details
        autocomplete="off"
        placeholder="Filters"
        prepend-inner-icon="mdi-filter-variant"
        append-icon="mdi-menu-down"
      />
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

export default {
  name: 'TrainingLibraryFilters',
  components: { TrainingLibrarySorting, TrainingLibraryFilteringOptions },
  data() {
    return {
      activeFilter: ''
    }
  }
}
</script>
