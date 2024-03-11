<template>
  <div class="px-4 py-2">
    <div
      v-if="col"
      v-for="(col, ind) of getFilterOptionsFilters"
      :key="ind"
      class="training-library-popup-row py-1"
    >
      {{ col.label }}
      <VSwitch v-model="col.show" color="#2196f3" @change="handleListItemClick" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TrainingLibraryShowFilterItems',
  computed: {
    ...mapGetters({
      getFilterOptionsFilters: 'trainingLibrary/getFilterOptionsFilters'
    })
  },
  methods: {
    handleListItemClick(item = '') {}
  }
}
</script>
