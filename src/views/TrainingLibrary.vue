<template>
  <KContainer tabless id="training-library">
    <TrainingLibraryCommonComponents />
    <TrainingLibraryFirstCard />
    <TrainingLibraryListViewCard v-if="isListView" />
    <TrainingLibraryCardView v-else />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import TrainingLibraryFirstCard from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCard.vue'
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryListViewCard from '@/components/TrainingLibrary/TrainingLibraryListViewCard/TrainingLibraryListViewCard.vue'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import TrainingLibraryCardView from '../components/TrainingLibrary/TrainingLibraryCardView/TrainingLibraryCardView.vue'
export default {
  name: 'TrainingLibrary',
  components: {
    TrainingLibraryCardView,
    TrainingLibraryCommonComponents,
    TrainingLibraryListViewCard,
    TrainingLibraryFirstCard,
    KContainer
  },
  computed: {
    ...mapGetters({
      isListView: 'trainingLibrary/getIsListView'
    })
  },
  created() {
    this.resetAllModals()
    this.initDefaultTableSettings()
    this.initDefaultTableFilters()
    this.callForTrainingHelpers()
    this.callForTrainingLibrary()
  },
  beforeDestroy() {
    this.resetState()
  },
  beforeRouteLeave(to, from, next) {
    this.resetAllModals()
    next()
  },
  methods: {
    ...mapActions({
      initDefaultTableSettings: 'trainingLibrary/initDefaultTableSettings',
      initDefaultTableFilters: 'trainingLibrary/initDefaultTableFilters',
      callForTrainingHelpers: 'trainingLibraryHelpers/callForTrainingHelpers',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary',
      resetState: 'trainingLibrary/resetState',
      resetAllModals: 'trainingLibrary/resetAllModals'
    })
  }
}
</script>
