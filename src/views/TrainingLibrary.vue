<template>
  <KContainer tabless id="training-library">
    <TrainingLibraryCommonComponents />
    <TrainingLibraryFirstCard />
    <TrainingLibraryListViewCard />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import TrainingLibraryFirstCard from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCard.vue'
import { mapActions } from 'vuex'
import TrainingLibraryListViewCard from '@/components/TrainingLibrary/TrainingLibraryListViewCard/TrainingLibraryListViewCard.vue'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
export default {
  name: 'TrainingLibrary',
  components: {
    TrainingLibraryCommonComponents,
    TrainingLibraryListViewCard,
    TrainingLibraryFirstCard,
    KContainer
  },
  data() {
    return {}
  },
  created() {
    this.initDefaultTableSettings()
    this.initDefaultTableFilters()
    this.callForTrainingHelpers()
    this.callForTrainingLibrary()
  },
  beforeDestroy() {
    this.resetState()
  },
  methods: {
    ...mapActions({
      initDefaultTableSettings: 'trainingLibrary/initDefaultTableSettings',
      initDefaultTableFilters: 'trainingLibrary/initDefaultTableFilters',
      callForTrainingHelpers: 'trainingLibraryHelpers/callForTrainingHelpers',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary',
      resetState: 'trainingLibrary/resetState'
    }),
    callForData() {}
  }
}
</script>
