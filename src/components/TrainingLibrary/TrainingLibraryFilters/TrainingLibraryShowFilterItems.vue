<template>
  <div class="px-4 py-2">
    <template v-for="(col, ind) of getFilterOptionsFilters">
      <div v-if="col" :key="ind" class="training-library-popup-row py-1">
        {{ col.label }}
        <VSwitch v-model="col.show" color="#2196f3" @change="handleListItemClick(col, $event)" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TrainingLibraryShowFilterItems',
  computed: {
    ...mapGetters({
      getFilterOptionsFilters: 'trainingLibrary/getFilterOptionsFilters'
    })
  },
  methods: {
    ...mapActions({ setFilterItemsShow: 'trainingLibrary/setFilterItemsShow' }),
    handleListItemClick(item, event) {
      this.setFilterItemsShow({
        key: item?.property,
        show: event
      })
    }
  }
}
</script>
