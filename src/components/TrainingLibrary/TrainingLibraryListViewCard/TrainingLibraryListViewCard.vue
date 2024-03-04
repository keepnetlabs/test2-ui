<template>
  <div class="training-library-list-view-card mt-6">
    <TrainingLibraryAllTypesTable />
  </div>
</template>

<script>
import TrainingLibraryAllTypesTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryAllTypesTable.vue'

export default {
  name: 'TrainingLibraryListViewCard',
  components: { TrainingLibraryAllTypesTable }
}
</script>
