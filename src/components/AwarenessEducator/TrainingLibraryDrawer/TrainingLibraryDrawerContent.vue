<template>
  <div class="training-library-drawer-content">
    <TrainingLibraryDrawerContentSummary :training-data="trainingData" :type="type" />
    <TrainingLibraryDrawerContentRelated :training-data="trainingData" />
  </div>
</template>

<script>
import TrainingLibraryDrawerContentSummary from './TrainingLibraryDrawerContentSummary.vue'
import TrainingLibraryDrawerContentRelated from './TrainingLibraryDrawerContentRelated.vue'

export default {
  name: 'TrainingLibraryDrawerContent',
  components: {
    TrainingLibraryDrawerContentSummary,
    TrainingLibraryDrawerContentRelated
  },
  props: {
    trainingData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'Training Library'
    }
  }
}
</script>
