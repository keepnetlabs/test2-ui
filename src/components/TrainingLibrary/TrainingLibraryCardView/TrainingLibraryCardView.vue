<template>
  <div class="training-library-card-view">
    <TrainingLibraryCard v-for="(card, index) in tableData" :key="index" :item="card" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TrainingLibraryCard from '../TrainingLibraryCard/TrainingLibraryCard.vue'

export default {
  name: 'TrainingLibraryCardView',
  components: { TrainingLibraryCard },
  computed: {
    ...mapGetters({
      tableData: 'trainingLibrary/getTableData'
    })
  }
}
</script>
